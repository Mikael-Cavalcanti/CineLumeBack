import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'mikaelcavalcanti@outlook.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password@123' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '2001-01-01' })
  @IsDateString()
  birthDate: Date;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
