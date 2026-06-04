export type FaceitRawObject = Record<string, unknown>;

export interface FaceitGameInfo extends FaceitRawObject {
  region?: string;
  skill_level?: number;
  faceit_elo?: number;
  game_player_id?: string;
  game_player_name?: string;
  skill_level_label?: string;
}

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
  memberships?: string[];
}

export interface FaceitProfileSection<T = unknown> {
  status: "fulfilled" | "rejected";
  data: T | null;
  error?: string;
}

export interface FaceitPlayerProfile {
  player: FaceitPlayer;
  gameId: string;
  game: FaceitGameInfo | null;
  links: {
    faceit: string | null;
    steam: string | null;
  };
  sections: {
    stats: FaceitProfileSection;
    history: FaceitProfileSection;
    bans: FaceitProfileSection;
    hubs: FaceitProfileSection;
    teams: FaceitProfileSection;
    tournaments: FaceitProfileSection;
    ranking: FaceitProfileSection;
  };
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
