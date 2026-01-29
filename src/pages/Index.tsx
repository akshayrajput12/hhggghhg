import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import MentorSection from "@/components/MentorSection";
import InstitutionSection from "@/components/InstitutionSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <TeamSection />
        <MentorSection />
        <InstitutionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
