# Hello-Child Automated Theme

This folder contains all brand styling and startup logic for Hello-Elementor based sites.

## Includes

- Brand token stylesheet (`assets/css/cursor.css`)
- Enqueue script for parent + child + cursor.css
- One-time WordPress bootstrap: Home, Sample Post, Menu

## Deployment

On push to `staging`, GitHub Actions syncs this folder to Cloudways.

## Activation

1. Log in to WP Admin → Appearance → Themes → Activate **Hello Child**
2. The following auto-happens:
   - Home page created
   - Sample post created
   - Nav menu assigned
   - Front page set
   - `hello_child_starter_done` flag saved
