"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/stores/ui.store";
import { Button, Input, Checkbox } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(\+84|0)[0-9]{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!agreeTerms) {
      newErrors.terms = "Bạn cần đồng ý với điều khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register(formData.email, formData.password, formData.fullName, formData.phone);
      toast.success("Đăng ký thành công!", "Chào mừng bạn đến với Honda Dealership");
      router.push("/");
    } catch (error) {
      toast.error("Đăng ký thất bại", "Email hoặc số điện thoại đã được sử dụng");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              Honda<span className="text-primary-600">Dealership</span>
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-2">
            Tạo tài khoản
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-center mb-8">
            Đăng ký ngay để trải nghiệm dịch vụ tốt nhất!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Họ và tên
              </label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Nguyễn Văn A"
                error={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-error">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="example@email.com"
                error={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Số điện thoại
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="0912345678"
                error={!!errors.phone}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-error">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Mật khẩu
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                error={!!errors.password}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-error">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="••••••••"
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-error">{errors.confirmPassword}</p>
              )}
            </div>

            {/* <div>
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                label={
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-primary-600 hover:underline">
                      Điều khoản
                    </Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-primary-600 hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </span>
                }
              />
              {errors.terms && (
                <p className="mt-1 text-xs text-error">{errors.terms}</p>
              )}
            </div> */}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              isLoading={isLoading}
            >
              Đăng ký
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              Đã có tài khoản?{" "}
              <Link 
                href="/login" 
                className="text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-neutral-500 hover:text-primary-600 dark:text-neutral-400">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}