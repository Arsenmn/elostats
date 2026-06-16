import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Crosshair, Globe2, Shield, Trophy } from "lucide-react";
import { faceitApi } from "../api/faceit.api";
import Loader from "../shared/ui/Loader";
import type { FaceitRankingPlayer } from "../types/faceit.interface";

const regions = ["EU", "NA", "SA", "SEA", "OCE"] as const;
const seasonFilters = [
  { label: "Current", value: "current", disabled: false },
  { label: "Season 8", value: "season-8", disabled: true },
  { label: "Season 7", value: "season-7", disabled: true },
];
const sortOptions = [
  { label: "Rank", value: "rank", disabled: false },
  { label: "FACEIT ELO", value: "faceit_elo", disabled: false },
  { label: "Skill level", value: "skill_level", disabled: false },
  { label: "K/D", value: "kd", disabled: true },
  { label: "Avg", value: "avg", disabled: true },
] as const;
const levelFilters = [
  { label: "All levels", value: "all" },
  { label: "Level 10", value: "10" },
  { label: "Level 9+", value: "9" },
  { label: "Level 8+", value: "8" },
] as const;
const eloFilters = [
  { label: "Any ELO", value: "all" },
  { label: "2000+", value: "2000" },
  { label: "2500+", value: "2500" },
  { label: "3000+", value: "3000" },
] as const;

