import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Search, UserRound } from "lucide-react";
import { faceitApi } from "../../../api/faceit.api";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue.hook";
import type {
  FaceitGameInfo,
  FaceitSearchPlayer,
} from "../../../types/faceit.interface";

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 250;

const PlayerSearchCombobox = () => {
  const [nickname, setNickname] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const debouncedNickname = useDebouncedValue(nickname.trim(), SEARCH_DEBOUNCE_MS);

  const { data, isFetching, error } = useQuery({
    queryKey: ["faceit-player-search", debouncedNickname],
    queryFn: () => faceitApi.searchPlayers(debouncedNickname),
    enabled: debouncedNickname.length >= MIN_SEARCH_LENGTH,
    staleTime: 30_000,
  });

  const suggestions = useMemo(
    () => (data?.items ?? []).filter((player) => player.nickname),
    [data?.items],
  );

  const shouldShowDropdown =
    isOpen && nickname.trim().length >= MIN_SEARCH_LENGTH;

  const navigateToPlayer = (selectedNickname: string) => {
    const trimmedNickname = selectedNickname.trim();
    if (!trimmedNickname) return;

    setIsOpen(false);
    navigate(`/players/${encodeURIComponent(trimmedNickname)}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const activeSuggestion = suggestions[activeIndex];
    if (activeSuggestion?.nickname) {
      navigateToPlayer(activeSuggestion.nickname);
      return;
    }

    navigateToPlayer(nickname);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  return (
    <form
      className="relative mt-10 flex flex-col gap-4 sm:flex-row"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="text"
          placeholder="Enter FACEIT nickname"
          value={nickname}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (!shouldShowDropdown || !suggestions.length) return;

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((currentIndex) =>
                currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1,
              );
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((currentIndex) =>
                currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
              );
            }

            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          className="w-full border border-[#29324a] bg-[#0c101a]/92 py-4 pl-11 pr-5 text-[#f4f7ff] outline-none transition placeholder:text-[#94a3b8] focus:border-[#22f5ff]"
        />

        {shouldShowDropdown && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden border border-[#29324a] bg-[#0c101a] shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
            {isFetching ? (
              <DropdownMessage message="Searching FACEIT players..." />
            ) : error ? (
              <DropdownMessage message="Could not load suggestions." />
            ) : suggestions.length ? (
              <ul className="max-h-80 overflow-auto p-1">
                {suggestions.map((player, index) => (
                  <PlayerSuggestion
                    key={player.player_id ?? player.nickname}
                    isActive={index === activeIndex}
                    player={player}
                    onMouseEnter={() => setActiveIndex(index)}
                    onSelect={() => navigateToPlayer(player.nickname ?? "")}
                  />
                ))}
              </ul>
            ) : (
              <DropdownMessage message="No matching players found." />
            )}
          </div>
        )}
      </div>

      <button
        className="bg-[#22f5ff] px-6 py-4 font-black uppercase text-[#05070d] transition hover:bg-[#ff3df2]"
        type="submit"
      >
        Analyze Player
      </button>
    </form>
  );
};

interface PlayerSuggestionProps {
  player: FaceitSearchPlayer;
  isActive: boolean;
  onMouseEnter: () => void;
  onSelect: () => void;
}

const PlayerSuggestion = ({
  player,
  isActive,
  onMouseEnter,
  onSelect,
}: PlayerSuggestionProps) => {
  const cs2 = player.games?.cs2;

  return (
    <li>
      <button
        type="button"
        className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${
          isActive ? "bg-[#22f5ff]/14" : "hover:bg-[#22f5ff]/10"
        }`}
        onMouseDown={(event) => event.preventDefault()}
        onMouseEnter={onMouseEnter}
        onClick={onSelect}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-[#29324a] bg-[#05070d]">
          {player.avatar ? (
            <img
              src={player.avatar}
              alt={`${player.nickname ?? "FACEIT player"} avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="h-4 w-4 text-[#22f5ff]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-[#f4f7ff]">
            {player.nickname}
          </p>
          <p className="mt-0.5 text-xs text-[#94a3b8]">
            {[player.country?.toUpperCase(), formatGameSummary(cs2)]
              .filter(Boolean)
              .join(" / ")}
          </p>
        </div>
      </button>
    </li>
  );
};

function DropdownMessage({ message }: { message: string }) {
  return <p className="px-4 py-3 text-sm text-[#aab7cf]">{message}</p>;
}

function formatGameSummary(game?: FaceitGameInfo) {
  if (!game) return null;

  return [game.region?.toUpperCase(), `LVL ${game.skill_level ?? "?"}`]
    .filter(Boolean)
    .join(" ");
}

export default PlayerSearchCombobox;
