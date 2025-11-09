# Hezlep Ops — Cursor Rules

## Mission
Operate this monorepo with automation-first principles. Prefer scripts, WP-CLI, and orchestrator routes over manual steps.

## Golden Rules
- Do not introduce secrets in code. Use `${{ secrets.* }}` and env vars.
- Prefer WP-CLI for Elementor (kit export/import) and WP ops.
- Template updates live under `/templates/**`; theme code under `/infra/wordpress/theme/**`.
- Every change must be idempotent and reviewable (small PRs).
- For deploys/imports: run via CI or orchestrator, not from local unless instructed.

## Paths
- Theme: `/infra/wordpress/theme/`
- Templates: `/templates/` + `/templates/template.manifest.json`
- Docs (GPT): `/Documents/gpt/**` and `/Documents/gpt-bundle.md`
- Scripts: `/scripts/**`

## Commit Hygiene
- Conventional commits: feat/fix/chore/docs/ci
- Include path in subject when useful, e.g., `feat(templates): home hero block`

## When in doubt
1) Open a draft PR with the minimal diff  
2) Attach run output (or CI logs)  
3) Ping orchestrator `/ai/status` to verify state


