"use client";

import { useState } from "react";
import { Input } from "@/components/ui";
import { cn } from "@/lib";

interface ShippingFormData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  initialData?: Partial<ShippingFormData>;
}

export function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingFormData>({
    shippingName: initialData?.shippingName || "",
    shippingPhone: initialData?.shippingPhone || "",
    shippingAddress: initialData?.shippingAddress || "",
    note: initialData?.note || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, boolean>>>({});
  const [errorMessages, setErrorMessages] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, boolean>> = {};
    const newMessages: Partial<Record<keyof ShippingFormData, string>> = {};

    if (!formData.shippingName.trim()) {
      newErrors.shippingName = true;
      newMessages.shippingName = "Vui lòng nhập họ tên";
    }

    if (!formData.shippingPhone.trim()) {
      newErrors.shippingPhone = true;
      newMessages.shippingPhone = "Vui lòng nhập số điện thoại";
    } else if (!/^(\+84|0)[0-9]{9}$/.test(formData.shippingPhone.replace(/\s/g, ""))) {
      newErrors.shippingPhone = true;
      newMessages.shippingPhone = "Số điện thoại không hợp lệ";
    }

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = true;
      newMessages.shippingAddress = "Vui lòng nhập địa chỉ";
    }

    setErrors(newErrors);
    setErrorMessages(newMessages);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ShippingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setErrorMessages((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Họ và tên *
          </label>
          <Input
            value={formData.shippingName}
            onChange={(e) => handleChange("shippingName", e.target.value)}
            placeholder="Nguyễn Văn A"
            error={errors.shippingName}
          />
          {errorMessages.shippingName && (
            <p className="mt-1 text-xs text-error">{errorMessages.shippingName}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Số điện thoại *
          </label>
          <Input
            value={formData.shippingPhone}
            onChange={(e) => handleChange("shippingPhone", e.target.value)}
            placeholder="0912345678"
            error={errors.shippingPhone}
          />
          {errorMessages.shippingPhone && (
            <p className="mt-1 text-xs text-error">{errorMessages.shippingPhone}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Địa chỉ *
          </label>
          <Input
            value={formData.shippingAddress}
            onChange={(e) => handleChange("shippingAddress", e.target.value)}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            error={errors.shippingAddress}
          />
          {errorMessages.shippingAddress && (
            <p className="mt-1 text-xs text-error">{errorMessages.shippingAddress}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="Ghi chú thêm cho đơn hàng..."
            rows={3}
            className="flex w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </form>
  );
}

export default ShippingForm;