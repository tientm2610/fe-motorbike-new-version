"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Brand } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Spinner, Input } from "@/components/ui";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      toast.error("Lỗi", "Không thể tải danh sách thương hiệu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    
    setIsAdding(true);
    try {
      await adminService.createBrand(newBrandName);
      toast.success("Thành công", "Đã thêm thương hiệu mới");
      setNewBrandName("");
      fetchBrands();
    } catch (error) {
      toast.error("Lỗi", "Không thể thêm thương hiệu");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteBrand = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa thương hiệu "${name}"?`)) return;
    
    try {
      await adminService.deleteBrand(id);
      toast.success("Xóa thành công", `Đã xóa thương hiệu ${name}`);
      fetchBrands();
    } catch (error) {
      toast.error("Lỗi", "Không thể xóa thương hiệu");
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
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Quản lý thương hiệu
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Quản lý các thương hiệu xe máy
        </p>
      </div>

      {/* Add Brand Form */}
      <div className="mb-8 flex gap-4">
        <Input
          placeholder="Nhập tên thương hiệu mới..."
          value={newBrandName}
          onChange={(e) => setNewBrandName(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleAddBrand} isLoading={isAdding}>
          Thêm thương hiệu
        </Button>
      </div>

      {/* Brands List */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Tên thương hiệu</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Logo</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-500 dark:text-neutral-400">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {brands.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  Chưa có thương hiệu nào
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 text-sm text-neutral-500">{brand.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-900 dark:text-white">{brand.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBrand(brand.id, brand.name)}
                      className="text-error hover:text-error"
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}