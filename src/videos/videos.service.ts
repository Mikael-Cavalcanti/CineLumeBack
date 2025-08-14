import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseVideoDto } from './dto/base-video.dto';
import { Video } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: BaseVideoDto): Promise<Video> {
    try {
      return await this.prisma.video.create({
        data: {
          title: dto.title,
          description: dto.description,
          releaseYear: dto.releaseYear,
          duration: dto.duration,
          type: dto.type,
          thumbnailUrl: dto.thumbnailUrl,
          videoUrl: dto.url,
          ageRating: dto.ageRating,
        },
      });
    } catch (err) {
      console.error('Error creating video:', err);
      throw new Error('Error creating video');
    }
  }

  async getAllVideos(): Promise<Video[]> {
    try {
      return await this.prisma.video.findMany({
        orderBy: { title: 'asc' },
      });
    } catch (err) {
      console.error('Error fetching all videos:', err);
      throw new Error('Error fetching all videos');
    }
  }

  async update(id: number, dto: BaseVideoDto): Promise<Video | null> {
    try {
      return await this.prisma.video.update({
        where: { id: id },
        data: {
          title: dto.title,
          description: dto.description,
          releaseYear: dto.releaseYear,
          duration: dto.duration,
          type: dto.type,
          thumbnailUrl: dto.thumbnailUrl,
          ageRating: dto.ageRating,
          videoUrl: dto.url,
        },
      });
    } catch (err) {
      console.error('Error updating video', err);
      return null;
    }
  }

  async updateByTitle(title: string, dto: BaseVideoDto): Promise<Video | null> {
    try {
      const video: Video | null = await this.findByTitle(title);
      if (!video) {
        console.error('Video not found for title:', title);
        return null;
      }
      return await this.update(video.id, dto);
    } catch (err) {
      console.error('Error updating video by title', err);
      return null;
    }
  }

  async findByTitle(title: string): Promise<Video | null> {
    try {
      return await this.prisma.video.findFirst({
        where: { title: title },
      });
    } catch (err) {
      console.error('Error finding video by title', err);
      return null;
    }
  }

  async findById(id: number): Promise<Video | null> {
    try {
      return await this.prisma.video.findFirst({
        where: { id: id },
      });
    } catch (err) {
      console.error('Error finding video by id', err);
      return null;
    }
  }

  async remove(id: number): Promise<Video | null> {
    try {
      return await this.prisma.video.delete({
        where: { id: id },
      });
    } catch (err) {
      console.error('Error deleting video', err);
      return null;
    }
  }

  async getVideoStream(
    videoId: string,
    rangeHeader?: string,
  ): Promise<any | null> {
    const caminhoFilme = path.join(
      __dirname,
      '..',
      '..',
      'videos',
      `${videoId}.mp4`,
    );

    if (!fs.existsSync(caminhoFilme)) {
      throw new NotFoundException('Filme não encontrado');
    }

    const stat = fs.statSync(caminhoFilme);
    const fileSize = stat.size;

    if (!rangeHeader) {
      return {
        file: fs.createReadStream(caminhoFilme),
        fileSize,
        start: 0,
        end: fileSize - 1,
        partial: false,
      };
    }

    const partes = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(partes[0], 10);
    const end = partes[1] ? parseInt(partes[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    return {
      file: fs.createReadStream(caminhoFilme, { start, end }),
      fileSize,
      start,
      end,
      chunkSize,
      partial: true,
    };
  }

  async saveProgress(
    profileId: number,
    videoId: number,
    tempoAssistido: number,
  ): Promise<any | null> {
    return this.prisma.profileVideoWatchtime.upsert({
      where: { profileId_videoId: { profileId, videoId } },
      update: { totalWatch: tempoAssistido },
      create: { profileId, videoId, totalWatch: tempoAssistido },
    });
  }

  async getProgresso(profileId: number, videoId: number): Promise<any | null> {
    const registro = await this.prisma.profileVideoWatchtime.findUnique({
      where: { profileId_videoId: { profileId, videoId } },
    });
    return registro || { totalWatch: 0 };
  }

  async getTopTrendingMovies() {
    try {
      const trendingMovies = await this.prisma.trending.findMany({
        take: 10,
        orderBy: { rank: 'asc' },
        include: {
          video: {
            include: {
              genres: {
                include: {
                  genre: true
                }
              }
            }
          }
        }
      });

      const movies = trendingMovies.map((trending, index) => ({
        id: trending.video.id,
        title: trending.video.title,
        year: trending.video.releaseYear?.toString() || 'N/A',
        image: trending.video.thumbnailUrl || '/placeholder.svg',
        rank: trending.rank,
        views: trending.viewCount,
        description: trending.video.description,
        genre: trending.video.genres[0]?.genre.name || 'N/A',
        duration: this.formatDuration(trending.video.duration)
      }));

      return {
        movies,
        total: movies.length,
        period: 'week'
      };
    } catch (err) {
      console.error('Error fetching top trending movies:', err);
      throw new Error('Error fetching top trending movies');
    }
  }

  async getTrendingByPeriod(period: string) {
    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          throw new Error('Invalid period');
      }

      const trendingMovies = await this.prisma.trending.findMany({
        where: {
          recordedAt: {
            gte: startDate,
            lte: now
          }
        },
        take: 10,
        orderBy: { viewCount: 'desc' },
        include: {
          video: {
            include: {
              genres: {
                include: {
                  genre: true
                }
              }
            }
          }
        }
      });

      const movies = trendingMovies.map((trending, index) => ({
        id: trending.video.id,
        title: trending.video.title,
        year: trending.video.releaseYear?.toString() || 'N/A',
        image: trending.video.thumbnailUrl || '/placeholder.svg',
        rank: index + 1,
        views: trending.viewCount,
        description: trending.video.description,
        genre: trending.video.genres[0]?.genre.name || 'N/A',
        duration: this.formatDuration(trending.video.duration)
      }));

      return {
        movies,
        total: movies.length,
        period
      };
    } catch (err) {
      console.error('Error fetching trending movies by period:', err);
      throw new Error('Error fetching trending movies by period');
    }
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }
}
