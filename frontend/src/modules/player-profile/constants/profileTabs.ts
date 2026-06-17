export const profileTabs = [
  "Overview",
  "Stats",
  "Matches",
  "Teams",
  "AI Analysis",
  "Comparison",
  "Raw Data",
] as const;

export type ProfileTab = (typeof profileTabs)[number];
