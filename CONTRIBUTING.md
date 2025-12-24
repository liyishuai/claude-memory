# Contributing to claude-memory

Thank you for your interest in contributing to claude-memory! This document provides guidelines for contributing to the project.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/liyishuai/claude-memory.git
   cd claude-memory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Run linter**
   ```bash
   npm run lint
   ```

## Project Structure

```
claude-memory/
├── src/
│   ├── __tests__/        # Test files
│   ├── analyzer.ts       # LLM-based style analyzer
│   ├── fileManager.ts    # CLAUDE.md file operations
│   ├── hook.ts           # Main hook orchestration
│   ├── types.ts          # TypeScript type definitions
│   └── index.ts          # Public API exports
├── examples/             # Usage examples
├── dist/                 # Compiled output (git-ignored)
└── README.md
```

## Making Changes

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Run `npm run lint` before committing
- Ensure all tests pass with `npm test`

### Adding Features

1. Create a new branch for your feature
2. Write tests for your changes
3. Implement your feature
4. Update documentation (README.md) if needed
5. Ensure all tests pass
6. Submit a pull request

### Writing Tests

- Place tests in `src/__tests__/`
- Use descriptive test names
- Follow the existing test patterns
- Aim for good test coverage

Example test structure:
```typescript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should do something specific', async () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = await method(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## Testing with OpenAI API

To test with a real OpenAI-compatible API:

1. Set up your API key:
   ```bash
   export OPENAI_API_KEY=your-api-key
   ```

2. Run example scripts:
   ```bash
   npx ts-node examples/basic-usage.ts
   ```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update tests to reflect your changes
3. Ensure the test suite passes
4. Ensure your code passes linting
5. Update documentation for any API changes
6. The PR will be merged once reviewed and approved

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
