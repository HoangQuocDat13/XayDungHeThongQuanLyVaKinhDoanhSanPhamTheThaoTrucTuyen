import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Điều hướng phân cấp" className={cn("py-1", className)}>
      <ol className="flex items-center flex-wrap gap-2 text-sm text-slate-600">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md py-1 hover:text-primary transition-colors"
            aria-label="Trang chủ"
          >
            <Home size={15} aria-hidden="true" />
            <span>Trang chủ</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="inline-flex items-center gap-2 min-w-0">
              <ChevronRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className={cn(
                    "truncate max-w-[260px] sm:max-w-md",
                    isLast
                      ? "text-slate-900 font-medium"
                      : "hover:text-primary transition-colors"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors py-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
