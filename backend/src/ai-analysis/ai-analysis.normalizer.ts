import {
  FaceitPlayerProfile,
  FaceitProfileSection,
  FaceitRawObject,
} from '../faceit/faceit.types';
import { NormalizedPlayerAnalysisData } from './ai-analysis.types';

const LIFETIME_KEYS = [
  'Matches',
  'Wins',
  'Win Rate %',
  'Average K/D Ratio',
  'K/D Ratio',
  'Average K/R Ratio',
  'K/R Ratio',
  'Average Headshots %',
  'Headshots %',
  'ADR',
  'Entry Rate',
  'Entry Success Rate',
  'Total Entry Count',
  'Total Entry Wins',
  'Flash Success Rate',
  'Enemies Flashed per Round',
  'Flashes per Round',
  'Utility Damage per Round',
  'Utility Usage per Round',
  'Longest Win Streak',
  'Current Win Streak',
];

const MATCH_KEYS = [
  'match_id',
  'competition_name',
  'game_mode',
  'region',
  'status',
  'started_at',
  'finished_at',
  'map',
  'results',
  'teams',
];

export function normalizeFaceitProfileForAnalysis(
  profile: FaceitPlayerProfile,
): NormalizedPlayerAnalysisData {
  const lifetime = getLifetimeStats(profile.sections.stats);
  const segments = getSegments(profile.sections.stats);
  const recentMatches = getRecentMatches(profile.sections.history);
  const unavailableData = getUnavailableData(profile);

  return {
    player: {
      nickname: profile.player.nickname ?? 'Unknown player',
      avatar: profile.player.avatar,
      country: profile.player.country,
      skillLevel: profile.game?.skill_level,
      faceitElo: profile.game?.faceit_elo,
      region: profile.game?.region,
    },
    lifetimeStats: pickKnownKeys(lifetime, LIFETIME_KEYS),
    recentMatches,
    mapSegments: segments,
    unavailableData,
  };
}

function getLifetimeStats(section: FaceitProfileSection) {
  if (section.status === 'rejected' || !isRecord(section.data)) return {};

  return isRecord(section.data.lifetime)
    ? section.data.lifetime
    : section.data;
}

function getSegments(section: FaceitProfileSection) {
  if (section.status === 'rejected' || !isRecord(section.data)) return [];
  if (!Array.isArray(section.data.segments)) return [];

  return section.data.segments
    .filter(isRecord)
    .slice(0, 8)
    .map((segment) => ({
      label: segment.label ?? segment.mode ?? segment.type,
      mode: segment.mode,
      type: segment.type,
      stats: isRecord(segment.stats)
        ? pickKnownKeys(segment.stats, LIFETIME_KEYS)
        : {},
    }));
}

function getRecentMatches(section: FaceitProfileSection) {
  if (section.status === 'rejected' || !isRecord(section.data)) return [];
  if (!Array.isArray(section.data.items)) return [];

  return section.data.items
    .filter(isRecord)
    .slice(0, 8)
    .map((match) => pickKnownKeys(match, MATCH_KEYS));
}

function getUnavailableData(profile: FaceitPlayerProfile) {
  return Object.entries(profile.sections)
    .filter(([, section]) => section.status === 'rejected')
    .map(([name, section]) => `${name}: ${section.error ?? 'unavailable'}`);
}

function pickKnownKeys(source: FaceitRawObject, keys: string[]) {
  return keys.reduce<Record<string, unknown>>((result, key) => {
    if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
      result[key] = source[key];
    }

    return result;
  }, {});
}

function isRecord(value: unknown): value is FaceitRawObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
