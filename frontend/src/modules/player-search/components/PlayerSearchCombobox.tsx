import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

interface PlayerSearchComboboxProps {
  autoFocus?: boolean;
  className?: string;
  inputContainerClassName?: string;
  onNavigate?: () => void;
}

const PlayerSearchCombobox = ({
  autoFocus = false,
  className = "relative mt-8 flex flex-col gap-3 sm:flex-row",
  inputContainerClassName = "relative w-full sm:max-w-md",
  onNavigate,
}: PlayerSearchComboboxProps) => {
  const [nickname, setNickname] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (!autoFocus) return;

    inputRef.current?.focus();
  }, [autoFocus]);

  const navigateToPlayer = (selectedNickname: string) => {
    const trimmedNickname = selectedNickname.trim();
    if (!trimmedNickname) return;

    setIsOpen(false);
    navigate(`/players/${encodeURIComponent(trimmedNickname)}`);
    onNavigate?.();
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
      className={className}
      onSubmit={handleSubmit}
    >
      <div className={inputContainerClassName}>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f3ff2d]" />
        <input
          ref={inputRef}
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
          className="w-full border border-white/24 bg-[#05070d]/70 py-4 pl-11 pr-5 font-bold text-[#f4f7ff] outline-none backdrop-blur-xl transition placeholder:text-[#b6c0d3] focus:border-[#f3ff2d] focus:bg-[#05070d]/82 focus:ring-2 focus:ring-[#f3ff2d]/30 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)]"
        />

        {shouldShowDropdown && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden border border-white/24 bg-[#05070d]/96 shadow-[0_24px_70px_rgba(0,0,0,0.58)] backdrop-blur-xl [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)]">
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
        className="border border-[#f3ff2d] bg-[#f3ff2d] px-6 py-4 font-black uppercase text-[#05070d] transition hover:border-[#ff3d67] hover:bg-[#ff3d67] focus:outline-none focus:ring-2 focus:ring-[#f3ff2d]/40 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]"
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
          isActive ? "bg-[#f3ff2d]/14" : "hover:bg-[#f3ff2d]/10"
        }`}
        onMouseDown={(event) => event.preventDefault()}
        onMouseEnter={onMouseEnter}
        onClick={onSelect}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-white/18 bg-[#05070d]">
          {player.avatar ? (
            <img
              src={player.avatar}
              alt={`${player.nickname ?? "FACEIT player"} avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="h-4 w-4 text-[#f3ff2d]" />
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
