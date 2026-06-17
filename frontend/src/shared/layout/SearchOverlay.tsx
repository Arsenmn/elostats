import { X } from "lucide-react";
import PlayerSearchCombobox from "@/modules/player-search/components/PlayerSearchCombobox";

interface SearchOverlayProps {
  onClose: () => void;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close search"
        className="fixed inset-0 z-40 cursor-default bg-[#05070d]/18 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dfff22]/50 bg-[#05070d]/92 px-4 py-3 shadow-[0_-24px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-start gap-3">
          <PlayerSearchCombobox
            autoFocus
            className="relative flex min-w-0 flex-1 flex-col gap-3 sm:flex-row"
            dropdownPlacement="top"
            inputContainerClassName="relative min-w-0 flex-1"
            onNavigate={onClose}
          />

          <button
            type="button"
            aria-label="Close search"
            className="flex h-14 w-14 shrink-0 items-center justify-center text-[#f4f7ff] transition-colors hover:text-[#dfff22] focus:outline-none focus:ring-2 focus:ring-[#dfff22]/45"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
