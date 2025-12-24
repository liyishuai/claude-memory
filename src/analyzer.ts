import OpenAI from 'openai';
import { Interaction, UserPreferences, ClaudeMemoryConfig } from './types';

/**
 * Analyzes user interactions using an OpenAI-compatible LLM to learn preferences
 */
export class StyleAnalyzer {
  private client: OpenAI;
  private model: string;

  constructor(config: ClaudeMemoryConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.apiEndpoint,
    });
    this.model = config.model || 'gpt-3.5-turbo';
  }

  /**
   * Analyzes an interaction to extract user preferences and style
   */
  async analyzeInteraction(interaction: Interaction): Promise<UserPreferences> {
    const messages = interaction.messages.slice(-(10)); // Last 10 messages for context
    
    const conversationText = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const analysisPrompt = `Analyze the following conversation between a user and an AI assistant. 
Extract insights about the user's:
1. Communication style (formal, casual, technical, etc.)
2. Topic preferences and interests
3. Technical expertise level
4. Preferred response format (concise, detailed, with examples, etc.)
5. Language style and tone preferences
6. Any other notable patterns or preferences

Conversation:
${conversationText}

Provide your analysis in a structured format with clear sections. Be specific and cite examples from the conversation when possible.`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing communication patterns and user preferences. Provide concise, actionable insights.',
          },
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const analysisText = response.choices[0]?.message?.content || '';
      return this.parseAnalysis(analysisText);
    } catch (error) {
      console.error('Error analyzing interaction:', error);
      throw new Error(`Failed to analyze interaction: ${error}`);
    }
  }

  /**
   * Parses the LLM analysis response into structured preferences
   */
  private parseAnalysis(analysisText: string): UserPreferences {
    // Extract sections from the analysis
    const preferences: UserPreferences = {
      otherInsights: [],
    };

    // Simple parsing logic - can be enhanced
    const lines = analysisText.split('\n');
    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Detect section headers
      if (trimmed.toLowerCase().includes('communication style')) {
        currentSection = 'communicationStyle';
      } else if (trimmed.toLowerCase().includes('topic') || trimmed.toLowerCase().includes('interest')) {
        currentSection = 'topicPreferences';
      } else if (trimmed.toLowerCase().includes('technical') && trimmed.toLowerCase().includes('level')) {
        currentSection = 'technicalLevel';
      } else if (trimmed.toLowerCase().includes('format')) {
        currentSection = 'formatPreferences';
      } else if (trimmed.toLowerCase().includes('language') && trimmed.toLowerCase().includes('style')) {
        currentSection = 'languageStyle';
      } else if (trimmed.match(/^[-*\d.]/)) {
        // Bullet point or numbered item
        const content = trimmed.replace(/^[-*\d.]\s*/, '');
        if (currentSection === 'topicPreferences') {
          if (!preferences.topicPreferences) preferences.topicPreferences = [];
          preferences.topicPreferences.push(content);
        } else if (preferences.otherInsights) {
          preferences.otherInsights.push(content);
        }
      } else if (!trimmed.includes(':') && currentSection) {
        // Content line
        switch (currentSection) {
          case 'communicationStyle':
            preferences.communicationStyle = (preferences.communicationStyle || '') + ' ' + trimmed;
            break;
          case 'technicalLevel':
            preferences.technicalLevel = (preferences.technicalLevel || '') + ' ' + trimmed;
            break;
          case 'formatPreferences':
            preferences.formatPreferences = (preferences.formatPreferences || '') + ' ' + trimmed;
            break;
          case 'languageStyle':
            preferences.languageStyle = (preferences.languageStyle || '') + ' ' + trimmed;
            break;
        }
      }
    }

    // Clean up whitespace
    if (preferences.communicationStyle) {
      preferences.communicationStyle = preferences.communicationStyle.trim();
    }
    if (preferences.technicalLevel) {
      preferences.technicalLevel = preferences.technicalLevel.trim();
    }
    if (preferences.formatPreferences) {
      preferences.formatPreferences = preferences.formatPreferences.trim();
    }
    if (preferences.languageStyle) {
      preferences.languageStyle = preferences.languageStyle.trim();
    }

    // If parsing didn't extract much structure, store the whole analysis
    if (!preferences.communicationStyle && !preferences.technicalLevel && analysisText.length > 0) {
      preferences.otherInsights = [analysisText];
    }

    return preferences;
  }
}
