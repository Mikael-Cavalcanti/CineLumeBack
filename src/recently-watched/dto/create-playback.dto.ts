import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreatePlaybackDto {
  @ApiProperty()
  @IsInt()
  profileId: number;

  @ApiProperty()
  @IsInt()
  videoId: number;
}
