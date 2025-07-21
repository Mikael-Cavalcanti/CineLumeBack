import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards, HttpException,
  HttpStatus, } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';

@ApiTags('Subscribes')
@Controller('Subscribes')
export class ProfileController {
  constructor(private readonly subscribeService: SubscribeService) { }

  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth()
  @Get()
  async getAllSubscribes() {
    try {
      const subscribes = await this.subscribeService.getAllSubcribes(+profileId);
      return { success: true, data: subscribes };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  
  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth()
  @Post()
  async createSubscribe(@Body() body: CreateSubscribeDto) {
    try {
      const subscribe = await this.subscribeService.createSubscribe(body);
      return { success: true, data: subscribe };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth()
  @Delete(':channelId')
  async remove(@Param('channelId') channelId: number) {
    const subscribe = await this.subscribeService.removeSubscribe(+channelId);
    if (!subscribe) {
      throw new HttpException('Subscribe not found', HttpStatus.NOT_FOUND);
    }
    return subscribe;
  }
}
