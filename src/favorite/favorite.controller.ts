import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async addFavorite(@Body() dto: CreateFavoriteDto): Promise<any> {
    return await this.favoriteService.addFavorite(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  async removeFavorite(@Body() dto: DeleteFavoriteDto): Promise<any> {
    return await this.favoriteService.removeFavorite(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':profileId')
  async listFavorites(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<any[]> {
    return await this.favoriteService.listFavoritesByProfile(profileId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':profileId/:videoId')
  async isFavorite(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ): Promise<{ isFavorite: boolean }> {
    const result = await this.favoriteService.isFavorite(profileId, videoId);
    return { isFavorite: result };
  }
}
