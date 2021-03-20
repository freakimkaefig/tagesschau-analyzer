import { Controller, Get } from '@nestjs/common';

import { ShowService } from '@tagesschau-analyzer/api/mongodb';

@Controller()
export class AppController {
  constructor(private readonly showService: ShowService) {}

  @Get('count')
  async count(): Promise<number> {
    return await this.showService.getCount();
  }
}
