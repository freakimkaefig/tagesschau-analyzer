import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import { ShowModel, IShowDocument, IShow } from '../models/show.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

// interface ShowResponse {
//   time: string;
//   showId: number;
//   text: string;
// }

export class MongoClient {
  private connectionUrl: string = '';
  private connectionOptions: any = {};

  constructor() {
    const { MONGO_URI } = process.env;
    if (MONGO_URI !== undefined) {
      this.connectionUrl = MONGO_URI;
    }

    this.connectionOptions = {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
  }

  getLastShow(time: string): Promise<IShowDocument[]> {
    const query = ShowModel.find({ time: time });

    return query
      .sort({ showId: -1 })
      .limit(1)
      .select('date time showId')
      .exec();
  }

  addShow(data: IShow) {
    const show = new ShowModel(data);
    return show.save();
  }

  async connect(): Promise<void> {
    return mongoose
      .connect(
        this.connectionUrl,
        this.connectionOptions as mongoose.ConnectionOptions
      )
      .then(() => {
        mongoose.connection.on('error', error => {
          console.error('MongoService.connect', 'FATAL_ERROR', {
            errorMessage: error.message,
            error,
          });
        });

        mongoose.connection.on('close', info => {
          if (info) {
            console.warn('MongoClient.connect', 'MONGO_CLOSE', info);
          }
        });

        mongoose.connection.on('disconnected', info => {
          if (info) {
            console.warn('MongoClient.connect', 'MONGO_DISCONNECT', info);
          }
        });

        return Promise.resolve();
      })
      .catch((error: any) => {
        console.error('MongoClient.connect', 'CONNECTION_FAILED', error);

        return Promise.reject(error);
      });
  }

  disconnect(): Promise<void> {
    return mongoose.disconnect();
  }
}
