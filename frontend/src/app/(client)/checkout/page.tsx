"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useCartStore } from "@/features/cart/store/cart-store";
import {
  calculateCouponDiscount,
  cn,
  formatDiaChi,
  formatVND,
  getPhuongThucThanhToanLabel,
} from "@/lib/utils";
import type { PhuongThucThanhToan } from "@/types";

interface PlacedOrderPreview {
  maDonHang: string;
  tenNguoiNhan: string;
  soDienThoaiNhan: string;
  diaChiGiaoHang: string;
  phuongThuc: PhuongThucThanhToan;
  thanhTien: number;
  soSanPham: number;
}

export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const savedAddresses = user?.nguoiDung?.diaChi ?? [];
  const defaultAddress =
    savedAddresses.find((a) => a.macDinh) ?? savedAddresses[0] ?? null;

  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const setCouponCode = useCartStore((state) => state.setCouponCode);
  const clearCart = useCartStore((state) => state.clearCart);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddress?.id ?? "NEW"
  );
  const [tenNguoiNhan, setTenNguoiNhan] = useState(
    defaultAddress?.tenNguoiNhan ?? user?.hoTen ?? ""
  );
  const [soDienThoaiNhan, setSoDienThoaiNhan] = useState(
    defaultAddress?.soDienThoai ?? user?.nguoiDung?.soDienThoai ?? ""
  );
  const [duong, setDuong] = useState("");
  const [phuong, setPhuong] = useState("");
  const [quan, setQuan] = useState("");
  const [thanhPho, setThanhPho] = useState("TP. Hồ Chí Minh");
  const [ghiChu, setGhiChu] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PhuongThucThanhToan>("COD");
  const [promoInput, setPromoInput] = useState(couponCode ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderPreview | null>(
    null
  );

  const subtotal = items.reduce((sum, item) => sum + item.gia * item.soLuong, 0);
  const discount = calculateCouponDiscount(couponCode, subtotal);
  const shipping = subtotal === 0 || subtotal >= 1_000_000 ? 0 : 30_000;
  const finalTotal = Math.max(0, subtotal + shipping - discount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setCouponCode(null);
      return;
    }
    const d = calculateCouponDiscount(code, subtotal);
    if (d <= 0) {
      toast.error("Mã khuyến mãi chưa hợp lệ. Gợi ý: SPORTZONE10, NEWBIE50.");
      return;
    }
    setCouponCode(code);
    toast.success(`Đã áp dụng mã ${code}: giảm ${formatVND(d)}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const chosenSaved = savedAddresses.find((a) => a.id === selectedAddressId);
    const finalName = chosenSaved ? chosenSaved.tenNguoiNhan : tenNguoiNhan.trim();
    const finalPhone = chosenSaved ? chosenSaved.soDienThoai : soDienThoaiNhan.trim();
    const finalAddress = chosenSaved
      ? formatDiaChi(
          chosenSaved.duong,
          chosenSaved.phuong,
          chosenSaved.quan,
          chosenSaved.thanhPho
        )
      : formatDiaChi(
          duong.trim(),
          phuong.trim(),
          quan.trim(),
          thanhPho.trim()
        );

    if (!finalName || finalName.length < 2) {
      setFormError("Vui lòng nhập đầy đủ họ tên người nhận hàng.");
      return;
    }
    if (!/^[0-9+\s]{9,15}$/.test(finalPhone)) {
      setFormError("Số điện thoại người nhận chưa đúng định dạng (9–15 chữ số).");
      return;
    }
    if (!chosenSaved && (!duong.trim() || !phuong.trim() || !quan.trim() || !thanhPho.trim())) {
      setFormError("Vui lòng điền đầy đủ số nhà/đường, phường/xã, quận/huyện và tỉnh/thành phố.");
      return;
    }

    const totalQty = items.reduce((acc, i) => acc + i.soLuong, 0);
    setPlacedOrder({
      maDonHang: `DH20261104-${Math.floor(1000 + Math.random() * 9000)}`,
      tenNguoiNhan: finalName,
      soDienThoaiNhan: finalPhone,
      diaChiGiaoHang: finalAddress,
      phuongThuc: paymentMethod,
      thanhTien: finalTotal,
      soSanPham: totalQty,
    });
    clearCart();
    toast.success("Xác nhận đơn hàng xem trước thành công!");
  };

  if (placedOrder) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-light text-success">
            <CheckCircle2 size={32} aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Trạng thái đặt hàng mẫu
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Cảm ơn bạn đã đặt hàng!
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Mã đơn xem trước:{" "}
            <strong className="font-mono text-slate-900">
              {placedOrder.maDonHang}
            </strong>
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-left text-sm space-y-2">
            <p className="text-slate-700">
              <strong className="text-slate-900">Người nhận:</strong>{" "}
              {placedOrder.tenNguoiNhan} · {placedOrder.soDienThoaiNhan}
            </p>
            <p className="text-slate-700">
              <strong className="text-slate-900">Địa chỉ giao:</strong>{" "}
              {placedOrder.diaChiGiaoHang}
            </p>
            <p className="text-slate-700">
              <strong className="text-slate-900">Thanh toán:</strong>{" "}
              {getPhuongThucThanhToanLabel(placedOrder.phuongThuc)}
            </p>
            <p className="text-slate-700">
              <strong className="text-slate-900">Tổng thanh toán:</strong>{" "}
              <span className="font-bold text-primary">
                {formatVND(placedOrder.thanhTien)}
              </span>{" "}
              ({placedOrder.soSanPham} sản phẩm)
            </p>
          </div>

          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
            Lưu ý: Đây là màn hình xác nhận đặt hàng minh họa giao diện, đơn hàng chưa được ghi vào cơ sở dữ liệu máy chủ.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/orders"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <Package size={17} aria-hidden="true" />
              <span>Xem danh sách đơn hàng</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              <span>Tiếp tục mua sắm</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Chưa có sản phẩm để thanh toán"
          description="Vui lòng chọn sản phẩm vào giỏ hàng trước khi tiến hành đặt mua."
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
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Giỏ hàng", href: "/cart" },
          { label: "Thanh toán" },
        ]}
        className="mb-4"
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Hoàn tất đơn mua
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Thanh toán đơn hàng
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid gap-8 lg:grid-cols-12"
      >
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <MapPin size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Địa chỉ nhận hàng
                </h2>
                <p className="text-xs text-slate-600">
                  Chọn địa chỉ đã lưu hoặc nhập địa chỉ giao hàng mới
                </p>
              </div>
            </div>

            {savedAddresses.length > 0 && (
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                      selectedAddressId === addr.id
                        ? "border-primary bg-primary-50/50 ring-1 ring-primary/20"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 h-4 w-4 accent-teal-700"
                    />
                    <span className="min-w-0 text-sm">
                      <span className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
                        {addr.tenNguoiNhan} · {addr.soDienThoai}
                        {addr.macDinh && (
                          <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-800">
                            Mặc định
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                        {formatDiaChi(
                          addr.duong,
                          addr.phuong,
                          addr.quan,
                          addr.thanhPho
                        )}
                      </span>
                    </span>
                  </label>
                ))}

                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition",
                    selectedAddressId === "NEW"
                      ? "border-primary bg-primary-50/50 ring-1 ring-primary/20"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    checked={selectedAddressId === "NEW"}
                    onChange={() => setSelectedAddressId("NEW")}
                    className="h-4 w-4 accent-teal-700"
                  />
                  <span className="text-sm font-semibold text-slate-900">
                    + Giao đến địa chỉ mới khác
                  </span>
                </label>
              </div>
            )}

            {selectedAddressId === "NEW" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Họ và tên người nhận"
                  required
                  value={tenNguoiNhan}
                  onChange={(e) => setTenNguoiNhan(e.target.value)}
                  placeholder="Nguyễn Văn An"
                  autoComplete="name"
                />
                <Input
                  label="Số điện thoại"
                  type="tel"
                  required
                  value={soDienThoaiNhan}
                  onChange={(e) => setSoDienThoaiNhan(e.target.value)}
                  placeholder="0901234567"
                  autoComplete="tel"
                />
                <Input
                  label="Số nhà, tên đường"
                  required
                  value={duong}
                  onChange={(e) => setDuong(e.target.value)}
                  placeholder="123 Nguyễn Trãi"
                  wrapperClassName="sm:col-span-2"
                />
                <Input
                  label="Phường / Xã"
                  required
                  value={phuong}
                  onChange={(e) => setPhuong(e.target.value)}
                  placeholder="Phường Bến Thành"
                />
                <Input
                  label="Quận / Huyện"
                  required
                  value={quan}
                  onChange={(e) => setQuan(e.target.value)}
                  placeholder="Quận 1"
                />
                <Input
                  label="Tỉnh / Thành phố"
                  required
                  value={thanhPho}
                  onChange={(e) => setThanhPho(e.target.value)}
                  placeholder="TP. Hồ Chí Minh"
                  wrapperClassName="sm:col-span-2"
                />
              </div>
            )}

            <div className="mt-4">
              <Textarea
                label="Ghi chú giao hàng (không bắt buộc)"
                rows={2}
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="Ví dụ: Giao trong giờ hành chính, gọi trước khi đến..."
              />
            </div>

            {formError && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-danger"
              >
                {formError}
              </p>
            )}
          </section>

          {/* Payment Method */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <CreditCard size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Phương thức thanh toán
                </h2>
                <p className="text-xs text-slate-600">
                  Hỗ trợ thanh toán tiền mặt khi nhận hàng hoặc trực tuyến
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "COD" as PhuongThucThanhToan,
                  title: "Thanh toán khi nhận hàng (COD)",
                  detail:
                    "Kiểm tra tình trạng kiện hàng và thanh toán trực tiếp cho nhân viên vận chuyển.",
                  icon: Truck,
                },
                {
                  id: "TRUYEN_TUYEN" as PhuongThucThanhToan,
                  title: "Thanh toán trực tuyến",
                  detail:
                    "Chuyển khoản ngân hàng hoặc ví điện tử (cổng thanh toán thực tế sẽ kích hoạt khi kết nối backend).",
                  icon: CreditCard,
                },
              ].map((method) => {
                const MethodIcon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                      paymentMethod === method.id
                        ? "border-primary bg-primary-50/50 ring-1 ring-primary/20"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="phuongThucThanhToan"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-1 h-4 w-4 accent-teal-700"
                    />
                    <MethodIcon
                      size={18}
                      className="mt-0.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">
                        {method.title}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                        {method.detail}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-4 h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-slate-900">
            Chi tiết đơn hàng ({items.length})
          </h2>

          <div className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.bienTheId} className="flex items-start gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                  {item.anhUrl && (
                    <Image
                      src={item.anhUrl}
                      alt={item.tenSanPham}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-slate-900">
                    {item.tenSanPham}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {item.mauSac} · Cỡ {item.kichCo} · SL: {item.soLuong}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-slate-900">
                  {formatVND(item.gia * item.soLuong)}
                </p>
              </div>
            ))}
          </div>

          {/* Promo code */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <label
              htmlFor="checkout-promo"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2"
            >
              <Tag size={14} className="text-primary" aria-hidden="true" />
              <span>Mã khuyến mãi</span>
            </label>
            <div className="flex gap-2">
              <input
                id="checkout-promo"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="SPORTZONE10, NEWBIE50"
                className="min-h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleApplyPromo}>
                Áp dụng
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between gap-4 text-slate-600">
              <span>Tiền hàng</span>
              <span className="font-medium text-slate-900">
                {formatVND(subtotal)}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-slate-600">
              <span>Phí vận chuyển</span>
              <span className="font-medium text-slate-900">
                {shipping ? formatVND(shipping) : "Miễn phí"}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between gap-4 text-success font-medium">
                <span>Khuyến mãi ({couponCode})</span>
                <span>-{formatVND(discount)}</span>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-slate-100 pt-4 text-base font-bold text-slate-900">
              <span>Tổng thanh toán</span>
              <span className="text-primary text-lg">{formatVND(finalTotal)}</span>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" className="mt-6">
            Xác nhận đặt hàng
          </Button>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
            <ShieldCheck
              size={16}
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>
              Chế độ minh họa giao diện: đơn hàng sẽ hiển thị màn hình xác nhận mẫu, chưa ghi lên máy chủ.
            </span>
          </p>
        </aside>
      </form>
    </section>
  );
}
