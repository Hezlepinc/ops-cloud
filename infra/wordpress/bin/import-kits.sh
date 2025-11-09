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

imported_any=0

# Fallback importer via WP-CLI: import individual template JSONs from a kit zip
fallback_import_from_zip() {
  local zip_path="$1"
  local tmpdir
  tmpdir="$(mktemp -d)"
  unzip -q "$zip_path" -d "$tmpdir" || return 1
  shopt -s nullglob
  local imported=0
  for f in "$tmpdir"/templates/*.json "$tmpdir"/*/templates/*.json; do
    [[ -f "$f" ]] || continue
    echo ">>> Fallback (WP-CLI) importing template: $f"
    if wp elementor library import "$f" --allow-root >/dev/null 2>&1; then
      imported=1
    else
      # Some environments may not have the subcommand; keep going
      echo "⚠ WP-CLI import failed for $f (continuing)"
    fi
  done
  rm -rf "$tmpdir"
  return "$imported"
}

# Delete & import in order
for kit in "${KITS[@]}"; do
  [[ -z "${kit:-}" ]] && continue
  if [[ ! -f "$kit" ]]; then echo "⚠ Missing kit: $kit (skipping)"; continue; fi

  PREFIX=$(basename "$kit" | sed -E 's/_kit.*$//; s/[-_]/ /g' | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1')
  echo ">>> Removing templates with prefix: $PREFIX - "
  IDS=$(wp post list --post_type=elementor_library --s="$PREFIX - " --format=ids --allow-root || true)
  [[ -n "${IDS:-}" ]] && wp post delete $IDS --force --allow-root || true

  echo ">>> Importing kit (PHP): $kit"
  if KIT_PATH="$kit" APP_ROOT="$(pwd)" php infra/wordpress/bin/kit-import.php; then
    imported_any=1
  else
    echo ">>> PHP importer failed, attempting WP-CLI template import fallback"
    if fallback_import_from_zip "$kit"; then
      imported_any=1
    else
      echo "⚠ Fallback WP-CLI import did not import any templates for $kit"
    fi
  fi
done

# Fallback: if nothing imported from declared kits, try brand-level zip(s)
if [[ "$imported_any" -eq 0 ]]; then
  # Prefer *template*.zip and newest by mtime; otherwise any newest .zip
  fallback_zip=$(ls -t infra/wordpress/brands/${BRAND}/elementor/*template*.zip 2>/dev/null | head -n 1 || true)
  if [[ -z "${fallback_zip:-}" ]]; then
    fallback_zip=$(ls -t infra/wordpress/brands/${BRAND}/elementor/*.zip 2>/dev/null | head -n 1 || true)
  fi
  if [[ -n "$fallback_zip" && -f "$fallback_zip" ]]; then
    echo ">>> Fallback importing brand kit (PHP): $fallback_zip"
    if KIT_PATH="$fallback_zip" APP_ROOT="$(pwd)" php infra/wordpress/bin/kit-import.php; then
      imported_any=1
    else
      echo ">>> PHP importer failed, attempting WP-CLI template import fallback"
      if fallback_import_from_zip "$fallback_zip"; then
        imported_any=1
      else
        echo "⚠ Fallback WP-CLI import did not import any templates for $fallback_zip"
      fi
    fi
  else
    echo "No fallback brand kit found under infra/wordpress/brands/${BRAND}/elementor/"
  fi
fi

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

# Seed brand-specific page content for visible changes (idempotent via marker)
if [[ "$BRAND" == "hezlep-inc" ]]; then
  HOME_ID=$(wp post list --post_type=page --name=home --field=ID --allow-root || true)
  if [[ -n "$HOME_ID" ]]; then
    read -r -d '' HEZLEP_HOME_CONTENT <<'HTML'
<!-- oc_seed:hezlep_home_v1 -->
<section class="oc-section" style="background: linear-gradient(90deg,#0A2342 0%,#007AFF 100%); color:#fff;">
  <div class="container">
    <h1>Systems for builders, by builders.</h1>
    <p>Confident, analytical, precise. We design and deploy operating systems that scale.</p>
    <a class="oc-btn-primary" href="/contact">Book a Consultation</a>
  </div>
  </section>
<section class="oc-section">
  <div class="container">
    <h2>Capabilities</h2>
    <div class="grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
      <div class="oc-card"><h3>Automation</h3><p>Zapier/Make, CRM workflows, AI assistance.</p></div>
      <div class="oc-card"><h3>Web Ops</h3><p>WordPress, hosting, CI/CD, performance.</p></div>
      <div class="oc-card"><h3>Growth Systems</h3><p>Analytics, SEO, lead pipelines, reporting.</p></div>
    </div>
  </div>
</section>
<section class="oc-section">
  <div class="container">
    <div class="oc-card" style="text-align:center;">
      <h2>Let’s Design Your Ops System</h2>
      <a class="oc-btn-primary" href="/contact">Start a Project</a>
    </div>
  </div>
</section>
HTML
    if ! wp post get "$HOME_ID" --field=post_content --allow-root | grep -q 'oc_seed:hezlep_home_v1'; then
      wp post update "$HOME_ID" --post_content="$HEZLEP_HOME_CONTENT" --allow-root >/dev/null
    fi
  fi
  # Ensure key subpages exist
  for slug in consulting automation-systems contact; do
    if ! wp post list --post_type=page --name="$slug" --field=ID --allow-root | grep -qE '^[0-9]+$'; then
      title=$(echo "$slug" | sed 's/-/ /g;s/.*/\u&/');
      wp post create --post_type=page --post_status=publish --post_name="$slug" --post_title="$title" --post_content="<!-- oc_seed:$slug -->" --allow-root >/dev/null
    fi
  done
fi

if [[ "$BRAND" == "sparky-hq" ]]; then
  HOME_ID=$(wp post list --post_type=page --name=home --field=ID --allow-root || true)
  if [[ -n "$HOME_ID" ]]; then
    read -r -d '' SPARKY_HOME_CONTENT <<'HTML'
<!-- oc_seed:sparky_home_v1 -->
<section class="oc-section" style="background:#FBFCFE;">
  <div class="container">
    <h1>Electric trade intelligence.</h1>
    <p>Clear, context‑driven tools vetted by professionals. No prompts, just answers.</p>
  </div>
</section>
<section class="oc-section">
  <div class="container">
    <div class="grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
      <div class="oc-card"><h3>Learn</h3><p>Guides, resources, and best practices for electricians.</p></div>
      <div class="oc-card"><h3>Calculate</h3><p>Voltage drop and more — pro tools with NEC assumptions.</p></div>
      <div class="oc-card"><h3>Connect</h3><p>Newsletter, community, and partner resources.</p></div>
    </div>
  </div>
</section>
HTML
    if ! wp post get "$HOME_ID" --field=post_content --allow-root | grep -q 'oc_seed:sparky_home_v1'; then
      wp post update "$HOME_ID" --post_content="$SPARKY_HOME_CONTENT" --allow-root >/dev/null
    fi
  fi
  # Ensure key pages exist
  for slug in resources tools; do
    if ! wp post list --post_type=page --name="$slug" --field=ID --allow-root | grep -qE '^[0-9]+$'; then
      title=$(echo "$slug" | sed 's/-/ /g;s/.*/\u&/');
      wp post create --post_type=page --post_status=publish --post_name="$slug" --post_title="$title" --post_content="<!-- oc_seed:$slug -->" --allow-root >/dev/null
    fi
  done
fi

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


