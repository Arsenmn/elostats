import { TextGlitch } from "../ui/text-glitch-effect";

const GlitchStatement = () => {
  return (
    <section className="relative w-full overflow-hidden border-b border-[#1d2638] bg-[#05070d] py-12 text-[#f4f7ff] sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(34,245,255,0.16)_0%,rgba(34,245,255,0.06)_34%,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_at_bottom,rgba(223,255,34,0.14)_0%,rgba(223,255,34,0.045)_36%,transparent_74%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(34,245,255,0.24)_48%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(223,255,34,0.28)_48%,transparent_100%)]" />

      <div className="relative z-10 w-full">
        <div className="w-screen">
          <TextGlitch
            text="FACEIT FORM"
            hoverText="WEAKNESS MAP"
            delay={0}
            className="px-5 text-[clamp(2.75rem,7vw,6.25rem)] uppercase sm:px-8 lg:px-12"
          />
          <TextGlitch
            text="STEAM SIGNAL"
            hoverText="IDENTITY READ"
            delay={0.16}
            className="px-5 text-[clamp(2.75rem,7vw,6.25rem)] uppercase sm:px-8 lg:px-12"
          />
          <TextGlitch
            text="MATCH MEMORY"
            hoverText="AI REPORTS"
            delay={0.32}
            className="px-5 text-[clamp(2.75rem,7vw,6.25rem)] uppercase sm:px-8 lg:px-12"
          />
        </div>
      </div>
    </section>
  );
};

export default GlitchStatement;
