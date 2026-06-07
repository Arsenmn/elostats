import type { ReactNode } from "react";
import Panel from "./Panel";
import Unavailable from "./Unavailable";
import {
  formatValue,
  getItems,
  getStableKey,
} from "../lib/playerProfile.utils";
import type { FaceitProfileSection } from "../../../types/faceit.interface";

interface CollectionPanelProps {
  title: string;
  icon: ReactNode;
  section: FaceitProfileSection;
}

const CollectionPanel = ({ title, icon, section }: CollectionPanelProps) => {
  const items = getItems(section.data);

  return (
    <Panel title={title} icon={icon} eyebrow="Associations">
      {section.status === "rejected" ? (
        <Unavailable message={section.error} />
      ) : items.length ? (
        <div className="space-y-2">
          {items.slice(0, 5).map((item, index) => (
            <div
              key={getStableKey(item, index)}
              className="border-l-2 border-[#22f5ff] bg-black/25 px-4 py-3"
            >
              <p className="truncate font-bold text-[#f4f7ff]">
                {formatValue(item.name ?? item.nickname ?? item.team_id)}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                {formatValue(item.type ?? item.region ?? item.status)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Unavailable message={`No ${title.toLowerCase()} returned.`} />
      )}
    </Panel>
  );
};

export default CollectionPanel;
