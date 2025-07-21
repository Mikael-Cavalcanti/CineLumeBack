import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignGenreDto {
  @ApiProperty({ example: '2' })
  @IsInt()
  videoId: number;

  @ApiProperty({ example: '5' })
  @IsInt()
  genreId: number;
}
