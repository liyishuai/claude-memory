/**
 * Basic example of using claude-memory
 * 
 * Run with: npx ts-node examples/basic-usage.ts
 * 
 * Make sure to set OPENAI_API_KEY environment variable:
 * export OPENAI_API_KEY=your-api-key-here
 */

import { createHook, Interaction } from '../src';

async function main() {
  // Create the hook with configuration
  const hook = createHook({
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    claudeFilePath: './CLAUDE.md',
    maxMessages: 20,
  });

  // Example interaction 1: User asking about TypeScript
  const interaction1: Interaction = {
    messages: [
      {
        role: 'user',
        content: 'Can you help me understand async/await in TypeScript? I prefer concise examples.',
      },
      {
        role: 'assistant',
        content: `Of course! Here's a concise example:

\`\`\`typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return await response.json();
}

// Usage
try {
  const user = await fetchUser(123);
  console.log(user);
} catch (error) {
  console.error('Failed to fetch user:', error);
}
\`\`\`

The \`async\` keyword makes a function return a Promise. The \`await\` keyword pauses execution until the Promise resolves.`,
      },
      {
        role: 'user',
        content: 'Perfect! That\'s exactly what I needed. Short and to the point.',
      },
    ],
  };

  console.log('Processing first interaction...');
  await hook.processInteraction(interaction1);
  console.log('✓ First interaction processed\n');

  // Example interaction 2: User asking about testing
  const interaction2: Interaction = {
    messages: [
      {
        role: 'user',
        content: 'What\'s the best way to test async functions in Jest?',
      },
      {
        role: 'assistant',
        content: `Here's the most straightforward approach:

\`\`\`typescript
import { fetchUser } from './api';

describe('fetchUser', () => {
  it('should fetch user by id', async () => {
    const user = await fetchUser(123);
    expect(user.id).toBe(123);
    expect(user.name).toBeDefined();
  });

  it('should handle errors', async () => {
    await expect(fetchUser(-1)).rejects.toThrow();
  });
});
\`\`\`

Just mark the test function as \`async\` and use \`await\`.`,
      },
      {
        role: 'user',
        content: 'Great, I like how you always include practical examples!',
      },
    ],
  };

  console.log('Processing second interaction...');
  await hook.processInteraction(interaction2);
  console.log('✓ Second interaction processed\n');

  // Display the learned preferences
  console.log('Current preferences from CLAUDE.md:');
  console.log('='.repeat(50));
  const preferences = await hook.getCurrentPreferences();
  console.log(preferences);
  console.log('='.repeat(50));
}

// Run the example
main().catch(console.error);
