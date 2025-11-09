#!/usr/bin/env bash
# Orchestrator for Cloudways app operations (status/import/diagnose) with realtime logs
# Usage (on remote Cloudways host):
#   ACTION=status|import|diagnose
#   BRAND=<hezlep-inc|sparky-hq>
#   ENVIRONMENT=staging|prod
#   APP_PATH=/home/<user>/<app_id>/public_html
#   bash scripts/orchestrator.sh
set -euo pipefail

ACTION="${ACTION:-${1:-status}}"
BRAND="${BRAND:-${2:-}}"
ENVIRONMENT="${ENVIRONMENT:-${3:-staging}}"
APP_PATH="${APP_PATH:-${4:-$(pwd)}}"

echo "▶ Orchestrator starting"
echo "▶ Action=$ACTION Brand=${BRAND:-<none>} Env=$ENVIRONMENT AppPath=$APP_PATH"

cd "$APP_PATH"
echo "▶ PWD=$(pwd)"

timestamp() { date +"%Y-%m-%d %H:%M:%S"; }
section() { echo; echo "=== [$((++__sec:=0))] $(timestamp) :: $* ==="; }

section "Git sync to staging branch"
git fetch --all || true
git checkout staging || true
git pull --ff-only || true

case "$ACTION" in
  status)
    section "Theme status"
    wp theme status --allow-root || true

    section "Plugins: Elementor"
    wp plugin status elementor elementor-pro --allow-root || true

    section "Elementor templates (first 100)"
    wp post list --post_type=elementor_library --fields=ID,post_title,post_status --allow-root | sed -n '1,100p' || true

    section "Header/Footer conditions"
    HDRS=$(wp post list --post_type=elementor_library --search="Header" --format=ids --allow-root || true)
    FTRS=$(wp post list --post_type=elementor_library --search="Footer" --format=ids --allow-root || true)
    echo "Headers: $HDRS"
    echo "Footers: $FTRS"
    for id in $HDRS; do
      echo "-- Header $id conditions:"
      wp post meta get "$id" _elementor_conditions --allow-root || echo "(none)"
    done
    for id in $FTRS; do
      echo "-- Footer $id conditions:"
      wp post meta get "$id" _elementor_conditions --allow-root || echo "(none)"
    done

    section "Front page"
    echo "show_on_front: $(wp option get show_on_front --allow-root || echo 'n/a')"
    echo "page_on_front: $(wp option get page_on_front --allow-root || echo 'n/a')"
    if FRONT_ID=$(wp option get page_on_front --allow-root 2>/dev/null); then
      if [[ -n "$FRONT_ID" ]]; then
        echo "Front page title: $(wp post get "$FRONT_ID" --field=post_title --allow-root || true)"
      fi
    fi
    ;;

  import)
    if [[ -z "${BRAND:-}" ]]; then
      echo "Brand required for import"; exit 2
    fi
    section "Activate overlay and import kits for $BRAND ($ENVIRONMENT)"
    bash infra/wordpress/wp-bootstrap.sh "$BRAND" "$ENVIRONMENT"
    ;;

  diagnose)
    section "Run diagnose/fix"
    chmod +x scripts/diagnose_fix_elementor.sh || true
    bash scripts/diagnose_fix_elementor.sh "$APP_PATH"
    ;;

  *)
    echo "Unknown ACTION: $ACTION"; exit 2
    ;;
esac

section "Done"


