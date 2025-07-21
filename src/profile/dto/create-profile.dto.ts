import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'example.com.br/avatar.png' })
  @IsString()
  avatarUrl?: string;

  @ApiProperty()
  @IsBoolean()
  isKidProfile: boolean;
}
