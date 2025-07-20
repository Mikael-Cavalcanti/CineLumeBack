import { IsInt } from 'class-validator';

export class DeleteFavoriteDto {
  @IsInt()
  profileId: number;

  @IsInt()
  videoId: number;
}
