#!/usr/bin/env bash
# Usage (run from app public_html): infra/wordpress/bin/import-kits.sh <brand-slug>
set -euo pipefail
BRAND="${1:-}"
if [ -z "$BRAND" ]; then echo "brand slug required"; exit 1; fi

PROJECTS_JSON="infra/wordpress/config/projects.json"

# Use PHP (present on server) to parse JSON and echo kit list + overlay theme
meta=$(php -r '
  $p = json_decode(file_get_contents("'$PROJECTS_JSON'"), true);
  $b = $p["'$BRAND'"] ?? null;
  if (!$b) { echo "||"; exit; }
  $overlay = $b["overlay_theme"] ?? "";
  $kits = $b["kits"] ?? [];
  echo $overlay . "|" . implode(";", $kits);
')
OVERLAY="${meta%%|*}"
KITS_STR="${meta#*|}"

if [ -z "$OVERLAY" ] || [ -z "$KITS_STR" ]; then
  echo "No config for brand '$BRAND' in $PROJECTS_JSON"; exit 0;
fi

IFS=';' read -r -a KITS <<< "$KITS_STR"

# Loop kits in order
for kit in "${KITS[@]}"; do
  if [ ! -f "$kit" ]; then echo "Skipping missing kit: $kit"; continue; fi

  # Derive deletion prefix from filename (Base / Professional / Info / Client name)
  PREFIX=$(basename "$kit" | sed -E 's/_kit.*$//; s/[-_]/ /g' | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1')
  echo ">>> Deleting existing Elementor templates with prefix: $PREFIX - "
  IDS=$(wp post list --post_type=elementor_library --s="$PREFIX - " --format=ids --allow-root || true)
  [ -n "$IDS" ] && wp post delete $IDS --force --allow-root || true

  echo ">>> Importing kit: $kit"
  KIT_PATH="$kit" wp eval '
    $path = getenv("KIT_PATH");
    if (! file_exists($path)) { echo "Missing $path\n"; return; }
    require_once WP_PLUGIN_DIR . "/elementor/includes/import-export/kit-importer.php";
    $imp = new \Elementor\Import_Export\Kit_Importer();
    $res = $imp->import_kit($path);
    echo "Imported ".basename($path)."\n";
  ' --allow-root
done

# Apply newest header/footer conditions
wp eval '
  $latest = function($needle){
    $p = get_posts(["post_type"=>"elementor_library","s"=>$needle,"numberposts"=>1,"orderby"=>"date","order"=>"DESC"]);
    return $p ? $p[0]->ID : 0;
  };
  $h = $latest("Header"); $f = $latest("Footer");
  if ($h) update_post_meta($h, "_elementor_conditions", [["type"=>"entire_site","operator"=>"include"]]);
  if ($f) update_post_meta($f, "_elementor_conditions", [["type"=>"entire_site","operator"=>"include"]]);
  echo "HeaderID=$h FooterID=$f\n";
' --allow-root

# Set Home if exists
wp eval '$p=get_page_by_title("Home"); if($p){ update_option("page_on_front",$p->ID); update_option("show_on_front","page"); echo "Front page set\n"; }' --allow-root

# Flush caches
wp elementor flush_css --allow-root || true
wp cache flush --allow-root || true
wp breeze purge --cache=all --allow-root || true


