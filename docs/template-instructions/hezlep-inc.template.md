# Hezlep Inc — WordPress Template Specification

**Type:** Corporate / Consulting / Automation
**Stack:** WordPress + Hello Elementor + Elementor Pro
**Deploy:** GitHub Actions → Cloudways → `wp elementor kit import`

---

## 1️⃣ Brand Tone & Design Language

| Attribute           | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **Personality**     | Confident · Analytical · Trustworthy                                                          |
| **Message**         | _Systems for builders, by builders._                                                          |
| **Vibe**            | Clean corporate grid layout · ample whitespace · subtle motion · navy contrast + gold accents |
| **Imagery**         | Blueprint textures · field-to-boardroom scenes · people-in-process                            |
| **Typography Feel** | Editorial serif headlines + modern sans-serif body                                            |
| **Motion**          | Smooth Framer-style slide/fade · underline link hover · button lift                           |

---

## 2️⃣ Global Design System

### 🎨 Colors

| Role                | HEX       | Usage                            |
| ------------------- | --------- | -------------------------------- |
| **Primary / Navy**  | `#0B3D91` | Headers · CTAs · Accents         |
| **Navy Dark**       | `#082C6F` | Button hover · depth             |
| **Accent / Gold**   | `#E1A100` | Highlights · Focus rings · Icons |
| **Surface / White** | `#FFFFFF` | Base background                  |
| **Surface Alt**     | `#F7F9FB` | Alternating bands                |
| **Text Dark**       | `#1E1E1E` | Body copy                        |
| **Text Muted**      | `#555555` | Secondary text                   |
| **Divider**         | `#E5E7EB` | Borders · Input lines            |

### ✍️ Typography

| Element    | Font                | Weight / Size    | Line Height | Use         |
| ---------- | ------------------- | ---------------- | ----------- | ----------- |
| H1         | Merriweather        | 700 · 44-52 px   | 1.2         | Hero        |
| H2         | Merriweather        | 700 · 36 px      | 1.25        | Section     |
| H3         | Merriweather        | 600 · 28 px      | 1.3         | Sub         |
| H4/H5      | Merriweather        | 600 · 22 / 18 px | 1.35-1.4    | Cards       |
| Body       | Inter               | 400 · 18 px      | 1.6         | Paragraph   |
| Small      | Inter               | 400 · 16 px      | 1.5         | Captions    |
| Button/Nav | Inter               | 600 · 16-18 px   | 1.4         | UI          |
| Quote      | Merriweather Italic | 400 · 22-24 px   | 1.4         | Pull quotes |

Fallbacks:
`Merriweather, Georgia, serif`
`Inter, "Helvetica Neue", Helvetica, Arial, sans-serif`

### 🧱 Layout Tokens

- **Container Width:** 1200 – 1280 px
- **Section Padding:** 96 – 120 px desktop → 64 px mobile
- **Grid Gap:** 32 → 16 px
- **Card:** 32 px padding · 12 px radius · shadow `rgba(0,0,0,0.05) 0 4 12 px`
- **Buttons:** Primary navy → hover navy-dark; Secondary outline navy → hover fill
- **Focus Ring:** 2 px solid `#E1A100`
- **Icons:** Lucide / LineIcons (outlined mono)

**Accessibility:** WCAG 2.2 AA contrast ≥ 4.5 · keyboard navigation · visible focus · alt text · ARIA labels

---

## 3️⃣ Site Architecture (2–3 Page MVP)

| Page                     | Purpose             | Key Blocks                                                   |
| ------------------------ | ------------------- | ------------------------------------------------------------ |
| **Home**                 | Core overview + CTA | Hero · Value Pillars · Method · Proof · CTA Band             |
| **About / Capabilities** | Story + Services    | Mission · Capabilities Grid · Leadership · Testimonial · CTA |
| **Contact**              | Conversion          | Form · Reassurance · Alternate Contact · FAQ                 |

**Optional:** Insights (blog) · Case Studies · Consulting · Automation & Systems · Careers · Partner Portal

---

## 4️⃣ Elementor Section Blueprints

### 🏠 Home

1. **Hero (50/50):** H1 + subtext + CTA “Book Consultation”; trust logos.
2. **Value Pillars:** 3 cards → Discover / Design / Deploy.
3. **Method Stepper:** 4 steps horizontal + CTA.
4. **Proof Snapshot:** 2-3 metrics + testimonial.
5. **CTA Band:** Full-width navy section · white text · single button.

### 💼 About / Capabilities

- Mission statement (2-3 sentences)
- Capabilities grid (4–6 items)
- Leadership photo + bio + principles
- Testimonial + CTA

### 📞 Contact

