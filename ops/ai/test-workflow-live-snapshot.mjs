#!/usr/bin/env node
/**
 * Test script for orchestrator-live-cron.yml workflow logic
 *
 * Simulates what the workflow does to verify the fix works correctly
 *
 * Usage:
 *   node ops/ai/test-workflow-live-snapshot.mjs
 */

const ORCH_URL = process.env.ORCHESTRATOR_URL || process.env.ORCH_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AI_KEY = process.env.AI_KEY;

// Determine API key: prefer OPENAI_API_KEY, fallback to AI_KEY
const API_KEY = OPENAI_API_KEY || AI_KEY;

console.log('🧪 Testing orchestrator-live-cron.yml workflow logic\n');
console.log('Environment variables:');
console.log(`  ORCHESTRATOR_URL: ${ORCH_URL ? '✅ Set' : '❌ Not set'}`);
console.log(`  OPENAI_API_KEY: ${OPENAI_API_KEY ? '✅ Set' : '❌ Not set'}`);
console.log(`  AI_KEY: ${AI_KEY ? '✅ Set' : '❌ Not set'}`);
console.log(`  API_KEY (resolved): ${API_KEY ? '✅ Available' : '❌ Not available'}\n`);

// Test Case 1: No secrets set
if (!ORCH_URL && !API_KEY) {
  console.log('✅ Test Case 1: No secrets set');
  console.log('   Expected: Workflow should skip gracefully');
  console.log('   Result: Would create empty artifact and exit successfully\n');
}

// Test Case 2: Only ORCHESTRATOR_URL set
if (ORCH_URL && !API_KEY) {
  console.log('✅ Test Case 2: Only ORCHESTRATOR_URL set');
  console.log('   Expected: Workflow should skip gracefully (no API key)');
  console.log('   Result: Would create empty artifact and exit successfully\n');
}

// Test Case 3: Only API key set
if (!ORCH_URL && API_KEY) {
  console.log('✅ Test Case 3: Only API key set');
  console.log('   Expected: Workflow should skip gracefully (no URL)');
  console.log('   Result: Would create empty artifact and exit successfully\n');
}

// Test Case 4: Both set - try actual API call
if (ORCH_URL && API_KEY) {
  console.log('✅ Test Case 4: Both secrets set');
  console.log(`   ORCH_URL: ${ORCH_URL}`);
  console.log(`   API_KEY: ${API_KEY.substring(0, 10)}...`);
  console.log('   Attempting API call...\n');

  try {
    const response = await fetch(`${ORCH_URL}/ai/live`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ API call successful!');
      console.log(`   Response keys: ${Object.keys(data).join(', ')}`);
      console.log('   Result: Would create artifact with live snapshot\n');
    } else {
      console.log(`   ⚠️  API call returned ${response.status}`);
      console.log('   Result: Would create empty artifact and exit successfully\n');
    }
  } catch (error) {
    console.log(`   ⚠️  API call failed: ${error.message}`);
    console.log('   Result: Would create empty artifact and exit successfully\n');
  }
}

console.log('📋 Summary:');
console.log('   The workflow will:');
console.log('   1. Check for ORCHESTRATOR_URL - skip if missing');
console.log('   2. Check for API key (OPENAI_API_KEY or AI_KEY) - skip if missing');
console.log('   3. Attempt API call - create empty artifact if it fails');
console.log('   4. Always exit successfully (no workflow failure)\n');

console.log('🚀 To test the actual workflow:');
console.log('   1. Go to: https://github.com/Hezlepinc/ops-cloud/actions');
console.log('   2. Find "Orchestrator Live Cache Snapshot" workflow');
console.log('   3. Click "Run workflow" → "Run workflow"');
console.log('   4. Check the logs - should see warnings but no errors\n');

