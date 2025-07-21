import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateSubscribeDto {
  @ApiProperty()
  @IsNumber()
  profileId: number;

  @ApiProperty()
  @IsNumber()
  channelId: number;
}
