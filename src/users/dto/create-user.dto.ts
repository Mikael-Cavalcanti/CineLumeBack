import { IsEmail, IsNotEmpty, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password@123' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '2001-01-01' })
  @IsDateString()
  birthDate: Date;
}
