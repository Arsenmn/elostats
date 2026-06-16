export interface FaceitRankingPlayer {
  country?: string;
  faceit_elo?: number;
  game_skill_level?: number;
  nickname?: string;
  player_id?: string;
  position?: number;
  [key: string]: unknown;
}

export interface FaceitRankingResponse {
  start?: number;
  end?: number;
  items?: FaceitRankingPlayer[];
}
