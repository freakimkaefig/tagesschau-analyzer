import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiMongodbConfigService } from './api-mongodb-config.service';

import { ShowSchema } from './schema/show.schema';

import { ShowService } from './services/show.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Show', schema: ShowSchema }])],
  controllers: [],
  providers: [ApiMongodbConfigService, ShowService],
  exports: [ShowService],
})
export class ApiMongodbModule {}
