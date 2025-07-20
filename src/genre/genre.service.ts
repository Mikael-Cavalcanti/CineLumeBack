import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from '@prisma/client';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) { }

  async createGenre(dto: CreateGenreDto): Promise<Genre> {
    try {
      return await this.prisma.genre.create({
        data: {
          name: dto.name,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Genre name already exists');
      }
      throw new Error('Error creating genre');
    }
  }

  async getAllGenres(): Promise<any> {
    try {
      return await this.prisma.genre.findMany({
        include: {
          videos: {
            include: {
              video: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error('Error fetching genres');
    }
  }

  async getVideosByGenre(genreId: number): Promise<any> {
    try {
      const genre = await this.prisma.genre.findUnique({
        where: { id: genreId },
        include: {
          videos: {
            include: {
              video: true,
            },
          },
        },
      });

      if (!genre) {
        throw new Error('Genre not found');
      }

      return {
        genre: genre.name,
        videos: genre.videos.map((vg) => vg.video),
      };
    } catch (error) {
      throw new Error(error.message || 'Error fetching videos for genre');
    }
  }

  async addGenreToVideo(videoId: number, genreId: number): Promise<any> {
    try {
      return await this.prisma.videoGenre.create({
        data: {
          videoId,
          genreId,
        },
      });
    } catch (error) {
      throw new Error('Error adding genre to video');
    }
  }

  async removeGenreFromVideo(videoId: number, genreId: number): Promise<any> {
    try {
      return await this.prisma.videoGenre.delete({
        where: {
          videoId_genreId: {
            videoId,
            genreId,
          },
        },
      });
    } catch (error) {
      throw new Error('Error removing genre from video');
    }
  }
}
