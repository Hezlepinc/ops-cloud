# Ops Playbook — Cloudways + Render (Sparky‑HQ)

**Version:** 1.0
**Owner:** Operations (Sparky‑HQ)
**Last Updated:** {{ set on commit }}

> Purpose: This playbook defines how we deploy, operate, and scale our web properties and apps using **Cloudways** for WordPress and **Render** for apps/APIs/automation, with optional **Vercel** for Next.js frontends. It includes CI/CD, security, observability, backup, incident response, client onboarding, and revenue levers.

---

## 0) Executive Snapshot

- **Cloudways (DigitalOcean underlying)** → Managed WordPress for the **main business site** + **client sites** + optional **headless CMS**.
- **Render** → Node/Python **APIs**, workers, and **cron automations** (e.g., PowerPlay lead ingestor, AI endpoints).
- **Vercel** _(optional)_ → Next.js frontends (tools/calculators). May host on Render if you prefer to keep a single PaaS.
- **DNS/Email** → GoDaddy (or Cloudflare DNS).
- **Data** → MongoDB Atlas (JSON‑centric) and/or Render Postgres (relational).
- **Automation** → GitHub Actions for CI/CD, Zapier/Make for no‑code business flows.
- **Analytics/SEO** → Plausible, Google Search Console.

**Outcome:** Repeatable, low‑lift operations; fast client site creation; separate, scalable app tier; CI/CD everywhere.

---

## 1) Architecture (High‑Level)

```
                        +----------------------+
                        | GoDaddy / Cloudflare |
                        |  Domains + DNS/Email |
                        +----------+-----------+
                                   |
            -------------------------------------------------
            |                      |                         |
      Main Business            Sparky‑HQ                 Client Sites
         (WP)                   (Blog + Tools)              (WP)
            |                      |                         |
     +------+-------+      +-------+------+          +------+-------+
     | Cloudways WP |      | Vercel (Next) |         | Cloudways WP |
     |  + Staging   |      |  (optional)   |         |  + Staging   |
     +------+-------+      +-------+-------+         +------+-------+
            |                       |                       |
            |                       |                       |
            |                +------+-------+                |
            |                |  Render API  | <--- Workers/Cron (Render)
            |                +------+-------+
            |                       |
            |                +------+-------+
            |                |   DB (Atlas  |
            |                |   / Postgres)|
            |                +--------------+
```

---

## 2) Environments & Branching

- **Envs:** `dev` → `staging` → `prod`
- **Branches:**

  - `main`: production
  - `develop`: staging
  - feature branches: `feat/*`, `fix/*`

- **Promotion:** PR from feature → `develop`; smoke test on staging; PR `develop` → `main` to release.

---

## 3) Accounts & Access Checklist

- Cloudways org + server(s) provisioned (DO 4GB to start).
- Render org with services (API, workers, cron, DB).
- (Optional) Vercel project for Next.js.
- GoDaddy/Cloudflare for DNS.
- MongoDB Atlas or Render Postgres.
- GitHub org + repos created.
- SSO/MFA enforced on all vendors.
- SSH keys added to Cloudways users; GitHub deploy keys configured.

---

## 4) Repos & Naming Conventions

```
repos/
  infra-docs/                      # this playbook + diagrams
  main-business-wp-theme/          # theme + tooling (build)
  client-theme-template/           # golden image theme/plugins config
  sparkyhq-frontend/               # Next.js app (optional on Vercel)
  sparkyhq-api/                    # Node/Express API (Render Web Service)
  automation-workers/              # background workers + cron jobs (Render)
```

**Names:** use lowercase, hyphen‑separated; env suffixes: `-dev`, `-stg`, `-prod`.

---

## 5) Secrets & Config (Standardized)

**Shared env vars (examples):**

```
APP_ENV=production|staging|dev
LOG_LEVEL=info
WEB_BASE_URL=https://sparkyhq.com
API_BASE_URL=https://api.sparkyhq.com
WP_REST_ENDPOINT=https://cms.sparkyhq.com/wp-json
WP_GRAPHQL_ENDPOINT=https://cms.sparkyhq.com/graphql
MONGO_URI=...           # if using Atlas
POSTGRES_URL=...        # if using Render Postgres
REDIS_URL=...
OPENAI_API_KEY=...
SENDGRID_API_KEY=...
POWERPLAY_CREDENTIALS_JSON=...   # encrypted JSON in platform secret store
```

**Where to store:** GitHub Actions Secrets (org/repo) + Render/Vercel env stores. Cloudways: use app vars via `.env` only if your PHP code reads them.

---

## 6) DNS Layout (GoDaddy/Cloudflare)

