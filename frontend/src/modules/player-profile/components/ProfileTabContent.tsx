import type { faceitApi } from "@/api/faceit.api";
import type { ProfileTab } from "../constants/profileTabs";
import StatsPanel from "./StatsPanel";
import RecentMatchesPanel from "./RecentMatchesPanel";
import CollectionPanel from "./CollectionPanel";
import { Swords, Trophy, UserRound } from "lucide-react";
import { EmptyTabPanel } from "./EmptyTabPanel";
import RawDataPanel from "./RawDataPanel";
import { OverviewTab } from "./OverviewTab";

export function ProfileTabContent({
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
