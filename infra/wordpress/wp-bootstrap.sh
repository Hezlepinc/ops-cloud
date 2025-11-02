#!/usr/bin/env bash
set -euo pipefail

BRAND_SLUG="${1:-sparky-hq}"
THEME_SLUG="${2:-hello-child}"

# Assume running in app public_html
APP_ROOT="$(pwd)"
cd "$APP_ROOT"

echo "▶ Activating theme: $THEME_SLUG"
wp theme activate "$THEME_SLUG" --allow-root || true

echo "▶ Ensuring Elementor (free) active"
wp plugin activate elementor --allow-root || wp plugin install elementor --activate --allow-root

# Optional: activate Pro if present (already installed in your stack)
wp plugin activate elementor-pro --allow-root || true

BRAND_DIR="brand/${BRAND_SLUG}/elementor"
KIT="$(ls "${BRAND_DIR}"/*.zip 2>/dev/null | head -n 1 || true)"

# 1) Pre-clean duplicates for this brand's Elementor templates
BRAND_TITLE_PREFIX="$(echo "${BRAND_SLUG}" | sed 's/-/ /g' | sed -E "s/\b(.)/\u\1/g" | sed 's/Inc/Inc./g' )"
# Examples: "Sparky Hq" or "Hezlep Inc." — our templates are prefixed "Sparky -" / "Hezlep -"
echo "▶ Removing previous ${BRAND_TITLE_PREFIX} Elementor templates (if any)"
wp post delete $(wp post list --post_type=elementor_library --search="${BRAND_TITLE_PREFIX}" --format=ids) --force --allow-root || true

# 2) Import kit (if present)
if [ -n "$KIT" ]; then
  echo "▶ Importing kit: $KIT"
  wp eval '
    require_once WP_PLUGIN_DIR . "/elementor/includes/import-export/kit-importer.php";
    $zip = getenv("KIT_PATH") ?: "";
    if ($zip && file_exists($zip)) {
      $imp = new \Elementor\Import_Export\Kit_Importer();
      $res = $imp->import_kit($zip);
      echo "Imported: ".json_encode($res).PHP_EOL;
    } else {
      echo "No kit file found.\n";
    }
  ' --allow-root --env=KIT_PATH="$KIT"
else
  echo "⚠ No Elementor kit found under ${BRAND_DIR}; skipping import."
fi

# 3) Apply display conditions for newest Header & Footer
echo "▶ Applying display conditions (Entire Site) for newest Header/Footer"
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

# 4) Set front page to "Home" if it exists
echo "▶ Setting static front page to 'Home' (if exists)"
wp eval '
  $home = get_page_by_title("Home");
  if ($home) { update_option("page_on_front",$home->ID); update_option("show_on_front","page"); echo "Front page set.\n"; }
' --allow-root

# 5) Flush caches
echo "▶ Flushing Elementor + WP caches"
wp elementor flush_css --allow-root || true
wp cache flush --allow-root || true
wp breeze purge --cache=all --allow-root || true

echo "✅ Bootstrap complete for ${BRAND_SLUG} using theme ${THEME_SLUG}"
