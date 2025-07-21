import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { RecentlyWatchedService } from './recently-watched.service';
import { CreatePlaybackDto } from './dto/create-playback.dto';
import { FinishPlaybackDto } from './dto/finish-playback.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Recently Watched')
@Controller('recently-watched')
export class RecentlyWatchedController {
  constructor(private readonly service: RecentlyWatchedService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar início de reprodução de vídeo' })
  @ApiResponse({ status: 201, description: 'Sessão iniciada com sucesso' })
  async create(@Body() dto: CreatePlaybackDto) {
    return await this.service.createPlayback(dto);
  }

  @Patch(':id/finish')
  @ApiOperation({ summary: 'Finalizar sessão de reprodução' })
  @ApiParam({ name: 'id', type: 'number' })
  async finish(@Param('id') id: string, @Body() dto: FinishPlaybackDto) {
    return await this.service.finishPlayback(+id, dto);
  }

  @Get(':profileId')
  @ApiOperation({ summary: 'Buscar os últimos 10 vídeos assistidos pelo perfil' })
  @ApiParam({ name: 'profileId', type: 'number' })
  async getList(@Param('profileId') profileId: string) {
    return await this.service.getRecentlyWatched(+profileId);
  }
}
