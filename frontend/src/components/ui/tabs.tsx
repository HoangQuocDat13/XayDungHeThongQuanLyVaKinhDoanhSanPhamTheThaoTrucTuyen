"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  variant?: "underline" | "pills";
  ariaLabel?: string;
}

export function Tabs({
  items,
  activeKey,
  onChange,
  className,
  variant = "underline",
  ariaLabel = "Chuyển tab",
}: TabsProps) {
  if (variant === "pills") {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex max-w-full overflow-x-auto gap-1 bg-slate-100 rounded-xl p-1",
          className
        )}
      >
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={activeKey === item.key}
            onClick={() => onChange(item.key)}
            className={cn(
              "shrink-0 whitespace-nowrap min-h-9 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 inline-flex items-center gap-2",
              activeKey === item.key
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  activeKey === item.key
                    ? "bg-teal-50 text-primary"
                    : "bg-slate-200/80 text-slate-700"
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex max-w-full overflow-x-auto border-b border-slate-200 gap-2",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={activeKey === item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            "shrink-0 whitespace-nowrap min-h-11 px-4 py-2 text-sm font-medium transition-all duration-150 inline-flex items-center gap-2 border-b-2 -mb-px",
            activeKey === item.key
              ? "border-primary text-primary"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                activeKey === item.key
                  ? "bg-teal-50 text-primary"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
