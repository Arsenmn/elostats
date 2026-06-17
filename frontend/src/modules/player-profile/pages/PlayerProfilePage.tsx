import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router";
import ProfileHeader from "../components/ProfileHeader";
import Loader from "@/shared/ui/Loader";
import { usePlayerProfile } from "@/modules/player-profile/hooks/usePlayerProfile.hook";
import {
  profileTabs,
  type ProfileTab,
} from "@/modules/player-profile/constants/profileTabs";
import { ProfileTabContent } from "@/modules/player-profile/components/ProfileTabContent";
import { ProfileEmptyState } from "@/modules/player-profile/components/ProfileEmptyState";

const PlayerProfilePage = () => {
  const { nickname = "" } = useParams();
  const decodedNickname = useMemo(
    () => decodeURIComponent(nickname),
    [nickname],
  );
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");

  const { data, isLoading, error } = usePlayerProfile(decodedNickname);

  let content: ReactNode;

  if (!decodedNickname) {
    content = (
      <ProfileEmptyState message="Enter a FACEIT nickname from the home page search." />
    );
  } else if (isLoading) {
    content = (
      <div className="flex min-h-96 items-center justify-center">
        <Loader />
      </div>
    );
  } else if (error || !data) {
    content = (
      <ProfileEmptyState
        message={
          error instanceof Error
            ? error.message
            : "Could not load this FACEIT profile."
        }
      />
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

export default PlayerProfilePage;
