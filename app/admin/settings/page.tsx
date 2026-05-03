"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { SiteConfig } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Spinner, Input, Card } from "@/components/ui";
import { cn } from "@/lib";

const defaultConfig: SiteConfig = {
  id: 0,
  logo: "",
  shopName: "",
  primaryColor: "#e31837",
  secondaryColor: "#ffffff",
  banner: "",
  slogan: "",
  favicon: "",
  heroTitle: "",
  heroSubtitle: "",
  ctaPrimaryText: "",
  ctaPrimaryLink: "/motorcycles",
  ctaSecondaryText: "",
  ctaSecondaryLink: "/about",
};

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"branding" | "hero" | "cta">("branding");
  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getSiteConfig();
      setConfig(data);
    } catch (error) {
      console.error("Failed to fetch site config:", error);
      toast.error("Lỗi", "Không thể tải cấu hình trang web");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminService.updateSiteConfig(config);
      toast.success("Thành công", "Đã lưu cấu hình trang web");
    } catch (error) {
      console.error("Failed to save site config:", error);
      toast.error("Lỗi", "Không thể lưu cấu hình");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (field: "logo" | "favicon" | "banner", file: File) => {
    if (!file) return;
    
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Lỗi", "Chỉ hỗ trợ jpg, jpeg, png, webp");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Lỗi", "File không được vượt quá 5MB");
      return;
    }

    setIsUploading(field);
    try {
      let updatedConfig: SiteConfig;
      
      if (field === "logo") {
        updatedConfig = await adminService.uploadSiteLogo(file);
      } else if (field === "favicon") {
        updatedConfig = await adminService.uploadSiteFavicon(file);
      } else {
        updatedConfig = await adminService.uploadSiteBanner(file);
      }
      
      setConfig(updatedConfig);
      toast.success("Thành công", "Đã upload hình ảnh");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Lỗi", "Không thể upload hình ảnh");
    } finally {
      setIsUploading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: "branding", label: "Thương hiệu" },
    { id: "hero", label: "Hero Section" },
    { id: "cta", label: "Nút CTA" },
  ] as const;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Cài đặt trang web
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Quản lý giao diện và nội dung trang web
          </p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          Lưu thay đổi
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Branding Tab */}
      {activeTab === "branding" && (
        <div className="space-y-6">
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tên cửa hàng
                </label>
                <Input
                  value={config.shopName || ""}
                  onChange={(e) => handleChange("shopName", e.target.value)}
                  placeholder="Honda Dealership"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Slogan
                </label>
                <Input
                  value={config.slogan || ""}
                  onChange={(e) => handleChange("slogan", e.target.value)}
                  placeholder="Ride Your Dream"
                />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Màu sắc
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Màu chính
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={config.primaryColor || "#e31837"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="h-10 w-16 rounded-lg border border-neutral-300 cursor-pointer"
                  />
                  <Input
                    value={config.primaryColor || ""}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    placeholder="#e31837"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Màu phụ
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={config.secondaryColor || "#ffffff"}
                    onChange={(e) => handleChange("secondaryColor", e.target.value)}
                    className="h-10 w-16 rounded-lg border border-neutral-300 cursor-pointer"
                  />
                  <Input
                    value={config.secondaryColor || ""}
                    onChange={(e) => handleChange("secondaryColor", e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: config.primaryColor }}>
              <p className="text-sm text-white">Preview - Màu chính</p>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Hình ảnh
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Logo
                </label>
                <div className="flex gap-2 mb-2">
                  <label className="cursor-pointer px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload("logo", e.target.files[0])}
                      disabled={isUploading === "logo"}
                    />
                    {isUploading === "logo" ? "Đang upload..." : "Upload Logo"}
                  </label>
                </div>
                {config.logo && (
                  <div className="mt-2">
                    <img src={config.logo} alt="Logo preview" className="h-16 w-auto rounded-lg border" />
                  </div>
                )}
                <Input
                  value={config.logo || ""}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  placeholder="Hoặc nhập URL"
                  className="mt-2"
                />
              </div>

              {/* Favicon */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Favicon
                </label>
                <div className="flex gap-2 mb-2">
                  <label className="cursor-pointer px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload("favicon", e.target.files[0])}
                      disabled={isUploading === "favicon"}
                    />
                    {isUploading === "favicon" ? "Đang upload..." : "Upload Favicon"}
                  </label>
                </div>
                <Input
                  value={config.favicon || ""}
                  onChange={(e) => handleChange("favicon", e.target.value)}
                  placeholder="Hoặc nhập URL"
                />
              </div>

              {/* Banner */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Banner
                </label>
                <div className="flex gap-2 mb-2">
                  <label className="cursor-pointer px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload("banner", e.target.files[0])}
                      disabled={isUploading === "banner"}
                    />
                    {isUploading === "banner" ? "Đang upload..." : "Upload Banner"}
                  </label>
                  <span className="text-xs text-neutral-500 self-center">(jpg, jpeg, png, webp - max 5MB)</span>
                </div>
                {config.banner && (
                  <div className="mt-2">
                    <img src={config.banner} alt="Banner preview" className="w-full max-w-md rounded-lg border" />
                  </div>
                )}
                <Input
                  value={config.banner || ""}
                  onChange={(e) => handleChange("banner", e.target.value)}
                  placeholder="Hoặc nhập URL"
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Hero Tab */}
      {activeTab === "hero" && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Hero Section
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Tiêu đề Hero
              </label>
              <Input
                value={config.heroTitle || ""}
                onChange={(e) => handleChange("heroTitle", e.target.value)}
                placeholder="Ride Your Dream Bike"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Mô tả phụ
              </label>
              <textarea
                value={config.heroSubtitle || ""}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                placeholder="Discover premium Honda motorcycles with expert guidance, competitive pricing, and unparalleled service."
                rows={4}
                className="flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>
        </Card>
      )}

      {/* CTA Tab */}
      {activeTab === "cta" && (
        <div className="space-y-6">
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Nút chính (Primary)
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Text hiển thị
                </label>
                <Input
                  value={config.ctaPrimaryText || ""}
                  onChange={(e) => handleChange("ctaPrimaryText", e.target.value)}
                  placeholder="Khám phá xe máy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Link đích
                </label>
                <Input
                  value={config.ctaPrimaryLink || ""}
                  onChange={(e) => handleChange("ctaPrimaryLink", e.target.value)}
                  placeholder="/motorcycles"
                />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Nút phụ (Secondary)
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Text hiển thị
                </label>
                <Input
                  value={config.ctaSecondaryText || ""}
                  onChange={(e) => handleChange("ctaSecondaryText", e.target.value)}
                  placeholder="Tìm hiểu thêm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Link đích
                </label>
                <Input
                  value={config.ctaSecondaryLink || ""}
                  onChange={(e) => handleChange("ctaSecondaryLink", e.target.value)}
                  placeholder="/about"
                />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Preview
            </h2>
            <div className="flex gap-4">
              {config.ctaPrimaryText && (
                <button
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: config.primaryColor, color: config.secondaryColor }}
                >
                  {config.ctaPrimaryText}
                </button>
              )}
              {config.ctaSecondaryText && (
                <button
                  className="px-4 py-2 rounded-lg font-medium border-2"
                  style={{ borderColor: config.primaryColor, color: config.primaryColor }}
                >
                  {config.ctaSecondaryText}
                </button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}