# Full Project Review - Astra/Gutenberg Migration

**Date:** 2025-01-09
**Status:** Migration In Progress
**Goal:** Verify everything is aligned with Astra + Gutenberg path

## ✅ What's Correctly Set Up

### 1. Astra Child Theme Structure
- ✅ `infra/wordpress/themes/astra-child/` exists
- ✅ `style.css` - Child theme header configured
- ✅ `functions.php` - Enqueues Astra parent + cursor.css, registers block patterns
- ✅ `theme.json` - Basic structure (needs to be generated from tokens)
- ✅ `assets/css/cursor.css` - Placeholder (needs generation from tokens)

### 2. Design Scripts
- ✅ `scripts/design/generate-theme-json.mjs` - Reads tokens → generates theme.json
- ✅ `scripts/design/generate-cursor-css.mjs` - Reads tokens → generates cursor.css
- ✅ `scripts/design/buildpages.mjs` - Scaffold exists (needs pattern assembly logic)

### 3. Brand Tokens (Source of Truth)
- ✅ `infra/wordpress/brands/hezlep-inc/tokens/design-tokens.json` - Complete
- ✅ `infra/wordpress/brands/sparky-hq/tokens/design-tokens.json` - Complete
- ✅ Token structure matches blueprint (palette, typography, radius, spacing)

### 4. Documentation
- ✅ `docs/ROADMAP.md` - Updated with numbered roadmaps, Roadmap 1 = Astra deployment
- ✅ `docs/TEMPLATE_BUILDER_DECISION.md` - Documents Astra shift
- ✅ `docs/CURRENT_TASKS.md` - Tracks active work
- ✅ Legacy MD files cleaned up from root

## ❌ What's Missing (Critical for Roadmap 1)

### 1. Block Templates & Template Parts
**Missing:**
- `infra/wordpress/themes/astra-child/block-templates/` directory
- `infra/wordpress/themes/astra-child/block-template-parts/` directory
- Global templates: `front-page.html`, `page.html`, `single.html`, `archive.html`, `404.html`
- Template parts: `header.html`, `footer.html`

**Impact:** Can't deploy Astra sites without these.

### 2. Brand Patterns
**Missing:**
- `infra/wordpress/brands/hezlep-inc/patterns/` directory
- `infra/wordpress/brands/sparky-hq/patterns/` directory
- Pattern files: `hero-basic.html`, `services-grid.html`, `cta-banner.html`, etc.

**Impact:** Can't assemble pages from reusable patterns.

### 3. Brand Sitemap Files
**Missing:**
- `infra/wordpress/brands/hezlep-inc/sitemap.json`
- `infra/wordpress/brands/sparky-hq/sitemap.json`

**Impact:** `buildpages.mjs` can't know which pages to generate.

### 4. Brand Page Content
**Missing:**
- `infra/wordpress/brands/hezlep-inc/content/pages/` directory structure
- Actual page JSON files (home.json, services.json, etc.)

**Impact:** No content to deploy.

### 5. Package.json Scripts
**Missing:**
- `design:generate` - Run all design generation scripts
- `design:theme-json` - Generate theme.json for a brand
- `design:cursor-css` - Generate cursor.css for a brand
- `design:build-pages` - Build pages for a brand

**Impact:** No convenient way to run design pipeline.

### 6. Deployment Workflow Integration
**Missing:**
- Astra child theme rsync step in `.github/workflows/deploy-theme.yml`
- Design script execution before deployment
- WP-CLI step to activate Astra child theme
- WP-CLI step to apply block templates and patterns
- WP-CLI step to create/update pages from JSON

**Impact:** Deployment workflow still Elementor-only.

### 7. Bootstrap Script Updates
**Current:** `infra/wordpress/wp-bootstrap.sh` still Elementor-focused
**Needs:**
- Option to use Astra child theme instead of overlay themes
- Logic to apply block templates
- Logic to register patterns
- Logic to create pages from JSON

## ⚠️ What Still References Elementor (Legacy Support)

### 1. Deployment Workflow
- `.github/workflows/deploy-theme.yml` - Still rsyncs `ops-base` and overlay themes
- Still runs Elementor kit import via `import-kits.sh`
- Still checks for Elementor templates in health checks

**Action:** Add parallel Astra path, keep Elementor for legacy sites.

### 2. Bootstrap Script
- `infra/wordpress/wp-bootstrap.sh` - Activates overlay themes (Elementor-based)
- Calls `import-kits.sh` which imports Elementor kits

**Action:** Add conditional logic: if Astra mode, skip Elementor steps.

### 3. Import Scripts
- `infra/wordpress/bin/import-kits.sh` - Elementor-specific
- `infra/wordpress/bin/kit-import.php` - Elementor-specific

**Action:** Keep for legacy, create new `apply-astra-design.sh` for Astra path.

### 4. Config Files
- `infra/wordpress/config/projects.json` - References `overlay_theme` (Elementor concept)

**Action:** Add optional `theme_type: "astra" | "elementor"` field.

### 5. README.md
- Still mentions Hello Elementor child theme as primary
- References Elementor kits

