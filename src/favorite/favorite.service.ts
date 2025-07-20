import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) { }

  async addFavorite(dto: CreateFavoriteDto): Promise<any> {
    try {
      return await this.prisma.favorite.create({
        data: {
          profileId: dto.profileId,
          videoId: dto.videoId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao adicionar favorito');
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
        throw new NotFoundException('Favorito não encontrado');
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
      throw new InternalServerErrorException('Erro ao remover favorito');
    }
  }

  async listFavoritesByProfile(profileId: number): Promise<any[]> {
    try {
      return await this.prisma.favorite.findMany({
        where: { profileId },
        include: {
          video: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao listar favoritos');
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
      throw new InternalServerErrorException('Erro ao verificar favorito');
    }
  }
}
