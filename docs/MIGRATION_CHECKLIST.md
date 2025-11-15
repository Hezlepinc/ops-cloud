# Astra Migration Checklist

**Date:** 2025-01-09  
**Updated:** 2025-11-15 (Hybrid Structure Support Added)  
**Goal:** Complete Roadmap 1 - Astra Client Site Deployment

> **Migration Note:** System now supports both current and preferred file structures (hybrid). See [Brand Structure Alignment](BRAND_STRUCTURE_ALIGNMENT.md) for full migration plan. New brands should use preferred structure; existing brands can migrate gradually.

## ✅ Foundation (Complete)

- [x] Astra child theme scaffolded
- [x] Design scripts created
- [x] Brand tokens for hezlep-inc and sparky-hq
- [x] Documentation updated

## 🔨 Phase 1: Create Missing Structure

### Block Templates & Parts
- [ ] Create `infra/wordpress/themes/astra-child/block-templates/` directory
- [ ] Create `infra/wordpress/themes/astra-child/block-template-parts/` directory
- [ ] Create `block-templates/front-page.html`
- [ ] Create `block-templates/page.html`
- [ ] Create `block-templates/single.html`
- [ ] Create `block-templates/archive.html`
- [ ] Create `block-templates/404.html`
- [ ] Create `block-template-parts/header.html`
- [ ] Create `block-template-parts/footer.html`

### Brand Patterns
- [ ] Create `infra/wordpress/brands/hezlep-inc/patterns/` directory
- [ ] Create `infra/wordpress/brands/sparky-hq/patterns/` directory
- [ ] Create `hezlep-inc/patterns/hero-basic.html`
- [ ] Create `hezlep-inc/patterns/services-grid.html`
- [ ] Create `hezlep-inc/patterns/cta-banner.html`
- [ ] Create `sparky-hq/patterns/hero-basic.html`
- [ ] Create `sparky-hq/patterns/services-grid.html`
- [ ] Create `sparky-hq/patterns/cta-banner.html`

### Sitemap Files
- [ ] Create `infra/wordpress/brands/hezlep-inc/sitemap.json`
- [ ] Create `infra/wordpress/brands/sparky-hq/sitemap.json`

## 🔧 Phase 2: Enhance Scripts

- [ ] Enhance `buildpages.mjs` to read sitemap.json
- [ ] Enhance `buildpages.mjs` to load patterns
- [ ] Enhance `buildpages.mjs` to assemble pages
- [ ] Add `design:generate` script to package.json
- [ ] Add `design:theme-json` script to package.json
- [ ] Add `design:cursor-css` script to package.json
- [ ] Add `design:build-pages` script to package.json

## 🚀 Phase 3: Deployment Integration

- [ ] Add design script execution to deploy workflow
- [ ] Add Astra child theme rsync to deploy workflow
- [ ] Add WP-CLI step to activate Astra child theme
- [ ] Add WP-CLI step to register block templates
- [ ] Add WP-CLI step to register patterns
- [ ] Add WP-CLI step to create/update pages
- [ ] Create `apply-astra-design.sh` script
- [ ] Update `wp-bootstrap.sh` with Astra support
- [ ] Update `projects.json` with theme_type field

## ✅ Phase 4: Testing

- [ ] Test design scripts locally
- [ ] Verify theme.json generation
- [ ] Verify cursor.css generation
- [ ] Verify page assembly
- [ ] Test deployment to Hezlep staging
- [ ] Verify Astra theme activates
- [ ] Verify templates register
- [ ] Verify patterns register
- [ ] Verify pages created
- [ ] Verify Home page displays correctly

## 📊 Progress Tracking

**Current:** Foundation complete, Phase 1 starting
**Target:** Complete Phase 1-3 within 2 weeks
**Blockers:** None identified

---

**Update this checklist as work progresses.**

