"use client";

import { Variant } from "@/types";
import { cn } from "@/lib";

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Color / Version
        </span>
        {selectedVariant && (
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {selectedVariant.variantName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.status === "OUT_OF_STOCK" || variant.stockQuantity === 0;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
              className={cn(
                "relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200",
                "hover:border-neutral-400 dark:hover:border-neutral-600",
                isSelected 
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                  : "border-neutral-200 dark:border-neutral-700",
                isOutOfStock && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Color swatch */}
              {variant.colorCode && (
                <div 
                  className="w-6 h-6 rounded-full border border-neutral-200 dark:border-neutral-600"
                  style={{ backgroundColor: variant.colorCode }}
                />
              )}

              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                  {variant.colorName}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Intl.NumberFormat("vi-VN", { 
                    style: "currency", 
                    currency: "VND" 
                  }).format(variant.price)}
                </div>
              </div>

              {isOutOfStock && (
                <span className="absolute top-1 right-1 text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                  Hết hàng
                </span>
              )}

              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSelector;