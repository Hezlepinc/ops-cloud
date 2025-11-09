# save locally then run (example)
cat > diagnose_fix_elementor.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 /full/path/to/public_html"
  exit 2
fi

APP_ROOT="$1"
echo "== Running diagnose/repair on $APP_ROOT =="
cd "$APP_ROOT"

echo
echo "1) Theme status"
wp theme status --allow-root || true

echo
echo "2) Elementor plugin status"
wp plugin status elementor elementor-pro --allow-root || true

echo
echo "3) Count Elementor templates and list first 200"
wp post list --post_type=elementor_library --fields=ID,post_title,post_status --allow-root | sed -n '1,200p' || true

echo
echo "4) Headers / Footers and their conditions"
HDRS=$(wp post list --post_type=elementor_library --search="Header" --format=ids --allow-root || true)
FTRS=$(wp post list --post_type=elementor_library --search="Footer" --format=ids --allow-root || true)

echo "Header IDs: $HDRS"
echo "Footer IDs: $FTRS"

for id in $HDRS; do
  echo "-- Header $id _elementor_conditions:"
  wp post meta get $id _elementor_conditions --allow-root || echo "(none)"
done

for id in $FTRS; do
  echo "-- Footer $id _elementor_conditions:"
  wp post meta get $id _elementor_conditions --allow-root || echo "(none)"
done

echo
echo "5) If Header/Footer found but not applied, set Display Condition => Entire Site"
apply_cond(){
  ID=$1
  if [ -z "$ID" ]; then return; fi
  # set an array-like meta via php to avoid serialization mistakes
  wp eval "if (get_post($ID)) update_post_meta($ID, '_elementor_conditions', array(array('type'=>'entire_site','operator'=>'include')));" --allow-root || true
  echo "-> set _elementor_conditions for ID $ID"
}

for id in $HDRS; do
  # check again; if empty, apply
  cond=$(wp post meta get $id _elementor_conditions --allow-root || true)
  if [ -z "$cond" ]; then apply_cond $id; fi
done

for id in $FTRS; do
  cond=$(wp post meta get $id _elementor_conditions --allow-root || true)
  if [ -z "$cond" ]; then apply_cond $id; fi
done

echo
echo "6) Set Home page as front page (if a page titled 'Home' exists)"
HOME_ID=$(wp post list --post_type=page --title="Home" --field=ID --allow-root || true)
if [ -n "$HOME_ID" ]; then
  wp option update show_on_front page --allow-root || true
  wp option update page_on_front "$HOME_ID" --allow-root || true
  echo "-> Home page (ID $HOME_ID) set as static front page"
else
  echo "-> No 'Home' page found. Skipping front page set"
fi

echo
echo "7) Try to assign 'Primary' menu to theme location 'primary' (if menu exists)"
wp eval '$m = wp_get_nav_menu_object(\"Primary\"); if($m){ $locs=get_theme_mod(\"nav_menu_locations\",[]); $locs[\"primary\"]=(int)$m->term_id; set_theme_mod(\"nav_menu_locations\",$locs); echo \"-> Primary menu assigned\n\"; } else { echo \"-> Primary menu not found\n\"; }' --allow-root || true

echo
echo "8) Flush CSS / cache / permalinks"
wp elementor flush_css --allow-root || true
wp cache flush --allow-root || true
wp rewrite flush --hard --allow-root || true
# Breeze purge if installed
if wp plugin is-installed breeze --allow-root >/dev/null 2>&1; then
  wp breeze purge --cache=all --allow-root || true
  echo "-> Breeze cache purged"
fi

echo
echo "9) Summarize front page and active header/footer"
echo "show_on_front: $(wp option get show_on_front --allow-root || echo 'n/a')"
echo "page_on_front: $(wp option get page_on_front --allow-root || echo 'n/a')"
echo "Front page title: $(if [ -n \"$(wp option get page_on_front --allow-root)\" ]; then wp post get $(wp option get page_on_front --allow-root) --field=post_title --allow-root; else echo 'n/a'; fi)"

echo
echo "10) Quick HTTP check"
DOMAIN=$(wp option get home --allow-root || echo "")
if [ -n "$DOMAIN" ]; then
  echo "curl -I $DOMAIN"
  curl -I "$DOMAIN" 2>/dev/null | sed -n '1,5p' || true
else
  echo "-> No home URL found; check site URL in WP settings"
fi

echo
echo "== Done =="
BASH

chmod +x diagnose_fix_elementor.shs 