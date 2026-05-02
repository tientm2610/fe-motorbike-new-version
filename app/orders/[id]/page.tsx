import { Suspense } from "react";
import { notFound } from "next/navigation";
import { orderService } from "@/services/order.service";
import { OrderDetailClient } from "./order-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  try {
    const orderId = parseInt(id);
    if (isNaN(orderId)) return null;
    const order = await orderService.getOrderById(orderId);
    return order;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Order ${id} | Honda Dealership`,
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Đang tải...</div>}>
      <OrderDetailClient order={order} />
    </Suspense>
  );
}