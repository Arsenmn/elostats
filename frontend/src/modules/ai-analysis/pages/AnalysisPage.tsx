import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BrainCircuit } from "lucide-react";
import { aiAnalysisApi } from "../api/aiAnalysis.api";
import AnalysisResult from "../components/AnalysisResult";
import PlayerAnalysisForm from "../components/PlayerAnalysisForm";
import Loader from "@/shared/ui/Loader";
import type { FaceitSearchPlayer } from "@/types/faceit";

const AnalysisPage = () => {
  const [selectedPlayer, setSelectedPlayer] =
    useState<FaceitSearchPlayer | null>(null);

  const analysisMutation = useMutation({
    mutationFn: (nickname: string) =>
      aiAnalysisApi.analyzePlayer({ nickname, game: "cs2" }),
  });

  const handleGenerate = () => {
    const nickname = selectedPlayer?.nickname?.trim();

    if (!nickname) return;

    analysisMutation.mutate(nickname);
  };

  return (
    <main className="min-h-screen bg-[#05070d] bg-[linear-gradient(rgba(244,247,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] px-4 pb-24 pt-24 text-[#f4f7ff] sm:px-6 sm:pt-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden border border-[#29324a] bg-[#0c101a] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.42)] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,24px_100%,0_calc(100%-24px))] sm:p-8">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[#22f5ff] opacity-70 [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
          <div className="relative max-w-4xl">
            <p className="inline-flex items-center gap-2 border border-[#dfff22] bg-[#dfff22] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#05070d]">
              <BrainCircuit className="h-4 w-4" />
              AI player analysis
            </p>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.86] sm:text-7xl">
              Improve from real FACEIT signals
            </h1>
            <p className="mt-5 max-w-2xl border-l-4 border-[#ff3d67] pl-5 text-sm leading-6 text-[#aab7cf] sm:text-base">
              Select one player and generate a structured CS2 improvement
              report from available FACEIT profile, lifetime, map, and match
              history data.
            </p>
          </div>
        </section>

        <PlayerAnalysisForm
          isLoading={analysisMutation.isPending}
          selectedPlayer={selectedPlayer}
          onGenerate={handleGenerate}
          onSelectPlayer={(player) => {
            setSelectedPlayer(player);
            analysisMutation.reset();
          }}
        />

        {analysisMutation.isPending && (
          <div className="mt-8 flex min-h-72 items-center justify-center border border-[#29324a] bg-[#0c101a]/84">
            <Loader />
          </div>
        )}

        {analysisMutation.isError && (
          <ErrorPanel
            message={
              analysisMutation.error instanceof Error
                ? analysisMutation.error.message
                : "Could not generate player analysis."
            }
          />
        )}

        {analysisMutation.data && (
          <AnalysisResult
            dataLimitations={analysisMutation.data.dataLimitations}
            generatedAt={analysisMutation.data.generatedAt}
            player={analysisMutation.data.player}
            sections={analysisMutation.data.sections}
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

export default AnalysisPage;
