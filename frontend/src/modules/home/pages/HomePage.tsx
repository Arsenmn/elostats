import RotatingAnalysisGallery from "../components/RotatingAnalysisGallery";
import HomeFooter from "../components/HomeFooter";
import VectorPadSection from "../components/VectorPad";
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
