# Contributing to Recruut

Thank you for your interest in contributing to Recruut! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Before You Start

1. **Check existing issues** - Your idea might already be discussed
2. **Search the codebase** - Similar functionality might already exist
3. **Read our documentation** - Understand the project structure and patterns

### Types of Contributions

We welcome all types of contributions:

- 🐛 **Bug fixes** - Help us squash bugs
- ✨ **New features** - Add exciting new functionality
- 📚 **Documentation** - Improve our docs and guides
- 🎨 **UI/UX improvements** - Make Recruut more beautiful
- ⚡ **Performance optimizations** - Make it faster
- 🧪 **Tests** - Help ensure code quality
- 🌐 **Translations** - Help us reach more users

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git
- PostgreSQL (for database features)

### Getting Started

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/recruut.git
   cd recruut
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/dashboard/.env.example apps/dashboard/.env
   cp apps/marketing/.env.example apps/marketing/.env
   cp apps/agent/.env.example apps/agent/.env
   ```

4. **Configure your environment**
   - See the [README.md](README.md) for detailed setup instructions
   - At minimum, you'll need a database connection

5. **Run database migrations**
   ```bash
   cd packages/database
   pnpm drizzle-kit push
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

## 📝 Development Workflow

### 1. Create a Feature Branch

```bash
# Always work from main
git checkout main
git pull origin main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Follow our [coding standards](#coding-standards)
- Write tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format:fix
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description
git commit -m "feat(dashboard): add bulk email functionality"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs(readme): update installation instructions"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:

- **Clear title** describing the change
- **Detailed description** of what you changed and why
- **Screenshots** for UI changes
- **Test instructions** for reviewers

## 🎯 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Prefer `type` over `interface` for consistency
- Use strict type checking
- Avoid `any` - use `unknown` when needed

### React/Next.js

- Use functional components with hooks
- Prefer React Server Components when possible
- Use the App Router patterns
- Follow Next.js best practices

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic

### File Organization

```
apps/dashboard/
├── actions/          # Server actions
├── components/       # React components
├── data/            # Data fetching functions
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── schemas/         # Zod schemas
└── types/           # TypeScript types
```

### Component Structure

```typescript
// Good example
export type ComponentProps = {
  title: string;
  onAction: () => void;
};

export function Component({ title, onAction }: ComponentProps) {
  // Component logic
  return <div>{title}</div>;
}
```

## 🧪 Testing

### Writing Tests

- Write tests for new functionality
- Update tests when fixing bugs
- Use descriptive test names
- Test both success and error cases

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include usage examples for new components

### README Updates

- Update README.md for new features
- Add setup instructions for new dependencies
- Include screenshots for UI changes

## 🔍 Review Process

### Pull Request Guidelines

1. **Title**: Clear, descriptive title
2. **Description**: Explain what and why, not how
3. **Screenshots**: Include for UI changes
4. **Tests**: Ensure all tests pass
5. **Documentation**: Update docs as needed

### Review Checklist

- [ ] Code follows our standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log or debug code
- [ ] No sensitive information in code
- [ ] Performance impact considered

## 🚨 Security

### Security Guidelines

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Follow security best practices
- Report security issues privately

### Reporting Security Issues

For security issues, please email security@recruut.com instead of creating a public issue.

## 🏷️ Issue Labels

We use these labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `priority: high`: Urgent issues
- `priority: low`: Nice to have
- `type: ui/ux`: User interface changes
- `type: backend`: Server-side changes
- `type: frontend`: Client-side changes

## 🎉 Recognition

Contributors will be:

- Listed in our [Contributors](CONTRIBUTORS.md) file
- Mentioned in release notes
- Given credit in our documentation
- Invited to join our community

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Documentation**: Check our docs first
- **Community**: Join our Discord/Slack

## 📄 License

By contributing to Recruut, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Recruut! 🚀 