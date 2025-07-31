import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileVideoWatchtime, Video } from '@prisma/client';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly COMPLETION_THRESHOLD = 0.9;

  async getCompletedHistory(profileID: number): Promise<Video[]> {
    try {
      const records: (ProfileVideoWatchtime & { video: Video })[] =
        await this.fetchHistoryRecords(profileID);

      return records
        .filter((record) => {
          const duration = record.video?.duration ?? 0;
          return record.totalWatch >= duration * this.COMPLETION_THRESHOLD;
        })
        .map((record) => record.video);
    } catch (err) {
      console.error('Error fetching completed history:', err);
      throw new Error('Failed to fetch completed history');
    }
  }

  async getWatchingHistory(profileID: number): Promise<Video[]> {
    try {
      const records: (ProfileVideoWatchtime & { video: Video })[] =
        await this.fetchHistoryRecords(profileID);

      return records
        .filter((record) => {
          const duration = record.video?.duration ?? 0;
          return record.totalWatch < duration * this.COMPLETION_THRESHOLD;
        })
        .map((record) => record.video);
    } catch (err) {
      console.error('Error fetching watching history:', err);
      throw new Error('Failed to fetch watching history');
    }
  }

  private async fetchHistoryRecords(
    profileID: number,
  ): Promise<(ProfileVideoWatchtime & { video: Video })[]> {
    return this.prisma.profileVideoWatchtime.findMany({
      where: { profileId: profileID },
      include: { video: true },
      orderBy: { totalWatch: 'desc' },
    });
  }
}
