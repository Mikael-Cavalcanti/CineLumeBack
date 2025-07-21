import { Test, TestingModule } from '@nestjs/testing';
import { RecentlyWatchedController } from './recently-watched.controller';
import { RecentlyWatchedService } from './recently-watched.service';

describe('RecentlyWatchedController', () => {
  let controller: RecentlyWatchedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentlyWatchedController],
      providers: [RecentlyWatchedService],
    }).compile();

    controller = module.get<RecentlyWatchedController>(RecentlyWatchedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
