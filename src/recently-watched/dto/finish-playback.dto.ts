import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class FinishPlaybackDto {
  @ApiPropertyOptional({ description: 'Data de finalização da sessão' })
  @IsOptional()
  @IsDateString()
  endedAt?: string;
}
