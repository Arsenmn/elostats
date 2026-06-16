import type { FaceitGameInfo } from "./game.interface";
import type { FaceitRawObject } from "./raw-object.type";

export interface FaceitPlayer extends FaceitRawObject {
  player_id?: string;
  nickname?: string;
  avatar?: string;
  country?: string;
  cover_image?: string;
  faceit_url?: string;
  steam_id_64?: string;
  steam_nickname?: string;
  games?: Record<string, FaceitGameInfo>;
  memebership?: string[];
}

export interface FaceitSearchPlayer {
  player_id?: string;
  nickname?: string;
  avatar?: string;
  country?: string;
  games?: Record<string, FaceitGameInfo>;
}

export interface FaceitSearchPlayersResponse {
  items?: FaceitSearchPlayer[];
}
