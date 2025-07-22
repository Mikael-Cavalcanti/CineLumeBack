import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';

@ApiTags('Subscribes')
@Controller('Subscribes')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':profileId')
  async getAllSubscribes(@Param('profileId') profileId: number) {
    try {
      const subscribes =
        await this.subscribeService.getAllSubscribes(+profileId);
      return { success: true, data: subscribes };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createSubscribe(@Body() body: CreateSubscribeDto) {
    try {
      const subscribe = await this.subscribeService.createSubscribe(body);
      return { success: true, data: subscribe };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Delete(':channelId')
  async remove(
    @Query('profileId') profileId: string,
    @Param('channelId') channelId: string,
  ) {
    const subscribe = await this.subscribeService.removeSubscribe(
      +profileId,
      +channelId,
    );
    if (!subscribe) {
      throw new HttpException('Subscribe not found', HttpStatus.NOT_FOUND);
    }
    return subscribe;
  }
}
