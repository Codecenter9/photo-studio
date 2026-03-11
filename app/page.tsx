import Contact from "@/components/frontend/ui/contact";
import CTA from "@/components/frontend/ui/cta";
import Features from "@/components/frontend/ui/features";
import Hero from "@/components/frontend/ui/hero";
import Portfolio from "@/components/frontend/ui/portfolio";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <CTA />
      <Portfolio />
      <Contact />
    </div>
  );
}
