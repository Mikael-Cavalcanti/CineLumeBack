import { Controller, Post, Body, Patch, Param, Get, HttpCode, Delete, Query, HttpStatus } from '@nestjs/common';
import { RecentlyWatchedService } from './recently-watched.service';
import { CreatePlaybackDto } from './dto/create-playback.dto';
import { FinishPlaybackDto } from './dto/finish-playback.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Recently Watched')
@Controller('recently-watched')
export class RecentlyWatchedController {
  constructor(private readonly service: RecentlyWatchedService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar início de reprodução de vídeo' })
  @ApiResponse({ status: 201, description: 'Sessão iniciada com sucesso' })
  async create(@Body() dto: CreatePlaybackDto) {
    return await this.service.createPlayback(dto);
  }

  @Patch(':id/finish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finalizar sessão de reprodução' })
  @ApiParam({ name: 'id', type: 'number' })
  async finish(@Param('id') id: string, @Body() dto: FinishPlaybackDto) {
    return await this.service.finishPlayback(+id, dto);
  }

  @Get('list/:profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar os últimos 10 vídeos assistidos pelo perfil' })
  @ApiParam({ name: 'profileId', type: 'number' })
  async getList(@Param('profileId') profileId: string) {
    return await this.service.getRecentlyWatched(+profileId);
  }

  @Delete(':videoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover um vídeo da lista de assistidos recentemente' })
  @ApiParam({ name: 'videoId', type: 'number', description: 'ID do Vídeo a ser removido' })
  @ApiQuery({ name: 'profileId', type: 'number', required: true, description: 'ID do Perfil do qual o vídeo será removido' })
  @ApiResponse({ status: 200, description: 'Vídeo removido com sucesso', schema: { example: { message: 'Vídeo removido com sucesso' } } })
  @ApiResponse({ status: 404, description: 'Recurso não encontrado' })
  async remove(
    @Param('videoId') videoId: string,
    @Query('profileId') profileId: string,
  ) {
    return await this.service.deleteRecentlyWatched(+profileId, +videoId);
  }
}
