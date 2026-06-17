export function getPodiumStyle(position: number) {
  if (position === 1) {
    return {
      badgeClassName: "border-[#f8d66b]/45 bg-[#f8d66b]/12 text-[#ffe08a]",
      barClassName: "bg-[#f8d66b]",
      borderClassName: "border-[#f8d66b]/38",
      chevronClassName: "text-[#f8d66b]",
      label: "Champion seed",
      labelClassName: "text-[#ffe08a]",
      metricClassName: "text-[#f8d66b]",
      rankClassName: "bg-[#f8d66b] text-[#05070d]",
      rowClassName:
        "bg-[linear-gradient(90deg,rgba(248,214,107,0.18),rgba(248,214,107,0.055)_44%,rgba(12,16,26,0)_100%)] hover:bg-[#f8d66b]/12",
      wingClassName:
        "bg-[linear-gradient(135deg,rgba(248,214,107,0.28),transparent_58%)] [clip-path:polygon(38%_0,100%_0,100%_100%,0_100%)]",
    };
  }

  if (position === 2) {
    return {
      badgeClassName: "border-[#cfd8e6]/45 bg-[#cfd8e6]/12 text-[#f0f5ff]",
      barClassName: "bg-[#cfd8e6]",
      borderClassName: "border-[#cfd8e6]/34",
      chevronClassName: "text-[#dce6f5]",
      label: "Silver threat",
      labelClassName: "text-[#dce6f5]",
      metricClassName: "text-[#dce6f5]",
      rankClassName: "bg-[#cfd8e6] text-[#05070d]",
      rowClassName:
        "bg-[linear-gradient(90deg,rgba(207,216,230,0.16),rgba(207,216,230,0.052)_44%,rgba(12,16,26,0)_100%)] hover:bg-[#cfd8e6]/12",
      wingClassName:
        "bg-[linear-gradient(135deg,rgba(207,216,230,0.24),transparent_58%)] [clip-path:polygon(38%_0,100%_0,100%_100%,0_100%)]",
    };
  }

  if (position === 3) {
    return {
      badgeClassName: "border-[#d48b5a]/45 bg-[#d48b5a]/12 text-[#ffb27d]",
      barClassName: "bg-[#d48b5a]",
      borderClassName: "border-[#d48b5a]/34",
      chevronClassName: "text-[#d48b5a]",
      label: "Bronze pressure",
      labelClassName: "text-[#ffb27d]",
      metricClassName: "text-[#d48b5a]",
      rankClassName: "bg-[#d48b5a] text-[#05070d]",
      rowClassName:
        "bg-[linear-gradient(90deg,rgba(212,139,90,0.16),rgba(212,139,90,0.052)_44%,rgba(12,16,26,0)_100%)] hover:bg-[#d48b5a]/12",
      wingClassName:
        "bg-[linear-gradient(135deg,rgba(212,139,90,0.24),transparent_58%)] [clip-path:polygon(38%_0,100%_0,100%_100%,0_100%)]",
    };
  }

  return null;
}
