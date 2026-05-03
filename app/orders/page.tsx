"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { orderService } from "@/services/order.service";
import { Order, OrderStatus } from "@/types";
import { toast } from "@/stores/ui.store";
import { OrderRow } from "@/components/features/orders/order-row";
import { OrderDetailModal } from "@/components/features/orders/order-detail-modal";
import { ButtonLink, Spinner } from "@/components/ui";
import { cn } from "@/lib";

function OrdersContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const success = searchParams.get("success");
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    if (success === "true" && orderCode) {
      toast.success("Đặt hàng thành công!", `Mã đơn hàng: ${orderCode}`);
    }
  }, [success, orderCode]);

  const handleViewDetail = (orderId: number) => {
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedOrderId(null);
  };

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      try {
        const filters = selectedStatus !== "ALL" ? { status: selectedStatus } : undefined;
        const response = await orderService.getOrders(filters);
        setOrders(response.content);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Lỗi", "Không thể tải danh sách đơn hàng");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [selectedStatus]);

  const statusFilters: Array<{ value: OrderStatus | "ALL"; label: string }> = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <li><a href="/" className="hover:text-primary-600">Trang chủ</a></li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-white">Đơn hàng của tôi</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
        Đơn hàng của tôi
      </h1>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {statusFilters.map((status) => (
          <button
            key={status.value}
            onClick={() => setSelectedStatus(status.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedStatus === status.value
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            )}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Chưa có đơn hàng
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Bạn chưa có đơn hàng nào.
          </p>
          <ButtonLink href="/motorcycles" size="lg">
            Mua sắm ngay
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onViewDetail={handleViewDetail} />
          ))}
        </div>
      )}

      <OrderDetailModal
        orderId={selectedOrderId || 0}
        open={modalOpen}
        onClose={handleModalClose}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}