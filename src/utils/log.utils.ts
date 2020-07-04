import * as winston from 'winston';

export class LogClient {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/debug.log' }),
      ],
    });
  }

  log(sender: string, message: string) {
    this.logger.log({
      level: 'info',
      sender: sender,
      message: message,
    });
  }

  error(sender: string, error: any) {
    this.logger.error({
      level: 'info',
      sender: sender,
      error: error,
    });
  }
}