| Hostname             | Points To           | Purpose                  |
| -------------------- | ------------------- | ------------------------ |
| `@`                  | Cloudways server IP | Main business WP         |
| `cms.sparkyhq.com`   | Cloudways app IP    | Headless WP              |
| `api.sparkyhq.com`   | Render service      | API                      |
| `tools.sparkyhq.com` | Vercel/Render       | Next.js tools (optional) |
| client roots         | Cloudways server IP | Client WP sites          |

> Enable HTTPS everywhere (Cloudways Let’s Encrypt, Render managed certs, Vercel certs).

---

## 7) Cloudways Operations (WordPress)

### 7.1 Server Sizing (initial)

- **DO 4GB** (~$54/mo) = ~10–20 light client sites; upgrade as metrics demand.
- Enable **Varnish** + **Redis**; daily backups (retain 7–14 days).

### 7.2 Apps

- `main-business-site` (prod)
- `client-template-site` (golden image)
- Additional client apps cloned from template.

### 7.3 Golden Image Template (one‑time)

1. Install baseline theme (Kadence/Block or custom) + essential plugins (SEO, cache, security, forms).
2. Configure global styles (colors, typography tokens), header/footer, menus.
3. Create starter pages: Home, Services, About, Contact, Privacy, 404.
4. Export theme options (JSON) into `client-theme-template` repo.
5. Snapshot: on‑demand backup.

### 7.4 Git Deploy (theme)

- Cloudways **Deployment via Git** → add repo deploy key.
- Point to theme path `wp-content/themes/<your-theme>`.

### 7.5 WP‑CLI bootstrap (script snippets)

```bash
wp option update blogname "{{SITE_NAME}}"
wp option update siteurl "https://{{DOMAIN}}"
wp option update home "https://{{DOMAIN}}"
wp user update 1 --user_email=webmaster@{{DOMAIN}}
wp plugin activate seo-plugin cache-plugin security-plugin forms-plugin
```

---

## 8) Render Operations (APIs, Workers, Cron)

### 8.1 Services

- **Web Service:** `sparkyhq-api` (Express/Node)
- **Background Worker:** `automation-workers` (queues, emailers)
- **Cron Jobs:** `powerplay-ingestor` (e.g., every 5 min)
- **DB:** Render Postgres or connect to MongoDB Atlas

### 8.2 Health, Scaling, Cost

- Add `/healthz` endpoints.
- Enable autosuspend for staging/dev.
- Alerts → email/Slack.
- Scale horizontally as needed; split services by concern (API vs worker vs heavy jobs).

---

## 9) CI/CD Workflows (GitHub Actions)

### 9.1 WP Theme → Cloudways (SSH + rsync)

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
      - name: Rsync theme to Cloudways
        uses: burnett01/rsync-deployments@6.0
        with:
          switches: -avzr --delete
          path: wp-theme/
          remote_path: ${{ secrets.CW_THEME_PATH }}
          remote_host: ${{ secrets.CW_HOST }}
          remote_user: ${{ secrets.CW_USER }}
          remote_key: ${{ secrets.CW_SSH_KEY }}
