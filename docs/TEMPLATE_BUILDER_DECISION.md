# Template Builder Decision

**Date:** 2025-01-09 | **Decision:** Astra + Gutenberg (Elementor legacy-only)

## Policy
- ✅ **New brands/sites:** Astra child theme + Gutenberg blocks
- ✅ **New automation/AI flows:** Target `theme.json`, block templates, block patterns
- ⚠️ **Existing Elementor sites:** Keep working as-is; migrate gradually

## Why Astra + Gutenberg
- AI-friendly: design tokens + block templates = pure JSON/HTML
- CI/CD-friendly: deterministic files → Git → Actions → WP-CLI
- Multi-tenant: brand folders under `infra/wordpress/brands/*`
- WordPress-native: theme.json, block templates, block patterns
- Performance: lighter than heavy page builders

## Actions
- [x] Document decision, scaffold astra-child theme, create brand tokens, add design scripts
- [ ] Port one brand homepage to Astra/Gutenberg, wire CI/CD

**See:** [BRAND_STRUCTURE_ALIGNMENT.md](BRAND_STRUCTURE_ALIGNMENT.md) for file structure.
