import { MigrisConfig, DbType } from './types'
import { Postgres } from './database/postgres'
import { Mysql } from './database/mysql'
import { Mongo } from './database/mongo'
import { Base } from './database/base'

export default class Migris {
  private readonly database: Base
  private readonly migrationsDirPath: string
  private readonly migrationFilesPattern: RegExp

  constructor(config: MigrisConfig) {
    this.migrationsDirPath = config.migrationsDirPath || 'dist/migrations'
    this.migrationFilesPattern = config.migrationFilesPattern || /^\d+[\w-_]+\.js$/

    switch (config.dbType) {
      case 'postgres':
        this.database = new Postgres(config)
        break
      case 'mysql':
        this.database = new Mysql(config)
        break
      case 'mongo':
        this.database = new Mongo(config)
        break
      default:
        throw new Error(`Unsupported database type: ${config.dbType}`)
    }
  }

  async run(): Promise<void> {
    try {
      await this.database.checkLockTableExistsOrCreate()
    } catch (err) {
      throw err
    }

    try {
      const lockAcquired = await this.database.acquireLock()
      if (lockAcquired) {
        await this.database.executeMigrations(this.migrationsDirPath, this.migrationFilesPattern)
        await this.database.releaseLock()
      }
    } catch (err) {
      await this.database.releaseLock()
      throw err
    } finally {
      await this.database.close()
    }
  }
}
