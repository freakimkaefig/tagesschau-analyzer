import { MongoClient } from '../utils/mongo.utils';

export class Analyzer {
  private mongoClient: MongoClient;

  constructor() {
    this.mongoClient = new MongoClient();
  }

  async run(): Promise<void> {
    console.log('analyze');

    return await this.finalize();
  }

  async finalize(): Promise<void> {
    return await this.mongoClient.disconnect();
  }
}
