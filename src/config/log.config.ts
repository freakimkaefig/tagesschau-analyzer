export const logOptions = {
  file: {
    level: 'info',
    filename: `${__dirname}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5 * 1024 * 1024,
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};
