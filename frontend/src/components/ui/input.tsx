"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      wrapperClassName,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-2", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-800 leading-snug"
          >
            {label}
            {required && (
              <span className="text-danger ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="pointer-events-none absolute left-3.5 inline-flex items-center justify-center text-slate-500"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                ? `${inputId}-hint`
                : undefined
            }
            aria-invalid={error ? "true" : undefined}
            className={cn(
              "w-full min-h-11 px-4 py-2 rounded-xl border bg-white text-sm text-slate-900",
              "placeholder:text-slate-400 transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary",
              "read-only:bg-slate-50 read-only:text-slate-600",
              error
                ? "border-danger focus:ring-danger/25 focus:border-danger"
                : "border-slate-200 hover:border-slate-300",
              Boolean(leftIcon) && "pl-11",
              Boolean(rightIcon) && "pr-11",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-2.5 inline-flex items-center justify-center text-slate-500">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-danger leading-normal"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-600 leading-normal">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
