import { BackgroundPlus } from "@/components/ui/background-plus";
import VectorPad from "@/components/ui/vector-pad";

const VectorPadSection = () => {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#05070d]">
      <BackgroundPlus
        plusColor="#dfff22"
        plusSize={42}
        fade={false}
        className="opacity-[0.24]"
      />
      <BackgroundPlus
        plusColor="#22f5ff"
        plusSize={84}
        fade={false}
        className="opacity-[0.12]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(244,247,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,255,0.055)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="pointer-events-none absolute bottom-[-0.2em] left-1/2 -z-0 -translate-x-1/2 whitespace-nowrap text-[18vw] font-black uppercase leading-none tracking-normal text-white/[0.035]">
        VECTOR
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#05070d_0%,rgba(5,7,13,0.58)_24%,rgba(5,7,13,0.26)_50%,rgba(5,7,13,0.58)_76%,#05070d_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[min(620px,90vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,7,13,0.24)_62%,rgba(5,7,13,0.74)_100%)]" />
      <VectorPad />
    </section>
  );
};

export default VectorPadSection;
