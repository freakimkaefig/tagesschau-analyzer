import { createLogger, transports } from 'winston';
import { logOptions } from '../config/log.config';

export class LogService {
  constructor() {
    return createLogger({
      transports: [
        new transports.File(logOptions.file),
        new transports.Console(logOptions.console),
      ],
    });
  }
}
