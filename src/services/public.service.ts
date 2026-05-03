import apiClient from "./api-client";
import type { SiteConfig } from "@/types";

class PublicService {
  async getSiteConfig(): Promise<SiteConfig> {
    const response = await apiClient.get<SiteConfig>("/api/v1/site-config");
    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Failed to fetch site config");
    }
    return response.data.result as SiteConfig;
  }
}

export const publicService = new PublicService();
export default publicService;