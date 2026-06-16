import { useMemo, useState } from "react";
import Unavailable from "./Unavailable";
import { formatValue, getStats, isRecord } from "../lib/playerProfile.utils";
import type { FaceitProfileSection } from "../../../types/faceit.interface";

interface StatsPanelProps {
  section: FaceitProfileSection;
}

type StatTab = {
  id: string;
  label: string;
  title: string;
  personalKeys: string[];
  averageKeys: string[];
  benchmark: number;
  benchmarkLabel: string;
  maxValue: number;
  unit?: string;
  description: string;
  supportingKeys: string[];
};

const focusedTabs: StatTab[] = [
  {
    id: "kd",
    label: "K/D",
    title: "Average K/D ratio",
    personalKeys: ["Average K/D Ratio", "K/D Ratio"],
    averageKeys: [],
    benchmark: 1,
    benchmarkLabel: "Average FACEIT K/D",
    maxValue: 10,
    description:
      "Core fighting efficiency across the player's full available FACEIT sample.",
    supportingKeys: ["Average K/R Ratio", "K/R Ratio", "Matches", "Wins"],
  },
  {
    id: "headshots",
    label: "HS%",
    title: "Average headshot rate",
    personalKeys: ["Average Headshots %", "Headshots %"],
    averageKeys: [],
    benchmark: 45,
    benchmarkLabel: "Average FACEIT HS%",
    maxValue: 100,
    unit: "%",
    description:
      "How often kills are finished with headshots, useful for aim profile and precision trends.",
    supportingKeys: ["Average Kills", "Kills", "Average K/D Ratio", "ADR"],
  },
  {
    id: "adr",
    label: "ADR",
    title: "Average damage per round",
    personalKeys: ["ADR"],
    averageKeys: [],
    benchmark: 75,
    benchmarkLabel: "Average FACEIT ADR",
    maxValue: 200,
    description:
      "Round-by-round damage pressure. This often tells more than kills alone.",
    supportingKeys: [
      "Average Kills",
      "Average K/R Ratio",
      "Utility Damage per Round",
      "Matches",
    ],
  },
  {
    id: "entry",
    label: "Entry",
    title: "Entry impact",
    personalKeys: ["Entry Rate"],
    averageKeys: [],
    benchmark: 16,
    benchmarkLabel: "Average FACEIT entry rate",
    maxValue: 100,
    unit: "%",
    description:
      "Opening-duel involvement and conversion, showing how often the player creates first-contact impact.",
    supportingKeys: [
      "Entry Success Rate",
      "Total Entry Wins",
      "Total Entry Count",
      "Matches",
    ],
  },
  {
    id: "flash",
    label: "Flash",
    title: "Flash success rate",
    personalKeys: ["Flash Success Rate"],
    averageKeys: [],
    benchmark: 52,
    benchmarkLabel: "Average FACEIT flash success",
    maxValue: 100,
    unit: "%",
    description:
      "Utility quality indicator for how often flash usage produces successful pressure.",
    supportingKeys: [
      "Enemies Flashed per Round",
      "Flashes per Round",
      "Utility Usage per Round",
      "Utility Damage per Round",
    ],
  },
  {
    id: "utility",
    label: "Utility",
    title: "Utility output",
    personalKeys: ["Utility Damage per Round"],
    averageKeys: [],
    benchmark: 4.5,
    benchmarkLabel: "Average utility damage per round",
    maxValue: 100,
    description: "Grenade and support contribution outside pure aim duels.",
    supportingKeys: [
      "Flash Success Rate",
      "Enemies Flashed per Round",
      "Flashes per Round",
      "ADR",
    ],
  },
  {
    id: "winrate",
    label: "Win%",
    title: "Win rate",
    personalKeys: ["Win Rate %", "Win Rate"],
    averageKeys: [],
    benchmark: 50,
    benchmarkLabel: "Average FACEIT win rate",
    maxValue: 100,
    unit: "%",
    description:
      "Long-term result signal. Best read together with volume and competition context.",
    supportingKeys: [
      "Matches",
      "Wins",
      "Longest Win Streak",
      "Current Win Streak",
    ],
  },
];

