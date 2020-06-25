#!/usr/bin/env node

import commander from 'commander';

import { commands } from './commands';

commander.version('1.0.0').description('Tagesschau Analyzer');

commander
  .command('scrape')
  .alias('s')
  .description('Scrape tagesschau content')
  .action(() => {
    commands.scrapeCommand.run();
  });

commander.parse(process.argv);