```

### 9.2 API → Render (Deploy Hook)

```yaml
name: Deploy to Render (API)
on:
  push:
    branches: [main]
    paths: ['api/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' \
          --data '{"clearCache": true}' "${{ secrets.RENDER_DEPLOY_HOOK_API }}"
```

### 9.3 Frontend → Vercel (optional)

```yaml
name: Deploy Frontend to Vercel
on:
  push:
    branches: [main]
    paths: ['frontend/**']
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

## 10) Automations

### 10.1 No‑Code (Zapier/Make)

- **WP Form Submission** → CRM lead → Slack notify → GSC index API.
- **New WP Post** → Trigger Vercel/Render build via webhook → Share on socials.
- **Render incident webhook** → Create GitHub issue → Slack alert.

### 10.2 Render Cron (Node example)

```js
// powerplay-ingestor.js
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

async function run() {
  const db = client.db('sparky');
  const logs = db.collection('powerplay_logs');
  const t0 = Date.now();
  const resp = await fetch('https://powerplay.generac...');
  const latencyMs = Date.now() - t0;
  await logs.insertOne({ status: resp.status, latencyMs, ts: new Date() });
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

---

## 11) Observability

- **Uptime:** UptimeRobot checks for `www`, `cms.`, `api.` (60s interval); Slack/email alerts.
- **Logs:** Render real‑time logs; Cloudways access/error logs; centralize notable events in DB if needed.
- **Analytics:** Plausible dashboards per site; weekly SEO report from GSC.
- **Health Pages:** `/healthz` for APIs; WP heartbeat check via cron.

---

## 12) Backups & Restore Drills

- **Cloudways:** Daily backups + on‑demand before deploys; retain 7–14 days. Quarterly restore test on a staging app.
- **DBs:** Atlas/Render automated backups; monthly restore verification.
- **Artifacts:** Theme/plugin release tags in Git; changelog per release.

---

## 13) Security

- Enforce **MFA/SSO** across vendors.
- SSH keys only (no password logins).
- Principle of least privilege in GitHub + Cloudways + Render.
- WP hardening: security plugin, reCAPTCHA, limit logins, auto‑minor core updates.
- Optional: Cloudflare WAF in front of `@`, `cms.`, `api.`
- Secret rotation every 90 days; separate dev/staging/prod secrets.
- Dependency scanning via `npm audit` + GitHub Dependabot.

---

## 14) Incident Response

**Severity Levels**

- **SEV‑1:** Site/API down >10 min or critical data loss.
- **SEV‑2:** Degraded performance or partial outage.
- **SEV‑3:** Minor bug, cosmetic, or non‑blocking.

**Runbook**

1. Acknowledge alert (UptimeRobot/Slack).
2. Check vendor status pages (Cloudways/Render/DB).
3. Roll back last deploy if correlated.
4. Hotfix branch → deploy to staging → promote to prod.
5. Post‑mortem in `infra-docs/incidents/<YYYY‑MM‑DD>.md`.

**Target SLOs**

- Uptime: **99.9%** web, **99.5%** API.
- MTTD < 2 min (automated alert); MTTR < 30 min for SEV‑1.

---

## 15) Cost & Scaling

- **Cloudways DO 4GB**: ~$54/mo → ~10–20 light sites. Scale up (8GB ~$99) or add servers and shard clients.
- **Render Web Svc**: $7–$25+/mo; Workers/Cron $1.5–$5+/mo. Autosuspend dev/staging.
- **DB**: Atlas free → $9+; Render Postgres free → $7+.

**Monitoring:** monthly cost report; trigger scale decisions at 70% sustained CPU/RAM.

---

## 16) Client Onboarding SOP (10‑Minute Flow)

1. **Clone** Cloudways `client-template-site` → new app name.
2. **Map** domain A record → server IP; issue SSL.
3. **Run** WP‑CLI bootstrap (site name, admin email, activate plugins).
4. **Import** brand kit (colors, fonts, logo); apply global styles.
5. **Generate** starter pages from template; replace placeholders.
6. **Wire** form → CRM + email; add Plausible + GSC property.
7. **Snapshot** backup; send preview to client.

> Optional: CI hook for shared theme so common improvements cascade safely.

---

## 17) Revenue Levers

- **Build fee** (site setup/design).
- **Hosting retainer** (Cloudways margin per server; $25–$99/site/mo).
- **Automation subscriptions** (Render apps — quoting tools, lead ingestion).
- **Affiliate**: Cloudways, Render, WP Engine, etc.
- **Consulting**: SEO/content analytics packages.

---

## 18) KPIs & Reviews

- Time‑to‑launch (template → live): target < **2 days** per client site.
- Deployment lead time: < **10 min** from merge to live.
- Uptime (web/API): ≥ **99.9%**.
- Core Web Vitals: LCP < 2.5s, CLS < 0.1.
- Cost per site ≤ **$6–$12** (on shared 4GB server with 10–20 installs).
- Quarterly infra review: right‑size servers, rotate secrets, restore drill.

---

## 19) Appendices

### A) Minimal Express API (Render)

```ts
import express from 'express';
const app = express();
app.get('/healthz', (_, res) => res.json({ ok: true, ts: Date.now() }));
app.get('/calc', (req, res) => {
  const amps = Number(req.query.amps || 0);
  const volts = Number(req.query.volts || 120);
  res.json({ watts: amps * volts });
});
app.listen(process.env.PORT || 8080, () => console.log('API up'));
```

### B) Theme Deploy (rsync secrets)

```
CW_THEME_PATH=/home/master/applications/<app_id>/public_html/wp-content/themes/<theme>
CW_HOST=<server_ip>
CW_USER=<ssh_user>
CW_SSH_KEY=<private_key>
```

### C) WP → Frontend Rebuild Webhook

- On post publish, call Vercel/Render build hook; enable ISR/SSG for speed.

### D) Risk Register (starter)

- Single server saturation → add second server; shard clients.
- Secret sprawl → centralize in GitHub/Render/Vercel stores; rotate 90d.
- Plugin bloat → maintain approved plugin list; quarterly audit.

---

## 20) Next Actions (Do Now)

1. Provision Cloudways DO 4GB server; create `main-business-site` + `client-template-site` apps.
2. Stand up Render services: `sparkyhq-api`, `automation-workers`, `powerplay-ingestor` + DB.
3. Configure DNS for `@`, `cms.`, `api.` (and `tools.` if using Vercel).
4. Add the three GitHub Action workflows with secrets.
5. Run the end‑to‑end **Sparky‑HQ Test Plan** (content → frontend → API → cron → analytics).
6. Document first client site using the **Client Onboarding SOP** and capture timings.

---

**End of Playbook**
