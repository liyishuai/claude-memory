/**
 * Example of using claude-memory as a post-interaction hook
 * 
 * This demonstrates how to integrate claude-memory into an existing
 * chat application or Claude wrapper.
 */

import { createHook, Interaction, Message } from '../src';

// Simulated chat session
class ChatSession {
  private messages: Message[] = [];
  private hook;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.hook = createHook({
      apiKey,
      model: 'gpt-3.5-turbo',
      claudeFilePath: './CLAUDE.md',
    });
  }

  async addMessage(role: 'user' | 'assistant', content: string) {
    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    };
    
    this.messages.push(message);
    
    // After each exchange (user message + assistant response),
    // process the interaction to learn preferences
    if (role === 'assistant' && this.messages.length >= 2) {
      await this.processRecentInteraction();
    }
  }

  private async processRecentInteraction() {
    // Get the last few messages for context
    const recentMessages = this.messages.slice(-10);
    
    const interaction: Interaction = {
      messages: recentMessages,
      sessionId: 'chat-session-1',
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };

    try {
      await this.hook.processInteraction(interaction);
      console.log('✓ Preferences updated');
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  }

  async showPreferences() {
    const prefs = await this.hook.getCurrentPreferences();
    console.log('\n' + '='.repeat(60));
    console.log('CURRENT USER PREFERENCES');
    console.log('='.repeat(60));
    console.log(prefs);
    console.log('='.repeat(60) + '\n');
  }
}

// Example usage
async function simulateChat() {
  const chat = new ChatSession();

  console.log('Starting chat simulation...\n');

  // Conversation 1
  console.log('User: How do I create a React component?');
  await chat.addMessage('user', 'How do I create a React component?');
  
  console.log('Assistant: [Responding...]');
  await chat.addMessage('assistant', 
    'Here\'s a simple functional component:\n\n```tsx\nfunction Welcome({ name }: { name: string }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```'
  );

  // Conversation 2
  console.log('\nUser: Can you show me hooks too? I like TypeScript.');
  await chat.addMessage('user', 'Can you show me hooks too? I like TypeScript.');
  
  console.log('Assistant: [Responding...]');
  await chat.addMessage('assistant',
    'Sure! Here\'s an example with useState:\n\n```tsx\nimport { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState<number>(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}\n```'
  );

  // Conversation 3
  console.log('\nUser: Perfect! I prefer short, practical examples like these.');
  await chat.addMessage('user', 'Perfect! I prefer short, practical examples like these.');
  
  console.log('Assistant: [Responding...]');
  await chat.addMessage('assistant',
    'Noted! I\'ll keep examples concise and practical for you.'
  );

  // Show learned preferences
  await chat.showPreferences();
}

simulateChat().catch(console.error);
