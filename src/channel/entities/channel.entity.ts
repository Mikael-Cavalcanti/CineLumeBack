import { ApiProperty } from '@nestjs/swagger';

export class Channel {
  @ApiProperty({ description: 'O ID único do canal', example: 1 })
  id: number;

  @ApiProperty({
    description: 'O nome do canal',
    example: 'Canal de Culinária',
  })
  name: string;

  @ApiProperty({
    description: 'A URL do logotipo do canal',
    example: 'https://example.com/logo.png',
    nullable: true,
  })
  logoUrl: string | null;
}
