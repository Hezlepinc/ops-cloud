Hezlep Inc — WordPress Template Specification
Corporate / Consulting / Automation Brand

1. Brand Tone & Design Language
   Attribute Description
   Brand Personality Confident, analytical, precise, and trustworthy.
   Core Message “Systems for builders, by builders.”
   Style Vibe Clean corporate layout, grid-based whitespace, subtle motion, neutral backgrounds, rich contrast blues.
   Imagery Blueprint textures, field-to-boardroom visuals (construction meets technology), people-in-process scenes.
   Typography Feel Modern sans-serif with technical edge.
   Motion / Interaction Framer-style slide-in fades, subtle underline animations, counter animations for metrics.
2. Global Design System
   🎨 Colors
   Role Color Usage
   Primary #0A2342 Headers, footers, text emphasis
   Accent / CTA #007AFF Buttons, links, highlights
   Secondary #00C2FF Gradients, icon lines
   Background #FFFFFF / #F7F9FB Sections, cards
   Text Dark #1E1E1E Body copy
   Divider / Border #E5E7EB Section separators
   ✍️ Typography
   Element Font Weight / Size
   Headings Poppins 700 – 600 / H1 48px, H2 36px, H3 24px
   Body Inter 400 – 500 / 16–18px
   Quote / Accent IBM Plex Mono 400 / 16px for taglines or stats
   🧱 Layout Tokens

Section padding: 100px top / 80px bottom desktop → 60/40 mobile

Grid gap: 32 desktop → 16 mobile

Card padding: 32px; radius 12px; shadow 0 4px 14px rgba(0,0,0,0.08)

Buttons: 16px text, radius 8px, primary → hover darken 10%

Icons: Lucide or LineIcons — outlined, single color

3. Site Architecture (Top-Level Pages)
   Page Purpose Key Blocks
   Home High-impact overview + CTA Hero / Mission / Capabilities / Case Studies / CTA
   About Story, leadership, credibility Founder Intro / Timeline / Certifications
   Consulting Core services Service Grid / Process / Pricing CTA
   Automation & Systems Showcase backend/AI tools Workflow Illustrations / Integrations / Demo CTA
   Clients & Case Studies Proof + results Carousel / Stats Grid / Testimonials
   Insights Blog / News / Resources Card Archive + Categories
   Contact / Consult Conversion Contact Form → CRM + Map + Schedule CTA

Optional:

Careers (future)

Partner Portal (login redirect)

4. Elementor Section Blueprints
   🏠 Home Page
   Section Structure Notes
   Hero 2-col (50/50) layout; left = headline + CTA; right = image/Lottie Background gradient navy→blue; CTA = “Book a Consultation”
   Mission Statement Centered text block Tagline: “Turning field experience into scalable systems.”
   Capabilities Grid 3 cols Automation / Web Ops / Growth Systems; icons above headings
   Case Study Preview Horizontal cards with images + metrics Example: “Reduced lead handling time by 70%”
   CTA Banner Full width gradient → button “Let’s Design Your Ops System”
   💼 Consulting Page

Intro paragraph → Accordion (“What We Fix”)

3-step process grid (“Discover → Design → Deploy”)

Callout quote section (“Built by practitioners”)

Pricing table (Starter / Growth / Enterprise)

CTA → Schedule consult form

⚙️ Automation & Systems Page

Hero with “See it in Action” button → optional modal video

Icons row (CRM, Zapier, Render, Cloudways, OpenAI)

Integration flow diagram (can embed SVG/Lottie)

AI Tools Section: preview of “Ops Cloud Dashboard”

🧾 Insights Page

Blog archive layout → cards × 3

Sidebar: categories (“Automation,” “Leadership,” “Growth”)

Subscribe widget → CRM newsletter list

📞 Contact Page

Split layout (map left / form right)

Form → Zapier webhook → CRM Pipeline

Add FAQ accordion under form

5. Header & Footer Layout
   Header

Logo left, menu center, CTA button right (“Book Consult”)

Sticky on scroll; subtle blur background

Mobile: hamburger menu slide-in from right

Footer

4 cols: About | Services | Resources | Contact

Bottom bar with © Hezlep Inc 2025 + social icons

Footer accent stripe blue→navy gradient

6. Elementor Theme Builder Structure
   Template Scope Notes
   Header Global Transparent on home, solid on scroll
   Footer Global Dynamic year + social icons
   Single Post Insights articles Sidebar optional; breadcrumb top
   Archive Insights categories Masonry cards
   Single Case Study Custom post type KPI section + testimonial
   Popup Global CTA “Book Consult” modal via Elementor Popup
7. Plugins & Integrations
   Plugin Use
   Elementor Pro Core page builder
   ACF Pro Case Studies + Service meta
   Yoast SEO / RankMath SEO structure
   WP Rocket / Cloudways Breeze Caching
   WPForms / Fluent Forms Contact submission
   Cloudways Bot Server monitoring
   Plausible Analytics + GTM Analytics + tracking
   Zapier for WP Form → CRM automation
   Custom Post Types UI Case Studies, Testimonials
   WPGraphQL (optional) Future headless integration
8. Future AI / Automation Integration

Embed Architect GPT widget in “Automation & Systems” page.

Add “AI Command Prompt” backend widget to auto-generate Elementor JSON sections.

Integrate CRM (Airtable / HubSpot / Pipedrive) via API.

Optional Render cron to sync leads nightly.

9. Technical Structure / Deployment

Hosted on Cloudways (DigitalOcean 4 GB+)

Git Deploy → wp-content/themes/hezlepinc

Daily backups + Varnish + Redis enabled

SSL enabled (Let’s Encrypt)

Use staging site for design iterations

10. Visual Identity Examples
    Area Treatment
    Hero Banner Blueprint overlay / animated lines / gradient navy→blue
    Cards & Sections Minimal shadows, white cards on gray bg
    Typography Contrast Large headings, light body copy
    Imagery Tone Mix of real photos + vector icons
    Micro-animations Button hover lift, grid fade-ins
11. Example Elementor Block Naming Convention
    Section: hero_main
    Section: capabilities_grid
    Section: process_steps
    Section: case_study_teasers
    Section: contact_banner
    GlobalWidget: button_primary
    GlobalWidget: heading_subtle
    Popup: consult_modal

Keep a consistent naming pattern for global template reuse across client clones.

12. Deliverables for Initial Build
    Item Description
    hezlepinc-theme Custom child theme folder on Cloudways
    global-style.json Elementor global style kit
    page-home.json Elementor template export
    page-consulting.json Elementor template export
    page-contact.json Elementor template export
    WPForms Template Contact form → Zapier hook
    Assets Folder Logos, SVG icons, background Lotties
