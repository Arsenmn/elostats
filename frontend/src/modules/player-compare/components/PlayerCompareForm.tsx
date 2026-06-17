import { GitCompareArrows } from "lucide-react";
import PlayerSearchCombobox from "../../player-search/components/PlayerSearchCombobox";
import type { FaceitSearchPlayer } from "../../../types/faceit";

interface PlayerCompareFormProps {
  isLoading: boolean;
  playerA: FaceitSearchPlayer | null;
  playerB: FaceitSearchPlayer | null;
  onGenerate: () => void;
  onSelectPlayerA: (player: FaceitSearchPlayer) => void;
  onSelectPlayerB: (player: FaceitSearchPlayer) => void;
}

const PlayerCompareForm = ({
  isLoading,
  playerA,
  playerB,
  onGenerate,
  onSelectPlayerA,
  onSelectPlayerB,
}: PlayerCompareFormProps) => {
  const canGenerate =
    Boolean(playerA?.nickname) &&
    Boolean(playerB?.nickname) &&
    playerA?.nickname?.toLowerCase() !== playerB?.nickname?.toLowerCase();

  return (
    <section className="mt-8 border border-[#29324a] bg-[#0c101a]/94 p-5 sm:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end">
        <PlayerSlot
          label="Player A"
          selectedNickname={playerA?.nickname}
          onSelectPlayer={onSelectPlayerA}
        />
        <PlayerSlot
          label="Player B"
          selectedNickname={playerB?.nickname}
          onSelectPlayer={onSelectPlayerB}
        />

        <button
          type="button"
          disabled={!canGenerate || isLoading}
          className="inline-flex h-14 items-center justify-center gap-2 border border-[#dfff22] bg-[#dfff22] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#05070d] transition hover:bg-[#22f5ff] disabled:cursor-not-allowed disabled:border-[#29324a] disabled:bg-[#29324a] disabled:text-[#64748b]"
          onClick={onGenerate}
        >
          <GitCompareArrows className="h-4 w-4" />
          {isLoading ? "Generating..." : "Compare players"}
        </button>
      </div>
    </section>
  );
};

function PlayerSlot({
  label,
  selectedNickname,
  onSelectPlayer,
}: {
  label: string;
  selectedNickname?: string;
  onSelectPlayer: (player: FaceitSearchPlayer) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#22f5ff]">
        {label}
      </p>
      <PlayerSearchCombobox
        className="relative mt-3 flex flex-col gap-3 sm:flex-row"
        inputContainerClassName="relative w-full"
        onSelectPlayer={onSelectPlayer}
        submitLabel="Select"
      />
      {selectedNickname && (
        <p className="mt-3 text-sm font-bold text-[#dbe7ff]">
          Selected: <span className="text-[#dfff22]">{selectedNickname}</span>
        </p>
      )}
    </div>
  );
}

export default PlayerCompareForm;
