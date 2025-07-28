import { Test, TestingModule } from '@nestjs/testing';
import { RecentlyWatchedService } from '../recently-watched.service';

describe('RecentlyWatchedService', () => {
  let service: RecentlyWatchedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecentlyWatchedService],
    }).compile();

    service = module.get<RecentlyWatchedService>(RecentlyWatchedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
