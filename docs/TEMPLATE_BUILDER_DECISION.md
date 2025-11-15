# Template Builder Decision: Elementor Pro vs Astra Pro

**Date:** 2025-01-09
**Decision:** Shift to Astra + Gutenberg (Elementor legacy-only)
**Status:** Active

## 🎯 Updated Question

We initially standardized on Elementor Pro, but we now want an **AI-friendly, CI/CD-friendly, WordPress‑native** design system. Should we shift to an **Astra + Gutenberg** pipeline for all new work?

## 📊 Current State

### Elementor Pro (Legacy)
- ✅ Already integrated and working for existing templates
- ✅ Header/Footer system-wide templates working
- ✅ Full page builder with visual editing
- ❌ Harder to generate deterministically from AI
- ❌ Heavier and less Git/JSON friendly
- ❌ Deployment pipeline tied to proprietary kit format

### Astra Pro + Gutenberg (Target)
- ✅ Lightweight and fast
- ✅ Built-in starter templates
- ✅ Better performance
- ✅ Part of Cloudways WordPress stack
- ✅ No license cost (if included)
 - ✅ Works with native Gutenberg block templates
 - ✅ Easy to represent as JSON/HTML in Git
 - ✅ Plays well with CI/CD + AI generation

## 🔍 Analysis

### Elementor Pro Advantages (Why we keep it for legacy)

1. **Already Working**
   - Templates imported successfully
   - Deployment pipeline tested and working
   - Header/Footer system-wide templates functioning
   - Team familiar with Elementor

2. **Investment Protection**
   - Existing templates in repo
   - Deployment scripts built for Elementor
   - Import/export workflow established
   - Time already invested

3. **Feature Rich**
   - Advanced page builder
   - Extensive widget library
   - Theme builder (Header/Footer)
   - Form builder integration
   - Popup builder

4. **Deployment Pipeline**
   - GitHub Actions workflow built
   - Kit import scripts working
   - Template versioning possible
   - CI/CD integration complete

### Elementor Pro Disadvantages

- Requires Pro license (cost)
- Can be resource-heavy
- Some performance overhead
- Learning curve for new team members

### Astra + Gutenberg Advantages (Why we are shifting)

- **AI-friendly:** design tokens + block templates = pure JSON/HTML
- **CI/CD-friendly:** deterministic files → Git → Actions → WP-CLI
- **Multi-tenant:** brand folders under `infra/wordpress/brands/*`
- **WordPress-native:** theme.json, block templates, block patterns
- **Performance:** generally lighter than heavy page builders
- **Cost:** can rely on Astra Pro included in Cloudways stack

### Astra + Gutenberg Tradeoffs

- Requires initial pipeline build (child theme, scripts, patterns)
- Requires porting existing Elementor templates over time
- Different editing experience in WP Admin (Gutenberg vs Elementor)

## 💡 Recommendation: **Adopt Astra + Gutenberg for all new work**

Policy:
- ✅ **New brands/sites:** Astra child theme + Gutenberg blocks
- ✅ **New automation/AI flows:** target `theme.json`, block templates, block patterns, and page JSON
- ⚠️ **Existing Elementor sites:** keep working as-is; migrate gradually only when it makes sense

## 📋 Decision Matrix (Updated)

| Factor | Elementor Pro | Astra Pro | Winner |
|--------|---------------|-----------|--------|
| Current Integration | ✅ Working | ❌ Not integrated | Elementor |
| Template Investment | ✅ Existing | ❌ Would rebuild | Elementor |
| Deployment Pipeline | ✅ Built | ❌ Would rebuild | Elementor |
| Performance | ⚠️ Moderate | ✅ Better | Astra |
| Features | ✅ Rich | ⚠️ Basic | Elementor |
| Cost | ⚠️ License | ✅ Included | Astra |
| Team Knowledge | ✅ Familiar | ❌ New | Elementor |
| **Overall (New Work)** | | **✅ Astra + Gutenberg** | Astra |

## ✅ Actions

- [x] Document new decision (this file)
- [x] Scaffold `infra/wordpress/themes/astra-child/`
- [x] Create brand token files for `hezlep-inc` and `sparky-hq`
- [x] Add scripts:
  - `scripts/design/generate-theme-json.mjs`
  - `scripts/design/generate-cursor-css.mjs`
  - `scripts/design/buildpages.mjs` (scaffold)
- [ ] Port one brand (Hezlep Inc) homepage to Astra/Gutenberg
- [ ] Wire CI/CD to deploy Astra child + Gutenberg content


---

**Decision Date:** 2025-01-09
**Review Date:** 2026-01-09 (annual review)
**Decision Maker:** Dev Team
**Status:** Final

