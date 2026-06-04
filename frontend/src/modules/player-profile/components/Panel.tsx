import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  eyebrow?: string;
  icon?: ReactNode;
  children: ReactNode;
}

const Panel = ({ title, eyebrow, icon, children }: PanelProps) => {
  return (
    <section className="relative overflow-hidden border border-[#333a37] bg-[#141716] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[#d66f7c]" />
      <div className="border-b border-[#2b312f] bg-[#1a1e1c] px-5 py-4">
        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d66f7c]">
            {eyebrow}
          </p>
        )}
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#d66f7c]">{icon}</span>}
          <h2 className="text-base font-black uppercase text-[#e6dfd3]">
            {title}
          </h2>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
};

export default Panel;
