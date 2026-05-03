"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminService } from "@/services/admin.service";
import { Brand, Category, Motorcycle, MotorcycleStatus } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Input, Spinner, ButtonLink } from "@/components/ui";

export default function EditMotorcyclePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    slug: "",
    description: "",
    specsJson: "{}",
    brandId: 0,
    categoryId: 0,
    status: "ACTIVE" as MotorcycleStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [motorcycle, brandsData, categoriesData] = await Promise.all([
        adminService.getMotorcycleById(id),
        adminService.getBrands(),
        adminService.getCategories(),
      ]);

      setFormData({
        name: motorcycle.name || "",
        code: motorcycle.code || "",
        slug: motorcycle.slug || "",
        description: motorcycle.description || "",
        specsJson: motorcycle.specsJson || "{}",
        brandId: motorcycle.brand?.id || 0,
        categoryId: motorcycle.category?.id || 0,
        status: motorcycle.status || "ACTIVE",
      });

      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Lỗi", "Không thể tải dữ liệu sản phẩm");
      router.push("/admin/motorcycles");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "name" && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value as string) }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên sản phẩm";
    if (!formData.code.trim()) newErrors.code = "Vui lòng nhập mã sản phẩm";
    if (!formData.slug.trim()) newErrors.slug = "Vui lòng nhập slug";
    if (formData.brandId === 0) newErrors.brandId = "Vui lòng chọn thương hiệu";
    if (formData.categoryId === 0) newErrors.categoryId = "Vui lòng chọn danh mục";
    
    try {
      JSON.parse(formData.specsJson);
    } catch {
      newErrors.specsJson = "JSON không hợp lệ";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSaving(true);
    try {
      await adminService.updateMotorcycle(id, {
        name: formData.name,
        code: formData.code,
        slug: formData.slug,
        description: formData.description,
        specsJson: formData.specsJson,
        brandId: formData.brandId,
        categoryId: formData.categoryId,
        status: formData.status,
      });
      
      toast.success("Thành công", "Đã cập nhật sản phẩm");
      router.push(`/admin/motorcycles/${id}`);
    } catch (error) {
      console.error("Failed to update motorcycle:", error);
      toast.error("Lỗi", "Không thể cập nhật sản phẩm");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ButtonLink href={`/admin/motorcycles/${id}`} variant="ghost" size="sm">
            ← Quay lại
          </ButtonLink>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Chỉnh sửa sản phẩm
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Cập nhật thông tin sản phẩm
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Thông tin cơ bản
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Tên sản phẩm *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Honda Vision 2026"
                error={!!errors.name}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Mã sản phẩm *
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="HVN-2026"
                  error={!!errors.code}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="honda-vision-2026"
                  error={!!errors.slug}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Mô tả về sản phẩm..."
                rows={4}
                className="flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Category & Brand */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Phân loại
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Thương hiệu *
              </label>
              <select
                value={formData.brandId}
                onChange={(e) => handleChange("brandId", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value={0}>Chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brandId && <p className="mt-1 text-xs text-error">{errors.brandId}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Danh mục *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value={0}>Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-error">{errors.categoryId}</p>}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Thông số kỹ thuật (JSON)
          </h2>
          
          <div>
            <textarea
              value={formData.specsJson}
              onChange={(e) => handleChange("specsJson", e.target.value)}
              placeholder='{"engine": "125cc", "power": "10.5HP"}'
              rows={6}
              className="font-mono text-sm flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            {errors.specsJson && <p className="mt-1 text-xs text-error">{errors.specsJson}</p>}
          </div>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Trạng thái
          </h2>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="ACTIVE"
                checked={formData.status === "ACTIVE"}
                onChange={() => handleChange("status", "ACTIVE")}
                className="text-primary-600"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Hoạt động</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="INACTIVE"
                checked={formData.status === "INACTIVE"}
                onChange={() => handleChange("status", "INACTIVE")}
                className="text-primary-600"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Không hoạt động</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            isLoading={isSaving}
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}