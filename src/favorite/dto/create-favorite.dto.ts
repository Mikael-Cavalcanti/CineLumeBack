import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ example: '1' })
  @IsInt()
  profileId: number;

  @ApiProperty({ example: '3' })
  @IsInt()
  videoId: number;
}
