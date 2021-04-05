import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ApiMongodbConfigService,
  ApiMongodbModule,
} from '@tagesschau-analyzer/api/mongodb';

import { AppController } from './app.controller';
import { ShowsModule } from './shows/shows.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'tagesschau-analyzer'),
      exclude: ['/api*'],
    }),

    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      useClass: ApiMongodbConfigService,
    }),

    ApiMongodbModule,

    ShowsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
