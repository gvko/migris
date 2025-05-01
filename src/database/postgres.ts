import * as Knex from 'knex'
import { Base } from './base'
import { MigrisConfig } from '../types'
import * as Umzug from 'umzug'

export class Postgres extends Base {
  private readonly knex: Knex
  private readonly umzug: Umzug.Umzug

  constructor(config: MigrisConfig) {
    super(config)
    this.knex = Knex({
      client: 'pg',
      connection: config.connectionString,
    })

    this.umzug = new Umzug({
      storage: 'knex',
      storageOptions: {
        knex: this.knex,
        tableName: config.migrationsTable || '_migrations',
      },
      migrations: {
        path: config.migrationsDirPath || 'dist/migrations',
        pattern: config.migrationFilesPattern || /^\d+[\w-_]+\.js$/,
        params: [this.knex, ...(config.extraMigrationFuncParams || [])],
      },
      logging: this.logger.info.bind(this.logger),
    })
  }

  async checkLockTableExistsOrCreate(): Promise<void> {
    this.logger.info({}, 'Check lock table exists')

    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${this.migrationsLockTable} (
      acquired_at   timestamp with time zone default null
    );`

    try {
      await this.knex.raw(sqlQuery)
      this.logger.info({}, 'Lock table exists. Proceed with migrations.')
    } catch (err) {
      this.logger.error({ originalErrMsg: err.message, originalErr: err }, 'Could not create lock table. Exiting...')
      throw err
    }
  }

  async acquireLock(): Promise<boolean> {
    let lockAcquiredAt: string
    try {
      const result = await this.knex.raw(`SELECT acquired_at FROM ${this.migrationsLockTable} FOR UPDATE`)
      lockAcquiredAt = result.rows[0]?.acquired_at
    } catch (err) {
      this.lockAttempts++
      this.logger.warn(
        { err: err.message, attempt: this.lockAttempts },
        'Could not check for lock. Attempting again...',
      )
      if (this.lockAttempts <= 3) {
        return await this.acquireLock()
      }

      this.logger.error({ err: err.message }, `Could not check for lock after ${this.lockAttempts} attempts!`)
      throw err
    }

    if (lockAcquiredAt) {
      if (Number(new Date()) - Number(new Date(lockAcquiredAt)) > this.lockTimeoutSeconds * 1000) {
        this.logger.warn({}, 'Lock is stuck. Releasing and acquiring over...')
        await this.releaseLock()
        return await this.acquireLock()
      }

      this.logger.info({}, 'Lock acquired by another service. Skip migrations!')
      return false
    }

    try {
      await this.knex(this.migrationsLockTable).insert({ acquired_at: new Date() })
      this.logger.info({}, 'Lock acquired!')
      return true
    } catch (err) {
      throw err
    }
  }

  async releaseLock(): Promise<void> {
    try {
      await this.knex(this.migrationsLockTable).whereNotNull('acquired_at').delete()
      this.logger.info({}, 'Lock released!')
    } catch (err) {
      this.releaseAttempts++
      this.logger.warn(
        { err: err.message, attempt: this.releaseAttempts },
        'Could not release lock. Attempting again...',
      )
      if (this.releaseAttempts <= 3) {
        await this.releaseLock()
      } else {
        this.logger.error({ err: err.message }, `Could not release lock after ${this.releaseAttempts} attempts!`)
        throw err
      }
    }
  }

  async executeMigrations(migrationsDirPath: string, migrationFilesPattern: RegExp): Promise<void> {
    const pendingMigrations = await this.umzug.pending()
    if (pendingMigrations.length > 0) {
      this.logger.info(
        { pendingMigrations: pendingMigrations.map((migration) => migration.file) },
        '-- STARTING MIGRATION PROCESS for files:',
      )
    }

    try {
      const migrations = await this.umzug.up()
      const resultText =
        migrations.length > 0
          ? 'The migrations have been migrated successfully!'
          : 'No migrations needed to be executed!'
      this.logger.info({}, resultText)
    } catch (err) {
      throw err
    }
  }

  async close(): Promise<void> {
    await this.knex.destroy()
  }
}
