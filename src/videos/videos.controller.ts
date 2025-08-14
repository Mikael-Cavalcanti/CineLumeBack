import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { BaseVideoDto } from './dto/base-video.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Video } from '@prisma/client';
import { Request, Response } from 'express';

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videoService: VideosService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  async getAllVideos(): Promise<Video[]> {
    const videos: Video[] = await this.videoService.getAllVideos();
    if (!videos || videos.length === 0) {
      throw new Error('No videos found');
    }
    return videos;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('find/:id')
  async findVideo(@Param('id') id: number): Promise<Video> {
    const video: Video | null = await this.videoService.findById(+id);
    if (!video) {
      throw new Error('Video not found');
    }
    return video;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('find/:title')
  async findVideoByTitle(@Param('title') title: string): Promise<Video> {
    const video: Video | null = await this.videoService.findByTitle(title);
    if (!video) {
      throw new Error('Video not found');
    }
    return video;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('new')
  async createVideo(@Body() videoData: BaseVideoDto): Promise<Video> {
    const video: Video = await this.videoService.create(videoData);
    if (!video) {
      throw new Error('Error creating video');
    }
    return video;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('update/:id')
  async updateVideoById(
    @Param('id') id: number,
    @Body() dto: BaseVideoDto,
  ): Promise<Video> {
    const video: Video | null = await this.videoService.update(+id, dto);
    if (!video) {
      throw new Error('Error updating video by id, video not found');
    }
    return video;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('update')
  async updateVideoByTitle(@Body() dto: BaseVideoDto): Promise<Video> {
    const video: Video | null = await this.videoService.updateByTitle(
      dto.title,
      dto,
    );
    if (!video) {
      throw new Error('Error updating video by title, video not found');
    }
    return video;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('remove/:id')
  async remove(@Param('id') id: number): Promise<Video> {
    const video: Video | null = await this.videoService.remove(+id);
    if (!video) {
      throw new Error('Error removing video, video not found');
    }
    return video;
  }

  @Get(':id/stream')
  async streamVideo(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const range = req.headers.range;
    const videoData = await this.videoService.getVideoStream(id, range);

    if (videoData.partial) {
      if (videoData.partial) {
        res.status(206);
        res.set({
          'Content-Range': `bytes ${videoData.start}-${videoData.end}/${videoData.fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': videoData.chunkSize,
          'Content-Type': 'video/mp4',
        });
      } else {
        res.status(200);
        res.set({
          'Content-Length': videoData.fileSize,
          'Content-Type': 'video/mp4',
        });
      }

      videoData.file.pipe(res);
    }
  }

  @Post('progress')
  async salvarProgress(
    @Body()
    body: {
      profileId: number;
      videoId: number;
      tempoAssistido: number;
    },
  ) {
    return this.videoService.saveProgress(
      body.profileId,
      body.videoId,
      body.tempoAssistido,
    );
  }

  @Get('progress/:profileId/:videoId')
  async getProgress(
    @Param('profileId') profileId: number,
    @Param('videoId') videoId: number,
  ) {
    return this.videoService.getProgresso(+profileId, +videoId);
  }
}
