import { apiClient } from "./apiClient";
import type {
  FaceitPlayerProfile,
  FaceitRankingResponse,
  FaceitSearchPlayersResponse,
} from "../types/faceit.interface";

export const faceitApi = {
  getProfile: async (nickname: string, game = "cs2") => {
    const params = new URLSearchParams({
      nickname,
      game,
    });

    return apiClient.publicRequest<FaceitPlayerProfile>(
      `/faceit/profile?${params.toString()}`,
    );
  },

  searchPlayers: async (nickname: string, limit = 8) => {
    const params = new URLSearchParams({
      nickname,
      limit: String(limit),
    });

    return apiClient.publicRequest<FaceitSearchPlayersResponse>(
      `/faceit/search?${params.toString()}`,
    );
  },

  getTopPlayers: async ({
    game = "cs2",
    region = "EU",
    country,
    offset = 0,
    limit = 50,
  }: {
    game?: string;
    region?: string;
    country?: string;
    offset?: number;
    limit?: number;
  } = {}) => {
    const params = new URLSearchParams({
      game,
      region,
      offset: String(offset),
      limit: String(limit),
    });

    if (country) params.set("country", country);

    return apiClient.publicRequest<FaceitRankingResponse>(
      `/faceit/rankings?${params.toString()}`,
    );
  },
};
