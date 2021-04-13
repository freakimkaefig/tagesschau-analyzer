import { Command } from 'commander';

import { Scraper } from './app/commands/scraper';
import { Analyzer } from './app/commands/analyzer';

function bootstrap() {
  const program = new Command();

  program
    .command('scrape')
    .description('Scrapes remaining shows.')
    .action(() => {
      const scraper = new Scraper();
      scraper.run();
    });

  program
    .command('analyze')
    .description('Analyzes shows.')
    .action(() => {
      const analyzer = new Analyzer();
      analyzer.run();
    });

  program.parseAsync(process.argv);
}

bootstrap();
