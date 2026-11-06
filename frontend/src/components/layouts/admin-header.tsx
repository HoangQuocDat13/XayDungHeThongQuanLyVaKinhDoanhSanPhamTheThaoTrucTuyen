"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Avatar } from "@/components/ui/avatar";
import { AdminMobileMenuButton } from "./admin-sidebar";

export interface AdminHeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  onMobileMenuOpen: () => void;
}

export function AdminHeader({
  title,
  breadcrumbs,
  actions,
  onMobileMenuOpen,
}: AdminHeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 min-h-16 py-2 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center px-4 sm:px-6 lg:px-8 gap-4">
      <AdminMobileMenuButton onClick={onMobileMenuOpen} />

      {/* Title + breadcrumb */}
      <div className="flex-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Điều hướng phân cấp quản trị"
            className="hidden sm:flex items-center flex-wrap gap-2 mb-0.5"
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span className="text-slate-400 text-xs" aria-hidden="true">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-xs font-medium text-slate-600 hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs text-slate-500">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate leading-snug">
          {title}
        </h1>
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-2 min-h-10 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:text-primary hover:border-primary/40 hover:bg-primary-50/50 transition-colors"
        >
          <ExternalLink size={15} className="shrink-0" aria-hidden="true" />
          <span>Xem cửa hàng</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar src={user.anhDaiDien} name={user.hoTen} size="sm" />
            <span className="hidden md:inline-block text-sm font-medium text-slate-800 truncate max-w-40">
              {user.hoTen}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
