const Loader = () => {
  return (
    <div className="border border-[#29324a] bg-[#0c101a] p-6 text-[#f4f7ff] [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,14px_100%,0_calc(100%-14px))]">
      <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#22f5ff]">
        Loading...
      </h2>
      <p className="mt-2 text-sm text-[#aab7cf]">Please wait a bit...</p>
    </div>
  );
};

export default Loader;
