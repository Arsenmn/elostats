import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type {
  AiAnalysisPlayerSnapshot,
  AiAnalysisSection,
} from "../../../types/ai-analysis.interface";

interface AnalysisResultProps {
  dataLimitations: string[];
  generatedAt: string;
  player?: AiAnalysisPlayerSnapshot;
  sections: AiAnalysisSection[];
}

const AnalysisResult = ({
  dataLimitations,
  generatedAt,
  player,
  sections,
}: AnalysisResultProps) => {
  return (
    <section className="mt-8 overflow-hidden border border-[#29324a] bg-[#0c101a] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]">
      <div className="border-b border-[#20283c] bg-[#111827] p-5 sm:p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#22f5ff]">
          AI report
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase leading-none text-[#f4f7ff]">
              {player?.nickname ?? "Comparison result"}
            </h2>
            {player && (
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
                {[player.region, player.skillLevel ? `Level ${player.skillLevel}` : null, player.faceitElo ? `${player.faceitElo} ELO` : null]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
            )}
          </div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#64748b]">
            {new Date(generatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid gap-px bg-[#20283c] md:grid-cols-2">
        {sections.map((section) => (
          <article key={section.title} className="bg-[#0c101a] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#dfff22]" />
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#f4f7ff]">
                {section.title}
              </h3>
            </div>
            {section.summary && (
              <p className="text-sm leading-6 text-[#aab7cf]">
                {section.summary}
              </p>
            )}
            {section.bullets.length > 0 && (
              <ul className="mt-4 space-y-3">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="border-l-2 border-[#22f5ff]/70 pl-3 text-sm leading-6 text-[#dbe7ff]"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      {dataLimitations.length > 0 && (
        <div className="border-t border-[#20283c] bg-[#080c15] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[#ffb020]">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-[11px] font-black uppercase tracking-[0.18em]">
              Data limitations
            </p>
          </div>
          <ul className="mt-3 grid gap-2 text-sm text-[#aab7cf] md:grid-cols-2">
            {dataLimitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default AnalysisResult;
