import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Crosshair, Globe2, Trophy } from "lucide-react";
import { faceitApi } from "../api/faceit.api";
import Loader from "../shared/ui/Loader";
import type { FaceitRankingPlayer } from "../types/faceit.interface";

const regions = ["EU", "NA", "SA", "SEA", "OCE"] as const;

const PlayersPage = () => {
  const [region, setRegion] = useState<(typeof regions)[number]>("EU");

  const { data, isLoading, error } = useQuery({
    queryKey: ["faceit-top-players", region],
    queryFn: () => faceitApi.getTopPlayers({ region, limit: 50 }),
    staleTime: 60_000,
  });

  const players = data?.items ?? [];

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

        <div className="mt-6 flex flex-wrap gap-0 border border-[#29324a] bg-[#0c101a]">
          {regions.map((item) => (
            <button
              key={item}
              type="button"
              className={`h-11 w-20 border-r border-[#20283c] text-sm font-black uppercase transition-colors last:border-r-0 ${
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
              {players.map((player, index) => (
                <PlayerRow
                  key={player.player_id ?? `${player.nickname}-${index}`}
                  player={player}
                  fallbackPosition={(data?.start ?? 0) + index + 1}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

function PlayerRow({
  player,
  fallbackPosition,
}: {
  player: FaceitRankingPlayer;
  fallbackPosition: number;
}) {
  const nickname = player.nickname ?? "Unknown";
  const position = player.position ?? fallbackPosition;

  return (
    <Link
      to={`/players/${encodeURIComponent(nickname)}`}
      className="grid gap-3 border-b border-[#20283c] px-4 py-4 text-[#f4f7ff] no-underline transition-colors last:border-b-0 hover:bg-[#22f5ff]/8 md:grid-cols-[72px_minmax(0,1fr)_110px_110px_48px] md:items-center"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center bg-[#22f5ff] text-sm font-black text-[#05070d]">
          {position}
        </span>
      </div>

      <div className="min-w-0">
        <p className="truncate text-lg font-black uppercase">{nickname}</p>
        <p className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
          <Globe2 className="h-3.5 w-3.5" />
          {player.country?.toUpperCase() ?? "Unknown country"}
        </p>
      </div>

      <Metric icon={<Trophy className="h-4 w-4" />} value={player.faceit_elo} />
      <Metric
        icon={<Crosshair className="h-4 w-4" />}
        value={player.game_skill_level}
      />

      <ChevronRight className="hidden h-5 w-5 justify-self-end text-[#ff3df2] md:block" />
    </Link>
  );
}

function Metric({ icon, value }: { icon: React.ReactNode; value?: number }) {
  return (
    <div className="flex items-center gap-2 text-sm font-black text-[#dbe7ff]">
      <span className="text-[#22f5ff]">{icon}</span>
      {value?.toLocaleString() ?? "N/A"}
    </div>
  );
}

export default PlayersPage;
