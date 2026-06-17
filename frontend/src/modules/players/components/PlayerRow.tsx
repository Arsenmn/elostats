import type { FaceitRankingPlayer } from "@/types/faceit";
import { getPodiumStyle } from "../lib/getPodiumStyle";
import { Link } from "react-router";
import { ChevronRight, Crosshair, Globe2, Shield, Trophy } from "lucide-react";
import { Metric } from "./Metric";

export function PlayerRow({
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
