import { Search, Crown, ChartArea, GitCompareArrows } from "lucide-react";

export const navItems = [
  { id: "search", label: "Search", Icon: Search },
  {
    id: "stats",
    label: "Analysis",
    Icon: ChartArea,
    to: "/analysis",
  },
  {
    id: "compare",
    label: "Compare",
    Icon: GitCompareArrows,
    to: "/compare",
  },
  {
    id: "leaderboards",
    label: "Leaderboards",
    Icon: Crown,
    to: "/players",
  },
];
