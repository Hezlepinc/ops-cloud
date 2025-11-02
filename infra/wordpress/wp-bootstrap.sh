#!/usr/bin/env bash
set -euo pipefail

# Usage: ./wp-bootstrap.sh <brand-slug> [theme-slug]
# Example: ./wp-bootstrap.sh sparky-hq hello-child

BRAND_SLUG="${1:-sparky-hq}"
THEME_SLUG="${2:-hello-child}"

APP_ROOT="$(pwd)"
cd "$APP_ROOT"

echo "▶ APP_ROOT = $APP_ROOT"
echo "▶ Activating theme: $THEME_SLUG"
wp theme activate "$THEME_SLUG" --allow-root || true

# Ensure Elementor (free) active
echo "▶ Ensuring Elementor plugin is active"
wp plugin install elementor --activate --allow-root || wp plugin activate elementor --allow-root || true

# Try to activate Pro if present (do not fail if missing)
wp plugin activate elementor-pro --allow-root || true

BRAND_DIR="brand/${BRAND_SLUG}/elementor"
KIT="$(ls "${BRAND_DIR}"/*.zip 2>/dev/null | head -n 1 || true)"

# Fallback to industry kit if brand kit not found
if [ -z "$KIT" ]; then
  INDUSTRY_SLUG=""
  case "$BRAND_SLUG" in
    hezlep-inc) INDUSTRY_SLUG="professional" ;;
    sparky-hq) INDUSTRY_SLUG="information" ;;
  esac
  if [ -n "$INDUSTRY_SLUG" ]; then
    IND_DIR="industries/${INDUSTRY_SLUG}/elementor"
    KIT="$(ls "${IND_DIR}"/*.zip 2>/dev/null | head -n 1 || true)"
    if [ -n "$KIT" ]; then
      echo "▶ Using industry kit fallback: ${KIT}"
    fi
  fi
fi

# Convert slug to a human-ish search prefix for deleting previous templates
BRAND_SEARCH="$(echo "${BRAND_SLUG}" | sed -E 's/-/ /g' | awk '{for(i=1;i<=NF;i++){ $i = toupper(substr($i,1,1)) substr($i,2) }}1' | sed 's/  */ /g')"
echo "▶ Brand search prefix: $BRAND_SEARCH"

echo "▶ Deleting previously imported templates that match brand search string"
IDS=$(wp post list --post_type=elementor_library --s="$BRAND_SEARCH" --format=ids --allow-root || true)
if [ -n "$IDS" ]; then
  echo "Found template IDs to delete: $IDS"
  wp post delete $IDS --force --allow-root || true
else
  echo "No previous brand templates found for deletion."
fi

# Import kit if present
if [ -n "$KIT" ]; then
  echo "▶ Importing Elementor Kit: $KIT"
  KIT_PATH="$KIT" wp eval '
    if (! file_exists( getenv("KIT_PATH") )) { echo "Kit file not found: ".getenv("KIT_PATH")."\n"; exit; }
    if ( ! class_exists("\\Elementor\\Import_Export\\Kit_Importer") ) {
      require_once WP_PLUGIN_DIR . "/elementor/includes/import-export/kit-importer.php";
    }
    $imp = new \\Elementor\\Import_Export\\Kit_Importer();
    $r = $imp->import_kit( getenv("KIT_PATH") );
    echo "Import result: " . (is_array($r) ? json_encode($r) : print_r($r, true)) . PHP_EOL;
  ' --allow-root
else
  echo "⚠ No kit zip found under $BRAND_DIR. Skipping import."
fi

# Seed industry pages (brand-specific) if missing (idempotent)
echo "▶ Seeding brand-specific pages if missing"
wp eval '
  function oc_create_page_if_missing($title, $slug, $content = "") {
    $existing = get_page_by_path($slug, OBJECT, "page");
    if (!$existing) {
      $id = wp_insert_post([
        "post_type" => "page",
        "post_title" => $title,
        "post_name" => $slug,
        "post_status" => "publish",
        "post_content" => $content,
      ]);
      echo "Created page: $title (#$id)\n";
      return $id;
    }
    echo "Page exists: $title\n";
    return $existing->ID;
  }

  $brand = getenv("BRAND_SLUG");
  if ($brand === "hezlep-inc") {
    oc_create_page_if_missing("Home", "home", "Welcome to Hezlep.");
    oc_create_page_if_missing("Services", "services", "Our services overview.");
    oc_create_page_if_missing("Projects", "projects", "Project highlights.");
    oc_create_page_if_missing("About", "about", "About Hezlep Inc.");
    oc_create_page_if_missing("Contact", "contact", "Contact us.");
  } elseif ($brand === "sparky-hq") {
    oc_create_page_if_missing("Home", "home", "Welcome to Sparky HQ.");
    oc_create_page_if_missing("Resources", "resources", "Curated resources.");
    oc_create_page_if_missing("Tools", "tools", "Tools directory.");
    oc_create_page_if_missing("Guides", "guides", "How-to guides.");
    oc_create_page_if_missing("About", "about", "About Sparky HQ.");
    oc_create_page_if_missing("Contact", "contact", "Contact us.");
  }
' --allow-root --env=BRAND_SLUG="$BRAND_SLUG"

# Apply display conditions for newest Header and Footer
echo "▶ Applying display conditions (Entire Site) to newest Header/Footer"
wp eval '
  $get_latest = function($needle){
    $p = get_posts(["post_type"=>"elementor_library","s"=>$needle,"numberposts"=>1,"orderby"=>"date","order"=>"DESC"]);
    return ($p && isset($p[0])) ? $p[0]->ID : 0;
  };
  $h = $get_latest("Header");
  $f = $get_latest("Footer");
  if ($h) update_post_meta($h, "_elementor_conditions", [["type"=>"entire_site","operator"=>"include"]]);
  if ($f) update_post_meta($f, "_elementor_conditions", [["type"=>"entire_site","operator"=>"include"]]);
  echo "HeaderID=$h FooterID=$f\n";
' --allow-root

# Set front page to "Home" if present
echo "▶ Setting static front page to 'Home' if it exists"
wp eval '
  $home = get_page_by_title("Home");
  if ($home) { update_option("page_on_front", $home->ID); update_option("show_on_front","page"); echo "Front page set to ID ".$home->ID."\n"; }
' --allow-root

# Flush caches and regenerate Elementor CSS
echo "▶ Flushing caches and regenerating Elementor CSS"
wp elementor flush_css --allow-root || true
wp cache flush --allow-root || true
wp breeze purge --cache=all --allow-root || true

echo "✅ Bootstrap complete for ${BRAND_SLUG} using theme ${THEME_SLUG}"
