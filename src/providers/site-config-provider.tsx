"use client";

import { useEffect, useRef } from "react";
import { useSiteConfigStore } from "@/stores/site-config.store";

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const { config, fetchConfig, hasHydrated } = useSiteConfigStore();
  const hasFetched = useRef(false);

  // Fetch config immediately, don't wait for hydration
  useEffect(() => {
    if (!hasFetched.current && !config?.shopName) {
      hasFetched.current = true;
      fetchConfig();
    }
  }, [fetchConfig, config]);

  // Also fetch when hydration completes (to refresh)
  useEffect(() => {
    if (hasHydrated) {
      fetchConfig();
    }
  }, [hasHydrated, fetchConfig]);

  return <>{children}</>;
}