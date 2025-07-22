import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Channel } from './entities/channel.entity';

@ApiTags('Channels') 
@Controller('channels') 
export class ChannelController {
  constructor(private readonly channelService: ChannelService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo canal' })
  @ApiResponse({ status: 201, description: 'O canal foi criado com sucesso.', type: Channel })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  @ApiResponse({ status: 404, description: 'Um canal com este nome já existe.' })
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os canais' })
  @ApiResponse({ status: 200, description: 'Lista de todos os canais.', type: [Channel] })
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um canal pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do canal', type: 'number' })
  @ApiResponse({ status: 200, description: 'Detalhes do canal.', type: Channel })
  @ApiResponse({ status: 404, description: 'Canal não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um canal pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do canal', type: 'number' })
  @ApiResponse({ status: 200, description: 'O canal foi atualizado com sucesso.', type: Channel })
  @ApiResponse({ status: 404, description: 'Canal não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({ summary: 'Deletar um canal pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do canal', type: 'number' })
  @ApiResponse({ status: 204, description: 'O canal foi deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Canal não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.remove(id);
  }
}
