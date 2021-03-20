import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class ApiMongodbConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const MONGO_HOST = this.configService.get<string>('MONGO_HOST');
    const MONGO_REPLICA_SET = this.configService.get<string>(
      'MONGO_REPLICA_SET'
    );
    const MONGO_DB = this.configService.get<string>('MONGO_DB');
    const MONGO_USER = this.configService.get<string>('MONGO_USER');
    const MONGO_PASSWORD = this.configService.get<string>('MONGO_PASSWORD');
    const MONGO_SSL = this.configService.get<string>('MONGO_SSL') === 'true';

    if (
      !MONGO_HOST ||
      !MONGO_REPLICA_SET ||
      !MONGO_DB ||
      !MONGO_USER ||
      !MONGO_PASSWORD
    ) {
      throw new Error('MISSING_MONGO_ENV');
    }

    let connectionConfig: MongooseModuleOptions = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      user: MONGO_USER,
      pass: MONGO_PASSWORD,
      retryAttempts: Infinity,
      retryDelay: 5000,
    };

    if (MONGO_SSL) {
      connectionConfig = {
        ...connectionConfig,
        uri: `mongodb://${MONGO_HOST}/${MONGO_DB}?ssl=true&replicaSet=${MONGO_REPLICA_SET}&authSource=admin&retryWrites=true&w=majority`,
        ssl: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      };
    } else {
      // connect without ssl
      connectionConfig = {
        ...connectionConfig,
        uri: `mongodb://${MONGO_HOST}/${MONGO_DB}`,
      };
    }

    return connectionConfig;
  }
}
