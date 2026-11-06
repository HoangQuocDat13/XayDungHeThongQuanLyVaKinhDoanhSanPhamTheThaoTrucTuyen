"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  showCount?: number;
}

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 22,
};

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
  showCount,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const starSize = sizeMap[size];

  if (interactive) {
    return (
      <div
        className={cn("inline-flex items-center gap-1", className)}
        role="radiogroup"
        aria-label="Chọn số sao đánh giá"
      >
        {Array.from({ length: max }, (_, i) => {
          const index = i + 1;
          const filled = index <= (hovered ?? value);
          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={value === index}
              aria-label={`${index} sao`}
              onClick={() => onChange?.(index)}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Star
                size={starSize}
                className={cn(
                  "transition-colors",
                  filled
                    ? "text-amber-500 fill-amber-500"
                    : "text-slate-300 fill-slate-200"
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`${value.toFixed(1)} trên ${max} sao`}
    >
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        const filled = index <= Math.round(value);
        return (
          <Star
            key={i}
            size={starSize}
            className={cn(
              "shrink-0",
              filled
                ? "text-amber-500 fill-amber-500"
                : "text-slate-200 fill-slate-200"
            )}
            aria-hidden="true"
          />
        );
      })}
      {showCount !== undefined && (
        <span className="ml-1 text-xs text-slate-600">({showCount})</span>
      )}
    </div>
  );
}
