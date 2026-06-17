import { faceitApi } from "@/api/faceit.api";
import { useQuery } from "@tanstack/react-query";

export function usePlayerProfile(nickname: string) {
  return useQuery({
    queryKey: ["faceit-profile", nickname],
    queryFn: () => faceitApi.getProfile(nickname),
    enabled: nickname.length > 0,
  });
}
