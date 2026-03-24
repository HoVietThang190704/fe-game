import { FooterSection } from "./FooterSection"
import { HeroSection } from "./HeroSection"

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <FooterSection />
    </div>
  )
}