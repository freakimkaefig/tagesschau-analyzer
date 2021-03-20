import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ApiMongodbConfigService,
  ApiMongodbModule,
} from '@tagesschau-analyzer/api/mongodb';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: ApiMongodbConfigService,
    }),

    ApiMongodbModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
