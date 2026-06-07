import { playerProfileSectionLabels } from "../lib/playerProfile.constants";
import type { FaceitPlayerProfile } from "../../../types/faceit.interface";

interface RawDataPanelProps {
  profile: FaceitPlayerProfile;
}

const RawDataPanel = ({ profile }: RawDataPanelProps) => {
  return (
    <section className="mt-6 border border-[#29324a] bg-[#0c101a] p-6">
      <h2 className="text-xl font-bold">Raw FACEIT payloads</h2>
      <p className="mt-2 text-sm text-[#aab7cf]">
        Full server-returned profile data is available here for fields not yet
        promoted into the UI.
      </p>

      <div className="mt-5 space-y-3">
        <RawDetails title="Player" data={profile.player} />
        {Object.entries(profile.sections).map(([key, section]) => (
          <RawDetails
            key={key}
            title={
              playerProfileSectionLabels[
                key as keyof typeof playerProfileSectionLabels
              ]
            }
            data={section.data ?? { error: section.error }}
          />
        ))}
      </div>
    </section>
  );
};

function RawDetails({ title, data }: { title: string; data: unknown }) {
  return (
    <details className="border border-[#20283c] bg-black/20 p-4">
      <summary className="cursor-pointer font-semibold text-[#ff3df2]">
        {title}
      </summary>
      <pre className="mt-4 max-h-96 overflow-auto text-xs text-[#aab7cf]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

export default RawDataPanel;
