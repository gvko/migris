# Contributing

Thank you for your interest in contributing to Migris! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/migris.git
   cd migris
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the test databases:
   ```bash
   docker-compose up -d
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Run tests:
   ```bash
   npm test
   ```
4. Run linting:
   ```bash
   npm run lint
   ```
5. Run formatting:
   ```bash
   npm run format
   ```
6. Commit your changes:
   ```bash
   git commit -m "feat: your feature description"
   ```
7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. Create a pull request

## Code Style

- Use TypeScript
- Follow the ESLint configuration
- Follow the Prettier configuration
- Write tests for new features
- Update documentation as needed

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for test changes
- `chore:` for maintenance tasks

## Pull Requests

- Provide a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Ensure linting and formatting checks pass
- Update documentation as needed

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License. 