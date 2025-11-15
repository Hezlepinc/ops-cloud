# Current Tasks - Active Work

**Last Updated:** 2025-01-09
**Status:** In Progress

## 🚨 Immediate Actions (This Week)

### 1. Fix Dashboard Status Probe
**Priority:** High
**Status:** Not Started
**Owner:** Dev Team

**Problem:** Dashboard `/api/ai/status` endpoint is hanging during probe execution.

**Steps:**
1. Add detailed logging around each probe:
   - Orchestrator probe start/end
   - GitHub probe start/end
   - OpenAI probe start/end
2. Restart dashboard and inspect logs
3. Identify which probe is hanging
4. Patch the hanging probe
5. Add 5s timeout for each probe
6. Surface errors cleanly in dashboard UI

**Files:**
- `dashboard/src/pages/api/ai/status.ts`

**Success Criteria:**
- Dashboard correctly displays orchestrator health
- All probes complete within 5 seconds
- Errors are clearly visible in UI

---

### 2. Clean Up WordPress Pages
**Priority:** High
**Status:** In Progress
**Owner:** Dev Team

**Problem:** Pages showing duplicates and incorrect entries.

**Issues Found:**
- Duplicate Home pages ("Home" vs "Home - Front Page")
- Elementor template showing as page ("Elementor #84")
- Spelling error ("Resoureces" → "Resources")
- Missing pages (Consulting, Automation Systems)

**Steps:**
1. ✅ Identify issues (done)
2. Set correct front page (Settings → Reading)
3. Delete duplicate "Home - Front Page"
4. Delete "Elementor #84" from Pages
5. Fix "Resoureces" spelling
6. Create missing pages (Consulting, Automation Systems)
7. Verify front page is set correctly

**Files:**
- WordPress Admin UI (manual)
- Or via WP-CLI if SSH access available

**Success Criteria:**
- Only one Home page exists
- All expected pages exist with correct names
- Front page set correctly

---

### 3. Apply Templates to Pages
**Priority:** High
**Status:** In Progress
**Owner:** Dev Team

**Problem:** Pages showing basic framework instead of full templates.

**Root Cause:** Templates are imported into Elementor library but not applied to pages.

**Steps:**
1. ✅ Templates imported (done)
2. Edit Home page with Elementor
3. Insert Home template from My Templates
4. Edit Contact page with Elementor
5. Insert Contact template from My Templates
6. Edit Consulting page with Elementor
7. Insert appropriate template
8. Edit Automation Systems page with Elementor
9. Insert appropriate template
10. Verify all pages show full templates

**Files:**
- WordPress Admin UI (manual)
- Future: Auto-apply via enhanced deployment script

**Success Criteria:**
- All pages show full branded templates
- No placeholder images
- Consistent design across all pages

---

## 📋 Next Tasks (This Month)

### 4. Standardize Status Interfaces
**Priority:** Medium
**Status:** Not Started

**Goal:** Create shared status interface types.

**Steps:**
1. Create `packages/@hezlep/types/status` package
2. Define `ProbeStatus` interface
3. Define `StatusPayload` interface
4. Update orchestrator to use shared types
5. Update dashboard to use shared types
6. Add proper error handling

**Files:**
- `packages/@hezlep/types/status/index.ts` (new)
- `orchestrator/src/routes/status.js`
- `dashboard/src/pages/api/ai/status.ts`

---

### 5. Consolidate Environment Variables
**Priority:** Medium
**Status:** Not Started

**Goal:** Single source of truth for environment variables.

**Steps:**
1. Create `packages/config/env.ts`
2. Define Orchestrator env schema
3. Define Dashboard env schema
4. Add validation
5. Add safe defaults
6. Update all services to use shared config
7. Remove deprecated env vars

**Files:**
- `packages/config/env.ts` (new)
- `orchestrator/src/index.js`
- `dashboard/next.config.js`

---

### 6. Expand Observability
**Priority:** Medium
**Status:** Not Started

**Goal:** Better debugging and monitoring.

**Steps:**
1. Add Sentry to dashboard
2. Add request logging to orchestrator probes
3. Add log breadcrumbs
4. Set up error alerting
5. Create monitoring dashboard

**Files:**
- `dashboard/src/lib/sentry.ts` (exists, needs integration)
- `orchestrator/src/routes/status.js`
- `orchestrator/src/routes/deploy.js`

---

## ✅ Recently Completed

- [x] Template deployment proof of life
- [x] Orchestrator deploy endpoint
- [x] GitHub Actions workflow
- [x] Diagnostic tools created

---

## 📝 Notes

- All temporary MD files should be consolidated into this roadmap
- Update this file as tasks are completed
- Move completed tasks to `docs/ROADMAP.md` under "Completed"

