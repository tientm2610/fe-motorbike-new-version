"use client";

import { OrderStatus } from "@/types";
import { cn } from "@/lib";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { 
    label: "Chờ xác nhận", 
    className: "bg-warning/10 text-warning" 
  },
  CONFIRMED: { 
    label: "Đã xác nhận", 
    className: "bg-info/10 text-info" 
  },
  PROCESSING: { 
    label: "Đang xử lý", 
    className: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" 
  },
  SHIPPED: { 
    label: "Đang giao", 
    className: "bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300" 
  },
  DELIVERED: { 
    label: "Đã giao", 
    className: "bg-success/10 text-success" 
  },
  CANCELLED: { 
    label: "Đã hủy", 
    className: "bg-error/10 text-error" 
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
      config.className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === "PENDING" && "bg-warning",
        status === "CONFIRMED" && "bg-info",
        status === "PROCESSING" && "bg-primary-500",
        status === "SHIPPED" && "bg-accent-500",
        status === "DELIVERED" && "bg-success",
        status === "CANCELLED" && "bg-error"
      )} />
      {config.label}
    </span>
  );
}

export default OrderStatusBadge;