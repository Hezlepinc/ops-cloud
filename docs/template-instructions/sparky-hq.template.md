Sparky-HQ — Cursor-Integrated Project Template (v3, Nov 2025)

Purpose:
Unified build + deploy guide for all Sparky-HQ WordPress + Elementor + CI/CD projects.
Ready for Cursor AI workflows, Cloudways deployments, and Elementor SiteKit imports.
Includes local dev, CI pipeline, design tokens, and automated template import.

🧭 0) Mission and Impact

For builders

Build the trusted electric-trade intelligence platform (own traffic + data).

Automate repeatable site builds (Cursor + CI + Cloudways).

Control integrations and monetization (affiliates, lead gen, courses).

For users

Clear, context-driven tools (no prompt engineering needed).

Vetted information → implementation.

Accessibility, speed, and trust.

⚙️ 1) Tech Stack
Layer Platform Purpose
CMS Cloudways (WordPress + Elementor Pro) Main content system
CI/CD GitHub Actions + Cursor Ops Auto-deploy to staging / prod
Automation / APIs Render (Express + Workers) Calculators, cron jobs
Front-end (optional) Vercel / Render Next.js tools hub
Database MongoDB Atlas / Render Postgres Leads + telemetry
Analytics Plausible + GSC SEO & KPIs
Orchestration Cursor Dev flow automation, codegen, doc sync

Branches → staging (deploys to staging) • main (production)

🧱 2) Repo Layout
repo/
├── README.md
├── infra/
│ ├── brands/
│ │ └── sparky/
│ │ └── elementor/
│ │ ├── header.json
│ │ ├── footer.json
│ │ ├── home.json
│ │ ├── loop-item-post.json
│ │ ├── loop-item-tool.json
│ │ └── cursor-sitekit.json
│ └── wordpress/
│ └── themes/
│ └── hello-child/ (optional CSS + PHP hooks)
├── .github/workflows/
│ ├── deploy-cloudways-staging.yml
│ └── deploy-cloudways-prod.yml
├── api/ # Optional Express API
├── frontend/ # Optional Next.js UI
└── automation-workers/ # Jobs / cron scripts

🔐 3) Environment Variables
APP_ENV=production|staging|dev
CLOUDWAYS_HOST=...
CLOUDWAYS_USER=...
CLOUDWAYS_SSH_KEY=...
APP_ROOT_SPARKY_STAGING=/home/master/applications/xpzgjptrwn/public_html
APP_ROOT_SPARKY_PROD=/home/master/applications/tgmbbcupen/public_html
DEPLOY_SITE=sparky
OPENAI_API_KEY=...
SENDGRID_API_KEY=...

Stored as GitHub Actions Secrets.

🌐 4) DNS Map
Host Target Purpose
@ Cloudways server IP Main WP
cms.sparky-hq.com Cloudways app IP Headless WP
api.sparky-hq.com Render service Express API
tools.sparky-hq.com Vercel/Render Tools UI
🎨 5) Global Design System (Elementor Site Settings)

Colors

Token Hex Use
Primary #007AFF CTAs / links
Primary Hover #005FCC Button hover
Secondary #0E1622 Dark sections / footer
Accent #FF6A00 Highlights
Text #1E1E1E Headings
Text Muted #5F6B7A Paragraph / meta
Background #FFFFFF Page base
Surface #F8FAFC Cards
Divider #E5E7EB Lines

Fonts (Elementor → Global Fonts)

Slot Family Weight Size (D / T / M) LH
Primary Poppins 700 48 / 36 / 30 1.2
Secondary Poppins 600 32 / 28 / 24 1.3
Text Inter 400 16 / 15 / 14 1.7
Accent Inter 600 16 / 15 / 14 1.5

Spacing

Section padding 80 → 40 mobile

Card padding 24, grid gap 32 / 16

Radius 12 px, shadow 0 4px 14px rgba(0,0,0,0.08)

🏗️ 6) Core Elementor Templates
Template Display Condition Notes
header.json Entire Site Nav + CTA
footer.json Entire Site Secondary bg + white text
home.json Front Page Hero → 6 posts → 3 tools → CTA
loop-item-post.json Loop Blog card (16:9 image + excerpt)
loop-item-tool.json Loop Tool card (title + desc + CTA)
🧩 7) Dynamic Sections (Home Page)
Latest Posts (6)

