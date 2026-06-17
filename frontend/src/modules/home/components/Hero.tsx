const Hero = () => {
  return (
    <section className="relative isolate min-h-[94svh] overflow-hidden border-b border-[#1d2638] px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <img
        src="/home-hero-esports.jpg"
        alt="PGL CS2 Major Copenhagen 2024 stage"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(5,7,13,0.32)_0%,rgba(5,7,13,0.42)_46%,rgba(5,7,13,0.82)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_24%_58%,rgba(34,245,255,0.16)_0%,transparent_38%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-20 h-2/3 bg-[linear-gradient(0deg,#05070d_0%,rgba(5,7,13,0.82)_38%,rgba(5,7,13,0.24)_76%,transparent_100%)]" />
      <div className="absolute left-0 top-[18vh] -z-10 h-[15vw] min-h-24 w-[70vw] max-w-5xl bg-[#dfff22]/80 mix-blend-soft-light [clip-path:polygon(0_0,100%_0,94%_100%,0_100%)]" />
      <div className="absolute left-0 top-[18vh] -z-10 h-px w-[70vw] max-w-5xl bg-[#dfff22]/70" />

      <div className="mx-auto flex min-h-[calc(94svh-7.5rem)] max-w-7xl flex-col justify-end">
        <div className="pb-4 sm:pb-8">
          <div className="mb-5 flex max-w-3xl items-center gap-3">
            <span className="h-3 w-14 bg-[#f3ff2d]" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#dfff22]">
              FACEIT / Steam intelligence console
            </p>
          </div>

          <h1 className="max-w-5xl text-[clamp(4.25rem,12vw,11rem)] font-black uppercase leading-[0.78] tracking-normal text-white mix-blend-difference">
            Read the lobby.
          </h1>

          <p className="mt-8 max-w-2xl text-base font-semibold leading-7 text-[#d8e0ef] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-lg">
            Search public FACEIT profiles, inspect Steam-linked identity,
            pressure-test recent form, and build a sharper read on strengths,
            weaknesses, maps, and match patterns.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
