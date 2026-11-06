"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "accent";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:scale-[0.99] shadow-xs hover:shadow-sm",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.99]",
  outline:
    "border border-primary bg-white text-primary hover:bg-primary-50 active:scale-[0.99]",
  ghost:
    "text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99]",
  danger:
    "bg-danger text-white hover:bg-red-700 active:scale-[0.99] shadow-xs",
  accent:
    "bg-amber-400 text-slate-950 hover:bg-amber-500 active:scale-[0.99] shadow-xs font-semibold",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "min-h-8 px-3 py-1 text-xs gap-2 rounded-lg",
  sm: "min-h-10 px-4 py-2 text-sm gap-2 rounded-xl",
  md: "min-h-11 px-4 py-2 text-sm gap-2 rounded-xl",
  lg: "min-h-12 px-6 py-3 text-base gap-2 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-medium leading-snug transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon && (
          <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}
      {children}
      {!loading && rightIcon && (
        <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
