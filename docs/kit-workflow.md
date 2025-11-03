# Elementor Kit Workflow (Edit in Cursor)

Goal: edit kits inside the repo, then re-pack zips for deployment.

## Layout

```
infra/wordpress/brands/<brand>/elementor/
  <brand>_template.zip       # deploy artifact
  src/                       # editable JSON/templates (optional)
```

## Extract a kit into src/

```
bash infra/wordpress/bin/kit-extract.sh \
  infra/wordpress/brands/hezlep-inc/elementor/hezlep_template.zip \
  infra/wordpress/brands/hezlep-inc/elementor/src
```

Edit files under `src/` (JSON templates, site settings) in Cursor.

## Re-pack after edits

```
bash infra/wordpress/bin/kit-pack.sh \
  infra/wordpress/brands/hezlep-inc/elementor/src \
  infra/wordpress/brands/hezlep-inc/elementor/hezlep_template.zip
```

Commit the updated zip. CI will import it on deploy.

Notes:
- Keep brand tokens in CSS: `infra/wordpress/brands/<brand>/assets/css/cursor.css`.
- Display conditions (Header/Footer) are applied in `import-kits.sh` during deploy.

