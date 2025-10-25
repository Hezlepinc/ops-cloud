# Sparky‑HQ Project Template

A drop‑in project README you can paste into any new Sparky‑HQ site or client repo. It captures the **why**, **what**, and **how**: impact, revenue paths, tech stack (Cloudways + Render), and the exact build steps (Elementor Pro + WordPress) to get from zero → launch.

---

## 0) Why Sparky‑HQ Exists (Impact)

**For you (the builder):**

- Become the trusted _electric trade intelligence_ brand (not just another AI prompt).
- Own search traffic, data, and lead flow (feeds Lenhart/InCharge or partners).
- Build compounding SEO assets (posts, tools, calculators).
- Control integrations and monetization (affiliates, courses, pro tools).

**For users (electricians & homeowners):**

- Clear, context‑driven tools (with NEC assumptions/safety baked in).
- Trust (vetted by professionals) + transparency.
- Accessibility (no prompt engineering—just use the tool).
- Community and shared progress over time.

> In short: **ChatGPT gives information. Sparky‑HQ gives implementation.**

---

## 1) Tech Stack (Sparky Stack)

| Layer                | Platform                             | Purpose                                                          |
| -------------------- | ------------------------------------ | ---------------------------------------------------------------- |
| Domains/DNS          | GoDaddy (or Cloudflare)              | Centralized brand & client DNS/email                             |
| Managed WP (CMS)     | **Cloudways (DigitalOcean)**         | Main site + client sites; staging, backups, Git deploy           |
| Apps/APIs/Automation | **Render**                           | Node/Express APIs, cron jobs (e.g., PowerPlay ingestor), workers |
| Front‑end (optional) | Vercel **or** Render Web Service     | Next.js tools/calculators; headless WP front                     |
| Database             | MongoDB Atlas **or** Render Postgres | Leads, logs, calculator telemetry                                |
| CI/CD                | GitHub Actions                       | Build → test → deploy (Cloudways/Render/Vercel)                  |
| Integrations         | Zapier/Make                          | No‑code automations (forms → CRM, alerts)                        |
| Analytics/SEO        | Plausible + Google Search Console    | Traffic + indexing                                               |

**Environments:** `dev` → `staging` → `prod`
**Branches:** `main` (prod), `develop` (staging), `feat/*` (feature).

---

## 2) Repo Layout (suggested)

```
repos/
  README.md                       # this file
  infra-docs/                     # diagrams, runbooks
  main-business-wp-theme/         # WP theme + build pipeline
  client-theme-template/          # golden image (plugins/settings)
  sparkyhq-frontend/              # Next.js (optional)
  sparkyhq-api/                   # Express API (Render web service)
  automation-workers/             # cron jobs, ingestors, emailers
```

---

## 3) Environment Variables (standard)

```
APP_ENV=production|staging|dev
LOG_LEVEL=info
WEB_BASE_URL=https://sparkyhq.com
API_BASE_URL=https://api.sparkyhq.com
WP_REST_ENDPOINT=https://cms.sparkyhq.com/wp-json
WP_GRAPHQL_ENDPOINT=https://cms.sparkyhq.com/graphql
MONGO_URI=...
POSTGRES_URL=...
REDIS_URL=...
OPENAI_API_KEY=...
SENDGRID_API_KEY=...
POWERPLAY_CREDENTIALS_JSON=...   # encrypted credentials JSON
```

Store in: **GitHub Actions Secrets** + Render/Vercel env stores. (Cloudways only if your PHP reads a `.env`).

---

## 4) DNS Map

| Host                 | Target              | Purpose            |
| -------------------- | ------------------- | ------------------ |
| `@`                  | Cloudways server IP | Main business WP   |
| `cms.sparkyhq.com`   | Cloudways app IP    | Headless WordPress |
| `api.sparkyhq.com`   | Render service      | Express API        |
| `tools.sparkyhq.com` | Vercel/Render       | Next.js tools      |
| client roots         | Cloudways server IP | Client WP hosting  |

SSL everywhere (Let’s Encrypt/managed certs).

