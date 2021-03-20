import { Test, TestingModule } from '@nestjs/testing';
import { ApiMongodbConfigService } from './api-mongodb-config.service';

describe('ApiMongodbConfigService', () => {
  let service: ApiMongodbConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiMongodbConfigService],
    }).compile();

    service = module.get<ApiMongodbConfigService>(ApiMongodbConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
