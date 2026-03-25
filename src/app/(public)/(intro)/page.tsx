import { Navbar } from "@/src/components/intropage/Navbar";
import { HeroSection } from "@/src/components/intropage/HeroSection";
import { FeatureCardsSection } from "@/src/components/intropage/FeatureCardsSection";
import { FooterSection } from "@/src/components/intropage/FooterSection";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeatureCardsSection />
      <FooterSection />
    </div>
  )
}
