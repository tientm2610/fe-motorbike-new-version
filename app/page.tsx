"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { HomepageData } from "@/types";
import { HeroSection } from "@/components/features/homepage/hero-section";
import { FeaturedMotorcycles } from "@/components/features/homepage/featured-motorcycles";
import { CategoryShowcase } from "@/components/features/homepage/category-showcase";
import { CTASection } from "@/components/features/homepage/cta-section";
import { Spinner } from "@/components/ui";

export default function HomePage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getHomepage();
      setHomepageData(data);
    } catch (err) {
      console.error("Failed to fetch homepage data:", err);
      setError("Failed to load homepage data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !homepageData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-neutral-500">Failed to load homepage data</p>
          <button 
            onClick={fetchHomepageData}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection hero={homepageData.hero} />
      <FeaturedMotorcycles motorcycles={homepageData.featuredMotorcycles} />
      <CategoryShowcase categories={homepageData.categories} />
      <CTASection />
    </>
  );
}