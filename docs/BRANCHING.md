# Git Branching Strategy

## Overview

This repository uses a three-branch workflow: `dev` → `staging` → `main`.

## Branches

| Branch | Purpose | Protection | Auto-Deploy |
|--------|---------|------------|-------------|
| **`dev`** | Daily development work | Default branch | No |
| **`staging`** | Testing environment (clean) | PR required | Yes (to staging environment) |
| **`main`** | Production | Protected, PR required | Yes (to production environment) |

## Workflow

### Daily Development (`dev` branch)

1. **Work on `dev` branch** for all daily development
   ```bash
   git checkout dev
   git pull origin dev
   # Make changes
   git commit -m "feat: add new feature"
   git push origin dev
   ```

2. **Default branch:** `dev` is the default branch for all new work

### Testing (`dev` → `staging`)

1. **Create Pull Request** when ready for testing:
   - Source: `dev`
   - Target: `staging`
   - CI will run checks (lint, typecheck, build, tests)

2. **After PR approval and merge:**
   - Code deploys to staging environment automatically
   - Test on staging URLs (e.g., `staging.sparky-hq.com`)

### Production (`staging` → `main`)

1. **Manual promotion** after staging testing passes:
   - Use GitHub Actions workflow: "Promote Staging to Production"
   - Or create PR `staging` → `main` manually

2. **After merge to `main`:**
   - Code deploys to production environment automatically
   - Production URLs go live (e.g., `sparky-hq.com`)

## Promotion Flow Diagram

```
dev (daily work)
  ↓ PR + CI checks
staging (testing)
  ↓ Manual promotion
main (production)
```

## CI/CD Behavior

- **`dev` branch:** No automatic deployments
- **`staging` branch:** Auto-deploys to staging environment on merge
- **`main` branch:** Auto-deploys to production environment on merge

## Best Practices

1. **Keep `dev` clean:** Don't push broken code to `dev`
2. **Test before staging:** Run health checks and local tests before creating PR
3. **Review staging:** Always verify on staging before promoting to production
4. **Use PRs:** Always use Pull Requests for `dev` → `staging` and `staging` → `main`
5. **Small commits:** Keep commits focused and meaningful
6. **Clear messages:** Use conventional commit messages (feat:, fix:, docs:, etc.)

## Emergency Hotfixes

For critical production fixes:

1. Create branch from `main`: `git checkout -b hotfix/fix-name main`
2. Make fix and commit
3. Create PR `hotfix/fix-name` → `main`
4. After merge, cherry-pick to `staging` and `dev`:
   ```bash
   git checkout staging
   git cherry-pick <commit-hash>
   git push origin staging

   git checkout dev
   git cherry-pick <commit-hash>
   git push origin dev
   ```

## Related Documentation

- Daily workflow: [docs/02_DEV_CYCLE.md](02_DEV_CYCLE.md)
- Deployment: [docs/04_DEPLOYMENT.md](04_DEPLOYMENT.md)
- CI/CD: `.github/workflows/`

