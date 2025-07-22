import { Module } from '@nestjs/common';
import { RecentlyWatchedService } from './recently-watched.service';
import { RecentlyWatchedController } from './recently-watched.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RecentlyWatchedController],
  providers: [RecentlyWatchedService, PrismaService],
})
export class RecentlyWatchedModule {}
