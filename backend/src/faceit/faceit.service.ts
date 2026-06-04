import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {
  FaceitPlayer,
  FaceitPlayerProfile,
  FaceitProfileSection,
  FaceitRawObject,
  FaceitSearchPlayersResponse,
} from './faceit.types';

const FACEIT_API_BASE_URL = 'https://open.faceit.com/data/v4';
const DEFAULT_GAME_ID = 'cs2';
const DEFAULT_LIST_LIMIT = 20;
const DEFAULT_SEARCH_LIMIT = 10;
const MAX_SEARCH_LIMIT = 20;

@Injectable()
export class FaceitService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private get headers() {
    return {
      Authorization: `Bearer ${this.config.get('FACEIT_API_KEY')}`,
    };
  }

  async getPlayer(nickname: string): Promise<FaceitPlayer> {
    const normalizedNickname = nickname.trim();

    if (!normalizedNickname) {
      throw new NotFoundException('FACEIT player not found');
    }

    try {
      return await this.getPlayerByNickname(normalizedNickname);
    } catch (error) {
      if (!(error instanceof AxiosError) || error.response?.status !== 404) {
        this.throwFaceitError(error);
      }
    }

    const searchResult = await this.searchPlayer(normalizedNickname);

    const player = this.findBestSearchMatch(searchResult, normalizedNickname);

    if (!player?.player_id) {
      throw new NotFoundException('FACEIT player not found');
    }

    return this.getPlayerById(player.player_id);
  }

  async searchPlayers(
    nickname: string,
    limit = DEFAULT_SEARCH_LIMIT,
  ): Promise<FaceitSearchPlayersResponse> {
    const normalizedNickname = nickname.trim();

    if (!normalizedNickname) {
      return { items: [] };
    }

    return this.searchPlayer(
      normalizedNickname,
      Math.min(Math.max(limit, 1), MAX_SEARCH_LIMIT),
    );
  }

  async getPlayerProfile(
    nickname: string,
    gameId = DEFAULT_GAME_ID,
  ): Promise<FaceitPlayerProfile> {
    const player = await this.getPlayer(nickname);
    const playerId = player.player_id;

    if (!playerId) {
      throw new NotFoundException('FACEIT player not found');
    }

    const normalizedGameId = gameId.trim() || DEFAULT_GAME_ID;
    const game = player.games?.[normalizedGameId] ?? null;

    const [stats, history, bans, hubs, teams, tournaments, ranking] =
      await Promise.all([
        this.getOptionalSection(() =>
          this.getPlayerStats(playerId, normalizedGameId),
        ),
        this.getOptionalSection(() =>
          this.getPlayerHistory(playerId, normalizedGameId),
        ),
        this.getOptionalSection(() => this.getPlayerBans(playerId)),
        this.getOptionalSection(() => this.getPlayerHubs(playerId)),
        this.getOptionalSection(() => this.getPlayerTeams(playerId)),
        this.getOptionalSection(() => this.getPlayerTournaments(playerId)),
        this.getOptionalSection(() =>
          this.getPlayerRanking(playerId, normalizedGameId, game?.region),
        ),
      ]);

    return {
      player,
      gameId: normalizedGameId,
      game,
      links: {
        faceit: this.buildFaceitProfileUrl(player),
        steam: this.buildSteamProfileUrl(player),
      },
      sections: {
        stats,
        history,
        bans,
        hubs,
        teams,
        tournaments,
        ranking,
      },
    };
  }

  private async getPlayerByNickname(nickname: string): Promise<FaceitPlayer> {
    const { data } = await firstValueFrom(
      this.http.get<FaceitPlayer>(`${FACEIT_API_BASE_URL}/players`, {
        params: { nickname },
        headers: this.headers,
      }),
    );

    return data;
  }

  private async getPlayerById(playerId: string): Promise<FaceitPlayer> {
    const { data } = await firstValueFrom(
      this.http.get<FaceitPlayer>(
        `${FACEIT_API_BASE_URL}/players/${playerId}`,
        {
          headers: this.headers,
        },
      ),
    );

    return data;
  }

  private async searchPlayer(
    nickname: string,
    limit = DEFAULT_SEARCH_LIMIT,
  ): Promise<FaceitSearchPlayersResponse> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<FaceitSearchPlayersResponse>(
          `${FACEIT_API_BASE_URL}/search/players`,
          {
            params: {
              nickname,
              limit,
            },
            headers: this.headers,
          },
        ),
      );

      return data;
    } catch (error) {
      this.throwFaceitError(error);
    }
  }

  private findBestSearchMatch(
    searchResult: FaceitSearchPlayersResponse,
    nickname: string,
  ) {
    const players = searchResult.items ?? [];
    const normalizedNickname = nickname.toLowerCase();

    return (
      players.find(
        (player) => player.nickname?.toLowerCase() === normalizedNickname,
      ) ?? players[0]
    );
  }

  private async getPlayerStats(playerId: string, gameId: string) {
    return this.getFaceitResource(
      `/players/${encodeURIComponent(playerId)}/stats/${encodeURIComponent(
        gameId,
      )}`,
    );
  }

  private async getPlayerHistory(playerId: string, gameId: string) {
    return this.getFaceitResource(
      `/players/${encodeURIComponent(playerId)}/history`,
      {
        game: gameId,
        offset: 0,
        limit: DEFAULT_LIST_LIMIT,
      },
    );
  }

  private async getPlayerBans(playerId: string) {
    return this.getFaceitResource(
      `/players/${encodeURIComponent(playerId)}/bans`,
    );
  }

  private async getPlayerHubs(playerId: string) {
    return this.getFaceitResource(
      `/players/${encodeURIComponent(playerId)}/hubs`,
      {
        offset: 0,
        limit: DEFAULT_LIST_LIMIT,
      },
    );
  }

  private async getPlayerTeams(playerId: string) {
    return this.getFaceitResource(
      `/players/${encodeURIComponent(playerId)}/teams`,
      {
        offset: 0,
        limit: DEFAULT_LIST_LIMIT,
      },
    );
  }

  private async getPlayerTournaments(playerId: string) {
    return this.getFaceitResource(
      `/players/${encodeURIComponent(playerId)}/tournaments`,
      {
        offset: 0,
        limit: DEFAULT_LIST_LIMIT,
      },
    );
  }

  private async getPlayerRanking(
    playerId: string,
    gameId: string,
    region?: string,
  ) {
    if (!region) {
      throw new NotFoundException(
        'Ranking region is unavailable for this game',
      );
    }

    return this.getFaceitResource(
      `/rankings/games/${encodeURIComponent(gameId)}/regions/${encodeURIComponent(
        region,
      )}/players/${encodeURIComponent(playerId)}`,
    );
  }

  private async getFaceitResource(
    path: string,
    params?: Record<string, string | number>,
  ) {
    const { data } = await firstValueFrom(
      this.http.get<FaceitRawObject>(`${FACEIT_API_BASE_URL}${path}`, {
        params,
        headers: this.headers,
      }),
    );

    return data;
  }

  private async getOptionalSection<T>(
    loader: () => Promise<T>,
  ): Promise<FaceitProfileSection<T>> {
    try {
      return {
        status: 'fulfilled',
        data: await loader(),
      };
    } catch (error) {
      return {
        status: 'rejected',
        data: null,
        error: this.getFaceitErrorMessage(error),
      };
    }
  }

  private buildFaceitProfileUrl(player: FaceitPlayer) {
    if (typeof player.faceit_url !== 'string') return null;

    return player.faceit_url.replace('{lang}', 'en');
  }

  private buildSteamProfileUrl(player: FaceitPlayer) {
    if (typeof player.steam_id_64 !== 'string' || !player.steam_id_64) {
      return null;
    }

    return `https://steamcommunity.com/profiles/${player.steam_id_64}`;
  }

  private throwFaceitError(error: unknown): never {
    const message = this.getFaceitErrorMessage(error);

    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 500;

      throw new HttpException(message, status);
    }

    throw new InternalServerErrorException(message);
  }

  private getFaceitErrorMessage(error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 500;
      const data: unknown = error.response?.data;

      return typeof data === 'object' && data !== null && 'message' in data
        ? String(data.message)
        : `FACEIT request failed with status ${status}`;
    }

    return error instanceof Error ? error.message : 'FACEIT request failed';
  }
}
