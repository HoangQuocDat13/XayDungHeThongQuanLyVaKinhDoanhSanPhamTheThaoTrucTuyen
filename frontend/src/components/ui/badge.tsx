import React from "react";
import { cn, type BadgeVariant } from "@/lib/utils";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-300/60",
  primary: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-600/20",
  success: "bg-green-50 text-green-800 ring-1 ring-inset ring-green-600/20",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/25",
  danger: "bg-red-50 text-red-800 ring-1 ring-inset ring-red-600/20",
  info: "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-600/20",
  muted: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-slate-600",
  primary: "bg-teal-700",
  success: "bg-green-700",
  warning: "bg-amber-700",
  danger: "bg-red-600",
  info: "bg-blue-700",
  muted: "bg-slate-500",
};

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap leading-none",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
