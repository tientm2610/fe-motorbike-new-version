"use client";

import { useEffect } from "react";
import { useSiteConfigStore } from "@/stores/site-config.store";

function applySiteColors(config: { primaryColor: string; secondaryColor: string } | null) {
  if (!config) return;
  
  const root = document.documentElement;
  root.style.setProperty('--color-primary', config.primaryColor);
  root.style.setProperty('--color-primary-rgb', hexToRgb(config.primaryColor));
  root.style.setProperty('--color-secondary', config.secondaryColor);
  
  // Also set directly on body for immediate effect
  document.body.style.setProperty('--site-primary-color', config.primaryColor);
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return '227, 24, 55';
}

function applyFavicon(faviconUrl: string | null) {
  if (!faviconUrl) return;
  
  const existingFavicon = document.querySelector('link[rel="icon"]');
  if (existingFavicon) {
    existingFavicon.setAttribute('href', faviconUrl);
  } else {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
  }
}

export function SiteConfigLayout({ children }: { children: React.ReactNode }) {
  const { config, hasHydrated } = useSiteConfigStore();

  // Apply colors when config changes or when hydrated
  useEffect(() => {
    if (hasHydrated && config) {
      applySiteColors(config);
      applyFavicon(config.favicon);
    }
  }, [hasHydrated, config]);

  // Also apply on first mount before hydration completes
  useEffect(() => {
    if (config && config.primaryColor !== '#e31837') {
      applySiteColors(config);
    }
  }, []);

  return <>{children}</>;
}