const PlayersPage = () => {
  const [region, setRegion] = useState<(typeof regions)[number]>("EU");
  const [season, setSeason] = useState("current");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[number]["value"]>("rank");
  const [minLevel, setMinLevel] =
    useState<(typeof levelFilters)[number]["value"]>("all");
  const [minElo, setMinElo] =
    useState<(typeof eloFilters)[number]["value"]>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["faceit-top-players", region],
    queryFn: () => faceitApi.getTopPlayers({ region, limit: 50 }),
    staleTime: 60_000,
  });

  const visiblePlayers = useMemo(() => {
    const players = data?.items ?? [];
    const levelFloor = minLevel === "all" ? null : Number(minLevel);
    const eloFloor = minElo === "all" ? null : Number(minElo);

    return players
      .filter((player) => {
        const matchesLevel =
          levelFloor === null ||
          (player.game_skill_level ?? 0) >= levelFloor;
        const matchesElo =
          eloFloor === null || (player.faceit_elo ?? 0) >= eloFloor;

        return matchesLevel && matchesElo;
      })
      .toSorted((firstPlayer, secondPlayer) => {
        if (sortBy === "faceit_elo") {
          return (
            (secondPlayer.faceit_elo ?? 0) - (firstPlayer.faceit_elo ?? 0)
          );
        }

        if (sortBy === "skill_level") {
          return (
            (secondPlayer.game_skill_level ?? 0) -
            (firstPlayer.game_skill_level ?? 0)
          );
        }

        return (
          (firstPlayer.position ?? Number.MAX_SAFE_INTEGER) -
          (secondPlayer.position ?? Number.MAX_SAFE_INTEGER)
        );
      });
  }, [data?.items, minElo, minLevel, sortBy]);

  return (
    <main className="min-h-screen bg-[#05070d] bg-[linear-gradient(rgba(244,247,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] px-4 pb-20 pt-24 text-[#f4f7ff] sm:px-6 sm:pt-32 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden border border-[#29324a] bg-[#0c101a] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.42)] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,24px_100%,0_calc(100%-24px))] sm:p-8">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[#f4ff2f] opacity-90 [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
          <div className="relative">
            <p className="inline-flex border border-[#22f5ff] bg-[#22f5ff] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#05070d] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
              FACEIT global ranking
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.86] sm:text-7xl">
              Top CS2 players
            </h1>
            <p className="mt-5 max-w-2xl border-l-4 border-[#ff3df2] pl-5 text-sm leading-6 text-[#aab7cf] sm:text-base">
              Live regional leaderboard from FACEIT rankings. Open any player to
              inspect profile stats, history, teams, and raw public data.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 border border-[#29324a] bg-[#0c101a]">
          {regions.map((item) => (
            <button
              key={item}
              type="button"
              className={`h-11 w-full border-r border-[#20283c] text-sm font-black uppercase transition-colors last:border-r-0 ${
                region === item
                  ? "bg-[#f4ff2f] text-[#05070d]"
                  : "text-[#dbe7ff] hover:text-[#22f5ff]"
              }`}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 border border-[#29324a] bg-[#0c101a]/92 p-3 md:grid-cols-[1.1fr_1.5fr_1fr_1fr]">
          <FilterGroup label="Season">
            <div className="grid grid-cols-3 border border-[#20283c]">
              {seasonFilters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  disabled={item.disabled}
                  className={`h-10 border-r border-[#20283c] px-2 text-xs font-black uppercase transition-colors last:border-r-0 ${
                    season === item.value
                      ? "bg-[#f4ff2f] text-[#05070d]"
                      : "text-[#dbe7ff] hover:text-[#22f5ff]"
                  } disabled:cursor-not-allowed disabled:text-[#566176] disabled:hover:text-[#566176]`}
                  onClick={() => setSeason(item.value)}
                  title={
                    item.disabled
                      ? "FACEIT regional rankings API currently returns current rankings only."
                      : undefined
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Sort">
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as (typeof sortOptions)[number]["value"],
                )
              }
              className="h-10 w-full border border-[#20283c] bg-[#05070d] px-3 text-xs font-black uppercase text-[#f4f7ff] outline-none transition focus:border-[#f4ff2f]"
            >
              {sortOptions.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                  {item.disabled ? " - profile stats" : ""}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup label="Level">
            <select
              value={minLevel}
              onChange={(event) =>
                setMinLevel(
                  event.target.value as (typeof levelFilters)[number]["value"],
                )
              }
              className="h-10 w-full border border-[#20283c] bg-[#05070d] px-3 text-xs font-black uppercase text-[#f4f7ff] outline-none transition focus:border-[#f4ff2f]"
            >
              {levelFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup label="ELO">
            <select
              value={minElo}
              onChange={(event) =>
                setMinElo(
                  event.target.value as (typeof eloFilters)[number]["value"],
                )
              }
              className="h-10 w-full border border-[#20283c] bg-[#05070d] px-3 text-xs font-black uppercase text-[#f4f7ff] outline-none transition focus:border-[#f4ff2f]"
            >
              {eloFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </FilterGroup>
        </div>

        <section className="mt-6 overflow-hidden border border-[#29324a] bg-[#0c101a] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]">
          <div className="grid grid-cols-[72px_minmax(0,1fr)_110px_110px_48px] border-b border-[#20283c] bg-[#111827] px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#94a3b8] max-md:hidden">
            <span>Rank</span>
            <span>Player</span>
            <span>ELO</span>
            <span>Level</span>
            <span />
          </div>

          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center p-6">
              <Loader />
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-[#ff4d6d]">
              {error instanceof Error
                ? error.message
                : "Could not load FACEIT rankings."}
            </div>
          ) : (
            <div>
              {visiblePlayers.map((player, index) => (
                <PlayerRow
                  key={player.player_id ?? `${player.nickname}-${index}`}
                  player={player}
                  fallbackPosition={(data?.start ?? 0) + index + 1}
                />
              ))}
              {!visiblePlayers.length && (
                <p className="p-6 text-sm text-[#94a3b8]">
                  No players match the selected filters.
                </p>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

function FilterGroup({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#94a3b8]">
        {label}
      </span>
      {children}
    </label>
  );
}

function PlayerRow({
  player,
  fallbackPosition,
}: {
  player: FaceitRankingPlayer;
  fallbackPosition: number;
}) {
  const nickname = player.nickname ?? "Unknown";
  const position = player.position ?? fallbackPosition;
  const podiumStyle = getPodiumStyle(position);

  return (
    <Link
      to={`/players/${encodeURIComponent(nickname)}`}
      className={`group relative grid gap-3 overflow-hidden border-b px-4 py-4 text-[#f4f7ff] no-underline transition-colors last:border-b-0 md:grid-cols-[72px_minmax(0,1fr)_110px_110px_48px] md:items-center ${
        podiumStyle
          ? `${podiumStyle.rowClassName} ${podiumStyle.borderClassName}`
          : "border-[#20283c] hover:bg-[#22f5ff]/8"
      }`}
    >
      {podiumStyle && (
        <>
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 ${podiumStyle.barClassName}`}
          />
          <div
            className={`pointer-events-none absolute right-0 top-0 h-full w-44 opacity-80 ${podiumStyle.wingClassName}`}
          />
        </>
      )}

      <div className="flex items-center gap-3">
        <span
          className={`relative flex h-12 w-12 items-center justify-center text-sm font-black ${
            podiumStyle
              ? `${podiumStyle.rankClassName} shadow-[0_14px_34px_rgba(0,0,0,0.34)]`
              : "bg-[#22f5ff] text-[#05070d]"
          }`}
        >
          {podiumStyle && (
            <Trophy className="absolute -right-1 -top-1 h-4 w-4 text-current" />
          )}
          <span>{position}</span>
        </span>
      </div>

      <div className="relative min-w-0">
        {podiumStyle && (
          <p
            className={`mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] ${podiumStyle.labelClassName}`}
          >
            <Shield className="h-3.5 w-3.5" />
            {podiumStyle.label}
          </p>
        )}
        <p className="truncate text-lg font-black uppercase md:text-xl">
          {nickname}
        </p>
        <p className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
          <Globe2 className="h-3.5 w-3.5" />
          {player.country?.toUpperCase() ?? "Unknown country"}
        </p>
        {podiumStyle && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`border px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${podiumStyle.badgeClassName}`}
            >
              Regional elite
            </span>
            <span className="border border-white/12 bg-black/20 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#dbe7ff]">
              Rank verified
            </span>
          </div>
        )}
      </div>

      <Metric
        accentClassName={podiumStyle?.metricClassName}
        icon={<Trophy className="h-4 w-4" />}
        label="ELO"
        value={player.faceit_elo}
      />
      <Metric
        accentClassName={podiumStyle?.metricClassName}
        icon={<Crosshair className="h-4 w-4" />}
        label="Level"
        value={player.game_skill_level}
      />

      <ChevronRight
        className={`hidden h-5 w-5 justify-self-end transition-transform group-hover:translate-x-1 md:block ${
          podiumStyle ? podiumStyle.chevronClassName : "text-[#ff3df2]"
        }`}
      />
    </Link>
  );
}

function Metric({
  accentClassName = "text-[#22f5ff]",
  icon,
  label,
  value,
}: {
  accentClassName?: string;
  icon: React.ReactNode;
  label: string;
  value?: number;
}) {
  return (
    <div className="relative flex items-center gap-2 text-sm font-black text-[#dbe7ff]">
      <span className={accentClassName}>{icon}</span>
      <span>
        <span className="mr-2 text-[10px] uppercase tracking-[0.14em] text-[#7e8aa2]">
          {label}
        </span>
        {value?.toLocaleString() ?? "N/A"}
      </span>
    </div>
  );
}

function getPodiumStyle(position: number) {
  if (position === 1) {
    return {
      badgeClassName: "border-[#f8d66b]/45 bg-[#f8d66b]/12 text-[#ffe08a]",
      barClassName: "bg-[#f8d66b]",
      borderClassName: "border-[#f8d66b]/38",
      chevronClassName: "text-[#f8d66b]",
      label: "Champion seed",
      labelClassName: "text-[#ffe08a]",
      metricClassName: "text-[#f8d66b]",
      rankClassName: "bg-[#f8d66b] text-[#05070d]",
      rowClassName:
        "bg-[linear-gradient(90deg,rgba(248,214,107,0.18),rgba(248,214,107,0.055)_44%,rgba(12,16,26,0)_100%)] hover:bg-[#f8d66b]/12",
      wingClassName:
        "bg-[linear-gradient(135deg,rgba(248,214,107,0.28),transparent_58%)] [clip-path:polygon(38%_0,100%_0,100%_100%,0_100%)]",
    };
  }

  if (position === 2) {
    return {
      badgeClassName: "border-[#cfd8e6]/45 bg-[#cfd8e6]/12 text-[#f0f5ff]",
      barClassName: "bg-[#cfd8e6]",
      borderClassName: "border-[#cfd8e6]/34",
      chevronClassName: "text-[#dce6f5]",
      label: "Silver threat",
      labelClassName: "text-[#dce6f5]",
      metricClassName: "text-[#dce6f5]",
      rankClassName: "bg-[#cfd8e6] text-[#05070d]",
      rowClassName:
        "bg-[linear-gradient(90deg,rgba(207,216,230,0.16),rgba(207,216,230,0.052)_44%,rgba(12,16,26,0)_100%)] hover:bg-[#cfd8e6]/12",
      wingClassName:
        "bg-[linear-gradient(135deg,rgba(207,216,230,0.24),transparent_58%)] [clip-path:polygon(38%_0,100%_0,100%_100%,0_100%)]",
    };
  }

  if (position === 3) {
    return {
      badgeClassName: "border-[#d48b5a]/45 bg-[#d48b5a]/12 text-[#ffb27d]",
      barClassName: "bg-[#d48b5a]",
      borderClassName: "border-[#d48b5a]/34",
      chevronClassName: "text-[#d48b5a]",
      label: "Bronze pressure",
      labelClassName: "text-[#ffb27d]",
      metricClassName: "text-[#d48b5a]",
      rankClassName: "bg-[#d48b5a] text-[#05070d]",
      rowClassName:
        "bg-[linear-gradient(90deg,rgba(212,139,90,0.16),rgba(212,139,90,0.052)_44%,rgba(12,16,26,0)_100%)] hover:bg-[#d48b5a]/12",
      wingClassName:
        "bg-[linear-gradient(135deg,rgba(212,139,90,0.24),transparent_58%)] [clip-path:polygon(38%_0,100%_0,100%_100%,0_100%)]",
    };
  }

  return null;
}

export default PlayersPage;
