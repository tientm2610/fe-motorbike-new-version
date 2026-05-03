export interface SiteConfig {
  id: number;
  logo: string | null;
  shopName: string;
  primaryColor: string;
  secondaryColor: string;
  banner: string | null;
  slogan: string | null;
  favicon: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  ctaPrimaryText: string | null;
  ctaPrimaryLink: string | null;
  ctaSecondaryText: string | null;
  ctaSecondaryLink: string | null;
}

export interface UpdateSiteConfigRequest {
  logo?: string | null;
  shopName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  banner?: string | null;
  slogan?: string | null;
  favicon?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  ctaPrimaryText?: string | null;
  ctaPrimaryLink?: string | null;
  ctaSecondaryText?: string | null;
  ctaSecondaryLink?: string | null;
}