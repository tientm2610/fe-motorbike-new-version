"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Category } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Spinner, Input } from "@/components/ui";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Lỗi", "Không thể tải danh sách danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setIsAdding(true);
    try {
      await adminService.createCategory(newCategoryName);
      toast.success("Thành công", "Đã thêm danh mục mới");
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi", "Không thể thêm danh mục");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) return;
    
    try {
      await adminService.deleteCategory(id);
      toast.success("Xóa thành công", `Đã xóa danh mục ${name}`);
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi", "Không thể xóa danh mục");
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
          Quản lý danh mục
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Quản lý các danh mục xe máy
        </p>
      </div>

      {/* Add Category Form */}
      <div className="mb-8 flex gap-4">
        <Input
          placeholder="Nhập tên danh mục mới..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleAddCategory} isLoading={isAdding}>
          Thêm danh mục
        </Button>
      </div>

      {/* Categories List */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Tên danh mục</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Mô tả</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-500 dark:text-neutral-400">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  Chưa có danh mục nào
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 text-sm text-neutral-500">{category.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-900 dark:text-white">{category.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {category.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id, category.name)}
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