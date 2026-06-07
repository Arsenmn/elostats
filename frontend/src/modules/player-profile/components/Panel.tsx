import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  eyebrow?: string;
  icon?: ReactNode;
  children: ReactNode;
}

const Panel = ({ title, eyebrow, icon, children }: PanelProps) => {
  return (
    <section className="relative overflow-hidden border border-[#29324a] bg-[#0c101a] shadow-[0_24px_80px_rgba(0,0,0,0.35)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[#22f5ff]" />
      <div className="border-b border-[#20283c] bg-[#111827] px-5 py-4">
        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#22f5ff]">
            {eyebrow}
          </p>
        )}
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#22f5ff]">{icon}</span>}
          <h2 className="text-base font-black uppercase text-[#f4f7ff]">
            {title}
          </h2>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
};

export default Panel;
