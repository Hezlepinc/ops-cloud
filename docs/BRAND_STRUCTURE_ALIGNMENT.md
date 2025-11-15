# Brand Structure Alignment Guide

**Date:** 2025-11-15  
**Status:** Documenting current vs. preferred structure

## Current Structure vs. Preferred Structure

### Preferred Structure (from instructions)

```
/infra/wordpress/brands/<client-name>/
├── design-tokens.json          # At root
├── theme.json                   # At root (brand-specific)
├── cursor.css                   # At root (brand-specific)
├── sitemap.json                # ✅ Already matches
└── pages/
    ├── home.html                # HTML format
    ├── about.html
    ├── services.html
    └── contact.html
```

### Current Structure (what we have now)

```
/infra/wordpress/brands/<client-name>/
├── tokens/
│   └── design-tokens.json      # Nested (not at root)
├── assets/
│   └── css/
│       └── cursor.css          # Nested (not at root)
├── content/
│   └── pages/
│       ├── home.json           # JSON format (not HTML)
│       ├── about.json
│       ├── services.json
│       └── contact.json
├── patterns/                    # Pattern library
│   ├── hero-basic.html
│   ├── services-grid.html
│   └── cta-banner.html
├── sitemap.json                # ✅ Matches preferred
└── theme.json                  # Generated to astra-child/ (shared, not per-brand)
```

**Key Differences:**

1. **File locations:**
   - ✅ `sitemap.json` - Already at root (matches)
   - ⚠️ `design-tokens.json` - Currently nested in `tokens/`
   - ⚠️ `cursor.css` - Currently nested in `assets/css/`
   - ⚠️ `theme.json` - Currently generated to shared `astra-child/` theme

2. **Page format:**
   - ⚠️ Currently using `.json` files
   - Preferred: `.html` files (or `.wp.json`/`.wpblock.json` for block JSON)

3. **Theme approach:**
   - Current: Shared `astra-child` theme with brand-specific tokens injected
   - Preferred: Per-brand `theme.json` and `cursor.css` at brand root

## Alignment Options

### Option A: Keep Current Structure (Recommended for Now)

**Pros:**
- ✅ Already working and deployed
- ✅ Shared theme reduces duplication
- ✅ Pattern-based assembly is functional
- ✅ JSON format works with PHP script

**Cons:**
- ⚠️ Doesn't match preferred structure exactly
- ⚠️ Files nested deeper than preferred

**Action:** Document current structure, note differences

### Option B: Migrate to Preferred Structure

**Changes needed:**

1. **Move files to root:**
   ```bash
   mv infra/wordpress/brands/<brand>/tokens/design-tokens.json \
      infra/wordpress/brands/<brand>/design-tokens.json
   
   mv infra/wordpress/brands/<brand>/assets/css/cursor.css \
      infra/wordpress/brands/<brand>/cursor.css
   ```

2. **Generate theme.json per-brand:**
   - Update `generate-theme-json.mjs` to output to `brands/<brand>/theme.json`
   - Instead of `themes/astra-child/theme.json`

3. **Convert pages to HTML:**
   - Update `buildpages.mjs` to output `.html` instead of `.json`
   - Or support both formats (`.html` for templates, `.json` for WordPress import)

4. **Update PHP script:**
   - Read `.html` files instead of `.json`
   - Or convert HTML → WordPress blocks on import

**Pros:**
- ✅ Matches preferred structure exactly
- ✅ More self-contained per brand
- ✅ Easier for AI/Cursor to generate

**Cons:**
- ⚠️ Requires refactoring working code
- ⚠️ Need to update all scripts and workflows
- ⚠️ Risk of breaking current deployment

## Recommended Approach

### Phase 1: Support Both Formats (Hybrid)

1. **Keep current structure working** (don't break what's deployed)

2. **Add support for preferred structure:**
   - Update scripts to check for files at root first, then fall back to nested
   - Support both `.html` and `.json` page formats
   - Generate `theme.json` to both locations (brand root + astra-child)

3. **Gradual migration:**
   - New brands use preferred structure
   - Existing brands migrate when convenient

### Phase 2: Standardize on Preferred Structure

Once hybrid support is proven:
- Migrate all brands to root-level files
- Update all scripts to use preferred structure
- Remove nested structure support

## Implementation Plan

### Immediate (Support Both)

1. **Update `generate-theme-json.mjs`:**
   ```javascript
   // Output to both locations
   const brandThemeJson = path.join(brandRoot, 'theme.json');
   const sharedThemeJson = path.join(themeRoot, 'theme.json');
   fs.writeFileSync(brandThemeJson, json);
   fs.writeFileSync(sharedThemeJson, json); // Keep shared for now
   ```

2. **Update `generate-cursor-css.mjs`:**
   ```javascript
   // Output to both locations
   const brandCss = path.join(brandRoot, 'cursor.css');
   const assetsCss = path.join(brandRoot, 'assets/css/cursor.css');
   fs.writeFileSync(brandCss, css);
   fs.writeFileSync(assetsCss, css); // Keep nested for now
   ```

3. **Update `buildpages.mjs`:**
   ```javascript
   // Support both HTML and JSON output
   const htmlPath = path.join(contentDir, `${slug}.html`);
   const jsonPath = path.join(contentDir, `${slug}.json`);
   
   // Write HTML (preferred)
   fs.writeFileSync(htmlPath, assembledHtml);
   
   // Also write JSON (for current PHP script)
   fs.writeFileSync(jsonPath, JSON.stringify({ title, content: assembledHtml }));
   ```

4. **Update PHP script:**
   ```php
   // Try HTML first, fall back to JSON
   $htmlFile = "{$pagesDir}/{$slug}.html";
   $jsonFile = "{$pagesDir}/{$slug}.json";
   
   if (file_exists($htmlFile)) {
       $content = file_get_contents($htmlFile);
   } elseif (file_exists($jsonFile)) {
       $json = json_decode(file_get_contents($jsonFile), true);
       $content = $json['content'] ?? '';
   }
   ```

### Future (Full Migration)

1. Move all existing files to root
2. Remove nested structure
3. Standardize on HTML format
4. Update all documentation

## File Format Notes

### HTML vs. JSON for Pages

**HTML format (preferred):**
- ✅ Human-readable
- ✅ Easy for AI/Cursor to generate
- ✅ Can be edited directly
- ✅ Matches Gutenberg block markup format

**JSON format (current):**
- ✅ Structured data
- ✅ Easy to parse programmatically
- ✅ Can include metadata (title, patterns, etc.)
- ⚠️ Less human-readable

**Recommendation:** Support both, prefer HTML for new work

### Block JSON Format

If using full block JSON instead of HTML:
- Use `.wp.json` or `.wpblock.json` extension
- Format: `{ "blocks": [{ "blockName": "core/heading", ... }] }`
- More structured than HTML but less readable

## Next Steps

1. **Document current structure** ✅ (this file)
2. **Add hybrid support** (support both formats)
3. **Test with new brand** (use preferred structure)
4. **Migrate existing brands** (when convenient)
5. **Remove legacy support** (once all migrated)

---

**See Also:**
- [Automation Review](AUTOMATION_REVIEW.md) - Full automation status
- [Migration Checklist](MIGRATION_CHECKLIST.md) - Astra migration tasks
- [Deployment Guide](04_DEPLOYMENT.md) - Current deployment process

