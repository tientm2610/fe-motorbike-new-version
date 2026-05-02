"use client";

import { ButtonLink } from "@/components/ui";

interface CartSummaryProps {
  subtotal: number;
  estimatedTotal: number;
  totalQuantity: number;
}

export function CartSummary({ subtotal, estimatedTotal, totalQuantity }: CartSummaryProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Subtotal ({totalQuantity} items)</span>
          <span>
            {new Intl.NumberFormat("vi-VN", { 
              style: "currency", 
              currency: "VND",
              maximumFractionDigits: 0
            }).format(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Shipping</span>
          <span className="text-success">Free</span>
        </div>

        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
          <span>Tax</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-neutral-900 dark:text-white">Total</span>
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {new Intl.NumberFormat("vi-VN", { 
              style: "currency", 
              currency: "VND",
              maximumFractionDigits: 0
            }).format(estimatedTotal)}
          </span>
        </div>
      </div>

      <ButtonLink 
        href="/checkout"
        size="lg"
        className="w-full justify-center"
      >
        Proceed to Checkout
      </ButtonLink>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
        Secure checkout • Free shipping over ₫500,000
      </p>
    </div>
  );
}

export default CartSummary;