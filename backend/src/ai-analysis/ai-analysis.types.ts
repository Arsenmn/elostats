export interface AiAnalysisSection {
  title: string;
  summary: string;
  bullets: string[];
}

export interface AiAnalysisPlayerSnapshot {
  nickname: string;
  avatar?: string;
  country?: string;
  skillLevel?: number;
  faceitElo?: number;
  region?: string;
}

export interface PlayerAnalysisResponse {
  player: AiAnalysisPlayerSnapshot;
  generatedAt: string;
  sections: AiAnalysisSection[];
  dataLimitations: string[];
}

export interface PlayerComparisonResponse {
  players: {
    playerA: AiAnalysisPlayerSnapshot;
    playerB: AiAnalysisPlayerSnapshot;
  };
  generatedAt: string;
  sections: AiAnalysisSection[];
  dataLimitations: string[];
}

export interface NormalizedPlayerAnalysisData {
  player: AiAnalysisPlayerSnapshot;
  lifetimeStats: Record<string, unknown>;
  recentMatches: Array<Record<string, unknown>>;
  mapSegments: Array<Record<string, unknown>>;
  unavailableData: string[];
}
