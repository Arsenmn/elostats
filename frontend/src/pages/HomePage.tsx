const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#05070d] text-[#f4f7ff]">
      <section className="relative isolate min-h-screen overflow-hidden px-4 pb-28 pt-10 sm:px-6 lg:px-8">
        <img
          src="/home-hero-esports.jpg"
          alt="PGL CS2 Major Copenhagen 2024 stage"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(5,7,13,0.18)_0%,rgba(5,7,13,0.2)_46%,rgba(5,7,13,0.7)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-20 h-1/2 bg-[linear-gradient(0deg,rgba(5,7,13,0.9)_0%,rgba(5,7,13,0.34)_66%,transparent_100%)]" />
        <div className="absolute left-0 top-[18vh] -z-10 h-[18vw] min-h-28 w-[76vw] max-w-6xl bg-[#dfff22] mix-blend-difference [clip-path:polygon(0_0,100%_0,94%_100%,0_100%)]" />

        <div className="mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-7xl flex-col justify-end">
          <div className="pb-4 sm:pb-8">
            <div className="mb-5 flex max-w-3xl items-center gap-3">
              <span className="h-3 w-14 bg-[#f3ff2d]" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white mix-blend-difference">
                FACEIT / Steam intelligence console
              </p>
            </div>

            <h1 className="max-w-5xl text-[clamp(4.5rem,13vw,12rem)] font-black uppercase leading-[0.76] tracking-normal text-white mix-blend-difference">
              Read the lobby.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-[#e7edf8] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-lg">
              Search public FACEIT profiles, inspect Steam-linked identity,
              pressure-test recent form, and build a sharper read on strengths,
              weaknesses, maps, and match patterns.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
