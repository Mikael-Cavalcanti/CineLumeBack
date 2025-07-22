import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Video } from '@prisma/client';

@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('completed/:profileID')
  async getCompletedHistory(
    @Param('profileID') profileID: number,
  ): Promise<Video[]> {
    const history: Video[] =
      await this.historyService.getCompletedHistory(profileID);
    if (!history || history.length === 0) {
      throw new Error('No completed history found for this profile');
    }
    return history;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('watching/:profileID')
  async getWatchingHistory(
    @Param('profileID') profileID: number,
  ): Promise<Video[]> {
    const history: Video[] =
      await this.historyService.getWatchingHistory(profileID);
    if (!history || history.length === 0) {
      throw new Error('No watching history found for this profile');
    }
    return history;
  }
}
