# Brand Structure Alignment

**Current vs. preferred file structure (hybrid support).**

## Preferred Structure
```
/infra/wordpress/brands/<brand>/
├── design-tokens.json  # At root
├── theme.json         # At root
├── cursor.css         # At root
├── sitemap.json       # ✅ Matches
└── pages/*.html       # HTML format
```

## Current Structure (Working)
```
/infra/wordpress/brands/<brand>/
├── tokens/design-tokens.json  # Nested
├── assets/css/cursor.css      # Nested
├── content/pages/*.json       # JSON format
├── patterns/*.html            # Pattern library
└── sitemap.json               # ✅ Matches
```

## Hybrid Approach
- **Scripts support both:** Check root first, fall back to nested
- **New brands:** Use preferred structure
- **Existing brands:** Migrate gradually

**See:** [AUTOMATION_REVIEW.md](AUTOMATION_REVIEW.md) for automation status.
