import { ScrapeCommand } from './scraper';

export interface CommandMap {
  scrapeCommand: ScrapeCommand;
  [key: string]: ScrapeCommand;
}

export const commands: CommandMap = {
  scrapeCommand: new ScrapeCommand(),
};
