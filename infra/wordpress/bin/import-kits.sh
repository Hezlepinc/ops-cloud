#!/usr/bin/env bash
# Usage (run from app public_html): infra/wordpress/bin/import-kits.sh <brand-slug> <env>
# env: staging | prod
set -euo pipefail

BRAND="${1:-}"; DEPLOY_ENV="${2:-staging}"
if [[ -z "$BRAND" ]]; then echo "brand slug required"; exit 1; fi
if [[ "$DEPLOY_ENV" != "staging" && "$DEPLOY_ENV" != "prod" ]]; then echo "env must be staging|prod"; exit 1; fi

PROJECTS_JSON="infra/wordpress/config/projects.json"
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
IFS=';' read -r -a KITS <<< "$KITS_STR"

echo "▶ Importing kits for brand=$BRAND env=$DEPLOY_ENV overlay=$OVERLAY"
echo "▶ Kits: ${KITS[*]:-<none>}"

# Ensure Elementor active
wp plugin install elementor --activate --allow-root || wp plugin activate elementor --allow-root || true
wp plugin activate elementor-pro --allow-root || true

# Delete & import in order
for kit in "${KITS[@]}"; do
  [[ -z "${kit:-}" ]] && continue
  if [[ ! -f "$kit" ]]; then echo "⚠ Missing kit: $kit (skipping)"; continue; fi

  PREFIX=$(basename "$kit" | sed -E 's/_kit.*$//; s/[-_]/ /g' | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1')
  echo ">>> Removing templates with prefix: $PREFIX - "
  IDS=$(wp post list --post_type=elementor_library --s="$PREFIX - " --format=ids --allow-root || true)
  [[ -n "${IDS:-}" ]] && wp post delete $IDS --force --allow-root || true

  echo ">>> Importing kit: $kit"
  KIT_PATH="$kit" wp eval '
    $path = getenv("KIT_PATH");
    if (! file_exists($path)) { echo "Missing $path\n"; return; }
    if (! class_exists("\\Elementor\\Import_Export\\Kit_Importer")) {
      require_once WP_PLUGIN_DIR . "/elementor/includes/import-export/kit-importer.php";
    }
    $imp = new \\Elementor\\Import_Export\\Kit_Importer();
    $res = $imp->import_kit($path);
    echo "Imported ".basename($path)."\n";
  ' --allow-root
done

# Apply newest Header/Footer site-wide
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

# Set static home if "Home" exists
wp eval '$p=get_page_by_title("Home"); if($p){ update_option("show_on_front","page"); update_option("page_on_front",$p->ID); echo "Front page set\n"; }' --allow-root

# Menus: assign "Primary" and "Footer" if present
wp eval '
  $locs = get_theme_mod("nav_menu_locations", []);
  $primary = wp_get_nav_menu_object("Primary");
  $footer  = wp_get_nav_menu_object("Footer");
  if ($primary) $locs["primary"] = (int) $primary->term_id;
  if ($footer)  $locs["footer"]  = (int) $footer->term_id;
  set_theme_mod("nav_menu_locations", $locs);
  echo "Menu locations updated\n";
' --allow-root

# Permalinks
wp rewrite structure '/%postname%/' --hard --allow-root || true
wp rewrite flush --hard --allow-root || true

# Staging: set noindex
if [[ "$DEPLOY_ENV" == "staging" ]]; then
  wp option update blog_public 0 --allow-root || true
fi

# Flush caches
wp elementor flush_css --allow-root || true
wp cache flush --allow-root || true
wp breeze purge --cache=all --allow-root || true

echo "✅ Kits imported and applied"


