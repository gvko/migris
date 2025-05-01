# Migris

A database migration tool with support for PostgreSQL, MySQL, and MongoDB.

## Features

- Support for multiple database types:
  - PostgreSQL
  - MySQL
  - MongoDB
- Lock-based migration execution
- TypeScript support
- Configurable logging with Pino
- Comprehensive test suite

## Installation

```bash
npm install migris
```

## Usage

```typescript
import Migris from 'migris';

const config = {
  connectionString: 'postgres://user:password@localhost:5432/database',
  dbType: 'postgres',
  migrationsDirPath: './migrations',
  migrationFilesPattern: /^\d+[\w-_]+\.js$/,
};

const migris = new Migris(config);
await migris.run();
```

## Configuration

The `Migris` constructor accepts the following configuration:

- `connectionString`: Database connection string
- `dbType`: Database type ('postgres', 'mysql', or 'mongo')
- `migrationsDirPath`: Path to the migrations directory
- `migrationFilesPattern`: Regular expression to match migration files

## Development

### Prerequisites

- Node.js 16+
- Docker and Docker Compose

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the test databases:
   ```bash
   docker-compose up -d
   ```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## License

MIT
