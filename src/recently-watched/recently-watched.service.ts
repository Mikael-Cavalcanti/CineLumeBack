import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaybackDto } from './dto/create-playback.dto';
import { FinishPlaybackDto } from './dto/finish-playback.dto';
import { PlaybackSession } from '@prisma/client';

@Injectable()
export class RecentlyWatchedService {
  constructor(private readonly prisma: PrismaService) { }

  async createPlayback(dto: CreatePlaybackDto): Promise<PlaybackSession> {
    try {
      return await this.prisma.playbackSession.create({
        data: {
          profileId: dto.profileId,
          videoId: dto.videoId,
          startedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error('Error to initiate session: ' + error.message);
    }
  }

  async finishPlayback(id: number, dto: FinishPlaybackDto): Promise<PlaybackSession> {
    try {
      return await this.prisma.playbackSession.update({
        where: { id },
        data: { endedAt: dto.endedAt || new Date() },
      });
    } catch (error) {
      throw new Error('Error to finish session: ' + error.message);
    }
  }

  async getRecentlyWatched(profileId: number): Promise<PlaybackSession[]> {
    try {
      return await this.prisma.playbackSession.findMany({
        where: {
          profileId,
          endedAt: { not: null },
        },
        orderBy: { endedAt: 'desc' },
        take: 10,
        include: {
          video: true,
        },
      });
    } catch (error) {
      throw new Error('Error to get watched videos: ' + error.message);
    }
  }
}