const rawStatsTabId = "all";

const StatsPanel = ({ section }: StatsPanelProps) => {
  const stats = getStats(section.data);
  const lifetime = getLifetimeStats(section.data);
  const availableTabs = useMemo(
    () =>
      focusedTabs.filter((tab) =>
        Boolean(findStatValue(lifetime, tab.personalKeys, tab.maxValue)),
      ),
    [lifetime],
  );
  const [activeTab, setActiveTab] = useState(
    availableTabs[0]?.id ?? rawStatsTabId,
  );

  const visibleTab =
    availableTabs.find((tab) => tab.id === activeTab) ??
    (activeTab === rawStatsTabId ? null : availableTabs[0]);
  const visibleTabId = visibleTab?.id ?? rawStatsTabId;

  return (
    <section className="relative isolate overflow-hidden border-y border-[#20283c] bg-[#090d16] px-4 py-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-[#22f5ff] to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_10%_8%,rgba(34,245,255,0.2),transparent_36%),radial-gradient(circle_at_88%_86%,rgba(223,255,34,0.12),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.035)_0,transparent_36%,rgba(255,255,255,0.02)_100%)]" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#22f5ff]">
              Performance dossier
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-none text-[#f4f7ff] sm:text-4xl">
              Lifetime stats
            </h2>
          </div>
          {stats.length > 0 && (
            <p className="max-w-xl text-sm font-medium leading-6 text-[#94a3b8] lg:text-right">
              Pick one signal and compare the player against the available
              FACEIT average. Raw values are still available in the final tab.
            </p>
          )}
        </div>

        {section.status === "rejected" ? (
          <Unavailable message={section.error} />
        ) : stats.length ? (
          <div>
            <div
              className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8"
              role="tablist"
              aria-label="Lifetime stat views"
            >
              {availableTabs.map((tab, index) => (
                <StatTabButton
                  key={tab.id}
                  isActive={visibleTabId === tab.id}
                  label={tab.label}
                  index={index + 1}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
              <StatTabButton
                isActive={visibleTabId === rawStatsTabId}
                label="All stats"
                index={availableTabs.length + 1}
                onClick={() => setActiveTab(rawStatsTabId)}
              />
            </div>

            {visibleTab ? (
              <FocusedStatView tab={visibleTab} lifetime={lifetime} />
            ) : (
              <RawStatsGrid stats={stats} />
            )}
          </div>
        ) : (
          <Unavailable message="No lifetime stats returned for this player." />
        )}
      </div>
    </section>
  );
};

function StatTabButton({
  isActive,
  label,
  index,
  onClick,
}: {
  isActive: boolean;
  label: string;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`group relative min-h-14 overflow-hidden border px-3 py-2 text-left transition [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))] ${
        isActive
          ? "border-[#22f5ff] bg-[#22f5ff] text-[#05070d] shadow-[0_0_28px_rgba(34,245,255,0.22)]"
          : "border-[#20283c] bg-[#070a12]/80 text-[#94a3b8] hover:border-[#22f5ff]/60 hover:bg-[#22f5ff]/10 hover:text-[#f4f7ff]"
      }`}
      onClick={onClick}
    >
      <span
        className={`absolute left-0 top-0 h-full w-1 ${
          isActive ? "bg-[#05070d]" : "bg-[#22f5ff]/50"
        }`}
      />
      <span className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-[0.16em]">
          {label}
        </span>
        <span
          className={`font-mono text-[10px] font-black ${
            isActive ? "text-[#05070d]/70" : "text-[#64748b]"
          }`}
        >
          {String(index).padStart(2, "0")}
        </span>
      </span>
      <span
        className={`mt-3 block h-px transition ${
          isActive ? "bg-[#05070d]/45" : "bg-[#20283c] group-hover:bg-[#22f5ff]/50"
        }`}
      />
    </button>
  );
}

function FocusedStatView({
  tab,
  lifetime,
}: {
  tab: StatTab;
  lifetime: Record<string, unknown>;
}) {
  const personal = findStatValue(lifetime, tab.personalKeys, tab.maxValue);
  const average = findStatValue(lifetime, tab.averageKeys, tab.maxValue);
  const averageValue = average ? parseStatNumber(average.value) : tab.benchmark;
  const personalValue = parseStatNumber(personal?.value);
  const comparison =
    typeof personalValue === "number" && typeof averageValue === "number"
      ? getComparison(personalValue, averageValue)
      : null;
  const supportingStats = tab.supportingKeys
    .map((key) => [key, findStatValue(lifetime, [key])] as const)
    .filter(([, result]) => Boolean(result));
  const personalDisplay = personal
    ? formatFocusedValue(personal.value, tab.unit)
    : "N/A";
  const averageDisplay = formatFocusedValue(
    average?.value ?? tab.benchmark,
    tab.unit,
  );

  return (
    <div className="relative overflow-hidden border border-[#20283c] bg-[#060912]/88 [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#22f5ff] via-[#dfff22] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(34,245,255,0.08),transparent_34%,rgba(223,255,34,0.05))]" />

      <div className="relative grid min-h-[440px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-7 lg:p-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#22f5ff]">
              {tab.title}
            </p>
            <p className="mt-4 text-base font-medium leading-7 text-[#aab7cf] sm:text-lg sm:leading-8">
              {tab.description}
            </p>
          </div>

          <div className="mt-10">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
                  Player
                </p>
                <p
                  className={`mt-2 break-words font-mono text-[4.75rem] font-black uppercase leading-[0.86] tracking-normal sm:text-[7rem] lg:text-[8.5rem] ${comparison?.textClass ?? "text-[#22f5ff]"}`}
                >
                  {personalDisplay}
                </p>
              </div>

              <div className="mb-2 min-w-44 border-l border-[#20283c] pl-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
                  Average
                </p>
                <p className="mt-2 font-mono text-4xl font-black text-[#f4f7ff]">
                  {averageDisplay}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748b]">
                  {average?.label ?? tab.benchmarkLabel}
                </p>
              </div>
            </div>

            {comparison && (
              <div className="mt-7 max-w-3xl">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#94a3b8]">
                    {comparison.label}
                  </span>
                  <span
                    className={`font-mono text-base font-black ${comparison.textClass}`}
                  >
                    {formatDelta(comparison.delta, tab.unit)}
                  </span>
                </div>
                <div className="relative h-2 bg-[#111827]">
                  <div className="absolute left-1/2 top-[-4px] h-4 w-px bg-[#94a3b8]/50" />
                  <div
                    className={`h-full ${comparison.barClass}`}
                    style={{ width: `${comparison.width}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="border-t border-[#20283c] bg-[#080c15]/78 p-5 sm:p-6 xl:border-l xl:border-t-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#dfff22]">
            Related signals
          </p>

          {supportingStats.length ? (
            <div className="mt-5 space-y-3">
              {supportingStats.map(([fallbackLabel, result]) => (
                <div
                  key={result?.label ?? fallbackLabel}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-[#20283c] pb-3 last:border-b-0"
                >
                  <p className="min-w-0 text-[11px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                    {result?.label ?? fallbackLabel}
                  </p>
                  <p className="font-mono text-2xl font-black text-[#f4f7ff]">
                    {formatValue(result?.value)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <Unavailable message="No supporting metrics returned for this stat." />
            </div>
          )}

          {personal && (
            <p className="mt-6 font-mono text-[10px] font-black uppercase leading-5 tracking-[0.16em] text-[#64748b]">
              Source: {personal.label}
              {average ? ` / ${average.label}` : " / estimated baseline"}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function RawStatsGrid({ stats }: { stats: Array<[string, unknown]> }) {
  return (
    <div className="overflow-hidden border border-[#20283c] bg-[#060912]/88">
      {stats.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[#20283c] py-4 last:border-b-0"
        >
          <p className="min-w-0 text-[11px] font-black uppercase tracking-[0.16em] text-[#94a3b8]">
            {label}
          </p>
          <p className="font-mono text-xl font-black text-[#f4f7ff] sm:text-2xl">
            {formatValue(value)}
          </p>
        </div>
      ))}
    </div>
  );
}

function getLifetimeStats(data: unknown) {
  if (!isRecord(data)) return {};

  return isRecord(data.lifetime) ? data.lifetime : data;
}

function findStatValue(
  data: Record<string, unknown>,
  keys: string[],
  maxValue?: number,
) {
  const entries = Object.entries(data);

  for (const key of keys) {
    const normalizedKey = normalizeStatKey(key);
    const entry = entries.find(
      ([label]) => normalizeStatKey(label) === normalizedKey,
    );

    if (entry && isPlausibleStatValue(entry[1], maxValue)) {
      return { label: entry[0], value: entry[1] };
    }
  }

  return null;
}

function normalizeStatKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function formatFocusedValue(value: unknown, unit?: string) {
  const formatted = formatValue(value);

  if (!unit || formatted === "N/A" || formatted.includes(unit)) {
    return formatted;
  }

  return `${formatted}${unit}`;
}

type ComparisonTone = "danger" | "warning" | "neutral" | "positive";

function parseStatNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value !== "string") return null;

  const parsed = Number(value.replace("%", "").replace(",", "."));

  return Number.isFinite(parsed) ? parsed : null;
}

function isPlausibleStatValue(value: unknown, maxValue?: number) {
  if (maxValue === undefined) return true;

  const parsed = parseStatNumber(value);

  return typeof parsed === "number" && parsed >= 0 && parsed <= maxValue;
}

function getComparison(personal: number, average: number) {
  const delta = personal - average;
  const ratio = average === 0 ? 0 : delta / average;
  const absRatio = Math.abs(ratio);
  let tone: ComparisonTone = "neutral";
  let label = "Around average";

  if (ratio < -0.1) {
    tone = "danger";
    label = "Below average";
  } else if (ratio < 0) {
    tone = "warning";
    label = "Slightly below average";
  } else if (ratio > 0.1) {
    tone = "positive";
    label = "Above average";
  }

  return {
    delta,
    label,
    tone,
    textClass: getToneStyles(tone).text,
    barClass: getToneStyles(tone).bar,
    width: Math.min(100, Math.max(8, 50 + absRatio * 160)),
  };
}

function getToneStyles(tone: ComparisonTone | "average") {
  if (tone === "danger") {
    return {
      frame: "border-[#fb3a5d]/50 bg-[#fb3a5d]/10",
      text: "text-[#fb3a5d]",
      bar: "bg-[#fb3a5d]",
    };
  }

  if (tone === "warning") {
    return {
      frame: "border-[#ffb020]/50 bg-[#ffb020]/10",
      text: "text-[#ffb020]",
      bar: "bg-[#ffb020]",
    };
  }

  if (tone === "positive") {
    return {
      frame: "border-[#dfff22]/50 bg-[#dfff22]/10",
      text: "text-[#dfff22]",
      bar: "bg-[#dfff22]",
    };
  }

  if (tone === "average") {
    return {
      frame: "border-[#20283c] bg-black/20",
      text: "text-[#94a3b8]",
      bar: "bg-[#94a3b8]",
    };
  }

  return {
    frame: "border-[#22f5ff]/50 bg-[#22f5ff]/10",
    text: "text-[#22f5ff]",
    bar: "bg-[#22f5ff]",
  };
}

function formatDelta(delta: number, unit?: string) {
  const sign = delta > 0 ? "+" : "";
  const rounded = Number.isInteger(delta) ? delta : Number(delta.toFixed(2));

  return `${sign}${rounded}${unit ?? ""}`;
}

export default StatsPanel;
