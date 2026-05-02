"use client";

import Image from "next/image";
import Link from "next/link";
import { Order } from "@/types";
import { OrderStatusBadge } from "./order-status-badge";
import { ButtonLink } from "@/components/ui";
import { cn } from "@/lib";

interface OrderRowProps {
  order: Order;
  onCancel?: (orderId: number) => void;
  isCancelling?: boolean;
}

export function OrderRow({ order, onCancel, isCancelling }: OrderRowProps) {
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Order Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Mã đơn hàng
            </p>
            <p className="font-semibold text-neutral-900 dark:text-white">
              {order.orderCode}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Ngày đặt
            </p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Số sản phẩm
            </p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {order.totalItems} sản phẩm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {canCancel && onCancel && (
            <ButtonLink
              href={`/orders/${order.id}`}
              variant="outline"
              size="sm"
            >
              Chi tiết
            </ButtonLink>
          )}
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="p-4">
        <div className="flex flex-wrap gap-3">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={item.imageUrl}
                  alt={item.motorcycleName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">
                  {item.motorcycleName}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.variantName} x {item.quantity}
                </p>
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-500">
              +{order.items.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Order Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          <span className="mr-3">
            Thanh toán: {order.paymentMethod === "COD" ? "Tiền mặt" : "Online"}
          </span>
          <span className={cn(
            order.paymentStatus === "PAID" && "text-success",
            order.paymentStatus === "PENDING" && "text-warning",
            order.paymentStatus === "FAILED" && "text-error"
          )}>
            {order.paymentStatus === "PAID" && "Đã thanh toán"}
            {order.paymentStatus === "PENDING" && "Chờ thanh toán"}
            {order.paymentStatus === "FAILED" && "Thất bại"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Tổng tiền</p>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {new Intl.NumberFormat("vi-VN", { 
              style: "currency", 
              currency: "VND",
              maximumFractionDigits: 0
            }).format(order.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderRow;