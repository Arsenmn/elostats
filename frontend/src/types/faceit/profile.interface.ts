import type { FaceitGameInfo } from "./game.interface";
import type { FaceitPlayer } from "./player.interface";

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
