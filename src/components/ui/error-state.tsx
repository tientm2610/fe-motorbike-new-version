"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib";
import { Button } from "./button";

const ErrorIcon = () => (
  <svg className="h-16 w-16 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading this content. Please try again.",
  icon,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon || <ErrorIcon />}
      
      <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
        {title}
      </h3>
      
      <p className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface NetworkErrorProps {
  onRetry?: () => void;
  className?: string;
}

export function NetworkError({ onRetry, className }: NetworkErrorProps) {
  return (
    <ErrorState
      title="Lỗi mạng"
      description="Vui lòng kiểm tra kết nối internet và thử lại."
      action={onRetry ? { label: "Thử lại", onClick: onRetry } : undefined}
      className={className}
    />
  );
}

interface NotFoundErrorProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function NotFoundError({
  title = "Không tìm thấy trang",
  description = "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.",
  actionLabel = "Về trang chủ",
  onAction,
  className,
}: NotFoundErrorProps) {
  return (
    <ErrorState
      title={title}
      description={description}
      icon={
        <svg className="h-16 w-16 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      action={onAction ? { label: actionLabel, onClick: onAction } : undefined}
      className={className}
    />
  );
}