import { MigrisConfig, Logger } from '../types';

export abstract class BaseDatabase {
  protected readonly logger: Logger;
  protected readonly migrationsLockTable: string;
  protected readonly lockTimeoutSeconds: number;
  protected lockAttempts = 1;
  protected releaseAttempts = 1;

  constructor(config: MigrisConfig) {
    this.logger = config.logger || new (require('../logger').default)();
    this.migrationsLockTable = config.migrationsLockTable || '_migrations_lock';
    this.lockTimeoutSeconds = config.lockTimeoutSeconds || 60;
  }

  abstract checkLockTableExistsOrCreate(): Promise<void>;
  abstract acquireLock(): Promise<boolean>;
  abstract releaseLock(): Promise<void>;
  abstract executeMigrations(migrationsDirPath: string, migrationFilesPattern: RegExp): Promise<void>;
  abstract close(): Promise<void>;
} 