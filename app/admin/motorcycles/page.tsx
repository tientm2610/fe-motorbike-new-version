"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/services/admin.service";
import { MotorcycleListItem } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Spinner, ButtonLink, Skeleton, SkeletonList } from "@/components/ui";
import { cn } from "@/lib";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AdminMotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const fetchMotorcycles = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getMotorcycles({ size: 100 });
      setMotorcycles(response.content);
    } catch (error) {
      console.error("Failed to fetch motorcycles:", error);
      toast.error("Lỗi", "Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) return;
    
    try {
      await adminService.deleteMotorcycle(id);
      toast.success("Xóa thành công", `Đã xóa sản phẩm ${name}`);
      fetchMotorcycles();
    } catch (error) {
      toast.error("Lỗi", "Không thể xóa sản phẩm");
    }
  };

  const filteredMotorcycles = motorcycles.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div>
        <div className="mb-8 flex justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <SkeletonList count={5} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Quản lý sản phẩm
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Danh sách xe máy trong hệ thống
          </p>
        </div>
        <Button>
          <Link href="/admin/motorcycles/new" className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Thêm sản phẩm
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />
      </div>

      {/* Products Grid */}
      {filteredMotorcycles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500">Không có sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMotorcycles.map((motorcycle) => (
            <div
              key={motorcycle.id}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            >
              {/* Image */}
              <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800">
                {motorcycle.thumbnailUrl ? (
                  <img
                    src={motorcycle.thumbnailUrl}
                    alt={motorcycle.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <span className={cn(
                  "absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-medium",
                  motorcycle.totalStock > 0 
                    ? "bg-success/10 text-success" 
                    : "bg-error/10 text-error"
                )}>
                  {motorcycle.totalStock > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                  {motorcycle.name}
                </h3>
                <p className="text-sm text-neutral-500">{motorcycle.brandName} • {motorcycle.categoryName}</p>
                <p className="mt-2 text-lg font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(motorcycle.minPrice)}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm text-neutral-500">
                  <span>Tồn kho: {motorcycle.totalStock}</span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <ButtonLink 
                    href={`/admin/motorcycles/${motorcycle.id}`}
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    Sửa
                  </ButtonLink>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(motorcycle.id, motorcycle.name)}
                    className="text-error hover:text-error"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}