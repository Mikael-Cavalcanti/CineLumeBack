import {
  IsEmail,
  IsNotEmpty,
  IsDateString,
  MinLength,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({ example: '123456' })
  @IsString()
  verificationCode: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
