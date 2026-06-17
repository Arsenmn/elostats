import type { ReactNode } from "react";

export function ProfileMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-r border-[#20283c] p-5 md:[&:nth-child(2n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0">
      <div className="flex h-11 w-11 items-center justify-center bg-[#22f5ff] text-[#05070d]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
          {label}
        </p>
        <div className="mt-1 truncate text-2xl font-black text-[#f4f7ff]">
          {value}
        </div>
      </div>
    </div>
  );
}
