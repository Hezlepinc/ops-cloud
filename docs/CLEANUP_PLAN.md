# Documentation Cleanup Plan
**Priority Order:** Critical → Medium → Low

## 🔴 Phase 1: Critical Fixes (Do First)

### 1.1 Fix Branch References (`develop` → `dev`)

**Files to Update:**
- `README.md` - Replace all `develop` with `dev`
- `docs/02_DEV_CYCLE.md` - Update branch references
- `docs/04_DEPLOYMENT.md` - Verify and update branch references

**Search & Replace:**
```bash
# Find all instances
grep -r "develop" README.md docs/ --include="*.md"

# Replace pattern:
# "develop" → "dev" (in context of branches)
# "Push to develop" → "Push to dev"
```

### 1.2 Fix Broken Documentation Links

**File:** `README.md` (lines 23-29)

**Current (Broken):**
```markdown
- Daily/Weekly/Monthly Playbook: [docs/DEV_CYCLE.md](docs/DEV_CYCLE.md)
- Orchestrator API & Usage: [docs/orchestrator.md](docs/orchestrator.md)
- Roadmap and Remaining Tasks: [docs/roadmap.md](docs/roadmap.md)
- Repository Map & Workflows: [docs/project-map.md](docs/project-map.md)
- Elementor Kit Workflow: [docs/kit-workflow.md](docs/kit-workflow.md)
- Hello Child Deploy Guide: [docs/hello-child-deploy.md](docs/hello-child-deploy.md)
```

**Should Be:**
```markdown
- Daily/Weekly/Monthly Playbook: [docs/02_DEV_CYCLE.md](docs/02_DEV_CYCLE.md)
- Orchestrator API & Usage: [docs/03_ORCHESTRATOR.md](docs/03_ORCHESTRATOR.md)
- Roadmap and Remaining Tasks: [docs/08_ROADMAP.md](docs/08_ROADMAP.md)
- Repository Map & Workflows: [docs/01_OVERVIEW.md](docs/01_OVERVIEW.md)
- Elementor Kit Workflow: See [docs/04_DEPLOYMENT.md#elementor-kit-workflow](docs/04_DEPLOYMENT.md#elementor-kit-workflow)
- Hello Child Deploy Guide: See [docs/04_DEPLOYMENT.md#wordpress-theme-deployment](docs/04_DEPLOYMENT.md#wordpress-theme-deployment)
```

### 1.3 Document Current Branching Strategy

**Create:** `docs/BRANCHING.md` or add section to `docs/02_DEV_CYCLE.md`

**Content:**
```markdown
## Git Branching Strategy

### Branches
- **`dev`** - Daily development work (default branch)
- **`staging`** - Testing environment (clean, for testing)
- **`main`** - Production (protected, manual promotion only)

### Workflow
1. Work on `dev` branch for daily development
2. When ready for testing: Create PR `dev` → `staging`
3. After testing passes: Create PR `staging` → `main` (manual approval)

### Promotion Flow
- `dev` → `staging`: Automated via PR (CI runs checks)
- `staging` → `main`: Manual promotion via GitHub Actions workflow
```

---

## 🟡 Phase 2: Documentation Updates

### 2.1 Add Health Check Script to Daily Routine

**File:** `docs/02_DEV_CYCLE.md`

**Add to Daily Routine section:**
```markdown
### 🔹 0. Health Check (Quick)
```powershell
node ops/ai/test-health.mjs
```
Checks orchestrator and dashboard status endpoints.
```

### 2.2 Link Observability Documentation

**File:** `README.md`

**Add to Docs section:**
```markdown
- Observability & Monitoring: [docs/observability.md](docs/observability.md)
```

### 2.3 Update Dashboard Port Number

**File:** `dashboard/README.md`

**Change:**
```markdown
Local URLs:
- Home: http://localhost:5120/
- Maps: http://localhost:5120/maps
```

### 2.4 Reference Environment Samples

**File:** `README.md` or `docs/02_DEV_CYCLE.md`

**Add:**
```markdown
## Environment Setup

Copy `.env.sample` files to `.env.local`:
- `dashboard/.env.sample` → `dashboard/.env.local`
- `orchestrator/.env.sample` → `orchestrator/.env.local` or `orchestrator/.env`

See each service's README for required variables.
```

---

## 🟢 Phase 3: Structure Cleanup

### 3.1 Legacy `apps/` Directory

**Action:** Investigate and document or remove

**Check:**
```bash
# Check if apps/ops-dashboard is referenced anywhere
grep -r "apps/ops-dashboard" . --exclude-dir=node_modules

# Check last modified dates
ls -la apps/
```

**Decision:**
- If unused: Remove `apps/ops-dashboard`
- If used: Document purpose in `README.md`
- If future: Add note in `docs/10_FUTURE.md`

### 3.2 Consolidate Future Docs

**Check:**
- Does `docs/future.md` exist? (mentioned in `docs/README.md`)
- If yes, merge with `docs/10_FUTURE.md` or clarify difference

### 3.3 Update Promotion Workflow Docs

**File:** `.github/workflows/promote.yml` or `docs/04_DEPLOYMENT.md`

**Add comment:**
```yaml
# Note: This workflow promotes staging → main
# For dev → staging, use standard PR workflow
```

---

## 📝 Quick Reference: File Mapping

| Old Reference | Actual File | Notes |
|--------------|------------|-------|
| `develop` branch | `dev` branch | Update all references |
| `docs/DEV_CYCLE.md` | `docs/02_DEV_CYCLE.md` | Numbered file |
| `docs/orchestrator.md` | `docs/03_ORCHESTRATOR.md` | Numbered file |
| `docs/roadmap.md` | `docs/08_ROADMAP.md` | Numbered file |
| `docs/project-map.md` | `docs/01_OVERVIEW.md` | Contains project map |
| `docs/kit-workflow.md` | `docs/04_DEPLOYMENT.md` | Section within file |
| `docs/hello-child-deploy.md` | `docs/04_DEPLOYMENT.md` | Section within file |
| Port 5000 | Port 5120 | Dashboard dev server |

---

## ✅ Checklist

### Critical
- [ ] Update all `develop` → `dev` references
- [ ] Fix broken links in `README.md`
- [ ] Document branching strategy

### Medium Priority
- [ ] Add health check to daily routine
- [ ] Link observability docs
- [ ] Fix dashboard port number
- [ ] Reference `.env.sample` files

### Low Priority
- [ ] Clean up `apps/` directory
- [ ] Consolidate future docs
- [ ] Update promotion workflow comments

---

**Created:** 2025-01-09
**Status:** Ready for implementation

