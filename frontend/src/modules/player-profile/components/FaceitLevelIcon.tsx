import { cn } from "@/lib/utils";

interface FaceitLevelIconProps {
  level?: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeClassName = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-24 w-24",
};

const officialFaceitLevelIconUrl = (level: number) =>
  `https://cdn-frontend.faceit.com/web/960/src/app/assets/images-compress/skill-icons/skill_level_${level}_svg.svg`;

const FaceitLevelIcon = ({
  level,
  size = "md",
  showLabel = false,
}: FaceitLevelIconProps) => {
  const normalizedLevel =
    typeof level === "number" && level >= 1 && level <= 10 ? level : null;

  return (
    <div className="inline-flex items-center gap-3">
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center",
          sizeClassName[size],
        )}
        title={
          normalizedLevel
            ? `FACEIT level ${normalizedLevel}`
            : "FACEIT level unavailable"
        }
      >
        {normalizedLevel ? (
          <img
            src={officialFaceitLevelIconUrl(normalizedLevel)}
            alt={`FACEIT level ${normalizedLevel}`}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full border border-[#29324a] bg-[#111827] text-lg font-black text-[#94a3b8]">
            ?
          </span>
        )}
      </div>

      {showLabel && (
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
            FACEIT level
          </p>
          <p className="text-sm font-black uppercase text-[#f4f7ff]">
            {normalizedLevel ? `Level ${normalizedLevel}` : "Unranked"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FaceitLevelIcon;
