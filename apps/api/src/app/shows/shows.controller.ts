import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';

import { ShowService } from '@tagesschau-analyzer/api/mongodb';
import {
  ShowListResponse,
  SortDirection,
} from '@tagesschau-analyzer/core/types';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showService: ShowService) {}

  @Get()
  async getShowList(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('sortKey') sortKey: string,
    @Query('sortDirection') sortDirection: SortDirection
  ): Promise<ShowListResponse> {
    const count = await this.showService.getCount();
    const shows = await this.showService.getShows(
      limit,
      offset,
      sortKey,
      sortDirection
    );

    return {
      count,
      shows,
    };
  }
}
