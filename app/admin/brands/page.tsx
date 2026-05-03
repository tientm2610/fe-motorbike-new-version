"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Brand } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Spinner, Input } from "@/components/ui";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "@/components/ui/modal";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setEditName(brand.name);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBrand || !editName.trim()) return;
    
    setIsSaving(true);
    try {
      await adminService.updateBrand(editingBrand.id, editName);
      toast.success("Thành công", "Đã cập nhật thương hiệu");
      setEditModalOpen(false);
      fetchBrands();
    } catch (error) {
      toast.error("Lỗi", "Không thể cập nhật thương hiệu");
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(brand)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBrand(brand.id, brand.name)}
                        className="text-error hover:text-error"
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalHeader>Chỉnh sửa thương hiệu</ModalHeader>
        <ModalBody>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Tên thương hiệu
            </label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nhập tên thương hiệu..."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveEdit} isLoading={isSaving}>Lưu</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}