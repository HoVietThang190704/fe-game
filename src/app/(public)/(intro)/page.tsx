import { FeatureHighlightsSection } from "./FeatureHighlightsSection"
import { HeroSection } from "./HeroSection"

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <FeatureHighlightsSection />
    </div>
  )
}
