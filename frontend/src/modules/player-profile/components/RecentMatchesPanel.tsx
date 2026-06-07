import Panel from "./Panel";
import Unavailable from "./Unavailable";
import {
  formatValue,
  getItems,
  getStableKey,
} from "../lib/playerProfile.utils";
import type { FaceitProfileSection } from "../../../types/faceit.interface";

interface RecentMatchesPanelProps {
  section: FaceitProfileSection;
}

const RecentMatchesPanel = ({ section }: RecentMatchesPanelProps) => {
  const matches = getItems(section.data);

  return (
    <Panel title="Recent matches" eyebrow="Last public activity">
      {section.status === "rejected" ? (
        <Unavailable message={section.error} />
      ) : matches.length ? (
        <div className="border border-[#20283c]">
          {matches.slice(0, 8).map((match, index) => (
            <div
              key={getStableKey(match, index)}
              className="grid gap-3 border-b border-[#20283c] bg-black/20 p-4 last:border-b-0 sm:grid-cols-[48px_minmax(0,1fr)_140px]"
            >
              <div className="flex h-10 w-10 items-center justify-center bg-[#22f5ff] text-sm font-black text-[#05070d]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-[#f4f7ff]">
                  {formatValue(
                    match.competition_name ??
                      match.organizer_name ??
                      match.match_id,
                  )}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                  {[match.game_mode, match.region].filter(Boolean).join(" / ") ||
                    "Match record"}
                </p>
              </div>
              <p className="self-center text-sm font-bold text-[#ff3df2] sm:text-right">
                {formatValue(match.finished_at ?? match.started_at)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Unavailable message="No recent matches returned for this player." />
      )}
    </Panel>
  );
};

export default RecentMatchesPanel;
