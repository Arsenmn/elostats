import { apiClient } from "@/api/apiClient";
import type {
  PlayerAnalysisRequest,
  PlayerAnalysisResponse,
  PlayerComparisonRequest,
  PlayerComparisonResponse,
} from "../types/ai-analysis.interface";

export const aiAnalysisApi = {
  analyzePlayer: (request: PlayerAnalysisRequest) =>
    apiClient.publicRequest<PlayerAnalysisResponse>("/ai-analysis/player", {
      method: "POST",
      body: JSON.stringify(request),
    }),

  comparePlayers: (request: PlayerComparisonRequest) =>
    apiClient.publicRequest<PlayerComparisonResponse>("/ai-analysis/compare", {
      method: "POST",
      body: JSON.stringify(request),
    }),
};