---

## 5) WordPress Build (Elementor Pro)

### 5.1 Global Design System

- **Colors**

  - Primary `#007AFF` (CTAs)
  - Secondary `#005FCC` (hover/contrast)
  - Accent `#00C2FF` (highlights)
  - Text `#1E1E1E`
  - Background `#FFFFFF`; Alt `#F8F9FB`; Divider `#E4E6EA`

- **Fonts**

  - Headings: **Poppins** 700/600 (H1 48px, H2 36px, H3 28px; LH≈1.3)
  - Body/Buttons: **Inter** 400/600 (16–18px; LH≈1.6)

- **Buttons**: 16px, radius 8px, primary blue, hover dark‑blue, soft shadow
- **Spacing tokens**: section pad 80/40, card pad 24, grid gap 32/16, radius 12, shadow `0 4px 14px rgba(0,0,0,0.08)`

### 5.2 Core Pages (minimal viable)

- **Home** — Hero → Value Intro → Feature Trio (Learn/Calculate/Connect) → CTA
- **Resources** — “Learning Hub” w/ placeholder cards; later becomes blog archive
- **Tools** — Calculator hub; embed first tool (Voltage Drop) + “coming soon” cards

### 5.3 Feature Trio (Grid) — quick spec

- Container: **Grid** (3 cols desktop → 1 col mobile), gap 32
- Card: pad 32, bg Alt `#F8F9FB`, radius 12, shadow subtle
- Icon (Accent), H3 (Poppins 24–28), paragraph (Inter 16), optional outline button

### 5.4 Typography Setup (one‑time)

Elementor → **Site Settings → Typography**

- Disable default fonts/colors (Elementor → Settings)
- Set Body (Inter 16, LH 1.6), Links (Primary/Hover Accent)
- H1/H2/H3 as above (Poppins 700/600/500)

---

## 6) First Tool Embed (Voltage Drop)

**Option A (recommended):** Custom HTML/JS block inside Elementor → HTML widget (branded, lightweight).
**Option B:** Plugin shortcode (fastest start; replace later).

> Add explainer text + affiliate links (wire size, breakers) under the tool.

---

## 7) Cloudways Ops (WP Hosting)

- Provision DO **4GB** server (~$54/mo) → 10–20 light sites.
- Enable **Varnish + Redis**; daily backups (retain 7–14 days).
- Apps:

  - `main-business-site` (prod)
  - `client-template-site` (golden image → clone per customer)

- **Git Deploy (theme)**: Cloudways → Deployment via Git → repo deploy key → deploy to `wp-content/themes/<theme>`
- **WP‑CLI bootstrap** (script):

```
wp option update blogname "{{SITE_NAME}}"
wp option update siteurl "https://{{DOMAIN}}"
wp option update home "https://{{DOMAIN}}"
wp user update 1 --user_email=webmaster@{{DOMAIN}}
wp plugin activate seo-plugin cache-plugin security-plugin forms-plugin
```

---

## 8) Render Ops (APIs, Workers, Cron)

- Web Service: `sparkyhq-api` (Express: `/healthz`, `/calc` etc.)
- Worker: `automation-workers` (queues/emailers)
- Cron: `powerplay-ingestor` (e.g., _/5 _ \* \* \*)
- DB: Render Postgres or connect Atlas
- Alerts → email/Slack; autosuspend non‑prod services

**Minimal Express API:**

```ts
import express from 'express';
const app = express();
app.get('/healthz', (_, res) => res.json({ ok: true, ts: Date.now() }));
app.get('/calc', (req, res) => {
  const a = +req.query.amps || 0,
    v = +req.query.volts || 120;
  res.json({ watts: a * v });
});
app.listen(process.env.PORT || 8080, () => console.log('API up'));
```

---

## 9) CI/CD (GitHub Actions)

**WP Theme → Cloudways (rsync):**

