import { useMemo, useState } from "react";
import Loader from "@/shared/ui/Loader";
import {
  eloFilters,
  levelFilters,
  regions,
  seasonFilters,
  sortOptions,
} from "@/modules/players/constants/players.constants";
import { useTopPlayers } from "@/modules/players/hooks/useTopPlayers.hook";
import { getVisiblePlayers } from "@/modules/players/lib/getVisiblePlayers";
import { FilterGroup } from "@/modules/players/components/FilterGroup";
import { PlayerRow } from "@/modules/players/components/PlayerRow";

const PlayersPage = () => {
  const [region, setRegion] = useState<(typeof regions)[number]>("EU");
  const [season, setSeason] = useState("current");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[number]["value"]>("rank");
  const [minLevel, setMinLevel] =
    useState<(typeof levelFilters)[number]["value"]>("all");
  const [minElo, setMinElo] =
    useState<(typeof eloFilters)[number]["value"]>("all");

  const { data, isLoading, error } = useTopPlayers(region);

  const visiblePlayers = useMemo(() => {
    return getVisiblePlayers({
      players: data?.items ?? [],
      minLevel,
      minElo,
      sortBy,
    });
  }, [data?.items, minLevel, minElo, sortBy]);

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

export default PlayersPage;