- Form fields: Name · Work Email · Company · Role · Interest · Message · Consent
- Reassurance text (SLA, confidentiality)
- Alternate contact (email + scheduler)
- FAQ accordion

---

## 5️⃣ Header & Footer

**Header:** Logo left · Menu center · Gold button right (“Book Consultation”) → Sticky with blur scroll effect.
**Footer:** 3–4 columns (About · Services · Resources · Contact) + copyright bar on navy with thin gold line.

---

## 6️⃣ Elementor Theme Builder Templates

| Template          | Scope       | Notes                              |
| ----------------- | ----------- | ---------------------------------- |
| Header            | Entire Site | Transparent home → solid on scroll |
| Footer            | Entire Site | Dynamic year + social icons        |
| Single Page       | All Pages   | Used for Home · About · Contact    |
| (Opt) Single Post | Insights    | Blog article                       |
| (Opt) Archive     | Insights    | Blog grid                          |
| (Opt) Case Study  | CPT         | KPI band + testimonial             |
| Popup             | Global      | “Book Consult” modal               |

---

## 7️⃣ Plugins & Integrations

| Plugin                 | Use             |
| ---------------------- | --------------- |
| Elementor Pro          | Core builder    |
| ACF Pro                | Case Study meta |
| Yoast / RankMath       | SEO             |
| WP Rocket / Breeze     | Cache           |
| WPForms / Fluent Forms | Contact         |
| Cloudways Bot          | Monitor         |
| Plausible + GTM        | Analytics       |
| Zapier for WP          | CRM automation  |
| CPT UI                 | Custom types    |
| WPGraphQL (optional)   | Headless API    |

---

## 8️⃣ AI / Automation (Optional)

- Embed **Architect GPT** widget in Automation page.
- Backend “AI Command Prompt” to auto-generate Elementor JSON sections.
- CRM sync via API (Airtable / HubSpot / Pipedrive).
- Optional Render cron for lead sync.

---

## 9️⃣ Technical & Deployment

**Hosting:** Cloudways (DO 4 GB +) · Varnish + Redis + SSL
**Base Theme:** Hello Elementor (+ optional hello-child)

infra/
brands/
hezlepinc/
elementor/
sitekit.json
header.json
footer.json
single-page.json
TEMPLATE-SPEC.md

bash
Copy code

**CI/CD**

```bash
wp elementor kit import ./infra/brands/hezlepinc/elementor/sitekit.json --allow-root
for f in ./infra/brands/hezlepinc/elementor/*.json; do
  wp elementor import "$f" --allow-root || echo "Skipped $f"
done
Secrets: CLOUDWAYS_HOST · CLOUDWAYS_USER · CLOUDWAYS_SSH_KEY · APP_ROOT_*
Backups daily via Cloudways; staging branch for design iterations.

🔟 Visual Identity & Assets
Asset	Spec
Logo	Polished navy gradient (#0B3D91→#082C6F) + gold accent; transparent PNG 1024 px
Profile Photo	Color-balanced portrait · 4:5 ratio · 1600 px height
Exports	/assets/branding/hezlepinc-logo-polished.png · hezlepinc-favicon-64.png
Image Tone	Natural · Editorial · Minimal backgrounds

11️⃣ Performance · SEO · Compliance
WebP / AVIF images · lazy load · no layout shift

Preconnect fonts · minify CSS/JS via cache plugin

Unique meta title & H1 · OpenGraph image

Schema: Organization + WebSite

Events: Hero CTA click · Header CTA · Form Submit

Privacy & Accessibility statements in footer

12️⃣ Naming Convention (Elementor)
css
Copy code
section_hero-main
section_value-pillars
section_method-stepper
section_proof-snapshot
section_contact-cta
global_button-primary
global_heading-section
popup_consult-modal
13️⃣ Deliverables for Initial Build
Item	Description
sitekit.json	Global colors + fonts + container widths
header.json	Theme builder header
footer.json	Theme builder footer
single-page.json	Base layout
WPForms Template	Contact → Zapier hook
/assets folder	Logos · Icons · Profile image
(Opt) hello-child	Shared CSS/PHP hooks

Export & Commit

bash
Copy code
git add infra/brands/hezlepinc/elementor/*.json
git commit -m "Hezlep Inc – Site Kit + Header/Footer/Single-Page"
git push origin staging
14️⃣ Acceptance Criteria
✅ Global colors & fonts consistent
✅ Header/footer responsive & sticky blur
✅ Home · About · Contact pages publish-ready
✅ Accessibility (contrast · keyboard · alt text)
✅ Performance ≥ 90 PageSpeed · no CLS
✅ CI imports cleanly on fresh deploy
✅ README explains update / export workflow

Maintainer Note:
All brand and layout assets for Hezlep Inc are canonical within this folder.
Updates should be committed via staging and merged to main after CI verification.
```
