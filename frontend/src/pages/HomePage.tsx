import RotatingAnalysisGallery from "../modules/home/components/RotatingAnalysisGallery";
import HomeFooter from "../modules/home/components/HomeFooter";
import VectorPadSection from "../modules/home/components/VectorPad";
import GlitchStatement from "@/modules/home/components/GlitchStatement";
import Hero from "@/modules/home/components/Hero";
import FaqSection from "@/modules/home/components/FaqSection";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#05070d] text-[#f4f7ff]">
      <Hero />
      <RotatingAnalysisGallery />
      <GlitchStatement />
      <VectorPadSection />
      <FaqSection />
      <HomeFooter />
    </main>
  );
};

export default HomePage;
