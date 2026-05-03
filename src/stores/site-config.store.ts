import { create } from "zustand";
import { persist, type StateStorage } from "zustand/middleware";
import type { SiteConfig } from "@/types";
import { publicService } from "@/services/public.service";

interface SiteConfigState {
  config: SiteConfig | null;
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;
  
  fetchConfig: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

const defaultConfig: SiteConfig = {
  id: 0,
  logo: null,
  shopName: "Honda Dealership",
  primaryColor: "#e31837",
  secondaryColor: "#ffffff",
  banner: null,
  slogan: null,
  favicon: null,
  heroTitle: null,
  heroSubtitle: null,
  ctaPrimaryText: null,
  ctaPrimaryLink: "/motorcycles",
  ctaSecondaryText: null,
  ctaSecondaryLink: "/about",
};

export const useSiteConfigStore = create<SiteConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      isLoading: false,
      hasHydrated: false,
      error: null,

      fetchConfig: async () => {
        set({ isLoading: true, error: null });
        try {
          const config = await publicService.getSiteConfig();
          set({ config, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch site config:", error);
          set({ error: "Failed to load site config", isLoading: false });
        }
      },

      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: "site-config-storage",
      partialize: (state) => ({
        config: state.config,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);