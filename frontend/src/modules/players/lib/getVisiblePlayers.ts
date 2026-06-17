import type { FaceitRankingPlayer } from "@/types/faceit";

export function getVisiblePlayers({
  players,
  minLevel,
  minElo,
  sortBy,
}: {
  players: FaceitRankingPlayer[];
  minLevel: string;
  minElo: string;
  sortBy: string;
}) {
  const levelFloor = minLevel === "all" ? null : Number(minLevel);
  const eloFloor = minElo === "all" ? null : Number(minElo);

  return players
    .filter((player) => {
      const matchesLevel =
        levelFloor === null || (player.game_skill_level ?? 0) >= levelFloor;

      const matchesElo =
        eloFloor === null || (player.faceit_elo ?? 0) >= eloFloor;

      return matchesLevel && matchesElo;
    })
    .toSorted((a, b) => {
      if (sortBy === "faceit_elo") {
        return (b.faceit_elo ?? 0) - (a.faceit_elo ?? 0);
      }

      if (sortBy === "skill_level") {
        return (b.game_skill_level ?? 0) - (a.game_skill_level ?? 0);
      }

      return (
        (a.position ?? Number.MAX_SAFE_INTEGER) -
        (b.position ?? Number.MAX_SAFE_INTEGER)
      );
    });
}
