import * as winston from 'winston';
import 'winston-daily-rotate-file';

export class LogClient {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/daily-log-%DATE%.log',
          createSymlink: true,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxFiles: '14d',
        }),
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
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
