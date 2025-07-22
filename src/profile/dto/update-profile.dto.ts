import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'example.com.br/avatar.png' })
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isKidProfile: boolean;
}
