import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { FaceitService } from './faceit.service';

@Controller('faceit')
export class FaceitController {
  constructor(private readonly faceitService: FaceitService) {}

  @Get('rankings')
  getTopPlayers(
    @Query('game') game?: string,
    @Query('region') region?: string,
    @Query('country') country?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.faceitService.getTopPlayers({
      gameId: game,
      region,
      country,
      offset: Number(offset) || undefined,
      limit: Number(limit) || undefined,
    });
  }

  @Get('search')
  searchPlayers(
    @Query('nickname') nickname?: string,
    @Query('limit') limit?: string,
  ) {
    if (!nickname?.trim()) {
      return { items: [] };
    }

    return this.faceitService.searchPlayers(
      nickname,
      Number(limit) || undefined,
    );
  }

  @Get('profile')
  getProfileByQuery(
    @Query() query: Record<string, string | string[]>,
    @Req() request: Request,
  ) {
    const nickname = this.getNicknameFromQuery(query, request.url);
    const game = this.getSingleQueryValue(query.game ?? query.gameId);

    if (!nickname) {
      throw new BadRequestException(
        'Query parameter "nickname" is required. Example: /api/faceit/profile?nickname=s1mple',
      );
    }

    return this.faceitService.getPlayerProfile(nickname, game);
  }

  @Get('profile/:nickname')
  getProfileByParam(
    @Param('nickname') nickname: string,
    @Query('game') game?: string,
  ) {
    return this.faceitService.getPlayerProfile(nickname, game);
  }

  @Get('player')
  getPlayerByQuery(
    @Query() query: Record<string, string | string[]>,
    @Req() request: Request,
  ) {
    const nickname = this.getNicknameFromQuery(query, request.url);

    if (!nickname) {
      throw new BadRequestException(
        'Query parameter "nickname" is required. Example: /api/faceit/player?nickname=s1mple',
      );
    }

    return this.faceitService.getPlayer(nickname);
  }

  @Get('player/:nickname')
  getPlayerByPlayerParam(@Param('nickname') nickname: string) {
    return this.faceitService.getPlayer(nickname);
  }

  @Get(':nickname')
  getPlayerByParam(@Param('nickname') nickname: string) {
    return this.faceitService.getPlayer(nickname);
  }

  private getNicknameFromQuery(
    query: Record<string, string | string[]>,
    url: string,
  ) {
    const value = query.nickname ?? query.player ?? query.name ?? query[''];

    if (Array.isArray(value)) return value[0]?.trim();
    if (value) return value.trim();

    const rawQuery = url.split('?')[1];
    if (!rawQuery) return undefined;

    const firstParam = rawQuery.split('&')[0];
    if (firstParam.startsWith('=')) {
      return decodeURIComponent(firstParam.slice(1)).trim();
    }

    return undefined;
  }

  private getSingleQueryValue(value?: string | string[]) {
    if (Array.isArray(value)) return value[0];

    return value;
  }
}
