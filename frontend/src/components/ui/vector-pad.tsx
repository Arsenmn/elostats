"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";

type VectorAccent = "cyan" | "lime" | "blue" | "steel";

type VectorTarget = {
  id: string;
  col: number;
  row: number;
  color: VectorAccent;
  title: string;
  leftLabel: string;
  leftText: string;
  rightLabel: string;
  rightText: string;
};

const gridSize = 8;

const vectorTargets: VectorTarget[] = [
  {
    id: "faceit-form",
    col: 1,
    row: 2,
    color: "lime",
    title: "FACEIT FORM",
    leftLabel: "RECENT PRESSURE",
    leftText:
      "Tracks late-round impact, map spread, and volatility across the last visible match set.",
    rightLabel: "READ",
    rightText: "Stable entry value with risk spikes on utility-heavy halves.",
  },
  {
    id: "steam-link",
    col: 5,
    row: 1,
    color: "cyan",
    title: "STEAM LINK",
    leftLabel: "IDENTITY CHECK",
    leftText:
      "Connects public Steam profile signals with FACEIT identity and account context.",
    rightLabel: "READ",
    rightText:
      "Clean profile alignment. Useful for trust and tournament lookup context.",
  },
  {
    id: "aim-profile",
    col: 3,
    row: 5,
    color: "blue",
    title: "AIM PROFILE",
    leftLabel: "DUEL MAP",
    leftText:
      "Highlights opening fight frequency, trade exposure, and position-based pressure.",
    rightLabel: "READ",
    rightText:
      "High-contact node. Compare against role expectations before judging form.",
  },
  {
    id: "ai-brief",
    col: 6,
    row: 6,
    color: "steel",
    title: "AI BRIEF",
    leftLabel: "REPORT QUEUE",
    leftText:
      "Prepared slot for generated weakness summaries and player comparison notes.",
    rightLabel: "READ",
    rightText:
      "Best used after FACEIT, Steam, and match history vectors are all populated.",
  },
];

const targetColorClassName: Record<VectorTarget["color"], string> = {
  cyan: "border-cyan-300 bg-cyan-400/30 shadow-[0_0_18px_rgba(34,211,238,0.5)]",
  lime: "border-[#dfff22] bg-[#dfff22]/30 shadow-[0_0_18px_rgba(223,255,34,0.42)]",
  blue: "border-sky-300 bg-sky-400/25 shadow-[0_0_18px_rgba(56,189,248,0.42)]",
  steel:
    "border-slate-200 bg-slate-200/18 shadow-[0_0_18px_rgba(226,232,240,0.26)]",
};

const accentClassName: Record<
  VectorAccent,
  {
    dot: string;
    mutedDot: string;
    text: string;
    textSoft: string;
    border: string;
    borderSoft: string;
    bgSoft: string;
    shadow: string;
    viaStrong: string;
    viaSoft: string;
    grid: string;
  }
> = {
  cyan: {
    dot: "bg-cyan-400 shadow-[0_0_10px_cyan]",
    mutedDot: "bg-cyan-900",
    text: "text-cyan-400",
    textSoft: "text-cyan-500/50",
    border: "border-cyan-400",
    borderSoft: "border-cyan-500/50",
    bgSoft: "bg-cyan-900/20",
    shadow: "shadow-cyan-400/30",
    viaStrong: "via-cyan-400/80",
    viaSoft: "via-cyan-500/5",
    grid: "rgba(6,182,212,0.3)",
  },
  lime: {
    dot: "bg-[#dfff22] shadow-[0_0_10px_rgba(223,255,34,0.9)]",
    mutedDot: "bg-lime-950",
    text: "text-[#dfff22]",
    textSoft: "text-[#dfff22]/55",
    border: "border-[#dfff22]",
    borderSoft: "border-[#dfff22]/55",
    bgSoft: "bg-[#dfff22]/12",
    shadow: "shadow-[#dfff22]/30",
    viaStrong: "via-[#dfff22]/80",
    viaSoft: "via-[#dfff22]/8",
    grid: "rgba(223,255,34,0.28)",
  },
  blue: {
    dot: "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]",
    mutedDot: "bg-sky-950",
    text: "text-sky-400",
    textSoft: "text-sky-500/55",
    border: "border-sky-400",
    borderSoft: "border-sky-500/50",
    bgSoft: "bg-sky-900/18",
    shadow: "shadow-sky-400/25",
    viaStrong: "via-sky-400/75",
    viaSoft: "via-sky-500/5",
    grid: "rgba(56,189,248,0.26)",
  },
  steel: {
    dot: "bg-slate-200 shadow-[0_0_10px_rgba(226,232,240,0.72)]",
    mutedDot: "bg-slate-800",
    text: "text-slate-200",
    textSoft: "text-slate-300/55",
    border: "border-slate-200",
    borderSoft: "border-slate-300/45",
    bgSoft: "bg-slate-300/10",
    shadow: "shadow-slate-200/20",
    viaStrong: "via-slate-200/70",
    viaSoft: "via-slate-300/5",
    grid: "rgba(226,232,240,0.22)",
  },
};

