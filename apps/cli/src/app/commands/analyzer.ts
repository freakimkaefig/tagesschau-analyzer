import { LanguageServiceClient } from '@google-cloud/language';

import { MongoClient } from '../utils/mongo.utils';

export class Analyzer {
  private mongoClient: MongoClient;
  private languageServiceClient: LanguageServiceClient;

  constructor() {
    this.mongoClient = new MongoClient();
    this.languageServiceClient = new LanguageServiceClient();
  }

  async run(): Promise<void> {
    const shows = await this.mongoClient.getUnanalyzedShows();

    for (let i = 0; i < shows.length; i++) {
      console.log(shows[i].time, shows[i].showId);

      const [result] = await this.languageServiceClient.analyzeEntities({
        document: {
          content: shows[i].text,
          type: 'PLAIN_TEXT',
        },
      });
      const [syntax] = await this.languageServiceClient.analyzeSyntax({
        document: {
          content: shows[i].text,
          type: 'PLAIN_TEXT',
        },
      });

      await this.mongoClient.addAnalysisToShow(
        shows[i].time,
        shows[i].showId,
        result.entities,
        syntax.tokens
      );
    }

    return await this.finalize();
  }

  async finalize(): Promise<void> {
    return await this.mongoClient.disconnect();
  }
}
