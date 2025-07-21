import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscribeController } from './subscribe.controller';

@Module({
  controllers: [SubscribeController],
  providers: [SubscribeService, PrismaService],
})
export class SubscribeModule {}
