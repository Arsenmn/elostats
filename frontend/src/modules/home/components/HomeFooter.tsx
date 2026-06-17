import { ArrowUp, ExternalLink } from "lucide-react";

const socialLinks = [
  "Discord",
  "Twitch",
  "Community",
  "YouTube",
  "X",
  "Steam group",
];

const utilityLinks = ["Help", "Legal", "Terms of use", "Status", "Press"];

const HomeFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative isolate overflow-hidden border-t border-[#29324a] bg-[#05070d] pb-20 text-[#f4f7ff] sm:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(223,255,34,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl border-x border-[#29324a] bg-[#05070d]/88 md:grid-cols-[minmax(230px,0.9fr)_minmax(280px,1.1fr)_minmax(180px,0.7fr)_minmax(260px,0.95fr)]">
        <section className="relative flex min-h-72 flex-col justify-end overflow-hidden border-b border-[#29324a] p-5 md:border-b-0 md:border-r md:p-7">
          <div className="absolute left-[-0.08em] top-1/2 -translate-y-1/2 text-[4.2rem] font-black uppercase leading-none tracking-normal text-white md:text-[5.6rem]">
            Elo
            <br />
            Stats
          </div>
          <div className="relative z-10 mt-28 font-mono text-[11px] uppercase leading-5 tracking-[0.14em] text-[#8a94aa] md:mt-0">
            FACEIT / Steam analytics
            <br />
            Public profile intelligence
          </div>
        </section>

        <section className="border-b border-[#29324a] md:border-b-0 md:border-r">
          <div className="grid grid-cols-[96px_1fr] border-b border-[#dfff22] font-mono text-xs font-black uppercase tracking-[0.16em] text-[#dfff22]">
            <div className="border-r border-[#dfff22] px-4 py-4">(10)</div>
            <div className="px-5 py-4">Social media</div>
          </div>

          <nav className="space-y-3 px-5 py-6 md:px-7">
            {socialLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="flex w-fit items-center gap-3 font-mono text-sm uppercase tracking-[0.08em] text-[#dfff22] no-underline transition hover:text-[#22f5ff]"
              >
                <span className="text-[#f4f7ff]">[↗]</span>
                <span>{item}</span>
              </a>
            ))}
          </nav>
        </section>

        <section className="relative min-h-48 overflow-hidden border-b border-[#29324a] md:border-b-0 md:border-r">
          <div className="absolute inset-y-0 left-1/2 w-28 -translate-x-1/2 bg-[repeating-linear-gradient(135deg,#dfff22_0_22px,#000_22px_44px)]" />
          <div className="absolute inset-x-0 bottom-0 border-t border-[#29324a] bg-[#05070d]/88 px-4 py-4 font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-[#8a94aa]">
            <span className="text-[#dfff22]">Live node</span>
            <br />
            Match form parser ready
          </div>
        </section>

        <section className="border-b border-[#29324a] p-5 md:border-b-0 md:p-7">
          <nav className="border border-[#29324a] bg-[#070a12]/80 px-5 py-5">
            <div className="space-y-3">
              {utilityLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.08em] text-[#d8dce6] no-underline transition hover:text-[#dfff22]"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item}</span>
                </a>
              ))}
            </div>
          </nav>
        </section>

        <section className="border-b border-[#29324a] p-5 md:col-span-2 md:border-r md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex h-20 w-36 items-center justify-center border-2 border-[#f4f7ff] bg-white font-black uppercase leading-none text-black">
              CS2
              <br />
              Rated
            </div>
            <p className="max-w-xl font-mono text-xs uppercase leading-5 tracking-[0.08em] text-[#aab7cf]">
              EloStats is not affiliated with FACEIT, Steam, Valve, or
              tournament operators. Data is used for public player analysis and
              performance review.
            </p>
          </div>
        </section>

        <section className="border-b border-[#29324a] p-5 md:border-r md:p-6">
          <div className="font-mono text-xs uppercase leading-5 tracking-[0.1em] text-[#aab7cf]">
            Provider stack
            <br />
            <span className="text-[#dfff22]">FACEIT API</span> / Steam Web API /
            OpenAI-ready
          </div>
        </section>

        <section className="flex items-end justify-between gap-4 p-5 md:p-6">
          <div className="font-mono text-xs uppercase leading-5 tracking-[0.1em] text-[#8a94aa]">
            © 2026 EloStats
            <br />
            Crafted for CS2 form analysis
          </div>
          <button
            type="button"
            aria-label="Back to top"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#f4f7ff]/45 bg-black text-[#f4f7ff] transition hover:border-[#dfff22] hover:text-[#dfff22] focus:outline-none focus:ring-2 focus:ring-[#dfff22]/50"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </section>
      </div>

      <div className="pointer-events-none absolute bottom-[-0.18em] left-1/2 z-0 -translate-x-1/2 whitespace-nowrap text-[18vw] font-black uppercase leading-none tracking-normal text-white/[0.035]">
        Counter-strike
      </div>
    </footer>
  );
};

export default HomeFooter;
