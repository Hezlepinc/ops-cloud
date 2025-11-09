## Project Visibility Roadmap — Hezlep Ops Orchestrator

**Version:** 1.0
**Owner:** Hezlep Systems Architecture
**Goal:** Achieve total operational visibility of all project layers (GitHub, GPT-5, Cursor, Cloudways, and WordPress) through the central Orchestrator API.

## 0️⃣ Overview

| Layer                        | Role                                      | Endpoint Prefix                      |
| ---------------------------- | ----------------------------------------- | ------------------------------------ |
| GPT-5 (Hezlep Ops Assistant) | Conversational command layer              | `/ai/*` (via OpenAPI)                |
| Cursor IDE                   | Developer execution environment           | `/ai/cursor/*`                       |
| GitHub                       | Source of truth for repos                 | `/ai/github/*`                       |
| Cloudways / WordPress        | Hosting and front-end                     | `/ai/cloudways/*`, `/ai/wordpress/*` |
| Orchestrator (Render)        | Central coordination and visibility plane | N/A                                  |

## 1️⃣ Phase 1 — Unified Interface Foundation

**Goal:** Normalize all system communication through the Orchestrator.

**Tasks**

- Expand OpenAPI spec to include:
  - `/ai/github/*`
  - `/ai/cursor/*`
  - `/ai/context`
  - `/ai/audit`

- Standardize security headers:
  - `x-api-key` for GPT and Cursor
  - `x-client-id` to identify the caller (`gpt` / `cursor` / `cron`)

- Add `/ai/context` endpoint with Redis store

Example:

```json
{
  "branch": "staging",
  "commit": "abc1234",
  "activeUser": "john",
  "currentTask": "theme deployment"
}
```

- Cache state in Redis (expire 15 min).

**Outcome:** All systems share one communication plane and a shared context snapshot.

## 2️⃣ Phase 2 — GitHub Integration and Indexing

**Goal:** Grant full repo visibility via summarized, queryable APIs.

**Tasks**

- Add endpoints:
  - `/ai/github/commits`
  - `/ai/github/runs`
  - `/ai/github/repo`
  - `/ai/github/search`
  - `/ai/github/recall`

- Implement nightly cron:
  - Pull latest branch.
  - Chunk and embed repo (LangChain + OpenAIEmbeddings).
  - Store vectors in Redis or Pinecone.

- Add query endpoint:
  - `GET /ai/search?q=redis+cache+layer`
  - Returns top-k semantic matches with file context.

**Outcome:** GPT and Cursor can ask semantic questions across the entire repo.

## 3️⃣ Phase 3 — Cursor ↔ GPT Synchronization Layer

**Goal:** Connect IDE and GPT contexts in real time.

**Tasks**

- Create `/ai/cursor/session`:

```json
{
  "branch": "feature/ui",
  "file": "components/Header.tsx",
  "diff": "++ added search bar",
  "timestamp": "2025-11-09T15:45:00Z"
}
```

- Build small Cursor CLI plugin:
  - `cursor sync` → POSTs active file/diff.
  - `cursor listen` → subscribes to orchestrator events (Redis Pub/Sub).

- Update GPT prompt context from `/ai/context` before each command.

- Implement conflict resolution (last-write-wins + audit entry).

**Outcome:** Both interfaces operate cooperatively on the same live state.

## 4️⃣ Phase 4 — Full Visibility Dashboard

**Goal:** Human-readable monitoring UI.

**Features**

- GitHub branch / commit info
- Cursor session (active file, branch)
- GPT current context / query log
- WordPress + Cloudways health cards
- Audit timeline

**Stack**

- Next.js / React + Tailwind
- Data fetched via `/ai/status` and `/ai/context`
- Hosted on Render Web Service

**Outcome:** Real-time web dashboard consolidating system health and developer activity.

## 5️⃣ Phase 5 — Intent & Policy Engine

**Goal:** Enable coordinated command execution across GPT and Cursor with human approval.

**Tasks**

- Add `/ai/intents` endpoint:

```json
{
  "intent": "deploy",
  "target": "staging",
  "initiator": "gpt",
  "approved": false
}
```

- Store intents in Postgres (auditable queue).

- Build approval logic:
  - GPT can propose; human or Cursor must approve.
  - Policy: GPT cannot deploy to `main`.

- Mirror results to `/ai/audit`.

**Outcome:** Safe automated orchestration loop with full human oversight.

## 6️⃣ Phase 6 — Performance & Optimization

| Concern     | Mitigation                                                     |
| ----------- | -------------------------------------------------------------- |
| Token usage | Summarize and pre-embed large files; return concise JSON.      |
| Latency     | Use Redis caching; co-locate Render and Pinecone region.       |
| Cost        | Batch embeddings nightly; incremental diff indexing.           |
| Security    | No raw code exposed to GPT; only summaries and vector matches. |
| Reliability | `/ai/metrics` endpoint + uptime cron monitor.                  |

## 7️⃣ Phase 7 — Final Integration & Rollout

- Deploy all new endpoints to staging (`develop` branch).
- Test GPT-5 orchestration commands:
  - “Review full project”
  - “Show last five commits and workflow runs”
  - “Sync with Cursor session”
- Validate Cursor plugin (send + receive).
- Promote to `main` once latency < 4 s and context coherence > 95%.

## 🧠 Expected Benefits

| Category     | Impact                                        |
| ------------ | --------------------------------------------- |
| Visibility   | GPT and Cursor share identical project view   |
| Security     | GitHub token and repo data isolated in Render |
| Efficiency   | No large uploads; GPT receives only summaries |
| Auditability | Every action logged in `/ai/audit`            |
| Scalability  | Vector recall supports multi-repo visibility  |
| Governance   | Policy engine enforces safe automation        |

## 🔒 Key Environment Variables

| Variable              | Purpose                   |
| --------------------- | ------------------------- |
| OPENAI_API_KEY        | Embeddings + GPT recall   |
| GITHUB_TOKEN          | GitHub API access         |
| GITHUB_REPO           | Target repository         |
| REDIS_URL             | Context + session storage |
| POSTGRES_URL          | Audit + intents DB        |
| x-api-key             | GPT/Cursor authentication |
| CW_EMAIL / CW_API_KEY | Cloudways control         |
| WP_REST_ENDPOINT      | WordPress health checks   |

## 🗓️ Maintenance Cadence

| Frequency | Task                                    |
| --------- | --------------------------------------- |
| Daily     | pre-dev-day sync + `/ai/status` check   |
| Nightly   | Repo re-index + cache warm-up           |
| Weekly    | Audit log rotation + dependency update  |
| Monthly   | Security review + vector DB pruning     |
| Quarterly | Orchestrator load test + rollback drill |

## ✅ End State

After completing all phases:

- GPT-5, Cursor, and Render Orchestrator operate as a single, stateful ecosystem.
- Every edit, deploy, or query passes through the same context and audit channel.
- “Project review” becomes a first-class operation — GPT has full visibility without ever overloading context or exposing credentials.
