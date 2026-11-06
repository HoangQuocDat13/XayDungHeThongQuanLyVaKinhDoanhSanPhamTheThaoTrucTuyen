"use client";

import React, { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, wrapperClassName, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-2", wrapperClassName)}>
        <label
          htmlFor={checkboxId}
          className="inline-flex items-start gap-2 cursor-pointer group select-none"
        >
          <span className="relative mt-0.5 flex-shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? `${checkboxId}-error` : undefined}
              className="sr-only peer"
              {...props}
            />
            <span
              className={cn(
                "w-5 h-5 rounded-md border bg-white flex items-center justify-center transition-all duration-150",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                "peer-checked:bg-primary peer-checked:border-primary peer-checked:[&_svg]:opacity-100",
                "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                error ? "border-danger" : "border-slate-300 group-hover:border-slate-400"
              )}
              aria-hidden="true"
            >
              <Check size={13} strokeWidth={3} className="text-white opacity-0 transition-opacity" />
            </span>
          </span>
          {label && (
            <span className="text-sm text-slate-700 leading-snug">{label}</span>
          )}
        </label>
        {error && (
          <p id={`${checkboxId}-error`} className="text-xs font-medium text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
