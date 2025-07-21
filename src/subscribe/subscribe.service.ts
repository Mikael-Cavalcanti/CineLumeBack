import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { ChannelSubscription } from '@prisma/client';

@Injectable()
export class SubscribeService {
  constructor(private readonly prisma: PrismaService) { }
 
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

  async getAllSubcribes(profileId: number): Promise<any> {
    try {
      return await this.prisma.channelSubscription.findMany({
          where: { profileId },
        });
    } catch (error) {
      throw new Error('Error fetching subscritions');
    }
  }

  async removeSubscribe(channelId: number): Promise<ChannelSubscription | null> {
      try {
        return await this.prisma.channelSubscription.delete({
          where: { channelId },
        });
      } catch (err) {
        console.error('Error removing subscrition:', err);
        return null;
      }
    }

}
