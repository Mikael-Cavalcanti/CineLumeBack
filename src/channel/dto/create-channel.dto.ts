import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({
    description: 'O nome do canal. Deve ser único.',
    example: 'Canal de Notícias 24h',
  })
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @ApiProperty({
    description: 'A URL do logotipo do canal. Este campo é opcional.',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'A URL do logo deve ser uma URL válida.' })
  @IsString({ message: 'A URL do logo deve ser uma string.' })
  logoUrl?: string;
}
