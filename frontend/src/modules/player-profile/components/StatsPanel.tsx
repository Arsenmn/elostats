import Panel from "./Panel";
import Unavailable from "./Unavailable";
import { formatValue, getStats } from "../lib/playerProfile.utils";
import type { FaceitProfileSection } from "../../../types/faceit.interface";

interface StatsPanelProps {
  section: FaceitProfileSection;
}

const StatsPanel = ({ section }: StatsPanelProps) => {
  const stats = getStats(section.data);

  return (
    <Panel title="Lifetime stats" eyebrow="Performance dossier">
      {section.status === "rejected" ? (
        <Unavailable message={section.error} />
      ) : stats.length ? (
        <div className="grid border border-[#2b312f] sm:grid-cols-2">
          {stats.slice(0, 12).map(([label, value]) => (
            <div
              key={label}
              className="border-b border-r border-[#2b312f] bg-black/20 p-4 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#858c87]">
                {label}
              </p>
              <p className="mt-2 text-2xl font-black text-[#e6dfd3]">
                {formatValue(value)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Unavailable message="No lifetime stats returned for this player." />
      )}
    </Panel>
  );
};

export default StatsPanel;
