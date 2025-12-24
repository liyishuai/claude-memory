import { StyleAnalyzer } from './analyzer';
import { ClaudeFileManager } from './fileManager';
import { Interaction, ClaudeMemoryConfig } from './types';

/**
 * Main hook class that orchestrates the memory learning process
 */
export class ClaudeMemoryHook {
  private analyzer: StyleAnalyzer;
  private fileManager: ClaudeFileManager;
  private config: ClaudeMemoryConfig;

  constructor(config: ClaudeMemoryConfig) {
    this.config = config;
    this.analyzer = new StyleAnalyzer(config);
    this.fileManager = new ClaudeFileManager(config.claudeFilePath);
  }

  /**
   * Processes an interaction and updates user preferences
   */
  async processInteraction(interaction: Interaction): Promise<void> {
    try {
      // Limit messages if configured
      const limitedInteraction = this.limitMessages(interaction);
      
      // Analyze the interaction to extract preferences
      const preferences = await this.analyzer.analyzeInteraction(limitedInteraction);
      
      // Update CLAUDE.md file with merged preferences
      await this.fileManager.merge(preferences);
    } catch (error) {
      console.error('Error processing interaction:', error);
      throw error;
    }
  }

  /**
   * Limits the number of messages in an interaction based on config
   */
  private limitMessages(interaction: Interaction): Interaction {
    const maxMessages = this.config.maxMessages || 20;
    
    if (interaction.messages.length <= maxMessages) {
      return interaction;
    }
    
    return {
      ...interaction,
      messages: interaction.messages.slice(-maxMessages),
    };
  }

  /**
   * Gets the current CLAUDE.md content
   */
  async getCurrentPreferences(): Promise<string> {
    return await this.fileManager.read();
  }
}

/**
 * Creates and returns a configured Claude memory hook
 */
export function createHook(config: ClaudeMemoryConfig): ClaudeMemoryHook {
  return new ClaudeMemoryHook(config);
}
