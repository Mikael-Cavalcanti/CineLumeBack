import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  name: string

  @ApiProperty({ example: 'Avatar url' })
  @IsString()
  avatar_url: string

  @ApiProperty()
  @IsBoolean()
  is_kid_profile: boolean;
}
