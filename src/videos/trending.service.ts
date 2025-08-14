import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrendingService {
  constructor(private readonly prisma: PrismaService) {}

  async incrementViewCount(videoId: number): Promise<void> {
    try {
      // Incrementa o contador de views na tabela Trending
      await this.prisma.trending.upsert({
        where: { videoId },
        update: {
          viewCount: {
            increment: 1
          },
          recordedAt: new Date()
        },
        create: {
          videoId,
          viewCount: 1,
          rank: 1, // Será recalculado
          recordedAt: new Date()
        }
      });

      // Recalcula o ranking baseado no número de views
      await this.recalculateRanking();
    } catch (err) {
      console.error('Error incrementing view count:', err);
      throw new Error('Error incrementing view count');
    }
  }

  async recalculateRanking(): Promise<void> {
    try {
      // Busca todos os registros de trending ordenados por views
      const trendingRecords = await this.prisma.trending.findMany({
        orderBy: { viewCount: 'desc' }
      });

      // Atualiza o ranking de cada registro
      for (let i = 0; i < trendingRecords.length; i++) {
        await this.prisma.trending.update({
          where: { id: trendingRecords[i].id },
          data: { rank: i + 1 }
        });
      }
    } catch (err) {
      console.error('Error recalculating ranking:', err);
      throw new Error('Error recalculating ranking');
    }
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

      const movies = trendingMovies.map((trending) => ({
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