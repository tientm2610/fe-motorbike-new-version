"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { orderService } from "@/services/order.service";
import { toast } from "@/stores/ui.store";
import { PaymentMethod } from "@/types";
import { ShippingForm } from "@/components/features/checkout/shipping-form";
import { PaymentMethodSelector } from "@/components/features/checkout/payment-method-selector";
import { Button, ButtonLink, Spinner } from "@/components/ui";
import { cn } from "@/lib";

interface CheckoutData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, fetchCart, clearCart, isLoading: isCartLoading } = useCartStore();
  
  const [step, setStep] = useState<"shipping" | "payment" | "confirm">("shipping");
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cart && cart.items.length === 0 && !isCartLoading) {
      router.push("/cart");
    }
  }, [cart, isCartLoading, router]);

  const handleShippingSubmit = (data: CheckoutData) => {
    setCheckoutData(data);
    setStep("payment");
  };

  const handlePaymentSubmit = () => {
    setStep("confirm");
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const order = await orderService.checkout({
        shippingName: checkoutData.shippingName,
        shippingPhone: checkoutData.shippingPhone,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod,
        note: checkoutData.note,
      });
      
      await clearCart();
      toast.success("Đặt hàng thành công!", `Mã đơn hàng: ${order.orderCode}`);
      router.push(`/orders?success=true&orderCode=${order.orderCode}`);
    } catch (error) {
      toast.error("Đặt hàng thất bại", "Vui lòng thử lại sau");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isCartLoading || !cart) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500">Đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <li><a href="/" className="hover:text-primary-600">Trang chủ</a></li>
          <li>/</li>
          <li><a href="/cart" className="hover:text-primary-600">Giỏ hàng</a></li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-white">Thanh toán</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
        Thanh toán
      </h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {["shipping", "payment", "confirm"].map((s, i) => {
          const isActive = step === s;
          const isCompleted = ["shipping", "payment", "confirm"].indexOf(step) > i;
          
          return (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                isActive 
                  ? "bg-primary-500 text-white" 
                  : isCompleted 
                    ? "bg-success text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500"
              )}>
                {isCompleted ? "✓" : i + 1}
              </div>
              <span className={cn(
                "ml-2 text-sm",
                isActive ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-500"
              )}>
                {s === "shipping" ? "Thông tin giao hàng" : s === "payment" ? "Thanh toán" : "Xác nhận"}
              </span>
              {i < 2 && <span className="mx-4 text-neutral-300">→</span>}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Step */}
          {step === "shipping" && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Thông tin giao hàng
              </h2>
              <ShippingForm onSubmit={handleShippingSubmit} initialData={checkoutData} />
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleShippingSubmit(checkoutData)}>
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Phương thức thanh toán
              </h2>
              
              <PaymentMethodSelector 
                selected={paymentMethod} 
                onSelect={setPaymentMethod} 
              />
              
              <div className="mt-6 flex gap-3">
                <ButtonLink href="/cart" variant="outline">
                  ← Quay lại
                </ButtonLink>
                <Button onClick={handlePaymentSubmit}>
                  Xác nhận
                </Button>
              </div>
            </div>
          )}

          {/* Confirm Step */}
          {step === "confirm" && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Xác nhận đơn hàng
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Thông tin giao hàng
                  </h3>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                    <p><span className="font-medium">Họ tên:</span> {checkoutData.shippingName}</p>
                    <p><span className="font-medium">Số điện thoại:</span> {checkoutData.shippingPhone}</p>
                    <p><span className="font-medium">Địa chỉ:</span> {checkoutData.shippingAddress}</p>
                    {checkoutData.note && <p><span className="font-medium">Ghi chú:</span> {checkoutData.note}</p>}
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Phương thức thanh toán
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Sản phẩm ({cart.totalQuantity})
                  </h3>
                  <div className="space-y-2">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {item.motorcycleName} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("vi-VN", { 
                            style: "currency", 
                            currency: "VND",
                            maximumFractionDigits: 0
                          }).format(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep("payment")}>
                  ← Quay lại
                </Button>
                <Button 
                  onClick={handlePlaceOrder} 
                  isLoading={isPlacingOrder}
                  className="flex-1"
                >
                  Đặt hàng
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Tổng quan đơn hàng
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Tạm tính ({cart.totalQuantity} sản phẩm)
                </span>
                <span className="font-medium">
                  {new Intl.NumberFormat("vi-VN", { 
                    style: "currency", 
                    currency: "VND",
                    maximumFractionDigits: 0
                  }).format(cart.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Phí vận chuyển</span>
                <span className="text-success">Miễn phí</span>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {new Intl.NumberFormat("vi-VN", { 
                    style: "currency", 
                    currency: "VND",
                    maximumFractionDigits: 0
                  }).format(cart.estimatedTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}