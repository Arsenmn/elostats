export function EmptyTabPanel({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="mt-6 border border-[#29324a] bg-[#0c101a] p-8">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#22f5ff]">
        Coming soon
      </p>
      <h2 className="mt-2 text-3xl font-black uppercase text-[#f4f7ff]">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#aab7cf]">
        {message}
      </p>
    </section>
  );
}
