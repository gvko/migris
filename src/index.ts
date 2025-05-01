import { MigrisConfig, DbType } from './types';
import { PostgresDatabase } from './database/postgres-database';
import { MysqlDatabase } from './database/mysql-database';
import { MongoDatabase } from './database/mongo-database';
import { BaseDatabase } from './database/base-database';

export default class Migris {
  private readonly database: BaseDatabase;
  private readonly migrationsDirPath: string;
  private readonly migrationFilesPattern: RegExp;

  constructor(config: MigrisConfig) {
    this.migrationsDirPath = config.migrationsDirPath || 'dist/migrations';
    this.migrationFilesPattern = config.migrationFilesPattern || /^\d+[\w-_]+\.js$/;

    switch (config.dbType) {
      case 'postgres':
        this.database = new PostgresDatabase(config);
        break;
      case 'mysql':
        this.database = new MysqlDatabase(config);
        break;
      case 'mongo':
        this.database = new MongoDatabase(config);
        break;
      default:
        throw new Error(`Unsupported database type: ${config.dbType}`);
    }
  }

  async run(): Promise<void> {
    try {
      await this.database.checkLockTableExistsOrCreate();
    } catch (err) {
      throw err;
    }

    try {
      const lockAcquired = await this.database.acquireLock();
      if (lockAcquired) {
        await this.database.executeMigrations(this.migrationsDirPath, this.migrationFilesPattern);
        await this.database.releaseLock();
      }
    } catch (err) {
      await this.database.releaseLock();
      throw err;
    } finally {
      await this.database.close();
    }
  }
}
