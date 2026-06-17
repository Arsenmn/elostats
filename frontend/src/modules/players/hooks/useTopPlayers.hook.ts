import { faceitApi } from "@/api/faceit.api";
import { useQuery } from "@tanstack/react-query";

export function useTopPlayers(region: string) {
  return useQuery({
    queryKey: ["faceit-top-players", region],
    queryFn: () => faceitApi.getTopPlayers({ region, limit: 50 }),
    staleTime: 60_000,
  });
}
