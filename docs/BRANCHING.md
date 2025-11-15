# Git Branching Strategy

**Three-branch workflow: `dev` → `staging` → `main`**

## Branches
- **`dev`** - Daily development (default branch, no auto-deploy)
- **`staging`** - Testing (PR required, auto-deploys to staging)
- **`main`** - Production (protected, PR required, auto-deploys to prod)

## Workflow
1. **Daily work:** Commit to `dev`, push regularly
2. **Testing:** Create PR `dev` → `staging`, merge after CI passes → auto-deploys
3. **Production:** Promote `staging` → `main` via GitHub Actions or PR → auto-deploys

## Hotfixes
Create branch from `main`, fix, PR to `main`, then cherry-pick to `staging` and `dev`.

**See:** [02_DEV_CYCLE.md](02_DEV_CYCLE.md) for daily workflow.
