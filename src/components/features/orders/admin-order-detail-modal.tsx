"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Order, OrderStatus, OrderItem } from "@/types";
import { orderService } from "@/services/order.service";
import { toast } from "@/stores/ui.store";
import { Button } from "@/components/ui";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "@/components/ui/modal";
import { cn } from "@/lib";

interface AdminOrderDetailModalProps {
  orderId: number;
  open: boolean;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusLabels: Record<OrderStatus, string> = {
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

const nextStatusFlow: Record<OrderStatus, OrderStatus | null> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

export function AdminOrderDetailModal({ orderId, open, onClose, onOrderUpdated }: AdminOrderDetailModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetail();
    }
  }, [open, orderId]);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAdminOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
      toast.error("Lỗi", "Không thể tải chi tiết đơn hàng");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success("Cập nhật thành công", `Đơn hàng đã chuyển sang trạng thái ${statusLabels[newStatus]}`);
      onOrderUpdated?.();
      fetchOrderDetail();
    } catch (error) {
      toast.error("Lỗi", "Không thể cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(orderId, "CANCELLED");
      toast.success("Đã hủy", "Đơn hàng đã được hủy");
      onOrderUpdated?.();
      fetchOrderDetail();
    } catch (error) {
      toast.error("Lỗi", "Không thể hủy đơn hàng");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderOrderItems = (items: OrderItem[]) => {
    if (!items || items.length === 0) {
      return <p className="text-sm text-neutral-500">{order?.totalItems || 0} sản phẩm</p>;
    }

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.motorcycleName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                {item.motorcycleName}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {item.variantName} • {item.colorName}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-neutral-500">SL: {item.quantity}</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal open={open} onClose={onClose} size="lg" className="max-h-[90vh] overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-neutral-500">Đang tải...</span>
        </div>
      ) : order ? (
        <>
          <ModalHeader className="flex items-center justify-between pr-10">
            <div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Đơn hàng </span>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">{order.orderCode}</span>
            </div>
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getStatusColor(order.status))}>
              {statusLabels[order.status]}
            </span>
          </ModalHeader>

          <ModalBody className="space-y-4">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </div>

            {/* Customer Info */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Thông tin khách hàng</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-neutral-500">Họ tên:</span> {order.shippingName}</p>
                <p><span className="text-neutral-500">SĐT:</span> {order.shippingPhone}</p>
                <p><span className="text-neutral-500">Địa chỉ:</span> {order.shippingAddress}</p>
                {order.notes && <p><span className="text-neutral-500">Ghi chú:</span> {order.notes}</p>}
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Sản phẩm ({order.totalItems})</h3>
              {renderOrderItems(order.items)}
            </div>

            {/* Payment Info */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Thông tin thanh toán</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-neutral-500">Phương thức: </span>
                  {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
                </p>
                <p>
                  <span className="text-neutral-500">Trạng thái: </span>
                  <span className={cn(
                    order.paymentStatus === "PAID" && "text-success",
                    order.paymentStatus === "PENDING" && "text-warning",
                    order.paymentStatus === "FAILED" && "text-error"
                  )}>
                    {order.paymentStatus === "PAID" && "Đã thanh toán"}
                    {order.paymentStatus === "PENDING" && "Chờ thanh toán"}
                    {order.paymentStatus === "FAILED" && "Thất bại"}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Total */}
            <div className="flex justify-between items-center p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <span className="font-medium text-neutral-900 dark:text-white">Tổng cộng</span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </ModalBody>

          <ModalFooter>
            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  isLoading={isUpdating}
                  className="text-error border-error hover:bg-error/10"
                >
                  Hủy đơn
                </Button>
                {nextStatusFlow[order.status] && (
                  <Button
                    onClick={() => handleUpdateStatus(nextStatusFlow[order.status]!)}
                    isLoading={isUpdating}
                  >
                    {nextStatusFlow[order.status] === "CONFIRMED" && "Xác nhận đơn"}
                    {nextStatusFlow[order.status] === "PROCESSING" && "Bắt đầu xử lý"}
                    {nextStatusFlow[order.status] === "SHIPPED" && "Giao hàng"}
                    {nextStatusFlow[order.status] === "DELIVERED" && "Xác nhận đã giao"}
                  </Button>
                )}
              </>
            )}
            {order.status === "CANCELLED" && (
              <span className="text-error text-sm">Đơn hàng đã bị hủy</span>
            )}
            {order.status === "DELIVERED" && (
              <span className="text-success text-sm">Đơn hàng đã hoàn thành</span>
            )}
            <Button variant="ghost" onClick={onClose}>Đóng</Button>
          </ModalFooter>
        </>
      ) : null}
    </Modal>
  );
}

export default AdminOrderDetailModal;