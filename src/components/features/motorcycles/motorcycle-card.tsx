"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, Badge, Button } from "@/components/ui";
import { useCartStore } from "@/stores";
import { toast } from "@/stores/ui.store";
import type { MotorcycleListItem } from "@/types";

interface MotorcycleCardProps {
  motorcycle: MotorcycleListItem;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

export function MotorcycleCard({ motorcycle }: MotorcycleCardProps) {
  const { addItem, isLoading } = useCartStore();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(motorcycle.id, 1);
      toast.success("Added to cart", `${motorcycle.name} added to cart`);
    } catch {
      toast.error("Failed to add", "Could not add item to cart");
    }
  };

  const inStock = motorcycle.totalStock > 0;

  return (
    <Link href={`/motorcycles/${motorcycle.slug}`}>
      <Card variant="interactive" padding="none" className="group overflow-hidden h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {motorcycle.thumbnailUrl ? (
            <Image
              src={motorcycle.thumbnailUrl}
              alt={motorcycle.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg className="w-16 h-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Stock Badge */}
          <div className="absolute top-3 left-3">
            {inStock ? (
              <Badge variant="success">
                Còn {motorcycle.totalStock}
              </Badge>
            ) : (
              <Badge variant="error">Hết hàng</Badge>
            )}
          </div>

          {/* Quick Add Button */}
          {inStock && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              disabled={isLoading}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
            >
              <Button size="sm" className="shadow-lg">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Thêm nhanh
              </Button>
            </motion.button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>{motorcycle.brandName}</span>
            <span>•</span>
            <span>{motorcycle.categoryName}</span>
          </div>
          
          <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">
            {motorcycle.name}
          </h3>
          
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(motorcycle.minPrice)}
              </span>
              {motorcycle.maxPrice && motorcycle.minPrice !== motorcycle.maxPrice && (
                <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                  - {formatPrice(motorcycle.maxPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default MotorcycleCard;