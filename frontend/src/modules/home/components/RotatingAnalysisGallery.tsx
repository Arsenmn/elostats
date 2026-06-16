import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TextRotate, type TextRotateRef } from "@/components/ui/text-rotate";

const analysisItems = [
  {
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    title: "Weakness finder",
    label: "Map gaps, role pressure, and form drops",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    title: "Player comparison",
    label: "Side-by-side reads for duels and team fit",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1200&auto=format&fit=crop",
    title: "Tournament context",
    label: "Championship trends, opponents, and prep",
  },
  {
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    title: "AI reports",
    label: "OpenAI summaries from FACEIT and Steam data",
  },
];

const RotatingAnalysisGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRotateRef = useRef<TextRotateRef>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateActiveIndex = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const progress =
        scrollableDistance > 0
          ? Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)
          : 0;
      const nextIndex = Math.min(
        analysisItems.length - 1,
        Math.round(progress * (analysisItems.length - 1)),
      );

      setScrollProgress(progress);
      if (activeIndexRef.current !== nextIndex) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        textRotateRef.current?.jumpTo(nextIndex);
      }
    };

    updateActiveIndex();
    window.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      window.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#05070d] text-[#f4f7ff]"
      style={{ height: `${analysisItems.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <AnalysisSectionBackground progress={scrollProgress} />

        <div className="relative z-20 grid h-full w-full items-center gap-8 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:px-16">
          <div className="relative order-2 h-[34vh] min-h-64 overflow-hidden lg:order-1 lg:h-full">
            <AnimatePresence mode="wait" initial={false}>
              <AnalysisGalleryCard
                key={analysisItems[activeIndex].title}
                image={analysisItems[activeIndex].image}
                index={activeIndex}
                label={analysisItems[activeIndex].label}
              />
            </AnimatePresence>
          </div>

          <div className="pointer-events-none relative order-1 w-full lg:order-2">
            <div className="mb-5 flex items-center gap-3 sm:mb-8">
              <span className="h-3 w-14 bg-[#f3ff2d]" />
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f3ff2d]">
                Analysis engine
              </p>
            </div>

            <h2 className="max-w-5xl text-4xl font-black uppercase leading-[0.88] tracking-normal text-white sm:text-6xl lg:text-8xl">
              Scroll through
              <TextRotate
                ref={textRotateRef}
                texts={analysisItems.map((item) => item.title)}
                mainClassName="mt-3 flex w-full text-[#f3ff2d] drop-shadow-[0_0_28px_rgba(243,255,45,0.22)]"
                splitLevelClassName="overflow-hidden pb-3"
                staggerFrom="first"
                animatePresenceMode="wait"
                loop={false}
                auto={false}
                staggerDuration={0.008}
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -70 }}
                transition={{ type: "spring", duration: 0.7, bounce: 0 }}
              />
            </h2>

            <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-[#aab7cf] sm:mt-8 sm:text-lg sm:leading-8">
              Each card represents a slice of the EloStats workflow: inspect
              players, compare profiles, detect patterns, and turn raw match
              data into a cleaner pre-game read.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-9">
              <span className="border border-[#22f5ff]/35 bg-[#22f5ff]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#22f5ff]">
                FACEIT data
              </span>
              <span className="border border-[#f3ff2d]/35 bg-[#f3ff2d]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#f3ff2d]">
                Steam context
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function AnalysisSectionBackground({ progress }: { progress: number }) {
  const drift = (progress - 0.5) * 64;

  const largeDotMask: CSSProperties = {
    backgroundImage:
      "radial-gradient(circle, rgba(137,184,255,0.78) 1.25px, transparent 1.7px)",
    backgroundSize: "9px 9px",
    backgroundPosition: `${drift}px ${-drift * 0.6}px`,
    WebkitMaskImage:
      "radial-gradient(ellipse at 32% 34%, black 0 18%, transparent 43%), radial-gradient(ellipse at 67% 38%, black 0 18%, transparent 42%), radial-gradient(ellipse at 51% 68%, black 0 14%, transparent 34%)",
    maskImage:
      "radial-gradient(ellipse at 32% 34%, black 0 18%, transparent 43%), radial-gradient(ellipse at 67% 38%, black 0 18%, transparent 42%), radial-gradient(ellipse at 51% 68%, black 0 14%, transparent 34%)",
  };

  const fineDotMask: CSSProperties = {
    backgroundImage:
      "radial-gradient(circle, rgba(56,118,196,0.42) 0.85px, transparent 1.2px)",
    backgroundSize: "6px 6px",
    backgroundPosition: `${-drift * 0.45}px ${drift * 0.32}px`,
    WebkitMaskImage:
      "radial-gradient(ellipse at 50% 42%, black 0 38%, transparent 72%)",
    maskImage:
      "radial-gradient(ellipse at 50% 42%, black 0 38%, transparent 72%)",
  };

  const limeSignalMask: CSSProperties = {
    backgroundImage:
      "radial-gradient(circle, rgba(223,255,34,0.72) 1px, transparent 1.35px)",
    backgroundSize: "12px 12px",
    backgroundPosition: `${drift * 0.2}px ${drift * 0.18}px`,
    WebkitMaskImage:
      "linear-gradient(115deg, transparent 0 44%, black 48% 51%, transparent 55% 100%)",
    maskImage:
      "linear-gradient(115deg, transparent 0 44%, black 48% 51%, transparent 55% 100%)",
  };

  return (
    <div className="pointer-events-none absolute inset-0 bg-[#020409]">
      <div className="absolute inset-0 opacity-90" style={largeDotMask} />
      <div className="absolute inset-0 opacity-75" style={fineDotMask} />
      <div className="absolute inset-0 opacity-18" style={limeSignalMask} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#020409_0%,rgba(2,4,9,0.34)_22%,rgba(2,4,9,0.1)_50%,rgba(2,4,9,0.42)_78%,#020409_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#05070d_0%,rgba(5,7,13,0.1)_22%,rgba(5,7,13,0.06)_68%,#05070d_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,247,255,0.025)_1px,transparent_1px)] bg-[size:100%_7px] opacity-45" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#05070d_0%,transparent_100%)]" />
    </div>
  );
}

function AnalysisGalleryCard({
  image,
  index,
  label,
}: {
  image: string;
  index: number;
  label: string;
}) {
  return (
    <motion.section
      className="absolute inset-0 z-10 flex h-full w-full items-center justify-center"
      initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        scale: 1.035,
        x: -18,
        filter: "blur(7px) contrast(1.4)",
      }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="group relative h-44 w-44 overflow-hidden border border-white/16 bg-[#05070d] shadow-[0_28px_90px_rgba(0,0,0,0.52)] [clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,22px_100%,0_calc(100%-22px))] sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80"
        initial={{ clipPath: "inset(0 18% 0 18%)" }}
        animate={{ clipPath: "inset(0 0% 0 0%)" }}
        exit={{ clipPath: "inset(0 0 0 100%)" }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover opacity-82 saturate-125 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        <GlitchImageLayer image={image} className="mix-blend-screen" />
        <GlitchImageLayer
          image={image}
          className="mix-blend-lighten hue-rotate-90"
          reverse
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0.08)_0%,rgba(5,7,13,0.9)_100%)]" />
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(34,245,255,0.18)_38%,transparent_44%,rgba(243,255,45,0.18)_68%,transparent_74%)]"
          initial={{ opacity: 0, y: "-35%" }}
          animate={{ opacity: [0, 0.85, 0.22, 0], y: ["-35%", "8%", "18%", "42%"] }}
          transition={{ duration: 0.36, times: [0, 0.2, 0.56, 1] }}
        />
        <div className="absolute inset-x-0 top-0 h-1 bg-[#f3ff2d]" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3ff2d]">
            0{index + 1}
          </p>
          <p className="mt-2 text-sm font-black uppercase leading-5 text-white">
            {label}
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

function GlitchImageLayer({
  image,
  className,
  reverse = false,
}: {
  image: string;
  className?: string;
  reverse?: boolean;
}) {
  const x = reverse ? [18, -12, 10, -4, 0] : [-18, 14, -10, 5, 0];

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-cover bg-center opacity-0 ${className ?? ""}`}
      style={{
        backgroundImage: `url(${image})`,
        clipPath: reverse
          ? "polygon(0 54%,100% 48%,100% 76%,0 82%)"
          : "polygon(0 15%,100% 8%,100% 36%,0 42%)",
      }}
      initial={{ opacity: 0, x: x[0] }}
      animate={{
        opacity: [0, 0.86, 0.24, 0.74, 0],
        x,
        filter: [
          "saturate(1.8) contrast(1.15)",
          "saturate(2.4) contrast(1.45)",
          "saturate(1.4) contrast(1.1)",
          "saturate(2) contrast(1.35)",
          "saturate(1) contrast(1)",
        ],
      }}
      transition={{ duration: 0.38, times: [0, 0.16, 0.42, 0.64, 1] }}
    />
  );
}

export default RotatingAnalysisGallery;
