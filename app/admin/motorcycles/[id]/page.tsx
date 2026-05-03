"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { adminService } from "@/services/admin.service";
import { Motorcycle, Variant, Brand, Category, VariantImage } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Spinner, ButtonLink, Input } from "@/components/ui";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "@/components/ui/modal";
import { cn } from "@/lib";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MotorcycleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit variant modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [editForm, setEditForm] = useState({
    variantName: "",
    colorName: "",
    colorCode: "",
    sku: "",
    price: 0,
    stockQuantity: 0,
    status: "AVAILABLE" as "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED",
  });
  const [isSavingVariant, setIsSavingVariant] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [motorcycleData, variantsData, brandsData, categoriesData] = await Promise.all([
        adminService.getMotorcycleById(id),
        adminService.getVariants(id),
        adminService.getBrands(),
        adminService.getCategories(),
      ]);
      
      setMotorcycle(motorcycleData);
      setVariants(variantsData);
      setBrands(brandsData);
      setCategories(categoriesData);

      if (selectedVariant) {
        const updatedVariant = variantsData.find(v => v.id === selectedVariant.id);
        if (updatedVariant) {
          setSelectedVariant(updatedVariant);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Lỗi", "Không thể tải thông tin sản phẩm");
      router.push("/admin/motorcycles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVariant = async (variantId: number, variantName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa variant "${variantName}"?`)) return;
    
    try {
      await adminService.deleteVariant(variantId);
      toast.success("Thành công", `Đã xóa variant ${variantName}`);
      fetchData();
    } catch (error) {
      toast.error("Lỗi", "Không thể xóa variant");
    }
  };

  const handleDeleteMotorcycle = async () => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${motorcycle?.name}"?`)) return;
    
    try {
      await adminService.deleteMotorcycle(id);
      toast.success("Thành công", "Đã xóa sản phẩm");
      router.push("/admin/motorcycles");
    } catch (error) {
      toast.error("Lỗi", "Không thể xóa sản phẩm");
    }
  };

  // Image management functions
  const openImageModal = (variant: Variant) => {
    setSelectedVariant(variant);
    setImageModalOpen(true);
  };

  const handleAddImageByUrl = async () => {
    if (!imageUrlInput.trim() || !selectedVariant) return;
    
    setIsUploading(true);
    try {
      await adminService.addVariantImage(selectedVariant.id, imageUrlInput);
      toast.success("Thành công", "Đã thêm ảnh");
      setImageUrlInput("");
      fetchData();
    } catch (error) {
      toast.error("Lỗi", "Không thể thêm ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedVariant) return;
    
    setIsUploading(true);
    try {
      await adminService.uploadVariantImage(selectedVariant.id, file);
      toast.success("Thành công", "Đã upload ảnh");
      fetchData();
    } catch (error) {
      toast.error("Lỗi", "Không thể upload ảnh");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSetThumbnail = async (imageId: number) => {
    try {
      await adminService.setThumbnail(imageId);
      toast.success("Thành công", "Đã đặt ảnh đại diện");
      fetchData();
    } catch (error) {
      toast.error("Lỗi", "Không thể đặt ảnh đại diện");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    
    try {
      await adminService.deleteImage(imageId);
      toast.success("Thành công", "Đã xóa ảnh");
      fetchData();
    } catch (error) {
      toast.error("Lỗi", "Không thể xóa ảnh");
    }
  };

  // Edit variant functions
  const openEditModal = (variant: Variant) => {
    setEditingVariant(variant);
    setEditForm({
      variantName: variant.variantName,
      colorName: variant.colorName,
      colorCode: variant.colorCode || "",
      sku: variant.sku,
      price: variant.price,
      stockQuantity: variant.stockQuantity,
      status: variant.status,
    });
    setEditModalOpen(true);
  };

  const handleSaveVariant = async () => {
    if (!editingVariant) return;
    
    setIsSavingVariant(true);
    try {
      await adminService.updateVariant(editingVariant.id, editForm);
      toast.success("Thành công", "Đã cập nhật variant");
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Lỗi", "Không thể cập nhật variant");
    } finally {
      setIsSavingVariant(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-success/10 text-success";
      case "INACTIVE": return "bg-neutral-500/10 text-neutral-500";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  const getVariantStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-success/10 text-success";
      case "OUT_OF_STOCK": return "bg-warning/10 text-warning";
      case "DISCONTINUED": return "bg-error/10 text-error";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!motorcycle) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ButtonLink href="/admin/motorcycles" variant="ghost" size="sm">
              ← Danh sách
            </ButtonLink>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {motorcycle.name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(motorcycle.status))}>
              {motorcycle.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-500">{motorcycle.brand.name}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-500">{motorcycle.category.name}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <ButtonLink href={`/admin/motorcycles/${id}/edit`} variant="outline">
            Sửa thông tin
          </ButtonLink>
          <Button variant="outline" className="text-error border-error" onClick={handleDeleteMotorcycle}>
            Xóa sản phẩm
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {motorcycle.description && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Mô tả</h2>
              <p className="text-neutral-600 dark:text-neutral-400">{motorcycle.description}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Tổng quan</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Mã sản phẩm</span>
              <span className="font-medium">{motorcycle.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tổng tồn kho</span>
              <span className="font-medium">{motorcycle.totalStock}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Variants ({variants.length})
          </h2>
          <Button>
            <Link href={`/admin/motorcycles/${id}/variants/new`} className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Thêm variant
            </Link>
          </Button>
        </div>

        {variants.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            Chưa có variant nào. Hãy thêm variant để hiển thị sản phẩm.
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {variants.map((variant) => (
              <div key={variant.id} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Color */}
                  <div 
                    className="w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                    style={{ backgroundColor: variant.colorCode || '#ccc' }}
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {variant.variantName}
                      </p>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getVariantStatusColor(variant.status))}>
                        {variant.status === "AVAILABLE" && "Còn hàng"}
                        {variant.status === "OUT_OF_STOCK" && "Hết hàng"}
                        {variant.status === "DISCONTINUED" && "Ngừng KD"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                      <span>{variant.colorName}</span>
                      <span>•</span>
                      <span>SKU: {variant.sku}</span>
                      <span>•</span>
                      <span>SL: {variant.stockQuantity}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      {formatCurrency(variant.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(variant)}>
                      Sửa
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openImageModal(variant)}>
                      📷 Ảnh ({variant.images?.length || 0})
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteVariant(variant.id, variant.variantName)}>
                      Xóa
                    </Button>
                  </div>
                </div>

                {/* Image Preview */}
                {variant.images && variant.images.length > 0 && (
                  <div className="mt-3 pl-16 flex gap-2 overflow-x-auto">
                    {variant.images.map((img) => (
                      <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent flex-shrink-0">
                        <Image
                          src={img.imageUrl}
                          alt={variant.variantName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        {img.isThumbnail && (
                          <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white text-xs text-center py-0.5">
                            Avatar
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Management Modal */}
      <Modal open={imageModalOpen} onClose={() => setImageModalOpen(false)} size="lg">
        <ModalHeader>Quản lý ảnh - {selectedVariant?.variantName}</ModalHeader>
        <ModalBody>
          {/* Add by URL */}
          <div className="mb-6">
            <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Thêm ảnh bằng URL</h3>
            <div className="flex gap-2">
              <Input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <Button onClick={handleAddImageByUrl} isLoading={isUploading}>
                Thêm
              </Button>
            </div>
          </div>

          {/* Upload file */}
          <div className="mb-6">
            <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Upload ảnh từ máy</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300"
            />
          </div>

          {/* Image List */}
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Danh sách ảnh</h3>
            {selectedVariant?.images && selectedVariant.images.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {selectedVariant.images.map((img) => (
                  <div key={img.id} className="relative group">
                    <div className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2",
                      img.isThumbnail ? "border-primary-500" : "border-neutral-200 dark:border-neutral-700"
                    )}>
                      <Image
                        src={img.imageUrl}
                        alt={selectedVariant.variantName}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                    {img.isThumbnail && (
                      <span className="absolute top-1 left-1 bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded">
                        Avatar
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {!img.isThumbnail && (
                        <Button size="sm" variant="ghost" onClick={() => handleSetThumbnail(img.id)}>
                          Set
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-error" onClick={() => handleDeleteImage(img.id)}>
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">Chưa có ảnh nào</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setImageModalOpen(false)}>Đóng</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Variant Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} size="lg">
        <ModalHeader>Chỉnh sửa Variant - {editingVariant?.variantName}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tên variant *
                </label>
                <Input
                  value={editForm.variantName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, variantName: e.target.value }))}
                  placeholder="Honda Vision 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  SKU *
                </label>
                <Input
                  value={editForm.sku}
                  onChange={(e) => setEditForm(prev => ({ ...prev, sku: e.target.value }))}
                  placeholder="HVN-VISION-ABC"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tên màu *
                </label>
                <Input
                  value={editForm.colorName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, colorName: e.target.value }))}
                  placeholder="Đen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Mã màu (hex)
                </label>
                <Input
                  value={editForm.colorCode}
                  onChange={(e) => setEditForm(prev => ({ ...prev, colorCode: e.target.value }))}
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Giá (VND) *
                </label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="35000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Số lượng tồn kho *
                </label>
                <Input
                  type="number"
                  value={editForm.stockQuantity}
                  onChange={(e) => setEditForm(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Trạng thái
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editStatus"
                    value="AVAILABLE"
                    checked={editForm.status === "AVAILABLE"}
                    onChange={() => setEditForm(prev => ({ ...prev, status: "AVAILABLE" }))}
                    className="text-primary-600"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">Còn hàng</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editStatus"
                    value="OUT_OF_STOCK"
                    checked={editForm.status === "OUT_OF_STOCK"}
                    onChange={() => setEditForm(prev => ({ ...prev, status: "OUT_OF_STOCK" }))}
                    className="text-primary-600"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">Hết hàng</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editStatus"
                    value="DISCONTINUED"
                    checked={editForm.status === "DISCONTINUED"}
                    onChange={() => setEditForm(prev => ({ ...prev, status: "DISCONTINUED" }))}
                    className="text-primary-600"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">Ngừng kinh doanh</span>
                </label>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveVariant} isLoading={isSavingVariant}>Lưu</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}