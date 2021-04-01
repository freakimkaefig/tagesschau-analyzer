import { Scraper } from './app/scraper';

async function bootstrap() {
  const scraper = new Scraper();

  scraper.run();
}

bootstrap();
