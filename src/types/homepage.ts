export interface HomepageHero {
  heroImage: string;
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

export interface HomepageMotorcycle {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string;
  minPrice: number;
  isAvailable: boolean;
  categoryName: string;
}

export interface HomepageCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface HomepageData {
  hero: HomepageHero;
  featuredMotorcycles: HomepageMotorcycle[];
  categories: HomepageCategory[];
}