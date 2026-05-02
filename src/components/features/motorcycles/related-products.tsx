"use client";

import Link from "next/link";
import Image from "next/image";
import { MotorcycleListItem } from "@/types";
import { cn } from "@/lib";

interface RelatedProductsProps {
  products: MotorcycleListItem[];
  currentProductId?: number;
}

export function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const filteredProducts = currentProductId 
    ? products.filter(p => p.id !== currentProductId).slice(0, 4)
    : products.slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
        Sản phẩm liên quan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/motorcycles/${product.slug}`}
            className={cn(
              "group block bg-white dark:bg-neutral-900 rounded-xl overflow-hidden",
              "border border-neutral-200 dark:border-neutral-800",
              "hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700",
              "transition-all duration-300"
            )}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={product.thumbnailUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {product.name}
              </h3>
              
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {product.brandName}
              </p>

              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-primary-600 dark:text-primary-400 text-sm">
                  {new Intl.NumberFormat("vi-VN", { 
                    style: "currency", 
                    currency: "VND",
                    maximumFractionDigits: 0
                  }).format(product.minPrice)}
                </span>

                {product.totalStock > 0 ? (
                  <span className="text-xs text-success">Còn hàng</span>
                ) : (
                  <span className="text-xs text-neutral-400">Hết hàng</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;