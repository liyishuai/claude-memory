/**
 * Simple verification script to test the basic structure
 * This validates the hook can be instantiated without making API calls
 */

import { createHook, Interaction } from '../src';

console.log('✓ Module imports successfully');

// Test 1: Verify hook creation with minimal config
try {
  const hook = createHook({
    apiKey: 'test-key',
    model: 'gpt-3.5-turbo',
  });
  console.log('✓ Hook created successfully');
} catch (error) {
  console.error('✗ Failed to create hook:', error);
  process.exit(1);
}

// Test 2: Verify interaction structure
const testInteraction: Interaction = {
  messages: [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
  ],
};
console.log('✓ Interaction structure validated');

// Test 3: Verify all exports are available
import { 
  ClaudeMemoryHook, 
  StyleAnalyzer, 
  ClaudeFileManager,
  Message,
  ClaudeMemoryConfig,
  UserPreferences,
} from '../src';

console.log('✓ All exports available');
console.log('✓ Type definitions validated');

console.log('\n🎉 All basic verifications passed!');
console.log('\nTo test with a real API:');
console.log('  1. Set OPENAI_API_KEY environment variable');
console.log('  2. Run: npx ts-node examples/basic-usage.ts');
