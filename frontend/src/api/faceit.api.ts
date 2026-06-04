import { apiClient } from "./apiClient";
import type {
  FaceitPlayerProfile,
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
};
