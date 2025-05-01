import pino from 'pino';

export default class Logger {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    });
  }

  info(message: string, meta?: any): void {
    this.logger.info(meta, message);
  }

  error(message: string, meta?: any): void {
    this.logger.error(meta, message);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(meta, message);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(meta, message);
  }

  getLevel(): string {
    return this.logger.level;
  }

  setLevel(level: string): void {
    this.logger.level = level;
  }

  child(options: any): Logger {
    const childLogger = new Logger();
    childLogger.logger = this.logger.child(options);
    return childLogger;
  }
}

