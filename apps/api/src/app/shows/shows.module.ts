import { Module } from '@nestjs/common';

import { ApiMongodbModule } from '@tagesschau-analyzer/api/mongodb';

import { ShowsController } from './shows.controller';

@Module({
  imports: [ApiMongodbModule],
  controllers: [ShowsController],
})
export class ShowsModule {}
