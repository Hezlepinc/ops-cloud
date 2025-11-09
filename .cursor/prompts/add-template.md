Goal: add a new Elementor page template.

Steps:
1) Create file: /templates/pages/<slug>.json (Elementor JSON).
2) Append mapping in /templates/template.manifest.json:
   { "type": "page", "src": "templates/pages/<slug>.json", "slug": "<slug>" }
3) Bump "version" in manifest (YYYY.MM.DD-n).
4) Open PR "feat(templates): add <slug> page v<version>" with brief test notes.


