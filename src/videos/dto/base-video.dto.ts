import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BaseVideoDto {
  @ApiProperty({ example: 'Os vingadores Guerra infinita' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'União de heróis de Marvel' })
  @IsString()
  description?: string;

  @ApiProperty({ example: '2018' })
  @IsNumber()
  releaseYear?: number;

  @ApiProperty({ example: '9000' })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 'Ação' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 'example.com.br/guerraInfinita.mp4' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: '12' })
  @IsString()
  ageRating?: string;

  @ApiProperty({ example: 'example.com.br/guerraInfinita.png' })
  @IsString()
  thumbnailUrl?: string;
}
