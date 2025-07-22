import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { ChannelSubscription } from '@prisma/client';

@Injectable()
export class SubscribeService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscribe(dto: CreateSubscribeDto): Promise<ChannelSubscription> {
    try {
      return await this.prisma.channelSubscription.create({
        data: {
          profileId: dto.profileId,
          channelId: dto.channelId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Subscrition already exists');
      }
      throw new Error('Error creating subscrition');
    }
  }

  async getAllSubscribes(profileId: number) {
    try {
      const channelSub = await this.prisma.channelSubscription.findMany({
        where: { profileId },
      });
      return channelSub;
    } catch (error) {
      throw new Error('Error fetching subscritions');
    }
  }

  async removeSubscribe(
    profileId: number,
    channelId: number,
  ): Promise<ChannelSubscription | null> {
    try {
      const subscription = await this.prisma.channelSubscription.delete({
        where: {
          profileId_channelId: {
            profileId,
            channelId,
          },
        },
      });
      return subscription;
    } catch (err) {
      console.error('Error removing subscription:', err);
      return null;
    }
  }
}
