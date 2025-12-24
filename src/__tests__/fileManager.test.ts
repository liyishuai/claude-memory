import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { ClaudeFileManager } from '../fileManager';
import { UserPreferences } from '../types';

describe('ClaudeFileManager', () => {
  let tempDir: string;
  let manager: ClaudeFileManager;

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'claude-memory-test-'));
    const testFilePath = path.join(tempDir, 'CLAUDE.md');
    manager = new ClaudeFileManager(testFilePath);
  });

  afterEach(async () => {
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('read', () => {
    it('should return empty string if file does not exist', async () => {
      const content = await manager.read();
      expect(content).toBe('');
    });

    it('should read existing file content', async () => {
      const testContent = '# Test Content\nSome preferences';
      await fs.writeFile(path.join(tempDir, 'CLAUDE.md'), testContent, 'utf-8');
      
      const content = await manager.read();
      expect(content).toBe(testContent);
    });
  });

  describe('update', () => {
    it('should create new file with preferences', async () => {
      const preferences: UserPreferences = {
        communicationStyle: 'Casual and friendly',
        technicalLevel: 'Advanced developer',
      };

      await manager.update(preferences);
      
      const content = await manager.read();
      expect(content).toContain('# User Preferences and Style');
      expect(content).toContain('Casual and friendly');
      expect(content).toContain('Advanced developer');
    });

    it('should include all preference sections', async () => {
      const preferences: UserPreferences = {
        communicationStyle: 'Professional',
        topicPreferences: ['TypeScript', 'Testing'],
        technicalLevel: 'Intermediate',
        formatPreferences: 'Concise with code examples',
        languageStyle: 'Clear and direct',
        otherInsights: ['Prefers async/await over promises'],
      };

      await manager.update(preferences);
      
      const content = await manager.read();
      expect(content).toContain('Professional');
      expect(content).toContain('TypeScript');
      expect(content).toContain('Testing');
      expect(content).toContain('Intermediate');
      expect(content).toContain('Concise with code examples');
      expect(content).toContain('Clear and direct');
      expect(content).toContain('Prefers async/await');
    });
  });

  describe('merge', () => {
    it('should merge new preferences with existing ones', async () => {
      // Create initial preferences
      const initial: UserPreferences = {
        communicationStyle: 'Casual',
        topicPreferences: ['JavaScript'],
      };
      await manager.update(initial);

      // Merge with new preferences
      const newPrefs: UserPreferences = {
        technicalLevel: 'Expert',
        topicPreferences: ['TypeScript'],
      };
      await manager.merge(newPrefs);

      const content = await manager.read();
      expect(content).toContain('Casual'); // Preserved
      expect(content).toContain('Expert'); // Added
      expect(content).toContain('JavaScript'); // Preserved
      expect(content).toContain('TypeScript'); // Added
    });

    it('should not duplicate topics', async () => {
      const initial: UserPreferences = {
        topicPreferences: ['JavaScript', 'TypeScript'],
      };
      await manager.update(initial);

      const newPrefs: UserPreferences = {
        topicPreferences: ['TypeScript', 'React'],
      };
      await manager.merge(newPrefs);

      const content = await manager.read();
      const tsMatches = content.match(/TypeScript/g);
      expect(tsMatches).toHaveLength(1); // Should appear only once
      expect(content).toContain('JavaScript');
      expect(content).toContain('React');
    });
  });
});
