import { ShieldAlert } from "lucide-react";
import Panel from "./Panel";
import Unavailable from "./Unavailable";
import { getItems } from "../lib/playerProfile.utils";
import type { FaceitProfileSection } from "../../../types/faceit.interface";

interface SectionStatusPanelProps {
  title: string;
  section: FaceitProfileSection;
}

const SectionStatusPanel = ({ title, section }: SectionStatusPanelProps) => {
  const items = getItems(section.data);

  return (
    <Panel title={title} icon={<ShieldAlert className="h-4 w-4" />}>
      {section.status === "rejected" ? (
        <Unavailable message={section.error} />
      ) : items.length ? (
        <pre className="max-h-80 overflow-auto border border-[#2b312f] bg-black/20 p-4 text-xs text-[#a9afa9]">
          {JSON.stringify(section.data, null, 2)}
        </pre>
      ) : (
        <p className="text-sm text-[#a9afa9]">No records returned.</p>
      )}
    </Panel>
  );
};

export default SectionStatusPanel;
