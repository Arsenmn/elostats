import { IsOptional, IsString, MinLength } from 'class-validator';

export class ComparePlayersDto {
  @IsString()
  @MinLength(2)
  playerANickname: string;

  @IsString()
  @MinLength(2)
  playerBNickname: string;

  @IsOptional()
  @IsString()
  game?: string;
}
