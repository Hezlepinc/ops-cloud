# Documentation Consolidation Plan

**Date:** 2025-01-09
**Goal:** Consolidate temporary MD files into organized roadmaps

## 📋 Files to Archive/Consolidate

### Root Level Temporary Files → Archive/Delete

1. **FIX_HEZLEP_HOME.md** → Content merged into:
   - `docs/04_DEPLOYMENT.md` (troubleshooting section)
   - `docs/CURRENT_TASKS.md` (task #3)

2. **WHAT_SHOULD_BE_VISIBLE.md** → Content merged into:
   - `docs/04_DEPLOYMENT.md` (verification section)

3. **CLEANUP_PAGES.md** → Content merged into:
   - `docs/CURRENT_TASKS.md` (task #2)

4. **APPLY_TEMPLATES_TO_PAGES.md** → Content merged into:
   - `docs/CURRENT_TASKS.md` (task #3)
   - `docs/ROADMAP.md` (Phase 2)

5. **CLOUDWAYS_ACCESS.md** → Content merged into:
   - `docs/04_DEPLOYMENT.md` (diagnostic section)

6. **RUN_DIAGNOSTIC.md** → Content merged into:
   - `docs/04_DEPLOYMENT.md` (troubleshooting section)

7. **QUICK_DEPLOY.md** → Content merged into:
   - `docs/04_DEPLOYMENT.md` (quick start section)

8. **DEPLOY_PROOF_OF_LIFE.md** → Archive (completed milestone)
   - Move to `docs/archive/` or delete

9. **DEPLOYMENT_STATUS.md** → Archive (completed milestone)
   - Move to `docs/archive/` or delete

10. **DEPLOYMENT_PLAN.md** → Archive (completed milestone)
    - Move to `docs/archive/` or delete

11. **NEXT_STEPS.md** → Content merged into:
    - `docs/ROADMAP.md`
    - `docs/CURRENT_TASKS.md`

## 📁 New Structure

```
docs/
├── ROADMAP.md                    # Master roadmap (NEW)
├── CURRENT_TASKS.md              # Active tasks (NEW)
├── TEMPLATE_BUILDER_DECISION.md  # Elementor vs Astra decision (NEW)
├── CONSOLIDATION_PLAN.md         # This file (NEW)
├── 01_OVERVIEW.md                # Keep
├── 02_DEV_CYCLE.md               # Keep
├── 03_ORCHESTRATOR.md            # Keep
├── 04_DEPLOYMENT.md              # Update with consolidated content
├── 05_BRANDS_MAP.md              # Keep
├── 06_PLAYBOOK.md                # Keep
├── 08_ROADMAP.md                 # Archive (replaced by ROADMAP.md)
├── 09_CURSOR_GUIDE.md            # Keep
├── 10_FUTURE.md                  # Keep
├── BRANCHING.md                  # Keep
├── CLEANUP_PLAN.md               # Keep
├── observability.md              # Keep
├── README.md                     # Keep
└── template-instructions/        # Keep
    ├── hezlep-inc.template.md
    └── sparky-hq.template.md
```

## ✅ Consolidation Steps

### Step 1: Update Core Documentation

1. **Update `docs/04_DEPLOYMENT.md`:**
   - Add "Quick Start" section from `QUICK_DEPLOY.md`
   - Add "Verification" section from `WHAT_SHOULD_BE_VISIBLE.md`
   - Add "Troubleshooting" section from `FIX_HEZLEP_HOME.md` and `RUN_DIAGNOSTIC.md`
   - Add "Diagnostics" section from `CLOUDWAYS_ACCESS.md`

2. **Update `docs/CURRENT_TASKS.md`:**
   - Add task #2 details from `CLEANUP_PAGES.md`
   - Add task #3 details from `APPLY_TEMPLATES_TO_PAGES.md`

3. **Update `docs/ROADMAP.md`:**
   - Add Phase 2 details from `APPLY_TEMPLATES_TO_PAGES.md`
   - Merge relevant content from `NEXT_STEPS.md`

### Step 2: Archive Completed Milestones

Create `docs/archive/` directory and move:
- `DEPLOY_PROOF_OF_LIFE.md`
- `DEPLOYMENT_STATUS.md`
- `DEPLOYMENT_PLAN.md`
- `docs/08_ROADMAP.md` (replaced by new ROADMAP.md)

### Step 3: Delete Temporary Files

After consolidation, delete:
- `FIX_HEZLEP_HOME.md`
- `WHAT_SHOULD_BE_VISIBLE.md`
- `CLEANUP_PAGES.md`
- `APPLY_TEMPLATES_TO_PAGES.md`
- `CLOUDWAYS_ACCESS.md`
- `RUN_DIAGNOSTIC.md`
- `QUICK_DEPLOY.md`
- `NEXT_STEPS.md` (after merging)

## 🎯 Maintenance Going Forward

### Rules for New Documentation

1. **Before creating new MD file:**
   - Check if content belongs in existing file
   - Update existing roadmap/task file instead
   - Only create new file if it's a new major topic

2. **Update roadmaps as tasks complete:**
   - Move completed tasks from `CURRENT_TASKS.md` to `ROADMAP.md`
   - Update status in `ROADMAP.md`
   - Archive completed milestone docs

3. **Keep documentation current:**
   - Review `CURRENT_TASKS.md` weekly
   - Update `ROADMAP.md` monthly
   - Archive old docs quarterly

## 📝 Template Builder Decision

**Decision:** Continue with Elementor Pro (see `docs/TEMPLATE_BUILDER_DECISION.md`)

**Key Points:**
- System is working and proven
- Significant investment already made
- Better suited for current requirements
- Team already familiar
- Deployment pipeline complete

**Future:** Consider Astra Pro for new simple sites, but stick with Elementor for complex branded sites.

## ✅ Next Actions

- [ ] Update `docs/04_DEPLOYMENT.md` with consolidated content
- [ ] Update `docs/CURRENT_TASKS.md` with task details
- [ ] Create `docs/archive/` directory
- [ ] Move completed milestone docs to archive
- [ ] Delete temporary files after verification
- [ ] Update README.md to reference new structure

---

**Status:** Ready to execute
**Owner:** Dev Team
**Timeline:** Complete within 1 week

