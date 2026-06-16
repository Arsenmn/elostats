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
  FaceitRankingResponse,
  FaceitRawObject,
  FaceitSearchPlayersResponse,
} from './faceit.types';

const FACEIT_API_BASE_URL = 'https://open.faceit.com/data/v4';
const DEFAULT_GAME_ID = 'cs2';
const DEFAULT_LIST_LIMIT = 20;
const DEFAULT_SEARCH_LIMIT = 10;
const MAX_SEARCH_LIMIT = 20;
const DEFAULT_RANKING_REGION = 'EU';
const DEFAULT_RANKING_LIMIT = 50;
const MAX_RANKING_LIMIT = 100;

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

  async getTopPlayers({
    gameId = DEFAULT_GAME_ID,
    region = DEFAULT_RANKING_REGION,
    country,
    offset = 0,
    limit = DEFAULT_RANKING_LIMIT,
  }: {
    gameId?: string;
    region?: string;
    country?: string;
    offset?: number;
    limit?: number;
  }): Promise<FaceitRankingResponse> {
    const normalizedGameId = gameId.trim() || DEFAULT_GAME_ID;
    const normalizedRegion = (
      region.trim() || DEFAULT_RANKING_REGION
    ).toUpperCase();
    const normalizedOffset = Math.max(offset, 0);
    const normalizedLimit = Math.min(Math.max(limit, 1), MAX_RANKING_LIMIT);

    return this.getFaceitResource(
      `/rankings/games/${encodeURIComponent(
        normalizedGameId,
      )}/regions/${encodeURIComponent(normalizedRegion)}`,
      {
        offset: normalizedOffset,
        limit: normalizedLimit,
        ...(country?.trim() ? { country: country.trim().toLowerCase() } : {}),
      },
    );
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
    const history = await this.getFaceitResource(
      `/players/${encodeURIComponent(playerId)}/history`,
      {
        game: gameId,
        offset: 0,
        limit: DEFAULT_LIST_LIMIT,
      },
    );

    return this.enrichPlayerHistory(history);
  }

  private async enrichPlayerHistory(history: FaceitRawObject) {
    if (!Array.isArray(history.items)) {
      return history;
    }

    const enrichedItems = await Promise.all(
      history.items.map(async (item, index) => {
        if (!this.isRecord(item) || typeof item.match_id !== 'string') {
          return item;
        }

        if (index >= 8) {
          return item;
        }

        try {
          const matchDetails = await this.getMatchDetails(item.match_id);
          const map = this.extractMatchMap(matchDetails);

          return {
            ...item,
            ...(map ? { map } : {}),
            match_details: matchDetails,
          };
        } catch {
          return item;
        }
      }),
    );

    return {
      ...history,
      items: enrichedItems,
    };
  }

  private async getMatchDetails(matchId: string) {
    return this.getFaceitResource(`/matches/${encodeURIComponent(matchId)}`);
  }

  private extractMatchMap(matchDetails: FaceitRawObject) {
    const voting = matchDetails.voting;

    if (!this.isRecord(voting)) return null;

    const mapVoting = voting.map;

    if (!this.isRecord(mapVoting)) return null;

    const pickedMapId = this.getPickedMapId(mapVoting.pick);

    if (!pickedMapId) return null;

    const entities = Array.isArray(mapVoting.entities)
      ? mapVoting.entities.filter((entity): entity is FaceitRawObject =>
          this.isRecord(entity),
        )
      : [];
    const pickedMap =
      entities.find((entity) =>
        [
          entity.guid,
          entity.game_map_id,
          entity.class_name,
          entity.name,
        ].includes(pickedMapId),
      ) ?? entities[0];

    return {
      id: this.getString(pickedMap?.game_map_id) ?? pickedMapId,
      name:
        this.getString(pickedMap?.name) ??
        this.formatMapName(
          this.getString(pickedMap?.class_name) ?? pickedMapId,
        ),
      image_lg: this.getString(pickedMap?.image_lg),
      image_sm: this.getString(pickedMap?.image_sm),
      class_name: this.getString(pickedMap?.class_name) ?? pickedMapId,
    };
  }

  private getPickedMapId(pick: unknown) {
    if (Array.isArray(pick)) {
      return pick.find((item): item is string => typeof item === 'string');
    }

    return typeof pick === 'string' ? pick : null;
  }

  private formatMapName(mapId: string) {
    return mapId
      .replace(/^de[_-]/i, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

  private isRecord(value: unknown): value is FaceitRawObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private getString(value: unknown) {
    return typeof value === 'string' && value ? value : null;
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
