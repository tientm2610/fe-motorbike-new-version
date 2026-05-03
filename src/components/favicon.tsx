"use client";

import Head from "next/head";
import { useSiteConfigStore } from "@/stores/site-config.store";

export function DynamicFavicon() {
  const { config, hasHydrated } = useSiteConfigStore();

  if (!hasHydrated || !config?.favicon) {
    return null;
  }

  return (
    <Head>
      <link
        rel="icon"
        type="image/x-icon"
        href={config.favicon}
        key="dynamic-favicon"
      />
    </Head>
  );
}