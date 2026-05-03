"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { orderService } from "@/services/order.service";
import { useAuth } from "@/hooks/use-auth";
import { Card, Spinner } from "@/components/ui";
import { cn } from "@/lib";
import type { OrderStatus } from "@/types";

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: number;
  name: string;
  thumbnailUrl: string;
  totalSold: number;
  revenue: number;
}

interface RecentOrder {
  id: number;
  orderCode: string;
  shippingName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
}

function StatsCard({ title, value, icon, trend, trendType }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
          {trend && (
            <p className={cn(
              "mt-1 text-sm",
              trendType === "up" && "text-success",
              trendType === "down" && "text-error",
              trendType === "neutral" && "text-neutral-500"
            )}>
              {trend}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-primary-50 p-3 dark:bg-primary-900/20">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [summary, revenue, topProd, ordersRes] = await Promise.all([
          orderService.getDashboardSummary(),
          orderService.getRevenueData(30),
          orderService.getTopProducts(5),
          orderService.getAllOrders({ status: "PENDING", size: 100 }),
        ]);
        
        setStats({
          totalOrders: summary.totalOrders,
          pendingOrders: ordersRes.content.length,
          totalRevenue: summary.totalRevenue,
          totalCustomers: summary.totalCustomers,
        });
        setRevenueData(revenue);
        setTopProducts(topProd);
        setRecentOrders(ordersRes.content.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

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
          Dashboard
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Chào mừng {user?.fullName || "Admin"}! Tổng quan hệ thống
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          icon={
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatsCard
          title="Đơn chờ xử lý"
          value={stats.pendingOrders}
          icon={
            <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend="Cần xử lý"
          trendType="neutral"
        />
        <StatsCard
          title="Doanh thu"
          value={formatCurrency(stats.totalRevenue)}
          icon={
            <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend="Tổng doanh thu"
          trendType="neutral"
        />
        <StatsCard
          title="Khách hàng"
          value={stats.totalCustomers}
          icon={
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            <div className="rounded-lg bg-primary-50 p-2 dark:bg-primary-900/20">
              <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">Quản lý đơn hàng</p>
              <p className="text-sm text-neutral-500">Xem và cập nhật đơn hàng</p>
            </div>
          </a>
          
          <a
            href="/admin/motorcycles"
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            <div className="rounded-lg bg-success/10 p-2">
              <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">Thêm sản phẩm</p>
              <p className="text-sm text-neutral-500">Thêm xe mới vào hệ thống</p>
            </div>
          </a>

          <a
            href="/admin/brands"
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            <div className="rounded-lg bg-warning/10 p-2">
              <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">Quản lý thương hiệu</p>
              <p className="text-sm text-neutral-500">Thêm/sửa thương hiệu xe</p>
            </div>
          </a>

          <a
            href="/admin/categories"
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            <div className="rounded-lg bg-error/10 p-2">
              <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">Quản lý danh mục</p>
              <p className="text-sm text-neutral-500">Thêm/sửa danh mục xe</p>
            </div>
          </a>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Doanh thu 30 ngày gần nhất
        </h2>
        <Card className="p-6">
          {revenueData.length > 0 ? (
            <div className="h-64 flex items-end gap-1">
              {revenueData.map((day, index) => {
                const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-colors min-h-[4px]"
                      style={{ height: `${height}%` }}
                      title={`${formatCurrency(day.revenue)}`}
                    />
                    <span className="text-xs text-neutral-400">{new Date(day.date).getDate()}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-500">
              Chưa có dữ liệu doanh thu
            </div>
          )}
        </Card>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Đơn hàng gần nhất
            </h2>
            <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
              Xem tất cả →
            </Link>
          </div>
          <Card className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{order.orderCode}</p>
                    <p className="text-sm text-neutral-500">{order.shippingName} • {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900 dark:text-white">{formatCurrency(order.totalAmount)}</p>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      order.status === "PENDING" && "bg-warning/10 text-warning",
                      order.status === "CONFIRMED" && "bg-info/10 text-info",
                      order.status === "PROCESSING" && "bg-info/10 text-info",
                      order.status === "SHIPPED" && "bg-primary-50 text-primary-700",
                      order.status === "DELIVERED" && "bg-success/10 text-success",
                      order.status === "CANCELLED" && "bg-error/10 text-error",
                    )}>
                      {order.status === "PENDING" && "Chờ xác nhận"}
                      {order.status === "CONFIRMED" && "Đã xác nhận"}
                      {order.status === "PROCESSING" && "Đang xử lý"}
                      {order.status === "SHIPPED" && "Đang giao"}
                      {order.status === "DELIVERED" && "Đã giao"}
                      {order.status === "CANCELLED" && "Đã hủy"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500">Chưa có đơn hàng nào</div>
            )}
          </Card>
        </div>

        {/* Top Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Sản phẩm bán chạy
            </h2>
            <Link href="/admin/motorcycles" className="text-sm text-primary-600 hover:text-primary-700">
              Xem tất cả →
            </Link>
          </div>
          <Card className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.id} className="p-4 flex items-center gap-4">
                  <span className="text-lg font-bold text-neutral-300">#{index + 1}</span>
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                    <Image
                      src={product.thumbnailUrl || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-sm text-neutral-500">Đã bán: {product.totalSold}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary-600">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500">Chưa có sản phẩm nào</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}