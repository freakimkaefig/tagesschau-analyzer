import { TestCommand } from './test';
import { ScrapeCommand } from './scraper';

export interface CommandMap {
  testCommand: TestCommand;
  scrapeCommand: ScrapeCommand;
  [key: string]: TestCommand | ScrapeCommand;
}

export const commands: CommandMap = {
  testCommand: new TestCommand(),
  scrapeCommand: new ScrapeCommand(),
};
