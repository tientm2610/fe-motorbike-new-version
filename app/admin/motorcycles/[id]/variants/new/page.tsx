"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { VariantStatus } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Input, Spinner } from "@/components/ui";

export default function AddVariantPage() {
  const router = useRouter();
  const params = useParams();
  const motorcycleId = Number(params.id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    variantName: "",
    colorName: "",
    colorCode: "",
    sku: "",
    price: 0,
    stockQuantity: 0,
    status: "AVAILABLE" as VariantStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.variantName.trim()) newErrors.variantName = "Vui lòng nhập tên variant";
    if (!formData.colorName.trim()) newErrors.colorName = "Vui lòng nhập tên màu";
    if (!formData.sku.trim()) newErrors.sku = "Vui lòng nhập SKU";
    if (formData.price <= 0) newErrors.price = "Giá phải lớn hơn 0";
    if (formData.stockQuantity < 0) newErrors.stockQuantity = "Số lượng không được âm";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSaving(true);
    try {
      await adminService.createVariant(motorcycleId, {
        variantName: formData.variantName,
        colorName: formData.colorName,
        colorCode: formData.colorCode || undefined,
        sku: formData.sku,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        status: formData.status,
      });
      
      toast.success("Thành công", "Đã thêm variant mới");
      router.push(`/admin/motorcycles/${motorcycleId}`);
    } catch (error) {
      console.error("Failed to create variant:", error);
      toast.error("Lỗi", "Không thể thêm variant");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Thêm variant mới
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Thêm phiên bản màu sắc cho sản phẩm
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Variant Info */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Thông tin variant
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Tên variant *
              </label>
              <Input
                value={formData.variantName}
                onChange={(e) => handleChange("variantName", e.target.value)}
                placeholder="Vision Black"
                error={!!errors.variantName}
              />
              {errors.variantName && <p className="mt-1 text-xs text-error">{errors.variantName}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tên màu *
                </label>
                <Input
                  value={formData.colorName}
                  onChange={(e) => handleChange("colorName", e.target.value)}
                  placeholder="Black"
                  error={!!errors.colorName}
                />
                {errors.colorName && <p className="mt-1 text-xs text-error">{errors.colorName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Mã màu (HEX)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.colorCode || "#000000"}
                    onChange={(e) => handleChange("colorCode", e.target.value)}
                    className="h-10 w-14 rounded-lg border border-neutral-300 cursor-pointer"
                  />
                  <Input
                    value={formData.colorCode || ""}
                    onChange={(e) => handleChange("colorCode", e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                SKU *
              </label>
              <Input
                value={formData.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                placeholder="HVN-2026-BLK"
                error={!!errors.sku}
              />
              {errors.sku && <p className="mt-1 text-xs text-error">{errors.sku}</p>}
            </div>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Giá và tồn kho
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Giá (VND) *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                placeholder="35000000"
                error={!!errors.price}
              />
              {errors.price && <p className="mt-1 text-xs text-error">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Số lượng tồn kho *
              </label>
              <Input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => handleChange("stockQuantity", Number(e.target.value))}
                placeholder="10"
                error={!!errors.stockQuantity}
              />
              {errors.stockQuantity && <p className="mt-1 text-xs text-error">{errors.stockQuantity}</p>}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Trạng thái
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="AVAILABLE"
                checked={formData.status === "AVAILABLE"}
                onChange={() => handleChange("status", "AVAILABLE")}
              />
              <span className="text-neutral-700 dark:text-neutral-300">Còn hàng</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="OUT_OF_STOCK"
                checked={formData.status === "OUT_OF_STOCK"}
                onChange={() => handleChange("status", "OUT_OF_STOCK")}
              />
              <span className="text-neutral-700 dark:text-neutral-300">Hết hàng</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="DISCONTINUED"
                checked={formData.status === "DISCONTINUED"}
                onChange={() => handleChange("status", "DISCONTINUED")}
              />
              <span className="text-neutral-700 dark:text-neutral-300">Ngừng kinh doanh</span>
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
            Thêm variant
          </Button>
        </div>
      </form>
    </div>
  );
}