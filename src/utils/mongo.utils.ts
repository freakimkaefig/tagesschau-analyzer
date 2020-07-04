import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import { LogClient } from './log.utils';
import { ShowModel, IShowDocument, IShow } from '../models/show.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

export class MongoClient {
  private logger: LogClient;

  private connectionUrl: string = '';
  private connectionOptions: any = {};

  constructor(logClient: LogClient) {
    this.logger = logClient;

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
        mongoose.connection.on('error', (error: any) => {
          this.logger.error('MongoClient.connect', error);
        });

        mongoose.connection.on('close', (info: any) => {
          if (info) {
            this.logger.log('MongoClient.connect', info);
          }
        });

        mongoose.connection.on('disconnected', (info: any) => {
          if (info) {
            this.logger.log('MongoClient.connect', info);
          }
        });

        return Promise.resolve();
      })
      .catch((error: any) => {
        this.logger.error('MongoClient.connect', error);

        return Promise.reject(error);
      });
  }

  disconnect(): Promise<void> {
    return mongoose.disconnect();
  }
}
