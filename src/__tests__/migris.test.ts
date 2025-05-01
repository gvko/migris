import Migris from '../index';
import { MigrisConfig } from '../types';

describe('Migris', () => {
  const testConfig: MigrisConfig = {
    connectionString: '',
    dbType: 'postgres',
    migrationsDirPath: 'test/migrations',
    migrationFilesPattern: /^\d+[\w-_]+\.js$/,
  };

  describe('PostgreSQL', () => {
    it('should initialize with PostgreSQL configuration', () => {
      const config: MigrisConfig = {
        ...testConfig,
        connectionString: process.env.POSTGRES_URL || 'postgres://test:test@localhost:5432/test',
        dbType: 'postgres',
      };

      const migris = new Migris(config);
      expect(migris).toBeInstanceOf(Migris);
    });

    it('should run migrations successfully', async () => {
      const config: MigrisConfig = {
        ...testConfig,
        connectionString: process.env.POSTGRES_URL || 'postgres://test:test@localhost:5432/test',
        dbType: 'postgres',
      };

      const migris = new Migris(config);
      await expect(migris.run()).resolves.not.toThrow();
    });
  });

  describe('MySQL', () => {
    it('should initialize with MySQL configuration', () => {
      const config: MigrisConfig = {
        ...testConfig,
        connectionString: process.env.MYSQL_URL || 'mysql://test:test@localhost:3306/test',
        dbType: 'mysql',
      };

      const migris = new Migris(config);
      expect(migris).toBeInstanceOf(Migris);
    });

    it('should run migrations successfully', async () => {
      const config: MigrisConfig = {
        ...testConfig,
        connectionString: process.env.MYSQL_URL || 'mysql://test:test@localhost:3306/test',
        dbType: 'mysql',
      };

      const migris = new Migris(config);
      await expect(migris.run()).resolves.not.toThrow();
    });
  });

  describe('MongoDB', () => {
    it('should initialize with MongoDB configuration', () => {
      const config: MigrisConfig = {
        ...testConfig,
        connectionString: process.env.MONGO_URL || 'mongodb://test:test@localhost:27017/test',
        dbType: 'mongo',
      };

      const migris = new Migris(config);
      expect(migris).toBeInstanceOf(Migris);
    });

    it('should run migrations successfully', async () => {
      const config: MigrisConfig = {
        ...testConfig,
        connectionString: process.env.MONGO_URL || 'mongodb://test:test@localhost:27017/test',
        dbType: 'mongo',
      };

      const migris = new Migris(config);
      await expect(migris.run()).resolves.not.toThrow();
    });
  });

  it('should throw error for unsupported database type', () => {
    const config: MigrisConfig = {
      ...testConfig,
      connectionString: 'invalid://test:test@localhost:5432/test',
      dbType: 'invalid' as any,
    };

    expect(() => new Migris(config)).toThrow('Unsupported database type: invalid');
  });
}); 