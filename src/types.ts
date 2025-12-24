/**
 * Represents a message in the conversation between user and agent
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

/**
 * Represents an interaction session between user and agent
 */
export interface Interaction {
  messages: Message[];
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for the Claude memory hook
 */
export interface ClaudeMemoryConfig {
  /**
   * OpenAI-compatible API endpoint
   */
  apiEndpoint?: string;
  
  /**
   * API key for authentication
   */
  apiKey: string;
  
  /**
   * Model to use for analysis (e.g., 'gpt-4', 'gpt-3.5-turbo')
   */
  model?: string;
  
  /**
   * Path to the CLAUDE.md file
   */
  claudeFilePath?: string;
  
  /**
   * Maximum number of messages to include in analysis
   */
  maxMessages?: number;
}

/**
 * Learned user preferences and style
 */
export interface UserPreferences {
  communicationStyle?: string;
  topicPreferences?: string[];
  technicalLevel?: string;
  formatPreferences?: string;
  languageStyle?: string;
  otherInsights?: string[];
}
