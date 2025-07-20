import { IsInt } from 'class-validator';

export class CreateFavoriteDto {
    @IsInt()
    profileId: number;

    @IsInt()
    videoId: number;
}
