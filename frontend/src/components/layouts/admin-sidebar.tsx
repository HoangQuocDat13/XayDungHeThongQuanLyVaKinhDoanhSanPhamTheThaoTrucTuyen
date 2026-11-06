"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Gift,
  ShoppingBag,
  CreditCard,
  RefreshCw,
  Star,
  Newspaper,
  BarChart2,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/features/auth/store/auth-store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    group: "Tổng quan",
    items: [
      { label: "Bảng điều khiển", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Thống kê", href: "/admin/statistics", icon: BarChart2 },
    ],
  },
  {
    group: "Danh mục",
    items: [
      { label: "Sản phẩm & Biến thể", href: "/admin/products", icon: Package },
      { label: "Thương hiệu", href: "/admin/brands", icon: Tag },
      { label: "Môn thể thao", href: "/admin/sports", icon: Dumbbell },
      { label: "Khuyến mãi", href: "/admin/promotions", icon: Gift },
    ],
  },
  {
    group: "Giao dịch",
    items: [
      { label: "Đơn hàng", href: "/admin/orders", icon: ShoppingBag },
      { label: "Thanh toán", href: "/admin/payments", icon: CreditCard },
      { label: "Yêu cầu đổi/trả", href: "/admin/returns", icon: RefreshCw },
    ],
  },
  {
    group: "Nội dung",
    items: [
      { label: "Đánh giá sản phẩm", href: "/admin/reviews", icon: Star },
      { label: "Tin tức", href: "/admin/news", icon: Newspaper },
    ],
  },
  {
    group: "Hệ thống",
    items: [{ label: "Tài khoản & Người dùng", href: "/admin/users", icon: Users }],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({
  collapsed,
  onToggle,
  isMobile = false,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header / Logo */}
      <div
        className={cn(
          "flex items-center min-h-16 px-4 border-b border-slate-100 flex-shrink-0",
          collapsed ? "justify-center" : "justify-between gap-2"
        )}
      >
        {!collapsed && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-bold text-lg tracking-tight"
          >
            <Dumbbell size={22} className="shrink-0" aria-hidden="true" />
            <span>SportZone</span>
          </Link>
        )}
        {isMobile ? (
          <button
            type="button"
            onClick={onMobileClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Đóng menu quản trị"
          >
            <X size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            aria-label={collapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav aria-label="Điều hướng quản trị" className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.group}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={isMobile ? onMobileClose : undefined}
                    title={collapsed ? item.label : undefined}
                    aria-label={collapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 min-h-11 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 relative",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-primary-50 text-primary font-semibold"
                        : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                    )}
                  >
                    <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto min-w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold px-1.5">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User info */}
      {user && (
        <div
          className={cn(
            "p-4 border-t border-slate-100 flex-shrink-0",
            collapsed && "flex justify-center"
          )}
        >
          {collapsed ? (
            <Avatar src={user.anhDaiDien} name={user.hoTen} size="sm" />
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar src={user.anhDaiDien} name={user.hoTen} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user.hoTen}
                </p>
                <p className="text-xs text-slate-600 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) onMobileClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [mobileOpen, onMobileClose]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-200 h-screen sticky top-0 shrink-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 shadow-xl lg:hidden">
            <SidebarContent
              collapsed={false}
              onToggle={onMobileClose}
              isMobile
              onMobileClose={onMobileClose}
            />
          </aside>
        </>
      )}
    </>
  );
}

export function AdminMobileMenuButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
      aria-label="Mở menu điều hướng quản trị"
    >
      <Menu size={20} />
    </button>
  );
}
