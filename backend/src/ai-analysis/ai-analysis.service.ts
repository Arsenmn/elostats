import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FaceitService } from '../faceit/faceit.service';
import { AnalyzePlayerDto } from './dto/analyze-player.dto';
import { ComparePlayersDto } from './dto/compare-players.dto';
import {
  buildPlayerAnalysisMessages,
  buildPlayerComparisonMessages,
  coerceLimitations,
  coerceSections,
} from './ai-analysis.prompt-builder';
import { normalizeFaceitProfileForAnalysis } from './ai-analysis.normalizer';
import {
  PlayerAnalysisResponse,
  PlayerComparisonResponse,
} from './ai-analysis.types';

@Injectable()
export class AiAnalysisService {
  private readonly openAiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private readonly config: ConfigService,
    private readonly faceitService: FaceitService,
  ) {}

  async analyzePlayer(dto: AnalyzePlayerDto): Promise<PlayerAnalysisResponse> {
    const profile = await this.faceitService.getPlayerProfile(
      dto.nickname,
      dto.game,
    );
    const normalized = normalizeFaceitProfileForAnalysis(profile);
    const aiResult = await this.generateStructuredResult(
      buildPlayerAnalysisMessages(normalized),
    );

    return {
      player: normalized.player,
      generatedAt: new Date().toISOString(),
      sections: aiResult.sections,
      dataLimitations: [
        ...normalized.unavailableData,
        ...aiResult.dataLimitations,
      ],
    };
  }

  async comparePlayers(
    dto: ComparePlayersDto,
  ): Promise<PlayerComparisonResponse> {
    const [profileA, profileB] = await Promise.all([
      this.faceitService.getPlayerProfile(dto.playerANickname, dto.game),
      this.faceitService.getPlayerProfile(dto.playerBNickname, dto.game),
    ]);
    const playerA = normalizeFaceitProfileForAnalysis(profileA);
    const playerB = normalizeFaceitProfileForAnalysis(profileB);
    const aiResult = await this.generateStructuredResult(
      buildPlayerComparisonMessages(playerA, playerB),
    );

    return {
      players: {
        playerA: playerA.player,
        playerB: playerB.player,
      },
      generatedAt: new Date().toISOString(),
      sections: aiResult.sections,
      dataLimitations: [
        ...playerA.unavailableData.map((item) => `Player A ${item}`),
        ...playerB.unavailableData.map((item) => `Player B ${item}`),
        ...aiResult.dataLimitations,
      ],
    };
  }

  private async generateStructuredResult(
    messages: Array<{ role: string; content: string }>,
  ) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'AI analysis is not configured. Missing OPENAI_API_KEY.',
      );
    }

    try {
      const response = await fetch(this.openAiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4.1-mini',
          messages,
          temperature: 0.25,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = payload.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('OpenAI response did not include content');
      }

      const parsed = JSON.parse(content) as Record<string, unknown>;

      return {
        sections: coerceSections(parsed.sections),
        dataLimitations: coerceLimitations(parsed.dataLimitations),
      };
    } catch {
      throw new BadGatewayException(
        'Could not generate AI analysis right now. Please try again later.',
      );
    }
  }
}
