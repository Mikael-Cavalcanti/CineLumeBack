import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean } from 'class-validator'

export class CreateProfileDto {
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
