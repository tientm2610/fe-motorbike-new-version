import { Suspense } from "react";
import { notFound } from "next/navigation";
import { motorcycleService } from "@/services/motorcycle.service";
import { ProductDetailClient } from "./product-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getMotorcycle(slug: string) {
  try {
    const motorcycle = await motorcycleService.getMotorcycleBySlug(slug);
    return motorcycle;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const motorcycle = await getMotorcycle(slug);
  
  if (!motorcycle) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${motorcycle.name} | Honda Dealership`,
    description: motorcycle.description || `Buy ${motorcycle.name} at Honda Dealership`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const motorcycle = await getMotorcycle(slug);

  if (!motorcycle) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient motorcycle={motorcycle} />
    </Suspense>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
            <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}