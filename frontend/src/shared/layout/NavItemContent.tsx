export function NavItemContent({
  icon,
  isVisible,
  label,
}: {
  icon: React.ReactNode;
  isVisible: boolean;
  label: string;
}) {
  return (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-x-0.5">
        {icon}
      </span>
      <span
        className={`block overflow-hidden whitespace-nowrap text-[11px] font-black uppercase tracking-[0.08em] transition-[max-width,opacity,transform] duration-300 ease-out ${
          isVisible
            ? "max-w-28 translate-x-0 opacity-100"
            : "max-w-0 -translate-x-3 opacity-0"
        }`}
      >
        {label}
      </span>
    </>
  );
}
