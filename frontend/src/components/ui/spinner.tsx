import React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeStyles = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-2",
};

export function Spinner({
  size = "md",
  className,
  label = "Đang tải...",
}: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <span
        className={cn(
          "animate-spin rounded-full border-gray-200 border-t-primary",
          sizeStyles[size]
        )}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" label={label} />
        {label && <p className="text-sm text-gray-500">{label}</p>}
      </div>
    </div>
  );
}
