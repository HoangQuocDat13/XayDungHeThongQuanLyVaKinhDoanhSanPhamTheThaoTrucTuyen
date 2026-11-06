"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/layouts/admin-header";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Bảng điều khiển",
  "/admin/statistics": "Thống kê doanh thu & kinh doanh",
  "/admin/products": "Quản lý sản phẩm & biến thể",
  "/admin/brands": "Quản lý thương hiệu",
  "/admin/sports": "Quản lý môn thể thao",
  "/admin/promotions": "Quản lý khuyến mãi",
  "/admin/orders": "Quản lý đơn hàng",
  "/admin/payments": "Quản lý thanh toán",
  "/admin/returns": "Quản lý yêu cầu đổi / trả",
  "/admin/reviews": "Quản lý đánh giá sản phẩm",
  "/admin/news": "Quản lý tin tức",
  "/admin/users": "Quản lý tài khoản & người dùng",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = pageTitles[pathname] ?? "Khu vực quản trị";

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Chuyển đến nội dung quản trị
      </a>
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="min-w-0 flex-1 flex flex-col">
        <AdminHeader
          title={title}
          breadcrumbs={[
            { label: "Quản trị", href: "/admin/dashboard" },
            { label: title },
          ]}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />
        <main
          id="admin-main-content"
          className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
