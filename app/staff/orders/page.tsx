"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/order.service";
import { Order, OrderStatus } from "@/types";
import { toast } from "@/stores/ui.store";
import { Button, Spinner } from "@/components/ui";
import { StaffOrderDetailModal } from "@/components/features/orders/staff-order-detail-modal";
import { cn } from "@/lib";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusLabels: Record<OrderStatus | "ALL", string> = {
  ALL: "Tất cả",
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING": return "bg-warning/10 text-warning";
    case "CONFIRMED": return "bg-info/10 text-info";
    case "PROCESSING": return "bg-info/10 text-info";
    case "SHIPPED": return "bg-primary-50 text-primary-700";
    case "DELIVERED": return "bg-success/10 text-success";
    case "CANCELLED": return "bg-error/10 text-error";
    default: return "bg-neutral-100 text-neutral-600";
  }
};

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const filters = selectedStatus !== "ALL" ? { status: selectedStatus } : undefined;
      const response = await orderService.getAllOrders(filters);
      setOrders(response.content);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Lỗi", "Không thể tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (orderId: number) => {
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleOrderUpdated = () => {
    fetchOrders();
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
          Quản lý đơn hàng
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Cập nhật trạng thái đơn hàng
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedStatus === status
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700"
            )}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Mã đơn</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Khách hàng</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">SĐT</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Tổng tiền</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Ngày tạo</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-500 dark:text-neutral-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {order.orderCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {order.shippingName}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {order.shippingPhone}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(order.status))}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetail(order.id)}>
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <StaffOrderDetailModal
          orderId={selectedOrderId}
          open={modalOpen}
          onClose={handleModalClose}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}