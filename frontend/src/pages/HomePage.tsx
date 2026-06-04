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
    <main className="min-h-screen bg-[#0d100f] bg-[linear-gradient(rgba(230,223,211,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(230,223,211,0.035)_1px,transparent_1px)] bg-[size:44px_44px] text-[#e6dfd3]">
      <section className="relative isolate overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(214,111,124,0.22),transparent_32%),radial-gradient(circle_at_8%_82%,rgba(45,70,61,0.36),transparent_34%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)]">
          <div>
            <div className="mb-7 inline-flex border border-[#d66f7c]/45 bg-[#d66f7c]/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#e2939d]">
              CS2 FACEIT intelligence
            </div>

            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-normal sm:text-7xl">
              Read the player before the match starts.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#a9afa9]">
              Search public FACEIT profiles, inspect Steam-linked identity,
              pressure-test recent form, and build a sharper read on strengths,
              weaknesses, maps, and match patterns.
            </p>

            <PlayerSearchCombobox />

            <div className="mt-10 grid max-w-xl border border-[#333a37] bg-[#141716] sm:grid-cols-3">
              {featureStats.map(([value, label]) => (
                <div
                  key={label}
                  className="border-b border-r border-[#2b312f] p-4 last:border-b-0 sm:border-b-0 sm:last:border-r-0"
                >
                  <p className="text-2xl font-black text-[#e6dfd3]">{value}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#858c87]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 hidden border border-[#d66f7c]/45 bg-[#d66f7c]/12 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#e2939d] lg:block">
              +128 ELO this week
            </div>

            <div className="border border-[#333a37] bg-[#141716] shadow-[0_24px_100px_rgba(0,0,0,0.48)]">
              <div className="relative overflow-hidden border-b border-[#333a37] bg-[#191d1b] p-6">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(214,111,124,0.2)_0,rgba(214,111,124,0.06)_22%,transparent_22%,transparent_100%)]" />
                <div className="relative flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#858c87]">
                      Player preview
                    </p>
                    <h2 className="mt-2 text-4xl font-black uppercase leading-none">
                      shadowRifle
                    </h2>
                  </div>

                  <div className="bg-[#d66f7c] px-4 py-3 text-sm font-black uppercase text-[#101312]">
                    LVL 10
                  </div>
                </div>
              </div>

              <div className="grid border-b border-[#333a37] sm:grid-cols-2">
                {previewStats.map(([label, value]) => (
                  <div
                    key={label}
                    className="border-b border-r border-[#2b312f] bg-black/20 p-5 sm:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#858c87]">
                      {label}
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#e6dfd3]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-base font-black uppercase">Recent form</p>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e2939d]">
                    Last 10 matches
                  </p>
                </div>

                <div className="grid grid-cols-10 border border-[#2b312f]">
                  {recentForm.map((result, index) => (
                    <span
                      key={`${result}-${index}`}
                      className={`flex h-11 items-center justify-center border-r border-[#2b312f] text-sm font-black last:border-r-0 ${
                        result === "W"
                          ? "bg-emerald-400/12 text-emerald-300"
                          : "bg-[#d66f7c]/12 text-[#e2939d]"
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
