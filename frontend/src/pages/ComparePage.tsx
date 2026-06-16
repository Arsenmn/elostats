import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GitCompareArrows } from "lucide-react";
import { aiAnalysisApi } from "../api/aiAnalysis.api";
import AnalysisResult from "../modules/ai-analysis/components/AnalysisResult";
import PlayerCompareForm from "../modules/player-compare/components/PlayerCompareForm";
import Loader from "../shared/ui/Loader";
import type { FaceitSearchPlayer } from "../types/faceit.interface";

const ComparePage = () => {
  const [playerA, setPlayerA] = useState<FaceitSearchPlayer | null>(null);
  const [playerB, setPlayerB] = useState<FaceitSearchPlayer | null>(null);

  const comparisonMutation = useMutation({
    mutationFn: ({
      playerANickname,
      playerBNickname,
    }: {
      playerANickname: string;
      playerBNickname: string;
    }) =>
      aiAnalysisApi.comparePlayers({
        playerANickname,
        playerBNickname,
        game: "cs2",
      }),
  });

  const handleGenerate = () => {
    const playerANickname = playerA?.nickname?.trim();
    const playerBNickname = playerB?.nickname?.trim();

    if (!playerANickname || !playerBNickname) return;

    comparisonMutation.mutate({ playerANickname, playerBNickname });
  };

  return (
    <main className="min-h-screen bg-[#05070d] bg-[linear-gradient(rgba(244,247,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] px-4 pb-24 pt-24 text-[#f4f7ff] sm:px-6 sm:pt-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden border border-[#29324a] bg-[#0c101a] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.42)] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,24px_100%,0_calc(100%-24px))] sm:p-8">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[#dfff22] opacity-80 [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
          <div className="relative max-w-4xl">
            <p className="inline-flex items-center gap-2 border border-[#22f5ff] bg-[#22f5ff] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#05070d]">
              <GitCompareArrows className="h-4 w-4" />
              AI player comparison
            </p>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.86] sm:text-7xl">
              Compare two CS2 profiles
            </h1>
            <p className="mt-5 max-w-2xl border-l-4 border-[#ff3d67] pl-5 text-sm leading-6 text-[#aab7cf] sm:text-base">
              Select exactly two FACEIT players and generate a structured
              comparison across aim, duels, playstyle, utility, trends, and
              practical team value.
            </p>
          </div>
        </section>

        <PlayerCompareForm
          isLoading={comparisonMutation.isPending}
          playerA={playerA}
          playerB={playerB}
          onGenerate={handleGenerate}
          onSelectPlayerA={(player) => {
            setPlayerA(player);
            comparisonMutation.reset();
          }}
          onSelectPlayerB={(player) => {
            setPlayerB(player);
            comparisonMutation.reset();
          }}
        />

        {comparisonMutation.isPending && (
          <div className="mt-8 flex min-h-72 items-center justify-center border border-[#29324a] bg-[#0c101a]/84">
            <Loader />
          </div>
        )}

        {comparisonMutation.isError && (
          <ErrorPanel
            message={
              comparisonMutation.error instanceof Error
                ? comparisonMutation.error.message
                : "Could not generate player comparison."
            }
          />
        )}

        {comparisonMutation.data && (
          <AnalysisResult
            dataLimitations={comparisonMutation.data.dataLimitations}
            generatedAt={comparisonMutation.data.generatedAt}
            sections={comparisonMutation.data.sections}
          />
        )}
      </div>
    </main>
  );
};

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="mt-8 border border-[#ff3d67]/50 bg-[#ff3d67]/10 p-5 text-sm font-bold text-[#ff8aa1]">
      {message}
    </div>
  );
}

export default ComparePage;
