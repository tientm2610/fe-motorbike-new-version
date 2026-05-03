"use client";

import { useState, useEffect, useCallback } from "react";
import { Motorcycle, Variant } from "@/types";
import { motorcycleService } from "@/services/motorcycle.service";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "@/stores/ui.store";
import { ImageGallery } from "@/components/features/motorcycles/image-gallery";
import { VariantSelector } from "@/components/features/motorcycles/variant-selector";
import { Specifications } from "@/components/features/motorcycles/specifications";
import { RelatedProducts } from "@/components/features/motorcycles/related-products";
import { StickyAddToCart } from "@/components/features/motorcycles/sticky-add-to-cart";
import { Button } from "@/components/ui";
import { cn } from "@/lib";

interface ProductDetailClientProps {
  motorcycle: Motorcycle;
}

export function ProductDetailClient({ motorcycle }: ProductDetailClientProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isLoadingVariants, setIsLoadingVariants] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    async function loadVariants() {
      try {
        const data = await motorcycleService.getVariants(motorcycle.id);
        setVariants(data);
        if (data.length > 0) {
          const availableVariant = data.find(v => v.status === "AVAILABLE" && v.stockQuantity > 0);
          setSelectedVariant(availableVariant || data[0]);
        }
      } catch (error) {
        console.error("Failed to load variants:", error);
      } finally {
        setIsLoadingVariants(false);
      }
    }
    loadVariants();
  }, [motorcycle.id]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn phiên bản", "");
      return;
    }

    if (selectedVariant.status === "OUT_OF_STOCK" || selectedVariant.stockQuantity === 0) {
      toast.error("Sản phẩm đã hết hàng", "");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(selectedVariant.id, quantity);
      toast.success("Đã thêm vào giỏ hàng", "");
    } catch (error) {
      toast.error("Thêm vào giỏ hàng thất bại", "");
    } finally {
      setIsAddingToCart(false);
    }
  }, [selectedVariant, motorcycle, quantity, addItem, toast]);

  const currentPrice = selectedVariant?.price || motorcycle.minPrice;
  const isOutOfStock = selectedVariant 
    ? selectedVariant.status === "OUT_OF_STOCK" || selectedVariant.stockQuantity === 0
    : motorcycle.totalStock === 0;

  const allImages = selectedVariant?.images || [];

  return (
    <div className="pb-20 lg:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <li>
              <a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                Trang chủ
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/motorcycles" className="hover:text-primary-600 dark:hover:text-primary-400">
                Motorcycles
              </a>
            </li>
            <li>/</li>
            <li className="text-neutral-900 dark:text-white">{motorcycle.name}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <ImageGallery 
              images={allImages} 
              productName={motorcycle.name}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {motorcycle.brandName} • {motorcycle.categoryName}
              </p>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {motorcycle.name}
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                SKU: {motorcycle.code}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {new Intl.NumberFormat("vi-VN", { 
                  style: "currency", 
                  currency: "VND",
                  maximumFractionDigits: 0
                }).format(currentPrice)}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-error/10 text-error rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-error rounded-full" />
                  Hết hàng
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  Còn hàng ({selectedVariant?.stockQuantity || motorcycle.totalStock})
                </span>
              )}
            </div>

            {/* Description */}
            {motorcycle.description && (
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-neutral-600 dark:text-neutral-400">
                  {motorcycle.description}
                </p>
              </div>
            )}

            {/* Variant Selector */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <VariantSelector
                variants={variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Số lượng
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 10, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                isLoading={isAddingToCart}
                size="lg"
                className="flex-1"
              >
                {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Bảo hành 2 năm
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 42h.583a.583.583 0 00.583-.583V39.75a.583.583 0 00-.583-.583h-1.167a.583.583 0 00-.583.583v1.667c0 .321.262.583.583.583H11m5.417-15.75h1.083a.583.583 0 01.583.583v1.667a.583.583 0 01-.583.583h-1.083a.583.583 0 01-.583-.583v-1.667c0-.321.262-.583.583-.583zM20.25 10.5h.708a.375.375 0 00.375-.375v-.667a.375.375 0 00-.375-.375h-1.083a.375.375 0 00-.375.375v.667c0 .207.168.375.375.375H20.25M9 12.75h.75a.375.375 0 00.375-.375v-.667a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v.667c0 .207.168.375.375.375H9M4.5 10.5h.708a.375.375 0 00.375-.375v-.667a.375.375 0 00-.375-.375H3.75a.375.375 0 00-.375.375v.667c0 .207.168.375.375.375H4.5" />
                </svg>
                Miễn phí vận chuyển
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Đổi trả 30 ngày
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Giao hàng nhanh
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16">
          <Specifications 
            specsJson={motorcycle.specsJson}
            productName={motorcycle.name}
          />
        </div>

        {/* Related Products - Need to fetch from parent category */}
        <div className="mt-16">
          <RelatedProducts 
            products={[]}
            currentProductId={motorcycle.id}
          />
        </div>
      </div>

      {/* Sticky Add to Cart */}
      <StickyAddToCart
        productName={motorcycle.name}
        selectedVariant={selectedVariant}
        onAddToCart={handleAddToCart}
        isAddingToCart={isAddingToCart}
      />
    </div>
  );
}