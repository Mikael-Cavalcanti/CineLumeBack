import { Controller, Get, Param, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { GenreService } from './genre.service';
import { AssignGenreDto } from './dto/assign-genre.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateGenreDto } from './dto/create-genre.dto';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getAllGenres() {
    try {
      const genres = await this.genreService.getAllGenres();
      return { success: true, data: genres };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/videos')
  async getVideosByGenre(@Param('id') id: string) {
    try {
      const videos = await this.genreService.getVideosByGenre(Number(id));
      return { success: true, data: videos };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createGenre(@Body() body: CreateGenreDto) {
    try {
      const genre = await this.genreService.createGenre(body);
      return { success: true, data: genre };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('assign')
  async assignGenre(@Body() body: AssignGenreDto) {
    try {
      const result = await this.genreService.addGenreToVideo(body.videoId, body.genreId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('remove')
  async removeGenre(@Body() body: AssignGenreDto) {
    try {
      const result = await this.genreService.removeGenreFromVideo(body.videoId, body.genreId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
