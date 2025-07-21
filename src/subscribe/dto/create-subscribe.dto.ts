import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class CreateSubscribeDto {
    @ApiProperty()
    @IsNumber()
    profileId: Number

    @ApiProperty()
    @IsNumber()
    channelId: Number
}
