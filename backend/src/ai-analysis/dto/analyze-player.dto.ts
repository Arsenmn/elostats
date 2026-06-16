import { IsOptional, IsString, MinLength } from 'class-validator';

export class AnalyzePlayerDto {
  @IsString()
  @MinLength(2)
  nickname: string;

  @IsOptional()
  @IsString()
  game?: string;
}