export default function VectorPad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [hoveredTarget, setHoveredTarget] = useState<VectorTarget | null>(null);
  const [lockedTarget, setLockedTarget] = useState<VectorTarget | null>(null);

  const x = useMotionValue(50);
  const y = useMotionValue(50);

  const smoothX = useSpring(x, { stiffness: 300, damping: 28 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 28 });

  const crosshairX = useTransform(smoothX, (val) => `${val}%`);
  const crosshairY = useTransform(smoothY, (val) => `${val}%`);

  const velocityX = useTransform(smoothX, (latest) => (latest - x.get()) * 0.5);
  const velocityY = useTransform(smoothY, (latest) => (latest - y.get()) * 0.5);

  useMotionValueEvent(smoothX, "change", (latest) => {
    setCoords((prev) => ({ ...prev, x: Math.round(latest) }));
  });
  useMotionValueEvent(smoothY, "change", (latest) => {
    setCoords((prev) => ({ ...prev, y: Math.round(latest) }));
  });

  const getTargetAtPoint = (nextX: number, nextY: number) => {
    const col = Math.min(gridSize - 1, Math.floor((nextX / 100) * gridSize));
    const row = Math.min(gridSize - 1, Math.floor((nextY / 100) * gridSize));

    return (
      vectorTargets.find(
        (target) => target.col === col && target.row === row,
      ) ?? null
    );
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      const newX = ((e.clientX - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.min(Math.max(newX, 0), 100);
      const clampedY = Math.min(Math.max(newY, 0), 100);

      x.set(clampedX);
      y.set(clampedY);
      setHoveredTarget(getTargetAtPoint(clampedX, clampedY));
    }
  };

  const handlePointerEnter = () => setIsActive(true);

  const handlePointerLeave = () => {
    setIsActive(false);
    setIsLocked(false);
    setHoveredTarget(null);
    setLockedTarget(null);
    x.set(50);
    y.set(50);
  };

  const handlePointerDown = () => {
    setIsLocked(true);
    setLockedTarget(hoveredTarget);
  };

  const handlePointerUp = () => {
    setIsLocked(false);
    setLockedTarget(null);
  };

  const activeTarget = isLocked ? lockedTarget : null;
  const activeAccent = activeTarget?.color ?? hoveredTarget?.color ?? "cyan";
  const accent = accentClassName[activeAccent];
  const statusText = isActive
    ? isLocked
      ? lockedTarget?.title || "NO VECTOR DATA"
      : hoveredTarget?.title || "TRACKING"
    : "IDLE";

  return (
    <div className="relative z-10 flex min-h-screen w-full select-none flex-col items-center justify-center overflow-hidden bg-transparent font-mono">
      <style>
        {`
          @keyframes scan {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(50%); }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.34)_50%)] bg-[length:100%_4px] opacity-20" />
      </div>

      <TargetInfoPanel position="left" target={activeTarget} />
      <TargetInfoPanel position="right" target={activeTarget} />

      <div className="relative z-10 flex scale-100 flex-col items-center gap-8 sm:scale-110">
        <div
          className={cn(
            "flex w-[min(320px,calc(100vw-48px))] justify-between text-[10px] font-bold uppercase tracking-[0.2em]",
            accent.textSoft,
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-colors duration-300",
                isActive ? accent.dot : accent.mutedDot,
              )}
            />
            <span>VECTOR_CONTROLLER</span>
          </div>
          <span
            className={cn(
              "max-w-[160px] truncate text-right",
              isActive ? accent.text : "text-neutral-600",
              isLocked && lockedTarget && "animate-pulse",
            )}
          >
            {statusText}
          </span>
        </div>

        <div className="relative group">
          <div
            className={cn(
              "absolute -left-2 -top-2 h-4 w-4 border-l border-t transition-colors duration-300",
              accent.borderSoft,
            )}
          />
          <div
            className={cn(
              "absolute -right-2 -top-2 h-4 w-4 border-r border-t transition-colors duration-300",
              accent.borderSoft,
            )}
          />
          <div
            className={cn(
              "absolute -bottom-2 -left-2 h-4 w-4 border-b border-l transition-colors duration-300",
              accent.borderSoft,
            )}
          />
          <div
            className={cn(
              "absolute -bottom-2 -right-2 h-4 w-4 border-b border-r transition-colors duration-300",
              accent.borderSoft,
            )}
          />

          <div
            ref={containerRef}
            className={cn(
              "relative h-[min(320px,calc(100vw-48px))] w-[min(320px,calc(100vw-48px))] touch-none cursor-crosshair overflow-hidden rounded-sm border bg-neutral-900/80 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-colors duration-300",
              isLocked && lockedTarget ? accent.border : "border-neutral-800",
            )}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
              style={{
                backgroundImage: `linear-gradient(${accent.grid} 1px, transparent 1px), linear-gradient(90deg, ${accent.grid} 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                backgroundPosition: "-1px -1px",
              }}
            />

            <div
              className={cn(
                "pointer-events-none absolute inset-0 h-[200%] w-full animate-[scan_4s_linear_infinite] bg-gradient-to-b from-transparent to-transparent",
                isLocked && lockedTarget ? accent.viaSoft : "via-cyan-500/5",
              )}
            />

            {vectorTargets.map((target) => {
              const isHovered = hoveredTarget?.id === target.id;
              const isSelected = lockedTarget?.id === target.id;

              return (
                <div
                  key={target.id}
                  className={cn(
                    "pointer-events-none absolute z-10 border transition duration-200",
                    targetColorClassName[target.color],
                    isSelected && "scale-110",
                    isHovered && !isLocked && "scale-105",
                  )}
                  style={{
                    left: `${(target.col / gridSize) * 100}%`,
                    top: `${(target.row / gridSize) * 100}%`,
                    width: `${100 / gridSize}%`,
                    height: `${100 / gridSize}%`,
                  }}
                >
                  <span className="absolute inset-1 border border-white/20" />
                </div>
              );
            })}

            <motion.div
              className={cn(
                "pointer-events-none absolute bottom-0 top-0 w-px bg-gradient-to-b from-transparent to-transparent transition-colors duration-300",
                isLocked && lockedTarget ? accent.viaStrong : "via-cyan-400/50",
              )}
              style={{ left: crosshairX }}
            />
            <motion.div
              className={cn(
                "pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent transition-colors duration-300",
                isLocked && lockedTarget ? accent.viaStrong : "via-cyan-400/50",
              )}
              style={{ top: crosshairY }}
            />

            <motion.div
              className="absolute z-20 h-0 w-0"
              style={{ left: crosshairX, top: crosshairY }}
            >
              <motion.div
                className="relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                animate={{ scale: isActive ? (isLocked ? 0.9 : 1) : 0 }}
                style={{ rotateX: velocityY, rotateY: velocityX }}
              >
                <div
                  className={cn(
                    "h-1 w-1 rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-300",
                    isLocked && lockedTarget
                      ? cn(accent.dot, accent.text)
                      : "bg-cyan-50 text-cyan-50",
                  )}
                />

                <motion.div
                  className={cn(
                    "absolute border shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-colors duration-300",
                    isLocked && lockedTarget
                      ? cn(accent.border, accent.shadow)
                      : "border-cyan-400/80 shadow-cyan-400/30",
                  )}
                  initial={false}
                  animate={{
                    width: isActive ? (isLocked ? 30 : 50) : 0,
                    height: isActive ? (isLocked ? 30 : 50) : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-1.5 w-1.5 border-l border-t transition-colors duration-300",
                      isLocked && lockedTarget
                        ? accent.border
                        : "border-cyan-200",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute right-0 top-0 h-1.5 w-1.5 border-r border-t transition-colors duration-300",
                      isLocked && lockedTarget
                        ? accent.border
                        : "border-cyan-200",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l transition-colors duration-300",
                      isLocked && lockedTarget
                        ? accent.border
                        : "border-cyan-200",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r transition-colors duration-300",
                      isLocked && lockedTarget
                        ? accent.border
                        : "border-cyan-200",
                    )}
                  />
                </motion.div>

                <AnimatePresence>
                  {isActive && !isLocked && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute h-10 w-10 rounded-full border border-cyan-500"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <motion.div
              className={cn(
                "pointer-events-none absolute bottom-3 right-3 font-mono text-[9px] transition-colors duration-300",
                isLocked && lockedTarget ? accent.text : "text-cyan-500/50",
              )}
              animate={{ opacity: isActive ? 1 : 0.3 }}
            >
              {isLocked
                ? lockedTarget
                  ? lockedTarget.title
                  : "NO VECTOR DATA"
                : hoveredTarget
                  ? hoveredTarget.title
                  : "SEEKING..."}
            </motion.div>
          </div>
        </div>

        <div className="flex w-[min(320px,calc(100vw-48px))] gap-4">
          <DataPanel
            label="COORD_X"
            value={coords.x}
            accent={activeAccent}
            isActive={isActive}
            isLocked={isLocked}
          />
          <DataPanel
            label="COORD_Y"
            value={coords.y}
            accent={activeAccent}
            isActive={isActive}
            isLocked={isLocked}
          />
        </div>
      </div>
    </div>
  );
}

function TargetInfoPanel({
  position,
  target,
}: {
  position: "left" | "right";
  target: VectorTarget | null;
}) {
  const label = position === "left" ? target?.leftLabel : target?.rightLabel;
  const text = position === "left" ? target?.leftText : target?.rightText;
  const accent = target ? accentClassName[target.color] : accentClassName.cyan;

  return (
    <AnimatePresence>
      {target && (
        <motion.aside
          initial={{ opacity: 0, x: position === "left" ? -28 : 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: position === "left" ? -28 : 28 }}
          transition={{ duration: 0.22 }}
          className={cn(
            "absolute z-20 hidden w-64 border bg-black/72 p-4 text-left backdrop-blur md:block",
            accent.borderSoft,
            accent.shadow,
            position === "left" ? "left-10" : "right-10",
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <span
              className={cn(
                "font-mono text-[10px] font-black uppercase tracking-[0.18em]",
                accent.text,
              )}
            >
              {label}
            </span>
            <span className={cn("h-2 w-2", accent.dot)} />
          </div>
          <h3 className="text-lg font-black uppercase leading-none tracking-normal text-white">
            {target.title}
          </h3>
          <p className="mt-4 font-mono text-xs uppercase leading-5 tracking-[0.08em] text-neutral-300">
            {text}
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function DataPanel({
  label,
  value,
  accent,
  isActive,
  isLocked,
}: {
  label: string;
  value: number;
  accent: VectorAccent;
  isActive: boolean;
  isLocked: boolean;
}) {
  const accentClasses = accentClassName[accent];

  return (
    <div className="group relative flex-1 overflow-hidden border border-neutral-800 bg-neutral-900 p-2">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-0",
          isLocked ? accentClasses.bgSoft : "bg-cyan-900/20",
        )}
      />

      <div
        className={cn(
          "relative z-10 flex flex-col items-start border-l-2 pl-2 transition-colors duration-300",
          isLocked
            ? accentClasses.border
            : isActive
              ? "border-cyan-500"
              : "border-neutral-800",
        )}
      >
        <span className="mb-1 text-[9px] tracking-widest text-neutral-500">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-2xl font-bold leading-none tracking-tighter tabular-nums transition-colors duration-300",
              isLocked
                ? accentClasses.text
                : isActive
                  ? "text-cyan-400"
                  : "text-neutral-400",
            )}
          >
            {value.toString().padStart(3, "0")}
          </span>
          <span className="text-[9px] text-neutral-600">%</span>
        </div>
      </div>
    </div>
  );
}
