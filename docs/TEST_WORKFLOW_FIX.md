# Testing Workflow Fix - orchestrator-live-cron.yml

**Date:** 2025-01-09
**Status:** Ready for Testing

## What Was Fixed

The `orchestrator-live-cron.yml` workflow was failing with:
```
ORCHESTRATOR_URL and AI_KEY secrets are required
Error: Process completed with exit code 1.
```

**Fix Applied:**
- Updated to use `OPENAI_API_KEY` as primary (matches orchestrator auth)
- Added fallback to `AI_KEY` for legacy compatibility
- Made workflow fail gracefully - creates empty artifact if secrets missing
- No more workflow failures due to missing secrets

## Test Methods

### Method 1: Local Test Script (Recommended First)

Run the test script to verify the logic:

```bash
node ops/ai/test-workflow-live-snapshot.mjs
```

This simulates what the workflow does and shows:
- Which environment variables are set
- What the workflow would do in each scenario
- Expected behavior for each test case

**Expected Output (no secrets set):**
```
✅ Test Case 1: No secrets set
   Expected: Workflow should skip gracefully
   Result: Would create empty artifact and exit successfully
```

### Method 2: Test with Environment Variables

Test with actual values (if you have them):

```bash
# Test with OPENAI_API_KEY (preferred)
export ORCHESTRATOR_URL="https://ops-orchestrator.onrender.com"
export OPENAI_API_KEY="sk-..."
node ops/ai/test-workflow-live-snapshot.mjs

# Test with AI_KEY (legacy fallback)
export ORCHESTRATOR_URL="https://ops-orchestrator.onrender.com"
export AI_KEY="sk-..."
unset OPENAI_API_KEY
node ops/ai/test-workflow-live-snapshot.mjs
```

### Method 3: GitHub Actions Manual Trigger

**Steps:**

1. **Go to GitHub Actions:**
   - Navigate to: https://github.com/Hezlepinc/ops-cloud/actions

2. **Find the workflow:**
   - Look for "Orchestrator Live Cache Snapshot" in the workflow list

3. **Trigger manually:**
   - Click on "Orchestrator Live Cache Snapshot"
   - Click "Run workflow" button (top right)
   - Select branch (usually `dev` or `staging`)
   - Click "Run workflow"

4. **Check the run:**
   - Click on the new workflow run
   - Click on "live-snapshot" job
   - Review the logs

**Expected Behavior:**

**Scenario A: No secrets set**
```
⚠️  Warning: ORCHESTRATOR_URL secret not set, skipping live snapshot
```
- ✅ Workflow completes successfully
- ✅ Creates empty artifact `{}`
- ✅ No error exit code

**Scenario B: Only ORCHESTRATOR_URL set**
```
⚠️  Warning: Neither OPENAI_API_KEY nor AI_KEY secret is set, skipping live snapshot
Set OPENAI_API_KEY (preferred) or AI_KEY in repository secrets to enable live snapshot
```
- ✅ Workflow completes successfully
- ✅ Creates empty artifact `{}`
- ✅ No error exit code

**Scenario C: Both secrets set**
```
Fetching live snapshot from https://ops-orchestrator.onrender.com/ai/live
```
- ✅ Attempts API call
- ✅ Creates artifact with live snapshot (or empty if API fails)
- ✅ Workflow completes successfully

**Scenario D: API call fails**
```
⚠️  Warning: Failed to fetch live snapshot, creating empty artifact
```
- ✅ Workflow completes successfully
- ✅ Creates empty artifact `{}`
- ✅ No error exit code

## Verification Checklist

- [ ] Local test script runs without errors
- [ ] Workflow can be manually triggered in GitHub Actions
- [ ] Workflow completes successfully (green checkmark)
- [ ] No "Process completed with exit code 1" errors
- [ ] Logs show appropriate warnings (not errors)
- [ ] Artifact is created (even if empty)

## Setting Secrets (Optional)

If you want the workflow to actually fetch live snapshots:

1. **Go to repository Settings:**
   - Settings → Secrets and variables → Actions

2. **Add secrets:**
   - `ORCHESTRATOR_URL` = `https://ops-orchestrator.onrender.com`
   - `OPENAI_API_KEY` = Your OpenAI API key (preferred)
   - OR `AI_KEY` = Your API key (legacy fallback)

3. **Verify:**
   - Trigger workflow again
   - Should see "Fetching live snapshot..." in logs
   - Artifact should contain actual data

## Success Criteria

✅ **Workflow no longer fails** when secrets are missing
✅ **Workflow completes successfully** in all scenarios
✅ **Appropriate warnings** shown in logs (not errors)
✅ **Artifact always created** (empty or with data)

## Troubleshooting

### Workflow still fails
- Check that you've committed and pushed the fix
- Verify the workflow file is updated: `.github/workflows/orchestrator-live-cron.yml`
- Check that the branch you're testing has the latest changes

### No workflow appears in Actions
- Ensure workflow file is in `.github/workflows/` directory
- Check that `workflow_dispatch: {}` is present in the workflow
- Try pushing a commit to trigger validation

### Secrets not working
- Verify secret names match exactly (case-sensitive)
- Check that secrets are set at repository level (not environment level)
- Ensure you're testing on the correct branch

## Next Steps

Once testing confirms the fix works:

1. ✅ Workflow no longer fails
2. ✅ Can proceed with Astra migration work
3. ✅ Optional: Set secrets if you want live snapshots enabled

---

**Test Status:** Ready
**Test Script:** `ops/ai/test-workflow-live-snapshot.mjs`
**Workflow File:** `.github/workflows/orchestrator-live-cron.yml`

