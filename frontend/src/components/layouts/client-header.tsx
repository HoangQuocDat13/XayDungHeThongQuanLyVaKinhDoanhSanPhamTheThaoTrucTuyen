"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Dumbbell,
  LogOut,
  Package,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const sports = [
  { label: "Bóng đá", href: "/sports/bong-da" },
  { label: "Chạy bộ", href: "/sports/chay-bo" },
  { label: "Bơi lội", href: "/sports/boi-loi" },
  { label: "Tennis", href: "/sports/tennis" },
  { label: "Bóng rổ", href: "/sports/bong-ro" },
  { label: "Gym & Fitness", href: "/sports/gym-fitness" },
];

const navLinks = [
  { label: "Sản phẩm", href: "/products" },
  { label: "Thương hiệu", href: "/brands" },
  { label: "Tin tức", href: "/news" },
];

export function ClientHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.soLuong, 0)
  );
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSportsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSportsOpen(false);
        setUserMenuOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/products?q=${encodeURIComponent(trimmed)}`);
      setMobileOpen(false);
    } else {
      router.push("/products");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-200 border-b border-slate-200/80",
        scrolled && "shadow-sm"
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Chuyển đến nội dung chính
      </a>

      {/* Top bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 py-2 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg py-1 text-primary font-bold text-xl tracking-tight"
          >
            <Dumbbell size={24} className="shrink-0 text-primary" aria-hidden="true" />
            <span>SportZone</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-2">
            {/* Sports dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSportsOpen((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 min-h-10 px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                  sportsOpen || pathname.startsWith("/sports")
                    ? "text-primary bg-primary-50"
                    : "text-slate-700 hover:text-primary hover:bg-slate-50"
                )}
                aria-expanded={sportsOpen}
                aria-haspopup="true"
              >
                <span>Môn thể thao</span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 transition-transform",
                    sportsOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
              {sportsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSportsOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg z-20 p-2">
                    {sports.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="flex items-center px-4 py-2.5 rounded-xl text-sm text-slate-700 hover:text-primary hover:bg-primary-50 transition-colors"
                      >
                        {s.label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-slate-100" />
                    <Link
                      href="/sports"
                      className="flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-primary-50 transition-colors"
                    >
                      Tất cả môn thể thao
                    </Link>
                  </div>
                </>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center min-h-10 px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-primary bg-primary-50"
                    : "text-slate-700 hover:text-primary hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + actions */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* Desktop/Tablet Search */}
            <form
              onSubmit={handleSearch}
              role="search"
              className="hidden sm:flex items-center flex-1 max-w-xs"
            >
              <div className="relative w-full flex items-center">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm giày, áo, dụng cụ..."
                  aria-label="Tìm kiếm sản phẩm"
                  className="w-full min-h-10 pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </form>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:text-primary hover:bg-slate-100 transition-colors shrink-0"
              aria-label={`Giỏ hàng (${totalItems} sản phẩm)`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold px-1.5 leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="inline-flex min-h-10 items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-label="Menu tài khoản"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <Avatar src={user.anhDaiDien} name={user.hoTen} size="sm" />
                  <ChevronDown
                    size={15}
                    className={cn(
                      "text-slate-600 hidden sm:block transition-transform shrink-0",
                      userMenuOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-200 shadow-lg z-20 p-2">
                      <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.hoTen}
                        </p>
                        <p className="text-xs text-slate-600 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <User size={16} className="shrink-0" aria-hidden="true" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <Package size={16} className="shrink-0" aria-hidden="true" />
                        <span>Đơn hàng của tôi</span>
                      </Link>
                      <Link
                        href="/returns"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <RefreshCw size={16} className="shrink-0" aria-hidden="true" />
                        <span>Yêu cầu đổi/trả</span>
                      </Link>
                      {user.vaiTro !== "KHACH_HANG" && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary-50 transition-colors border-t border-slate-100 mt-1 pt-2.5"
                        >
                          <Shield size={16} className="shrink-0" aria-hidden="true" />
                          <span>Khu vực quản trị</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-light/60 transition-colors border-t border-slate-100 mt-1 pt-2.5"
                      >
                        <LogOut size={16} className="shrink-0" aria-hidden="true" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 min-h-10 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shrink-0"
              >
                <User size={16} className="shrink-0" aria-hidden="true" />
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:text-primary hover:bg-slate-100 transition-colors shrink-0"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearch} role="search">
          <div className="relative flex items-center">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm sản phẩm thể thao..."
              aria-label="Tìm kiếm sản phẩm"
              className="w-full min-h-10 pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white max-h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            <div>
              <p className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Môn thể thao
              </p>
              <div className="grid grid-cols-2 gap-1">
                {sports.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/sports"
                className="mt-1 block px-3 py-2 text-sm font-semibold text-primary rounded-xl hover:bg-primary-50 transition-colors"
              >
                Xem tất cả môn thể thao
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1">
              <p className="px-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Khám phá
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {isAuthenticated && user ? (
              <div className="border-t border-slate-100 pt-3 space-y-1">
                <p className="px-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tài khoản ({user.hoTen})
                </p>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 hover:text-primary"
                >
                  <User size={16} aria-hidden="true" /> Hồ sơ cá nhân
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 hover:text-primary"
                >
                  <Package size={16} aria-hidden="true" /> Đơn hàng của tôi
                </Link>
                <Link
                  href="/returns"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 hover:text-primary"
                >
                  <RefreshCw size={16} aria-hidden="true" /> Yêu cầu đổi/trả
                </Link>
                {user.vaiTro !== "KHACH_HANG" && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-primary rounded-xl hover:bg-primary-50"
                  >
                    <Shield size={16} aria-hidden="true" /> Khu vực quản trị
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-danger rounded-xl hover:bg-danger-light/60"
                >
                  <LogOut size={16} aria-hidden="true" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                <Link
                  href="/login"
                  className="flex justify-center items-center gap-2 min-h-11 w-full rounded-xl bg-primary px-4 py-2 text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  <User size={16} aria-hidden="true" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  href="/register"
                  className="flex justify-center items-center min-h-11 w-full rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
