#!/usr/bin/env node

import commander from 'commander';
import chalk from 'chalk';

import { Scraper } from './scraper';

commander.version('1.0.0').description('Tagesschau Analyzer');

commander
  .command('scrape')
  .alias('s')
  .description('Scrape tagesschau content')
  .action(() => {
    console.log(chalk.green('Start scraping ...'));
    const scraper = new Scraper();
    scraper.start();
  });

commander.parse(process.argv);
