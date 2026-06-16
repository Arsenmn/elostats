import {
  AiAnalysisSection,
  NormalizedPlayerAnalysisData,
} from './ai-analysis.types';

const ANALYSIS_SECTION_TITLES = [
  'Overall player summary',
  'Strengths',
  'Weaknesses',
  'Playstyle observations',
  'Aim / shooting insights',
  'Duel performance insights',
  'Utility / grenade usage insights',
  'Map or match-history trends',
  'Actionable improvement recommendations',
];

const COMPARISON_SECTION_TITLES = [
  'Overall comparison summary',
  'Player A strengths vs Player B strengths',
  'Player A weaknesses vs Player B weaknesses',
  'Aim / shooting comparison',
  'Duel / entry impact comparison',
  'Playstyle comparison',
  'Map or match-history trends',
  'Practical conclusion',
];

export function buildPlayerAnalysisMessages(data: NormalizedPlayerAnalysisData) {
  return [
    buildSystemMessage(),
    {
      role: 'user',
      content: [
        'Generate a practical CS2 FACEIT player analysis for the provided normalized data.',
        'Return JSON only with this shape: {"sections":[{"title":"string","summary":"string","bullets":["string"]}],"dataLimitations":["string"]}.',
        `Use exactly these section titles when relevant: ${ANALYSIS_SECTION_TITLES.join(', ')}.`,
        'If a section has limited data, say what is missing instead of inventing numbers.',
        JSON.stringify({ player: data }),
      ].join('\n\n'),
    },
  ];
}

export function buildPlayerComparisonMessages(
  playerA: NormalizedPlayerAnalysisData,
  playerB: NormalizedPlayerAnalysisData,
) {
  return [
    buildSystemMessage(),
    {
      role: 'user',
      content: [
        'Generate a practical CS2 FACEIT comparison for exactly two players.',
        'Return JSON only with this shape: {"sections":[{"title":"string","summary":"string","bullets":["string"]}],"dataLimitations":["string"]}.',
        `Use exactly these section titles when relevant: ${COMPARISON_SECTION_TITLES.join(', ')}.`,
        'Use Player A and Player B labels consistently. Explain uncertainty when metrics are missing.',
        JSON.stringify({ playerA, playerB }),
      ].join('\n\n'),
    },
  ];
}

export function coerceSections(value: unknown): AiAnalysisSection[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => ({
      title: toNonEmptyString(item.title) ?? 'Analysis',
      summary: toNonEmptyString(item.summary) ?? '',
      bullets: Array.isArray(item.bullets)
        ? item.bullets
            .map((bullet) => toNonEmptyString(bullet))
            .filter((bullet): bullet is string => Boolean(bullet))
        : [],
    }))
    .filter((section) => section.summary || section.bullets.length);
}

export function coerceLimitations(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => toNonEmptyString(item))
    .filter((item): item is string => Boolean(item));
}

function buildSystemMessage() {
  return {
    role: 'system',
    content: [
      'You are an expert CS2 FACEIT analyst.',
      'Analyze only the provided data.',
      'Never invent missing statistics, match results, maps, or player traits.',
      'If data is missing or inconclusive, state the limitation clearly.',
      'Prefer practical improvement advice over generic motivational text.',
      'Be direct, specific, and useful for a player trying to improve.',
      'Return valid JSON only. No markdown. No prose outside JSON.',
    ].join(' '),
  };
}

function toNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
