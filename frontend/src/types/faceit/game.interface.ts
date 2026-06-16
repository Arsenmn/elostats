import type { FaceitRawObject } from "./raw-object.type";

export interface FaceitGameInfo extends FaceitRawObject {
  region?: string;
  skill_level?: number;
  faceit_elo?: number;
  game_player_id?: string;
  game_player_name?: string;
  skill_level_label?: string;
}
