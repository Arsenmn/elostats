import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-[#05070d] bg-[linear-gradient(rgba(244,247,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.045)_1px,transparent_1px)] bg-[size:42px_42px] px-6 py-28 text-[#f4f7ff]">
      <div className="mx-auto max-w-2xl border border-[#29324a] bg-[#0c101a] p-8 [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ff3df2]">
          Route missing
        </p>
        <h2 className="mt-2 text-5xl font-black uppercase">Not Found</h2>
        <p className="mt-4 text-[#aab7cf]">Could not find requested resource</p>
        <Link
          to="/"
          className="mt-6 inline-flex bg-[#f4ff2f] px-5 py-3 font-black uppercase text-[#05070d] no-underline [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
