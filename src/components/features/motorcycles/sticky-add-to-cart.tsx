"use client";

import { useState, useEffect } from "react";
import { Variant } from "@/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib";

interface StickyAddToCartProps {
  productName: string;
  selectedVariant: Variant | null;
  onAddToCart: () => void;
  isAddingToCart?: boolean;
}

export function StickyAddToCart({ 
  productName, 
  selectedVariant, 
  onAddToCart,
  isAddingToCart 
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const price = selectedVariant?.price || 0;
  const isOutOfStock = selectedVariant?.status === "OUT_OF_STOCK" || (selectedVariant?.stockQuantity || 0) === 0;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-white dark:bg-neutral-900",
        "border-t border-neutral-200 dark:border-neutral-800",
        "transform transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              {productName}
            </p>
            <p className="font-bold text-neutral-900 dark:text-white">
              {new Intl.NumberFormat("vi-VN", { 
                style: "currency", 
                currency: "VND",
                maximumFractionDigits: 0
              }).format(price)}
            </p>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={onAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            isLoading={isAddingToCart}
            className="shrink-0"
          >
            {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StickyAddToCart;