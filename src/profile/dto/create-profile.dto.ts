import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateProfileDto {
    @ApiProperty({ example: 'Alice' })
    @IsString()
    name: string
}
