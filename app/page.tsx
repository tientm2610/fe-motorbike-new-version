import { HeroSection } from "@/components/features/homepage/hero-section";
import { FeaturedMotorcycles } from "@/components/features/homepage/featured-motorcycles";
import { CategoryShowcase } from "@/components/features/homepage/category-showcase";
import { CTASection } from "@/components/features/homepage/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedMotorcycles />
      <CategoryShowcase />
      <CTASection />
    </>
  );
}