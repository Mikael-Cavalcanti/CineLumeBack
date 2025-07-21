import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) { }

  async addFavorite(dto: CreateFavoriteDto): Promise<Favorite> {
    try {
      return await this.prisma.favorite.create({
        data: {
          profileId: dto.profileId,
          videoId: dto.videoId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error to add favorite');
    }
  }

  async removeFavorite(dto: DeleteFavoriteDto): Promise<any> {
    try {
      const favorite = await this.prisma.favorite.findUnique({
        where: {
          profileId_videoId: {
            profileId: dto.profileId,
            videoId: dto.videoId,
          },
        },
      });

      if (!favorite) {
        throw new NotFoundException('Favorite not found');
      }

      return await this.prisma.favorite.delete({
        where: {
          profileId_videoId: {
            profileId: dto.profileId,
            videoId: dto.videoId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error to remove favorite');
    }
  }

  async listFavoritesByProfile(profileId: number): Promise<Favorite[]> {
    try {
      return await this.prisma.favorite.findMany({
        where: { profileId },
        include: {
          video: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error to list the favorites');
    }
  }

  async isFavorite(profileId: number, videoId: number): Promise<boolean> {
    try {
      const favorite = await this.prisma.favorite.findUnique({
        where: {
          profileId_videoId: {
            profileId,
            videoId,
          },
        },
      });
      return !!favorite;
    } catch (error) {
      throw new InternalServerErrorException('Error to verify favorite');
    }
  }
}
