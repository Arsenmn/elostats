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

export interface PlayerAnalysisRequest {
  nickname: string;
  game?: string;
}

export interface PlayerComparisonRequest {
  playerANickname: string;
  playerBNickname: string;
  game?: string;
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
