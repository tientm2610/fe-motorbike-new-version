"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "@/stores/ui.store";
import { CartItem } from "@/components/features/cart/cart-item";
import { CartSummary } from "@/components/features/cart/cart-summary";
import { ButtonLink } from "@/components/ui";

export default function CartPage() {
  const { cart, fetchCart, updateItem, removeItem, isLoading } = useCartStore();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    setIsUpdating(itemId);
    try {
      await updateItem(itemId, quantity);
      toast.success("Đã cập nhật", "Giỏ hàng đã được cập nhật");
    } catch (error) {
      toast.error("Lỗi", "Không thể cập nhật số lượng");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setIsUpdating(itemId);
    try {
      await removeItem(itemId);
      toast.success("Đã xóa", "Sản phẩm đã được xóa khỏi giỏ");
    } catch (error) {
      toast.error("Lỗi", "Không thể xóa sản phẩm");
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-neutral-200 dark:bg-neutral-800 rounded-xl h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Handle when cart is null or undefined
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Giỏ hàng trống
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </p>
          <ButtonLink href="/motorcycles" size="lg">
            Mua sắm ngay
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
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
          <li className="text-neutral-900 dark:text-white">Giỏ hàng</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
        Giỏ hàng ({cart.totalQuantity || 0} sản phẩm)
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
              isUpdating={isUpdating === item.id}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CartSummary
              subtotal={cart.subtotal}
              estimatedTotal={cart.estimatedTotal}
              totalQuantity={cart.totalQuantity}
            />

            {/* Continue Shopping */}
            <div className="mt-4 text-center">
              <ButtonLink href="/motorcycles" variant="ghost" size="sm">
                ← Tiếp tục mua sắm
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}