import { FeatureHighlightsSection } from "./FeatureHighlightsSection"
import { FooterSection } from "./FooterSection"
import { HeroSection } from "./HeroSection"

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <FeatureHighlightsSection />
      <FooterSection />
    </div>
  )
}
