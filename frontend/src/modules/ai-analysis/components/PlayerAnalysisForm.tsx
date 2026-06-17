import { BrainCircuit } from "lucide-react";
import PlayerSearchCombobox from "../../player-search/components/PlayerSearchCombobox";
import type { FaceitSearchPlayer } from "../../../types/faceit";

interface PlayerAnalysisFormProps {
  isLoading: boolean;
  selectedPlayer: FaceitSearchPlayer | null;
  onGenerate: () => void;
  onSelectPlayer: (player: FaceitSearchPlayer) => void;
}

const PlayerAnalysisForm = ({
  isLoading,
  selectedPlayer,
  onGenerate,
  onSelectPlayer,
}: PlayerAnalysisFormProps) => {
  return (
    <section className="mt-8 border border-[#29324a] bg-[#0c101a]/94 p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#22f5ff]">
            Select player
          </p>
          <PlayerSearchCombobox
            className="relative mt-3 flex flex-col gap-3 sm:flex-row"
            inputContainerClassName="relative w-full"
            onSelectPlayer={onSelectPlayer}
            submitLabel="Select"
          />
          {selectedPlayer?.nickname && (
            <p className="mt-3 text-sm font-bold text-[#dbe7ff]">
              Selected:{" "}
              <span className="text-[#dfff22]">{selectedPlayer.nickname}</span>
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={!selectedPlayer?.nickname || isLoading}
          className="inline-flex h-14 items-center justify-center gap-2 border border-[#dfff22] bg-[#dfff22] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#05070d] transition hover:bg-[#22f5ff] disabled:cursor-not-allowed disabled:border-[#29324a] disabled:bg-[#29324a] disabled:text-[#64748b]"
          onClick={onGenerate}
        >
          <BrainCircuit className="h-4 w-4" />
          {isLoading ? "Generating..." : "Generate analysis"}
        </button>
      </div>
    </section>
  );
};

export default PlayerAnalysisForm;
