import { Activity, Crosshair, Swords, Trophy, UserRound } from "lucide-react";
import FaceitLevelIcon from "./FaceitLevelIcon";
import RecentMatchesPanel from "./RecentMatchesPanel";
import StatsPanel from "./StatsPanel";
import CollectionPanel from "./CollectionPanel";
import SectionStatusPanel from "./SectionStatusPanel";
import { formatValue } from "../lib/playerProfile.utils";
import { ProfileMetric } from "./ProfileMetric";
import type { faceitApi } from "@/api/faceit.api";

export function OverviewTab({
  profile,
}: {
  profile: NonNullable<Awaited<ReturnType<typeof faceitApi.getProfile>>>;
}) {
  return (
    <>
      <section className="mt-6 grid border border-[#29324a] bg-[#0c101a] md:grid-cols-2 xl:grid-cols-4">
        <ProfileMetric
          label="Skill level"
          value={
            <FaceitLevelIcon level={profile.game?.skill_level} size="md" />
          }
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

      <section className="mt-6 space-y-6">
        <StatsPanel section={profile.sections.stats} />
        <RecentMatchesPanel section={profile.sections.history} />
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-3 w-14 bg-[#22f5ff]" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
            Profile context
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
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
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SectionStatusPanel title="Bans" section={profile.sections.bans} />
          <SectionStatusPanel
            title="Ranking"
            section={profile.sections.ranking}
          />
        </div>
      </section>
    </>
  );
}
