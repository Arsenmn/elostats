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
    <main className="relative isolate min-h-screen overflow-hidden bg-[#061810] px-6 py-24 text-[#fff8df] sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,232,160,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(31,116,76,0.28),transparent_34%)]" />

      <section className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1fr)]">
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex rounded-full border border-[#ffe8a0]/35 bg-[#ffe8a0]/10 px-4 py-2 text-sm font-medium text-[#ffe8a0]">
            EloStats access
          </div>

          <h1 className="max-w-lg text-5xl font-bold tracking-tight">
            Keep your FACEIT form in view.
          </h1>

          <p className="mt-5 max-w-md text-lg leading-8 text-[#c9d5b9]">
            Sign in to save player lookups, compare recent match trends, and
            return to your CS2 performance dashboard faster.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-3 text-sm">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#2d5a40] bg-[#0d2619]/80 p-4"
              >
                <p className="text-2xl font-bold text-[#ffe8a0]">{value}</p>
                <p className="mt-1 text-[#8da383]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-3xl border border-[#2d5a40] bg-[#0d2619]/85 p-6 shadow-2xl shadow-[#ffe8a0]/10 backdrop-blur sm:p-8">
          {children}
        </div>
      </section>
    </main>
  );
};

export default AuthPageLayout;
