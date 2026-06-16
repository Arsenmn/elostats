import { CalendarClock, Map, RadioTower, Swords, Trophy } from "lucide-react";
import Unavailable from "./Unavailable";
import {
  formatValue,
  getItems,
  getStableKey,
  isRecord,
} from "../lib/playerProfile.utils";
import type {
  FaceitProfileSection,
  FaceitRawObject,
} from "../../../types/faceit.interface";

interface RecentMatchesPanelProps {
  section: FaceitProfileSection;
}

const fallbackMapBackground =
  "linear-gradient(135deg,rgba(34,245,255,0.2),rgba(5,7,13,0.9) 54%,rgba(223,255,34,0.08))";

const RecentMatchesPanel = ({ section }: RecentMatchesPanelProps) => {
  const matches = getItems(section.data);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#22f5ff]">
            Last public activity
          </p>
          <h2 className="mt-1 text-base font-black uppercase text-[#f4f7ff]">
            Recent matches
          </h2>
        </div>
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
          {matches.length ? `${Math.min(matches.length, 8)} loaded` : "No data"}
        </span>
      </div>

      {section.status === "rejected" ? (
        <Unavailable message={section.error} />
      ) : matches.length ? (
        <div className="overflow-hidden border border-[#20283c]">
          {matches.slice(0, 8).map((match, index) => (
            <RecentMatchCard
              key={getStableKey(match, index)}
              match={match}
              index={index}
            />
          ))}
        </div>
      ) : (
        <Unavailable message="No recent matches returned for this player." />
      )}
    </section>
  );
};

function RecentMatchCard({
  match,
  index,
}: {
  match: FaceitRawObject;
  index: number;
}) {
  const mapName = getMapName(match);
  const mapImage = getMapImage(match);
  const status = getString(match.status) ?? "Match record";
  const score = getScore(match);
  const teams = getTeams(match);
  const date = formatValue(match.finished_at ?? match.started_at);
  const background = mapImage ? `url("${mapImage}")` : fallbackMapBackground;

  return (
    <article className="relative isolate overflow-hidden border-b border-[#20283c] bg-[#05070d] p-4 last:border-b-0">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-95"
        style={{ backgroundImage: background }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,13,0.26)_0%,rgba(5,7,13,0.7)_58%,rgba(5,7,13,0.92)_100%)]" />
      <div className="pointer-events-none absolute bottom-[-0.16em] right-4 -z-0 text-[4rem] font-black uppercase leading-none tracking-normal text-white/[0.045] sm:text-[5.2rem]">
        {mapName}
      </div>

      <div className="relative z-10 grid gap-4 lg:grid-cols-[56px_minmax(0,1fr)_minmax(180px,0.42fr)] lg:items-center">
        <div className="flex h-12 w-12 items-center justify-center bg-[#dfff22] text-sm font-black text-[#05070d] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-lg font-black uppercase leading-6 text-[#f4f7ff]">
              {formatValue(
                match.competition_name ??
                  match.organizer_name ??
                  match.match_id,
              )}
            </p>
            <span className="border border-[#22f5ff]/40 bg-[#22f5ff]/10 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#22f5ff]">
              {status}
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#aab7cf] sm:grid-cols-2 xl:grid-cols-4">
            <MatchMeta icon={<Map className="h-3.5 w-3.5" />} value={mapName} />
            <MatchMeta
              icon={<Swords className="h-3.5 w-3.5" />}
              value={
                [match.game_mode, match.region].filter(Boolean).join(" / ") ||
                "CS2"
              }
            />
            <MatchMeta
              icon={<CalendarClock className="h-3.5 w-3.5" />}
              value={date}
            />
            <MatchMeta
              icon={<RadioTower className="h-3.5 w-3.5" />}
              value={
                getString(match.match_type) ??
                getString(match.game_id) ??
                "FACEIT"
              }
            />
          </div>
        </div>

        <div className="border border-[#f4f7ff]/14 bg-black/34 p-3 backdrop-blur">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
            Scoreline
          </p>
          <p className="mt-1 text-2xl font-black text-[#dfff22]">
            {score ?? "Pending"}
          </p>
          <p className="mt-2 truncate text-xs font-bold uppercase tracking-[0.12em] text-[#f4f7ff]">
            <Trophy className="mr-1 inline h-3.5 w-3.5 text-[#22f5ff]" />
            {teams ?? "Teams unavailable"}
          </p>
        </div>
      </div>
    </article>
  );
}