**Action:** Update to reflect Astra as primary, Elementor as legacy.

## 📋 Action Plan to Complete Roadmap 1

### Phase 1: Create Missing Structure (1-2 hours)

1. **Create block templates directory structure:**
   ```bash
   mkdir -p infra/wordpress/themes/astra-child/block-templates
   mkdir -p infra/wordpress/themes/astra-child/block-template-parts
   ```

2. **Create initial block templates:**
   - `block-templates/front-page.html`
   - `block-templates/page.html`
   - `block-templates/single.html`
   - `block-templates/archive.html`
   - `block-templates/404.html`

3. **Create template parts:**
   - `block-template-parts/header.html`
   - `block-template-parts/footer.html`

4. **Create brand pattern directories:**
   ```bash
   mkdir -p infra/wordpress/brands/hezlep-inc/patterns
   mkdir -p infra/wordpress/brands/sparky-hq/patterns
   ```

5. **Create initial patterns:**
   - `hero-basic.html`
   - `services-grid.html`
   - `cta-banner.html`

6. **Create sitemap files:**
   - `infra/wordpress/brands/hezlep-inc/sitemap.json`
   - `infra/wordpress/brands/sparky-hq/sitemap.json`

### Phase 2: Enhance Scripts (2-3 hours)

1. **Update `buildpages.mjs`:**
   - Read `sitemap.json`
   - Load patterns from `patterns/*.html`
   - Assemble pages into `content/pages/*.json`
   - Convert to Gutenberg block HTML format

2. **Add package.json scripts:**
   ```json
   "design:generate": "node scripts/design/generate-theme-json.mjs --brand=$BRAND && node scripts/design/generate-cursor-css.mjs --brand=$BRAND && node scripts/design/buildpages.mjs --brand=$BRAND",
   "design:theme-json": "node scripts/design/generate-theme-json.mjs",
   "design:cursor-css": "node scripts/design/generate-cursor-css.mjs",
   "design:build-pages": "node scripts/design/buildpages.mjs"
   ```

### Phase 3: Update Deployment (3-4 hours)

1. **Create new deployment workflow or enhance existing:**
   - Add step to run design scripts before rsync
   - Add rsync step for `astra-child` theme
   - Add WP-CLI step to activate Astra child theme
   - Add WP-CLI step to register block templates
   - Add WP-CLI step to register patterns
   - Add WP-CLI step to create/update pages from JSON

2. **Update bootstrap script:**
   - Add `THEME_TYPE` parameter (astra | elementor)
   - Conditional logic for Astra vs Elementor path

3. **Create Astra-specific apply script:**
   - `infra/wordpress/bin/apply-astra-design.sh`
   - Registers templates, patterns, creates pages

### Phase 4: Test & Verify (2-3 hours)

1. **Local testing:**
   - Run design scripts locally
   - Verify theme.json and cursor.css generated correctly
   - Verify pages assembled correctly

2. **Deployment testing:**
   - Deploy to Hezlep staging
   - Verify Astra child theme activates
   - Verify templates and patterns register
   - Verify pages created correctly

## 🎯 Success Criteria for Roadmap 1

- [ ] Astra child theme deploys to Cloudways
- [ ] Design tokens generate theme.json and cursor.css correctly
- [ ] Block templates register and display correctly
- [ ] Patterns register and can be inserted
- [ ] Pages created from JSON content
- [ ] Home page displays with patterns applied
- [ ] Full deployment pipeline works end-to-end

## 📊 Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Astra Child Theme | ✅ Scaffolded | Needs block templates/parts |
| Design Scripts | ✅ Created | buildpages.mjs needs enhancement |
| Brand Tokens | ✅ Complete | Both brands have tokens |
| Block Templates | ❌ Missing | Need to create |
| Template Parts | ❌ Missing | Need to create |
| Brand Patterns | ❌ Missing | Need to create |
| Sitemap Files | ❌ Missing | Need to create |
| Page Content | ❌ Missing | Need to generate |
| Package Scripts | ❌ Missing | Need to add |
| Deployment Integration | ❌ Missing | Need to add Astra path |
| Bootstrap Updates | ❌ Missing | Need Astra support |

## 🔄 Migration Strategy

**Dual Path Approach:**
1. **Keep Elementor path working** for existing sites (hezlep-inc, sparky-hq)
2. **Add Astra path** for new sites and gradual migration
3. **Config-driven:** Use `projects.json` to specify `theme_type: "astra" | "elementor"`

**Timeline:**
- Week 1: Create missing structure (Phase 1)
- Week 2: Enhance scripts and add deployment (Phases 2-3)
- Week 3: Test and verify (Phase 4)
- Week 4: Migrate first brand (Hezlep) to Astra

## 📝 Next Immediate Actions

1. **Create block templates and parts** (highest priority)
2. **Create initial brand patterns** (hero, services, CTA)
3. **Create sitemap.json files** for both brands
4. **Enhance buildpages.mjs** to assemble real pages
5. **Add package.json scripts** for design pipeline
6. **Create Astra deployment workflow** or enhance existing

---

**Review Status:** Complete
**Next Review:** After Phase 1 completion
**Owner:** Dev Team

