import type { ReactNode } from "react";
import { Link } from "react-router";
import { ExternalLink, Search, ShieldCheck, UserRound } from "lucide-react";
import type { FaceitPlayerProfile } from "../../../types/faceit.interface";

interface ProfileHeaderProps {
  profile: FaceitPlayerProfile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const { player, links } = profile;
  const coverImage =
    typeof player.cover_image === "string" && player.cover_image
      ? player.cover_image
      : null;
  const avatar =
    typeof player.avatar === "string" && player.avatar ? player.avatar : null;
  const game = profile.game;
  const level = game?.skill_level ?? "N/A";
  const elo = game?.faceit_elo?.toLocaleString() ?? "N/A";

  return (
    <section className="relative overflow-hidden border border-[#333a37] bg-[#141716] shadow-[0_24px_100px_rgba(0,0,0,0.5)]">
      <div
        className="absolute inset-0 bg-[#191d1b] bg-cover bg-center opacity-45"
        style={
          coverImage
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(13,15,14,0.96), rgba(19,23,21,0.68), rgba(13,15,14,0.96)), url(${coverImage})`,
              }
            : undefined
        }
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(214,111,124,0.22)_0,rgba(214,111,124,0.06)_18%,transparent_18%,transparent_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d66f7c]" />

      <div className="relative grid min-h-[320px] gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden border border-[#444c49] bg-black shadow-[12px_12px_0_rgba(214,111,124,0.28)]">
            {avatar ? (
              <img
                src={avatar}
                alt={`${player.nickname ?? "FACEIT player"} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-12 w-12 text-[#d66f7c]" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-[#d66f7c] px-2 py-1 text-center text-xs font-black uppercase text-[#101312]">
              Level {level}
            </div>
          </div>

          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 border border-[#d66f7c]/45 bg-[#d66f7c]/12 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#e2939d]">
              <ShieldCheck className="h-3.5 w-3.5" />
              {profile.gameId.toUpperCase()} competitor profile
            </p>
            <h1 className="mt-4 truncate text-5xl font-black uppercase leading-none tracking-normal text-[#e6dfd3] sm:text-7xl">
              {player.nickname ?? "Unknown player"}
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-medium uppercase tracking-[0.16em] text-[#a9afa9]">
              {[
                player.country ? player.country.toUpperCase() : null,
                game?.region ? `${game.region.toUpperCase()} region` : null,
                player.player_id,
              ]
                .filter(Boolean)
                .join("  /  ")}
            </p>
          </div>
        </div>

        <div className="border border-[#333a37] bg-black/40 backdrop-blur">
          <div className="grid grid-cols-2 border-b border-[#333a37]">
            <HeroStat label="FACEIT ELO" value={elo} />
            <HeroStat label="Skill level" value={String(level)} accent />
          </div>

          <div className="flex flex-wrap gap-3 p-4">
            {links.faceit && (
              <ExternalProfileLink href={links.faceit}>FACEIT</ExternalProfileLink>
            )}
            {links.steam && (
              <ExternalProfileLink href={links.steam}>Steam</ExternalProfileLink>
            )}
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-[#3a4240] px-4 py-3 text-sm font-bold uppercase text-[#c9cec8] no-underline transition hover:border-[#d66f7c] hover:text-white"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

function HeroStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#858c87]">
        {label}
      </p>
      <p
        className={`mt-1 text-3xl font-black ${
          accent ? "text-[#d66f7c]" : "text-[#e6dfd3]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ExternalProfileLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 bg-[#d66f7c] px-4 py-3 text-sm font-black uppercase text-[#101312] no-underline transition hover:bg-[#e2939d]"
    >
      {children}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export default ProfileHeader;
