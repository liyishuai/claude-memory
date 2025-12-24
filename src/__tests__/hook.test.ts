import { ClaudeMemoryHook } from '../hook';
import { Interaction, ClaudeMemoryConfig } from '../types';

// Mock the dependencies
jest.mock('../analyzer');
jest.mock('../fileManager');

import { StyleAnalyzer } from '../analyzer';
import { ClaudeFileManager } from '../fileManager';

describe('ClaudeMemoryHook', () => {
  let hook: ClaudeMemoryHook;
  let mockConfig: ClaudeMemoryConfig;
  let mockAnalyzer: jest.Mocked<StyleAnalyzer>;
  let mockFileManager: jest.Mocked<ClaudeFileManager>;

  beforeEach(() => {
    mockConfig = {
      apiKey: 'test-api-key',
      model: 'gpt-3.5-turbo',
      maxMessages: 10,
    };

    // Reset mocks
    jest.clearAllMocks();
    
    mockAnalyzer = {
      analyzeInteraction: jest.fn(),
    } as unknown as jest.Mocked<StyleAnalyzer>;
    
    mockFileManager = {
      merge: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ClaudeFileManager>;

    (StyleAnalyzer as jest.MockedClass<typeof StyleAnalyzer>).mockImplementation(() => mockAnalyzer);
    (ClaudeFileManager as jest.MockedClass<typeof ClaudeFileManager>).mockImplementation(() => mockFileManager);

    hook = new ClaudeMemoryHook(mockConfig);
  });

  describe('processInteraction', () => {
    it('should analyze interaction and update file', async () => {
      const interaction: Interaction = {
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ],
      };

      const mockPreferences = {
        communicationStyle: 'Friendly',
      };

      mockAnalyzer.analyzeInteraction.mockResolvedValue(mockPreferences);

      await hook.processInteraction(interaction);

      expect(mockAnalyzer.analyzeInteraction).toHaveBeenCalledWith(interaction);
      expect(mockFileManager.merge).toHaveBeenCalledWith(mockPreferences);
    });

    it('should limit messages based on config', async () => {
      const messages = Array.from({ length: 25 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' as const : 'assistant' as const,
        content: `Message ${i}`,
      }));

      const interaction: Interaction = { messages };

      mockAnalyzer.analyzeInteraction.mockResolvedValue({});

      await hook.processInteraction(interaction);

      const analyzedInteraction = mockAnalyzer.analyzeInteraction.mock.calls[0][0];
      expect(analyzedInteraction.messages.length).toBe(10); // maxMessages from config
    });

    it('should handle errors gracefully', async () => {
      const interaction: Interaction = {
        messages: [{ role: 'user', content: 'Test' }],
      };

      mockAnalyzer.analyzeInteraction.mockRejectedValue(new Error('API Error'));

      await expect(hook.processInteraction(interaction)).rejects.toThrow('API Error');
    });
  });

  describe('getCurrentPreferences', () => {
    it('should return current CLAUDE.md content', async () => {
      const mockContent = '# User Preferences\nSome content';
      mockFileManager.read.mockResolvedValue(mockContent);

      const content = await hook.getCurrentPreferences();

      expect(content).toBe(mockContent);
      expect(mockFileManager.read).toHaveBeenCalled();
    });
  });
});
