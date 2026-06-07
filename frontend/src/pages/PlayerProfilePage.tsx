import { useMemo, useState } from "react";
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

const profileTabs = [
  "Overview",
  "Stats",
  "Matches",
  "Teams",
  "AI Analysis",
  "Comparison",
  "Raw Data",
] as const;

type ProfileTab = (typeof profileTabs)[number];

const PlayerProfilePage = () => {
  const { nickname = "" } = useParams();
  const decodedNickname = useMemo(() => decodeURIComponent(nickname), [nickname]);
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");

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

        <nav className="mt-6 flex overflow-x-auto border border-[#29324a] bg-[#0c101a]">
          {profileTabs.map((item) => (
              <button
                key={item}
                type="button"
                className={`min-w-max border-r border-[#20283c] px-5 py-3 text-left text-xs font-black uppercase tracking-[0.18em] transition ${
                  activeTab === item
                    ? "bg-[#22f5ff] text-[#05070d]"
                    : "text-[#94a3b8] hover:bg-[#22f5ff]/10 hover:text-[#f4f7ff]"
                }`}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </button>
            ))}
        </nav>

        <ProfileTabContent activeTab={activeTab} profile={data} />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] bg-[linear-gradient(rgba(230,223,211,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(230,223,211,0.035)_1px,transparent_1px)] bg-[size:44px_44px] px-4 py-20 text-[#f4f7ff] sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">{content}</div>
    </main>
  );
};

function ProfileTabContent({
  activeTab,
  profile,
}: {
  activeTab: ProfileTab;
  profile: NonNullable<Awaited<ReturnType<typeof faceitApi.getProfile>>>;
}) {
  if (activeTab === "Stats") {
    return (
      <div className="mt-6">
        <StatsPanel section={profile.sections.stats} />
      </div>
    );
  }

  if (activeTab === "Matches") {
    return (
      <div className="mt-6">
        <RecentMatchesPanel section={profile.sections.history} />
      </div>
    );
  }

  if (activeTab === "Teams") {
    return (
      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <CollectionPanel
          title="Teams"
          icon={<Swords className="h-4 w-4" />}
          section={profile.sections.teams}
        />
        <CollectionPanel
          title="Hubs"
          icon={<UserRound className="h-4 w-4" />}
          section={profile.sections.hubs}
        />
        <CollectionPanel
          title="Tournaments"
          icon={<Trophy className="h-4 w-4" />}
          section={profile.sections.tournaments}
        />
      </section>
    );
  }

  if (activeTab === "AI Analysis") {
    return (
      <EmptyTabPanel
        title="AI analysis"
        message="OpenAI-powered player analysis will appear here once the analysis service is connected."
      />
    );
  }

  if (activeTab === "Comparison") {
    return (
      <EmptyTabPanel
        title="Comparison"
        message="Player-vs-player and multi-player comparison tools will appear here."
      />
    );
  }

  if (activeTab === "Raw Data") {
    return <RawDataPanel profile={profile} />;
  }

  return <OverviewTab profile={profile} />;
}

function OverviewTab({
  profile,
}: {
  profile: NonNullable<Awaited<ReturnType<typeof faceitApi.getProfile>>>;
}) {
  return (
    <>
      <section className="mt-6 grid border border-[#29324a] bg-[#0c101a] md:grid-cols-2 xl:grid-cols-4">
        <ProfileMetric
          label="Skill level"
          value={formatValue(profile.game?.skill_level)}
          icon={<Crosshair className="h-4 w-4" />}
        />
        <ProfileMetric
          label="FACEIT ELO"
          value={formatValue(profile.game?.faceit_elo)}
          icon={<Activity className="h-4 w-4" />}
        />
        <ProfileMetric
          label="Region"
          value={formatValue(profile.game?.region)}
          icon={<Swords className="h-4 w-4" />}
        />
        <ProfileMetric
          label="Steam"
          value={formatValue(profile.player.steam_nickname)}
          icon={<UserRound className="h-4 w-4" />}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <StatsPanel section={profile.sections.stats} />
          <RecentMatchesPanel section={profile.sections.history} />
        </div>

        <aside className="space-y-6">
          <CollectionPanel
            title="Teams"
            icon={<Swords className="h-4 w-4" />}
            section={profile.sections.teams}
          />
          <CollectionPanel
            title="Hubs"
            icon={<UserRound className="h-4 w-4" />}
            section={profile.sections.hubs}
          />
          <CollectionPanel
            title="Tournaments"
            icon={<Trophy className="h-4 w-4" />}
            section={profile.sections.tournaments}
          />
        </aside>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionStatusPanel title="Bans" section={profile.sections.bans} />
        <SectionStatusPanel title="Ranking" section={profile.sections.ranking} />
      </section>
    </>
  );
}

function EmptyTabPanel({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="mt-6 border border-[#29324a] bg-[#0c101a] p-8">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#22f5ff]">
        Coming soon
      </p>
      <h2 className="mt-2 text-3xl font-black uppercase text-[#f4f7ff]">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#aab7cf]">
        {message}
      </p>
    </section>
  );
}

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
    <div className="flex items-center gap-4 border-b border-r border-[#20283c] p-5 md:[&:nth-child(2n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0">
      <div className="flex h-11 w-11 items-center justify-center bg-[#22f5ff] text-[#05070d]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
          {label}
        </p>
        <p className="mt-1 truncate text-2xl font-black text-[#f4f7ff]">
          {value}
        </p>
      </div>
    </div>
  );
}

function renderEmptyState(message: string) {
  return (
    <div className="border border-[#29324a] bg-[#0c101a] p-8">
      <h1 className="text-3xl font-bold">Profile unavailable</h1>
      <p className="mt-3 text-[#aab7cf]">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-flex bg-[#22f5ff] px-5 py-3 font-black uppercase text-[#05070d] no-underline"
      >
        Back to search
      </Link>
    </div>
  );
}

export default PlayerProfilePage;
