import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class GenericMailDto {
  @ApiProperty({ example: 'mikaelcavalcanti@outlook.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Welcome to Our Service' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Thank you for joining us!' })
  @IsString()
  message: string;
}
