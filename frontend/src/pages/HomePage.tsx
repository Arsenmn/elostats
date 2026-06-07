import PlayerSearchCombobox from "../modules/player-search/components/PlayerSearchCombobox";

const featureStats = [
  ["ELO", "Tracking"],
  ["Maps", "Breakdown"],
  ["Form", "Analysis"],
];

const previewStats = [
  ["FACEIT ELO", "2,476"],
  ["Win rate", "58%"],
  ["K/D ratio", "1.24"],
  ["Headshots", "47%"],
];

const recentForm = ["W", "W", "L", "W", "W", "L", "W", "W", "W", "L"];

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#05070d] bg-[linear-gradient(rgba(244,247,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] text-[#f4f7ff]">
      <section className="relative isolate overflow-hidden px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8">
        <div className="absolute right-0 top-14 -z-10 h-72 w-[58vw] bg-[#f4ff2f] opacity-95 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
        <div className="absolute bottom-6 left-0 -z-10 h-56 w-[42vw] bg-[#ff3df2] opacity-55 [clip-path:polygon(0_0,100%_26%,74%_100%,0_100%)]" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_14%,rgba(34,245,255,0.22),transparent_28%),radial-gradient(circle_at_15%_82%,rgba(255,61,242,0.18),transparent_26%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)]">
          <div>
            <div className="mb-7 inline-flex border border-[#22f5ff] bg-[#22f5ff] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#05070d] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
              Runner-grade FACEIT intel
            </div>

            <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.82] tracking-normal text-[#f4f7ff] sm:text-8xl lg:text-9xl">
              Hunt the weak side.
            </h1>

            <p className="mt-7 max-w-2xl border-l-4 border-[#ff3df2] pl-5 text-lg leading-8 text-[#c9d4ea]">
              Search public FACEIT profiles, inspect Steam-linked identity,
              pressure-test recent form, and build a sharper read on strengths,
              weaknesses, maps, and match patterns.
            </p>

            <PlayerSearchCombobox />

            <div className="mt-10 grid max-w-xl border border-[#2b3554] bg-[#0c101a]/92 shadow-[0_24px_80px_rgba(0,0,0,0.36)] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))] sm:grid-cols-3">
              {featureStats.map(([value, label]) => (
                <div
                  key={label}
                  className="border-b border-r border-[#20283c] p-4 last:border-b-0 sm:border-b-0 sm:last:border-r-0"
                >
                  <p className="text-2xl font-black text-[#f4ff2f]">{value}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 hidden border border-[#f4ff2f] bg-[#f4ff2f] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#05070d] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))] lg:block">
              +128 ELO this week
            </div>

            <div className="border border-[#2b3554] bg-[#0c101a] shadow-[0_28px_110px_rgba(0,0,0,0.52)] [clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,22px_100%,0_calc(100%-22px))]">
              <div className="relative overflow-hidden border-b border-[#2b3554] bg-[#111827] p-6">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,245,255,0.24)_0,rgba(34,245,255,0.07)_22%,transparent_22%,transparent_100%)]" />
                <div className="relative flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
                      Player preview
                    </p>
                    <h2 className="mt-2 text-5xl font-black uppercase leading-none">
                      shadowRifle
                    </h2>
                  </div>

                  <div className="bg-[#22f5ff] px-4 py-3 text-sm font-black uppercase text-[#05070d] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
                    LVL 10
                  </div>
                </div>
              </div>

              <div className="grid border-b border-[#2b3554] sm:grid-cols-2">
                {previewStats.map(([label, value]) => (
                  <div
                    key={label}
                    className="border-b border-r border-[#20283c] bg-black/25 p-5 sm:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#94a3b8]">
                      {label}
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#f4f7ff]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-base font-black uppercase">Recent form</p>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff3df2]">
                    Last 10 matches
                  </p>
                </div>

                <div className="grid grid-cols-10 border border-[#20283c]">
                  {recentForm.map((result, index) => (
                    <span
                      key={`${result}-${index}`}
                      className={`flex h-11 items-center justify-center border-r border-[#20283c] text-sm font-black last:border-r-0 ${
                        result === "W"
                          ? "bg-[#b6ff3d]/12 text-[#b6ff3d]"
                          : "bg-[#ff4d6d]/12 text-[#ff4d6d]"
                      }`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
