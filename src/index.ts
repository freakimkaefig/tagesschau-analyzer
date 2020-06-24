#!/usr/bin/env node

import commander from 'commander';
// import chalk from 'chalk';

import { commands } from './commands';
// import { Scraper } from './commands/scraper';

commander.version('1.0.0').description('Tagesschau Analyzer');

commander.command('test').action(() => {
  commands.testCommand.run();
});

commander
  .command('scrape')
  .alias('s')
  .description('Scrape tagesschau content')
  .action(() => {
    commands.scrapeCommand.run();
  });

commander.parse(process.argv);
