import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

import {
  Show,
  ShowDocument,
  ShowSchema,
} from '@tagesschau-analyzer/api/mongodb';

export class MongoClient {
  private showModel: mongoose.Model<ShowDocument>;

  constructor() {
    dotenv.config({ path: path.join(__dirname, '../../../.dev.env') });

    const {
      MONGO_HOST,
      MONGO_REPLICA_SET,
      MONGO_DB,
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_SSL,
    } = process.env;

    if (
      !MONGO_HOST ||
      !MONGO_REPLICA_SET ||
      !MONGO_DB ||
      !MONGO_USER ||
      !MONGO_PASSWORD
    ) {
      throw new Error('MISSING_MONGO_ENV');
    }

    let connectionUrl: string;
    let connectionConfig: mongoose.ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      user: MONGO_USER,
      pass: MONGO_PASSWORD,
    };

    if (MONGO_SSL === 'true') {
      connectionUrl = `mongodb://${MONGO_HOST}/${MONGO_DB}?ssl=true&replicaSet=${MONGO_REPLICA_SET}&authSource=admin&retryWrites=true&w=majority`;
      connectionConfig = {
        ...connectionConfig,
        ssl: true,
        useCreateIndex: true,
      };
    } else {
      connectionUrl = `mongodb://${MONGO_HOST}/${MONGO_DB}`;
    }

    this.connect(connectionUrl, connectionConfig);
    this.showModel = mongoose.model<ShowDocument>('show', ShowSchema);
  }

  private async connect(
    uri: string,
    options: mongoose.ConnectionOptions
  ): Promise<void> {
    return await mongoose
      .connect(uri, options)
      .then(() => {
        mongoose.connection.on('error', (error) => {
          console.error('MongoClient.connect', error);
        });

        mongoose.connection.on('close', (info) => {
          if (info) {
            console.log('MongoClient.connect', info);
          }
        });

        mongoose.connection.on('disconnected', (info) => {
          if (info) {
            console.log('MongoClient.connect', info);
          }
        });

        return Promise.resolve();
      })
      .catch((error) => {
        console.error('MongoClient.connect', error);

        return Promise.reject(error);
      });
  }

  disconnect(): Promise<void> {
    return mongoose.disconnect();
  }

  async getLastShow(time: string): Promise<Show> {
    return await this.showModel
      .findOne({
        time: time,
      })
      .sort({
        showId: -1,
      })
      .lean<Show>();
  }

  async addShow(show: Show): Promise<void> {
    await this.showModel.create(show);
  }

  async getUnanalyzedShows(): Promise<Show[]> {
    return await this.showModel
      .find({
        ut: true,
        entities: { $exists: false },
      })
      .sort({
        showId: -1,
      })
      .lean<Show[]>();
  }

  async addAnalysisToShow(
    time: string,
    showId: number,
    entities: any[],
    syntax: any[]
  ): Promise<void> {
    await this.showModel.findOneAndUpdate(
      { time, showId },
      {
        $set: {
          entities,
          syntax,
        },
      }
    );
  }

  async transformNewlinesToSpaces(): Promise<void> {
    const shows = await this.showModel.find({ ut: true });

    for (let i = 0; i < shows.length; i++) {
      console.log(shows[i].time, shows[i].showId);
      await this.showModel.findOneAndUpdate(
        {
          time: shows[i].time,
          showId: shows[i].showId,
        },
        {
          $set: {
            text: shows[i].text.replace(/\n/g, ' '),
          },
        }
      );
    }
  }
}
