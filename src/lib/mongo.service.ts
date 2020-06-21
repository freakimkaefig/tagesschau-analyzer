import * as Mongoose from 'mongoose';
import { environment } from '../config/environment.config';

export class MongoService {
  uri: string;
  database: any;

  constructor() {
    // @ts-ignore
    this.uri = environment.MONGO_DB;
    this.database = Mongoose.Connection;
  }

  connect() {
    if (this.database) {
      return;
    }

    Mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    this.database = Mongoose.connection;

    this.database.once('open', async () => {
      console.log('Connected to mongodb');
    });
  }

  disconnect() {
    if (!this.database) {
      return;
    }

    Mongoose.disconnect();
  }
}
