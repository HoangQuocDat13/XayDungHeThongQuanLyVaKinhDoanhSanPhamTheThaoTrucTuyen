"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useCartStore } from "@/features/cart/store/cart-store";
import { calculateCouponDiscount, formatVND } from "@/lib/utils";

const SHIPPING_FEE = 30_000;
const FREE_SHIPPING_THRESHOLD = 1_000_000;

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const setCouponCode = useCartStore((state) => state.setCouponCode);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.gia * item.soLuong, 0);
  const discount = calculateCouponDiscount(couponCode, subtotal);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal + shipping - discount);
  const amountForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = couponInput.trim().toUpperCase();
    if (!normalized) {
      toast.error("Vui lòng nhập mã giảm giá.");
      return;
    }
    const computed = calculateCouponDiscount(normalized, subtotal);
    if (computed <= 0) {
      toast.error(
        "Mã giảm giá chưa hợp lệ. Hãy thử: SPORTZONE10, NEWBIE50 hoặc FLASH1111."
      );
      return;
    }
    setCouponCode(normalized);
    toast.success(`Áp dụng mã ${normalized} thành công: giảm ${formatVND(computed)}.`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb items={[{ label: "Giỏ hàng" }]} className="mb-4" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Mua sắm trực tuyến
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Giỏ hàng của bạn
          </h1>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={15} />}
            onClick={() => setConfirmClearOpen(true)}
            className="text-danger hover:bg-danger-light/50 hover:text-danger"
          >
            Làm trống giỏ hàng
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={ShoppingBag}
            title="Giỏ hàng hiện đang trống"
            description="Hãy dạo quanh danh mục môn thể thao và chọn những sản phẩm ưng ý cho buổi tập sắp tới."
            action={
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <span>Khám phá sản phẩm</span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Items Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping banner */}
            <div className="flex items-center gap-3 rounded-2xl border border-teal-200/80 bg-primary-50/70 p-4 text-sm text-slate-800">
              <Truck size={20} className="shrink-0 text-primary" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                {amountForFreeShip > 0 ? (
                  <p>
                    Mua thêm{" "}
                    <strong className="text-primary">
                      {formatVND(amountForFreeShip)}
                    </strong>{" "}
                    để được <strong>miễn phí vận chuyển</strong> toàn quốc.
                  </p>
                ) : (
                  <p className="font-medium text-primary-dark">
                    Đơn hàng của bạn đã đủ điều kiện miễn phí vận chuyển!
                  </p>
                )}
              </div>
            </div>

            {items.map((item) => (
              <article
                key={item.bienTheId}
                className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs"
              >
                <Link
                  href={`/products/${item.sanPhamSlug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100"
                >
                  {item.anhUrl && (
                    <Image
                      src={item.anhUrl}
                      alt={item.tenSanPham}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </Link>

                <div className="min-w-0 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.sanPhamSlug}`}
                        className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-primary transition-colors"
                      >
                        {item.tenSanPham}
                      </Link>
                      <p className="mt-1 text-xs text-slate-600">
                        Màu sắc: <strong className="text-slate-800">{item.mauSac}</strong> · Kích cỡ:{" "}
                        <strong className="text-slate-800">{item.kichCo}</strong> · Tồn kho: {item.soLuongTon}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(item.bienTheId);
                        toast.info(`Đã xóa "${item.tenSanPham}" khỏi giỏ hàng.`);
                      }}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-danger"
                      aria-label={`Xóa ${item.tenSanPham} khỏi giỏ hàng`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">
                        Đơn giá: {formatVND(item.gia)}
                      </p>
                      <p className="text-base font-bold text-slate-900">
                        {formatVND(item.gia * item.soLuong)}
                      </p>
                    </div>

                    <div
                      className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white"
                      role="group"
                      aria-label={`Số lượng của ${item.tenSanPham}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.bienTheId, item.soLuong - 1)
                        }
                        disabled={item.soLuong <= 1}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-l-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Giảm số lượng"
                      >
                        <Minus size={15} />
                      </button>
                      <span
                        className="min-w-8 px-2 text-center text-sm font-semibold text-slate-900"
                        aria-live="polite"
                      >
                        {item.soLuong}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.bienTheId,
                            Math.min(item.soLuongTon, item.soLuong + 1)
                          )
                        }
                        disabled={item.soLuong >= item.soLuongTon}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Tăng số lượng"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <p className="text-xs text-slate-500">
              Giỏ hàng đang lưu trên trình duyệt của bạn (chưa đồng bộ máy chủ).
            </p>
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-4 h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900">
              Tóm tắt đơn hàng
            </h2>

            <form className="mt-4 flex flex-wrap sm:flex-nowrap gap-2" onSubmit={handleApplyCoupon}>
              <label htmlFor="cart-coupon" className="sr-only">
                Nhập mã giảm giá
              </label>
              <input
                id="cart-coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Nhập mã khuyến mãi..."
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
              />
              <Button type="submit" variant="outline" size="md">
                Áp dụng
              </Button>
            </form>

            {couponCode ? (
              <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-teal-50 px-3 py-2 text-xs font-medium text-primary-dark">
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={14} aria-hidden="true" />
                  Đã áp dụng mã <strong>{couponCode}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCouponCode(null);
                    setCouponInput("");
                  }}
                  aria-label="Gỡ mã giảm giá"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-teal-100"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-600">
                Mã mẫu: <strong className="font-mono">SPORTZONE10</strong>,{" "}
                <strong className="font-mono">NEWBIE50</strong>
              </p>
            )}

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between gap-4 text-slate-600">
                <span>Tiền hàng tạm tính</span>
                <span className="font-medium text-slate-900">
                  {formatVND(subtotal)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-slate-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-slate-900">
                  {shipping === 0 ? "Miễn phí" : formatVND(shipping)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between gap-4 text-success font-medium">
                  <span>Giảm giá khuyến mãi</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-slate-100 pt-4 text-base font-bold text-slate-900">
                <span>Thành tiền</span>
                <span className="text-primary text-lg">{formatVND(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition hover:bg-primary-dark shadow-xs"
            >
              <span>Tiến hành thanh toán</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/products"
              className="mt-3 flex min-h-10 w-full items-center justify-center rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
            >
              Tiếp tục mua thêm sản phẩm
            </Link>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearCart();
          setConfirmClearOpen(false);
          toast.info("Đã làm trống giỏ hàng.");
        }}
        title="Làm trống giỏ hàng?"
        description="Tất cả sản phẩm đang chọn trong giỏ hàng sẽ bị xóa. Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Xóa tất cả"
      />
    </section>
  );
}