Loop Grid → Query ID top_six_posts

Default = latest 6; can filter by category “top”.

Most Used Tools (3)

CPT tool with meta usage_weight DESC

Loop Grid → Query ID most_used_tools

Optional CPT / hook code in hello-child/functions.php (included in v2 template).

💻 8) CI/CD — Cloudways Deploy

Staging Workflow (.github/workflows/deploy-cloudways-staging.yml)

name: Deploy Staging (Cloudways)
on:
push:
branches: [staging]
jobs:
deploy:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4 - name: Rsync Hello Child
if: hashFiles('infra/wordpress/themes/hello-child/\*_') != ''
uses: burnett01/rsync-deployments@6.0
with:
switches: -avzr --delete
path: infra/wordpress/themes/hello-child/
remote_path: ${{ secrets.APP_ROOT_SPARKY_STAGING }}/wp-content/themes/hello-child/
remote_host: ${{ secrets.CLOUDWAYS_HOST }}
remote_user: ${{ secrets.CLOUDWAYS_USER }}
remote_key: ${{ secrets.CLOUDWAYS_SSH_KEY }} - name: Import Elementor Templates
run: |
for f in ./infra/brands/sparky/elementor/_.json; do
wp elementor import "$f" --allow-root || echo "Skipped $f"
          done
          HOME_ID=$(wp post list --post_type=page --name=home --field=ID --allow-root || true)
if [ -z "$HOME_ID" ]; then
HOME_ID=$(wp post create --post_type=page --post_title="Home" --post_status=publish --porcelain --allow-root)
fi
wp option update show_on_front 'page' --allow-root
wp option update page_on_front $HOME_ID --allow-root
wp cache flush --allow-root

Production Workflow (deploy-cloudways-prod.yml)
→ identical except branch main and path ${{ secrets.APP_ROOT_SPARKY_PROD }}.

🧠 9) Cursor Automation Steps

Goal: keep docs, pipeline, and SiteKit in sync.

Upload or edit templates in /infra/brands/sparky/elementor/.

Cursor auto-detects JSON changes → prompts commit message.
Example:

“Update SiteKit templates – header/footer/home adjusted.”

On save → staging branch push → triggers CI above.

Cloudways → SSH → imports templates via WP-CLI.

Site auto-rebuilds (Header + Footer + Home active).

Cursor Commands

@cursor sync templates
@cursor open infra/brands/sparky/elementor/
@cursor commit "Update Elementor SiteKit (v1.1)"
@cursor push staging

🚀 10) Launch Checklist

DNS @, cms., api. mapped & SSL padlock green

Elementor Pro active + SiteKit imported

Header/Footer visible site-wide

Home: 6 posts + 3 tools render correctly

Analytics (Plausible) + GSC verified

Cache + Security plugins active

CI/CD staging → main tested

📈 11) Growth Roadmap
Phase Focus Duration
1 – Foundation Launch 5 pages + first tool 1–2 weeks
2 – Content & Tools 10 posts + Load Calc + Conduit Fill 1–2 months
3 – Monetize Affiliates + Newsletter + Ads 3–6 months
4 – Platform Pro Tools + Courses + Partner dashboards 6–12 months
📊 12) KPIs

Launch time: < 1 day from clone

LCP: < 2.5 s • CLS: < 0.1

Posts / week: 2 • Tools / day: 50+

Lead conversion: 1–3 %

🧰 13) Elementor Quick-Build Reference

Hero (Flex) — 50/50 columns, min-height 600, bg #F8FAFC → H1 + button.
Post Grid (6) — Loop Grid → Query top_six_posts.
Tools Grid (3) — Loop Grid → Query most_used_tools.
CTA Band — Primary blue bg, white text, orange button.
Footer — Dark secondary bg #0E1622 → white links + copyright.

✅ 14) Client Template SOP (10 min)

Clone staging app → new client Cloudways app.

Run WP-CLI bootstrap script.

Import brand SiteKit (JSONs).

Verify Header/Footer/Home.

Add client DNS + SSL + analytics.

Snapshot backup → handoff.

End of Template – Cursor-Integrated Sparky HQ v3
