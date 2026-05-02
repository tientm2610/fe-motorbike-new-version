"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating?: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
      {/* Image */}
      <Link 
        href={`/motorcycles/${item.motorcycleSlug}`}
        className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800"
      >
        <Image
          src={item.imageUrl}
          alt={item.motorcycleName}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="128px"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Link 
          href={`/motorcycles/${item.motorcycleSlug}`}
          className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2"
        >
          {item.motorcycleName}
        </Link>
        
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {item.variantName} • {item.colorName}
        </p>

        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-auto">
          {new Intl.NumberFormat("vi-VN", { 
            style: "currency", 
            currency: "VND",
            maximumFractionDigits: 0
          }).format(item.unitPrice)}
        </p>
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-col items-end gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={isUpdating || item.quantity <= 1}
            className="w-8 h-8 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          
          <span className="w-10 text-center font-medium">{item.quantity}</span>
          
          <button
            onClick={handleIncrease}
            disabled={isUpdating}
            className="w-8 h-8 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Subtotal */}
        <p className="font-bold text-neutral-900 dark:text-white">
          {new Intl.NumberFormat("vi-VN", { 
            style: "currency", 
            currency: "VND",
            maximumFractionDigits: 0
          }).format(item.subtotal)}
        </p>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          disabled={isUpdating}
          className="text-sm text-neutral-500 hover:text-error transition-colors disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;