```yaml
name: Deploy WP Theme to Cloudways
on:
  push:
    branches: [main]
    paths: ['wp-theme/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build theme assets
        working-directory: wp-theme
        run: |
          npm ci
          npm run build
      - name: Rsync to Cloudways
        uses: burnett01/rsync-deployments@6.0
        with:
          switches: -avzr --delete
          path: wp-theme/
          remote_path: ${{ secrets.CW_THEME_PATH }}
          remote_host: ${{ secrets.CW_HOST }}
          remote_user: ${{ secrets.CW_USER }}
          remote_key: ${{ secrets.CW_SSH_KEY }}
```

**API → Render (Deploy Hook):**

```yaml
name: Deploy API to Render
on:
  push:
    branches: [main]
    paths: ['api/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST -H 'Content-Type: application/json' \
          --data '{"clearCache": true}' "${{ secrets.RENDER_DEPLOY_HOOK_API }}"
```

**Frontend → Vercel (optional):**

```yaml
name: Deploy Frontend to Vercel
on: { push: { branches: [main], paths: ['frontend/**'] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
          prod: true
```

---

## 10) Monetization & Revenue Paths

1. **Affiliate** — Amazon/Home Depot (wire, devices), Generac, hosting referrals (Cloudways/Render).
2. **Ads** — Ezoic/Mediavine once 5k–50k+ visits.
3. **Pro Tools** — advanced calculators, NEC references, panel estimator (subscription).
4. **Courses** — generator mastery, NEC load calc, quoting systems.
5. **Lead Gen** — forms CTA into Lenhart/InCharge pipelines.

**Early projections (rough):**

- 10k visits/mo → $100–$400 ads; affiliates $200–$600; plus lead‑gen value.
- 50–100k → $3k–$8k blended, pre‑lead‑gen.

---

## 11) Launch Checklist (v1 Minimal)

- [ ] DNS → `@`, `cms.`, `api.`, (`tools.` optional)
- [ ] Elementor Pro activated; global colors/typography/buttons set
- [ ] Pages: Home / Resources / Tools (no broken links; polished placeholders ok)
- [ ] First tool embedded (or “coming soon”) + explainer copy + affiliate links
- [ ] Analytics (Plausible) + GSC verified; sitemap submitted
- [ ] Cache + security plugin enabled; SSL padlock
- [ ] CI/CD tested: WP theme deploy + API deploy

---

## 12) Growth Roadmap (phased)

**Phase 1 — Foundation (Week 1–2)**

- Build 3 pages; embed first tool; connect analytics; ship.

**Phase 2 — Content & Tools (Month 1–2)**

- 6–10 posts; add Load Calc; add Conduit Fill.
- Internal links: Tools ↔ Guides ↔ CTAs.

**Phase 3 — Monetize (Month 3–6)**

- Affiliates wired site‑wide; basic ads; newsletter capture.
- Start Pro Toolbox (auth + advanced calc behind login).

**Phase 4 — Platform (6–12 mo)**

- Courses, partnerships, data insights dashboards.
- Regional landing pages feeding your service orgs.

---

## 13) KPIs

- Time‑to‑launch page set: < **1 day**
- Core Web Vitals: LCP < 2.5s, CLS < 0.1
- Weekly posts: **2**
- Tools used/day: **50+** (target)
- Conversion to lead (relevant posts/tools): **1–3%**

---

## 14) Client Template SOP (10‑min)

1. Clone Cloudways `client-template-site` → new app.
2. Map domain + SSL; run WP‑CLI bootstrap.
3. Import brand kit; apply global styles.
4. Generate starter pages; wire form → CRM; add analytics + GSC.
5. Snapshot backup; handoff preview.

---

## 15) Appendix — Elementor Quick Builds

**Hero (Flex):** 2‑col (50/50), min‑height 600, bg `#F8F9FB`; H1 + paragraph + primary button; right column image/Lottie; mobile stack.

**Feature Trio (Grid):** 3 cols → 1 col mobile; card pad 32, bg Alt, radius 12; icon → H3 → paragraph → outline button.

**Tools Cards:** same as Feature Trio; each links to calculator route or “coming soon” modal.

---

**End of Template**
