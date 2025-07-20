import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteFavoriteDto {
    @ApiProperty({ example: '1' })
    @IsInt()
    profileId: number;

    @ApiProperty({ example: '2' })
    @IsInt()
    videoId: number;
}
