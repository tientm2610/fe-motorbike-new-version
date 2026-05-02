"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Order } from "@/types";
import { orderService } from "@/services/order.service";
import { toast } from "@/stores/ui.store";
import { OrderStatusBadge } from "@/components/features/orders/order-status-badge";
import { Button, ButtonLink, Spinner } from "@/components/ui";
import { cn } from "@/lib";

interface OrderDetailClientProps {
  order: Order;
}

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [orderData, setOrderData] = useState(order);

  const canCancel = orderData.status === "PENDING" || orderData.status === "CONFIRMED";

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      return;
    }

    setIsCancelling(true);
    try {
      const updatedOrder = await orderService.cancelOrder(orderData.id);
      setOrderData(updatedOrder);
      toast.success("Đã hủy đơn hàng", "Đơn hàng đã được hủy thành công");
    } catch (error) {
      toast.error("Lỗi", "Không thể hủy đơn hàng");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <li><Link href="/" className="hover:text-primary-600">Trang chủ</Link></li>
          <li>/</li>
          <li><Link href="/orders" className="hover:text-primary-600">Đơn hàng</Link></li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-white">{orderData.orderCode}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Đơn hàng {orderData.orderCode}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Đặt ngày {new Date(orderData.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <OrderStatusBadge status={orderData.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="font-semibold text-neutral-900 dark:text-white">
                Sản phẩm ({orderData.totalItems})
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.motorcycleName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {item.motorcycleName}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {item.variantName} • {item.colorName}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-neutral-500">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {new Intl.NumberFormat("vi-VN", { 
                          style: "currency", 
                          currency: "VND",
                          maximumFractionDigits: 0
                        }).format(item.subtotal)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Thông tin giao hàng
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-neutral-500 dark:text-neutral-400">Họ tên: </span>
                <span className="text-neutral-900 dark:text-white">{orderData.shippingName}</span>
              </p>
              <p>
                <span className="text-neutral-500 dark:text-neutral-400">Số điện thoại: </span>
                <span className="text-neutral-900 dark:text-white">{orderData.shippingPhone}</span>
              </p>
              <p>
                <span className="text-neutral-500 dark:text-neutral-400">Địa chỉ: </span>
                <span className="text-neutral-900 dark:text-white">{orderData.shippingAddress}</span>
              </p>
              {orderData.notes && (
                <p>
                  <span className="text-neutral-500 dark:text-neutral-400">Ghi chú: </span>
                  <span className="text-neutral-900 dark:text-white">{orderData.notes}</span>
                </p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Thông tin thanh toán
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-neutral-500 dark:text-neutral-400">Phương thức: </span>
                <span className="text-neutral-900 dark:text-white">
                  {orderData.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
                </span>
              </p>
              <p>
                <span className="text-neutral-500 dark:text-neutral-400">Trạng thái: </span>
                <span className={cn(
                  orderData.paymentStatus === "PAID" && "text-success",
                  orderData.paymentStatus === "PENDING" && "text-warning",
                  orderData.paymentStatus === "FAILED" && "text-error"
                )}>
                  {orderData.paymentStatus === "PAID" && "Đã thanh toán"}
                  {orderData.paymentStatus === "PENDING" && "Chờ thanh toán"}
                  {orderData.paymentStatus === "FAILED" && "Thất bại"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Tổng quan đơn hàng
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Tạm tính</span>
                <span className="text-neutral-900 dark:text-white">
                  {new Intl.NumberFormat("vi-VN", { 
                    style: "currency", 
                    currency: "VND",
                    maximumFractionDigits: 0
                  }).format(orderData.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Phí vận chuyển</span>
                <span className="text-success">Miễn phí</span>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {new Intl.NumberFormat("vi-VN", { 
                    style: "currency", 
                    currency: "VND",
                    maximumFractionDigits: 0
                  }).format(orderData.totalAmount)}
                </span>
              </div>
            </div>

            {/* Cancel Button */}
            {canCancel && (
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCancelOrder}
                  isLoading={isCancelling}
                >
                  Hủy đơn hàng
                </Button>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-4">
              <ButtonLink href="/orders" variant="ghost" className="w-full justify-center">
                ← Quay lại danh sách đơn hàng
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}