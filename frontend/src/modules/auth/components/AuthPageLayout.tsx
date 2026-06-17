import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
}

const stats = [
  ["2,476", "ELO"],
  ["58%", "Win rate"],
  ["1.24", "K/D"],
];

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#05070d] bg-[linear-gradient(rgba(244,247,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] px-6 py-24 text-[#f4f7ff] sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(34,245,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,61,242,0.16),transparent_34%)]" />

      <section className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1fr)]">
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex border border-[#22f5ff] bg-[#22f5ff] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#05070d] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
            EloStats access
          </div>

          <h1 className="max-w-lg text-5xl font-black uppercase leading-none tracking-normal">
            Keep your FACEIT form in view.
          </h1>

          <p className="mt-5 max-w-md text-lg leading-8 text-[#aab7cf]">
            Sign in to save player lookups, compare recent match trends, and
            return to your CS2 performance dashboard faster.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 border border-[#29324a] text-sm">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="border-r border-[#20283c] bg-[#0c101a]/80 p-4 last:border-r-0"
              >
                <p className="text-2xl font-black text-[#22f5ff]">{value}</p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full border border-[#29324a] bg-[#0c101a]/90 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))] sm:p-8">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-[#22f5ff]" />
          {children}
        </div>
      </section>
    </main>
  );
};

export default AuthPageLayout;
