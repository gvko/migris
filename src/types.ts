export type DbType = 'postgres' | 'mysql' | 'mongo';

export interface MigrisConfig {
  connectionString: string;
  dbType: DbType;
  migrationsTable?: string;
  migrationsLockTable?: string;
  lockTimeoutSeconds?: number;
  migrationsDirPath?: string;
  migrationFilesPattern?: RegExp;
  logger?: Logger;
  extraMigrationFuncParams?: any[];
}

export interface Logger {
  logger: any;
  getLevel: () => string;
  setLevel: (level: string) => void;
  child: (options: any) => Logger;
  debug: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  error: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
} 