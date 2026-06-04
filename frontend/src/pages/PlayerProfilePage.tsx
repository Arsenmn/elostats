import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, Crosshair, Swords, Trophy, UserRound } from "lucide-react";
import { faceitApi } from "../api/faceit.api";
import CollectionPanel from "../modules/player-profile/components/CollectionPanel";
import ProfileHeader from "../modules/player-profile/components/ProfileHeader";
import RawDataPanel from "../modules/player-profile/components/RawDataPanel";
import RecentMatchesPanel from "../modules/player-profile/components/RecentMatchesPanel";
import SectionStatusPanel from "../modules/player-profile/components/SectionStatusPanel";
import StatsPanel from "../modules/player-profile/components/StatsPanel";
import { formatValue } from "../modules/player-profile/lib/playerProfile.utils";
import Loader from "../shared/ui/Loader";

const PlayerProfilePage = () => {
  const { nickname = "" } = useParams();
  const decodedNickname = useMemo(() => decodeURIComponent(nickname), [nickname]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["faceit-profile", decodedNickname],
    queryFn: () => faceitApi.getProfile(decodedNickname),
    enabled: decodedNickname.length > 0,
  });

  let content: ReactNode;

  if (!decodedNickname) {
    content = renderEmptyState(
      "Enter a FACEIT nickname from the home page search.",
    );
  } else if (isLoading) {
    content = (
      <div className="flex min-h-96 items-center justify-center">
        <Loader />
      </div>
    );
  } else if (error || !data) {
    content = renderEmptyState(
      error instanceof Error
        ? error.message
        : "Could not load this FACEIT profile.",
    );
  } else {
    content = (
      <>
        <ProfileHeader profile={data} />

        <nav className="mt-6 flex overflow-x-auto border border-[#333a37] bg-[#141716]">
          {["Overview", "Stats", "Matches", "Teams", "Raw data"].map(
            (item, index) => (
              <span
                key={item}
                className={`min-w-max border-r border-[#2b312f] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] ${
                  index === 0
                    ? "bg-[#d66f7c] text-[#101312]"
                    : "text-[#858c87]"
                }`}
              >
                {item}
              </span>
            ),
          )}
        </nav>

        <section className="mt-6 grid border border-[#333a37] bg-[#141716] md:grid-cols-2 xl:grid-cols-4">
          <ProfileMetric
            label="Skill level"
            value={formatValue(data.game?.skill_level)}
            icon={<Crosshair className="h-4 w-4" />}
          />
          <ProfileMetric
            label="FACEIT ELO"
            value={formatValue(data.game?.faceit_elo)}
            icon={<Activity className="h-4 w-4" />}
          />
          <ProfileMetric
            label="Region"
            value={formatValue(data.game?.region)}
            icon={<Swords className="h-4 w-4" />}
          />
          <ProfileMetric
            label="Steam"
            value={formatValue(data.player.steam_nickname)}
            icon={<UserRound className="h-4 w-4" />}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <StatsPanel section={data.sections.stats} />
            <RecentMatchesPanel section={data.sections.history} />
          </div>

          <aside className="space-y-6">
            <CollectionPanel
              title="Teams"
              icon={<Swords className="h-4 w-4" />}
              section={data.sections.teams}
            />
            <CollectionPanel
              title="Hubs"
              icon={<UserRound className="h-4 w-4" />}
              section={data.sections.hubs}
            />
            <CollectionPanel
              title="Tournaments"
              icon={<Trophy className="h-4 w-4" />}
              section={data.sections.tournaments}
            />
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <SectionStatusPanel title="Bans" section={data.sections.bans} />
          <SectionStatusPanel
            title="Ranking"
            section={data.sections.ranking}
          />
        </section>

        <RawDataPanel profile={data} />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d100f] bg-[linear-gradient(rgba(230,223,211,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(230,223,211,0.035)_1px,transparent_1px)] bg-[size:44px_44px] px-4 py-20 text-[#e6dfd3] sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">{content}</div>
    </main>
  );
};

function ProfileMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-r border-[#2b312f] p-5 md:[&:nth-child(2n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0">
      <div className="flex h-11 w-11 items-center justify-center bg-[#d66f7c] text-[#101312]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#858c87]">
          {label}
        </p>
        <p className="mt-1 truncate text-2xl font-black text-[#e6dfd3]">
          {value}
        </p>
      </div>
    </div>
  );
}

function renderEmptyState(message: string) {
  return (
    <div className="border border-[#333a37] bg-[#141716] p-8">
      <h1 className="text-3xl font-bold">Profile unavailable</h1>
      <p className="mt-3 text-[#a9afa9]">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-flex bg-[#d66f7c] px-5 py-3 font-black uppercase text-[#101312] no-underline"
      >
        Back to search
      </Link>
    </div>
  );
}

export default PlayerProfilePage;
