import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VideosModule } from '../videos/videos.module';

@Module({
  imports: [PrismaModule, VideosModule],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
