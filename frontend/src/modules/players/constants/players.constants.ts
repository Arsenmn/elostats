export const regions = ["EU", "NA", "SA", "SEA", "OCE"] as const;
export const seasonFilters = [
  { label: "Current", value: "current", disabled: false },
  { label: "Season 8", value: "season-8", disabled: true },
  { label: "Season 7", value: "season-7", disabled: true },
];
export const sortOptions = [
  { label: "Rank", value: "rank", disabled: false },
  { label: "FACEIT ELO", value: "faceit_elo", disabled: false },
  { label: "Skill level", value: "skill_level", disabled: false },
  { label: "K/D", value: "kd", disabled: true },
  { label: "Avg", value: "avg", disabled: true },
] as const;
export const levelFilters = [
  { label: "All levels", value: "all" },
  { label: "Level 10", value: "10" },
  { label: "Level 9+", value: "9" },
  { label: "Level 8+", value: "8" },
] as const;
export const eloFilters = [
  { label: "Any ELO", value: "all" },
  { label: "2000+", value: "2000" },
  { label: "2500+", value: "2500" },
  { label: "3000+", value: "3000" },
] as const;