function MatchMeta({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-[#22f5ff]">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function getMapName(match: FaceitRawObject) {
  const normalizedMap = match.map;

  if (isRecord(normalizedMap)) {
    const normalizedMapName = getString(normalizedMap.name);

    if (normalizedMapName) return normalizedMapName;
  }

  const explicitMap =
    findStringByKeys(match, ["map", "map_name", "map_name_pretty"]) ??
    findMapFromVoting(match);

  if (!explicitMap) return "Unknown map";

  return explicitMap
    .replace(/^de[_-]/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function findMapFromVoting(value: unknown): string | null {
  if (!isRecord(value)) return null;

  const directMap = getMapFromVotingObject(value.voting);

  if (directMap) return directMap;

  for (const nestedValue of Object.values(value)) {
    if (isRecord(nestedValue)) {
      const nestedMap = findMapFromVoting(nestedValue);

      if (nestedMap) return nestedMap;
    }
  }

  return null;
}

function getMapFromVotingObject(voting: unknown) {
  if (!isRecord(voting)) return null;

  const map = voting.map;
  if (!isRecord(map)) return null;

  const pick = map.pick;
  const entities = Array.isArray(map.entities)
    ? map.entities.filter(isRecord)
    : [];

  if (Array.isArray(pick)) {
    const pickedId = pick.find(
      (item): item is string => typeof item === "string",
    );

    if (!pickedId) return null;

    const pickedEntity = entities.find(
      (entity) =>
        entity.guid === pickedId ||
        entity.game_map_id === pickedId ||
        entity.class_name === pickedId ||
        entity.name === pickedId,
    );

    return (
      getString(pickedEntity?.name) ??
      getString(pickedEntity?.class_name) ??
      pickedId
    );
  }

  return typeof pick === "string" ? pick : null;
}

function getMapImage(match: FaceitRawObject) {
  const normalizedMap = match.map;

  if (isRecord(normalizedMap)) {
    const normalizedMapImage =
      getString(normalizedMap.image_lg) ?? getString(normalizedMap.image_sm);

    if (normalizedMapImage) return normalizedMapImage;
  }

  const details = match.match_details;

  if (isRecord(details)) {
    const voting = details.voting;

    if (isRecord(voting) && isRecord(voting.map)) {
      const entities = Array.isArray(voting.map.entities)
        ? voting.map.entities.filter(isRecord)
        : [];
      const mapEntity = entities[0];
      const mapImage =
        getString(mapEntity?.image_lg) ?? getString(mapEntity?.image_sm);

      if (mapImage) return mapImage;
    }
  }

  return (
    findStringByKeys(match, [
      "image_lg",
      "image_sm",
      "image",
      "thumbnail",
      "map_image",
      "map_image_url",
    ]) ?? null
  );
}

function findStringByKeys(value: unknown, keys: string[]): string | null {
  if (!isRecord(value)) return null;

  for (const [key, nestedValue] of Object.entries(value)) {
    if (keys.includes(key.toLowerCase()) && typeof nestedValue === "string") {
      return nestedValue;
    }

    if (isRecord(nestedValue)) {
      const nestedResult = findStringByKeys(nestedValue, keys);

      if (nestedResult) return nestedResult;
    }
  }

  return null;
}

function getScore(match: FaceitRawObject) {
  const results = match.results;

  if (!isRecord(results)) return null;

  const score = results.score;

  if (isRecord(score)) {
    const values = Object.values(score).filter(
      (value): value is number | string =>
        typeof value === "number" || typeof value === "string",
    );

    return values.length >= 2 ? values.slice(0, 2).join(" : ") : null;
  }

  return typeof score === "string" ? score : null;
}

function getTeams(match: FaceitRawObject) {
  const teams = match.teams;

  if (!isRecord(teams)) return null;

  const names = Object.values(teams)
    .map((team) => {
      if (!isRecord(team)) return null;

      return (
        getString(team.nickname) ??
        getString(team.name) ??
        getString(team.team_id)
      );
    })
    .filter((name): name is string => Boolean(name));

  return names.length >= 2
    ? names.slice(0, 2).join(" vs ")
    : (names[0] ?? null);
}

function getString(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

export default RecentMatchesPanel;
