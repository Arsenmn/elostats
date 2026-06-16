import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "What is EloStats built for?",
    answer:
      "EloStats helps CS2 players inspect public FACEIT and Steam data, read recent form, compare player context, and prepare for deeper AI-assisted analysis.",
  },
  {
    question: "Do I need to connect my own accounts?",
    answer:
      "No. Player search works around public data. Account login is used for saving sessions, dashboard workflows, and future personalized analysis features.",
  },
  {
    question: "Which data providers are involved?",
    answer:
      "The platform is structured around FACEIT and Steam boundaries today, with room for tournament data, comparison pipelines, and OpenAI-generated reports.",
  },
  {
    question: "Is this only a stats viewer?",
    answer:
      "No. The goal is to turn raw match and profile data into readable signals: strengths, weaknesses, role pressure, form shifts, and player comparison context.",
  },
];

const FaqSection = () => {
  return (
    <section className="relative isolate overflow-hidden border-t border-[#29324a] bg-[#05070d] px-4 py-20 text-[#f4f7ff] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(223,255,34,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(0deg,#000_0%,transparent_100%)]" />

      <div className="mx-auto grid max-w-7xl border border-[#29324a] bg-black/34 md:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.28fr)]">
        <div className="relative overflow-hidden border-b border-[#29324a] p-6 md:border-b-0 md:border-r md:p-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#dfff22]">
            (04) FAQ
          </p>
          <h2 className="mt-6 max-w-sm text-4xl font-black uppercase leading-[0.88] tracking-normal text-white sm:text-5xl">
            Before you read the lobby
          </h2>
          <p className="mt-5 max-w-sm text-sm font-semibold leading-6 text-[#aab7cf]">
            Short answers about the product, data boundaries, and where the
            analysis layer is heading.
          </p>
          <div className="absolute bottom-[-0.18em] left-4 text-[6rem] font-black uppercase leading-none tracking-normal text-white/[0.035] md:text-[7rem]">
            FAQ
          </div>
        </div>

        <div className="divide-y divide-[#29324a]">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className="group bg-[#05070d]/72 transition-colors open:bg-[#071017]/88"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left marker:hidden sm:px-7">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="mt-1 font-mono text-xs font-black text-[#dfff22]">
                    0{index + 1}
                  </span>
                  <span className="text-base font-black uppercase leading-6 tracking-normal text-[#f4f7ff] sm:text-lg">
                    {item.question}
                  </span>
                </div>
                <ChevronDown className="h-5 w-5 shrink-0 text-[#22f5ff] transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-6 pl-14 sm:px-7 sm:pl-[4.25rem]">
                <p className="max-w-3xl font-mono text-xs uppercase leading-6 tracking-[0.08em] text-[#aab7cf]">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
