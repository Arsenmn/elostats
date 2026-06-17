export function Metric({
  accentClassName = "text-[#22f5ff]",
  icon,
  label,
  value,
}: {
  accentClassName?: string;
  icon: React.ReactNode;
  label: string;
  value?: number;
}) {
  return (
    <div className="relative flex items-center gap-2 text-sm font-black text-[#dbe7ff]">
      <span className={accentClassName}>{icon}</span>
      <span>
        <span className="mr-2 text-[10px] uppercase tracking-[0.14em] text-[#7e8aa2]">
          {label}
        </span>
        {value?.toLocaleString() ?? "N/A"}
      </span>
    </div>
  );
}
