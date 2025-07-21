import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SubscribeController],
  providers: [SubscribeService, PrismaService],
})
export class SubscribeModule {}
