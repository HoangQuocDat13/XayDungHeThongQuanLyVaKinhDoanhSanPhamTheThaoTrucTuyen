"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import {
  Check,
  Clock3,
  MapPin,
  PackageCheck,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { mockDonHang, mockYeuCauDoiTra } from "@/features/order/data/mock";
import {
  formatDateTime,
  getPhuongThucThanhToanLabel,
  getTrangThaiDonLabel,
  getTrangThaiDonVariant,
  getTrangThaiThanhToanLabel,
  getTrangThaiThanhToanVariant,
  formatVND,
} from "@/lib/utils";
import type { DonHang } from "@/types";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const initialOrder = mockDonHang.find((item) => item.id === params.id);
  if (!initialOrder) notFound();

  const [order, setOrder] = useState<DonHang>(initialOrder);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const returnRequest = mockYeuCauDoiTra.find(
    (item) => item.donHangId === order.id
  );
  const history = [...(order.lichSu ?? [])].sort(
    (a, b) => new Date(a.thoiDiem).getTime() - new Date(b.thoiDiem).getTime()
  );

  const handleCancelOrder = () => {
    const nowIso = new Date().toISOString();
    setOrder((prev) => ({
      ...prev,
      trangThai: "DA_HUY",
      ngayCapNhat: nowIso,
      lichSu: [
        ...(prev.lichSu ?? []),
        {
          id: `ls-cancel-${Date.now()}`,
          donHangId: prev.id,
          trangThai: "DA_HUY",
          ghiChu: "Khách hàng yêu cầu hủy đơn trên giao diện",
          thoiDiem: nowIso,
        },
      ],
    }));
    setCancelModalOpen(false);
    toast.success("Đã hủy đơn hàng (trạng thái xem trước trên trình duyệt).");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Đơn hàng của tôi", href: "/orders" },
          { label: order.maDonHang },
        ]}
        className="mb-4"
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Chi tiết đơn mua
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Đơn hàng {order.maDonHang}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Đặt lúc {formatDateTime(order.ngayTao)}
          </p>
        </div>
        <Badge variant={getTrangThaiDonVariant(order.trangThai)} dot>
          {getTrangThaiDonLabel(order.trangThai)}
        </Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {/* Ordered Items */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">
              Sản phẩm trong đơn ({order.chiTiet?.length ?? 0})
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {order.chiTiet?.map((line) => {
                const product = line.bienThe?.sanPham;
                return (
                  <div
                    key={line.id}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                      {product?.anhDaiDien && (
                        <Image
                          src={product.anhDaiDien}
                          alt={product.ten}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {product?.duongDanNgan ? (
                        <Link
                          href={`/products/${product.duongDanNgan}`}
                          className="text-sm font-semibold text-slate-900 hover:text-primary"
                        >
                          {product.ten}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-slate-900">
                          {product?.ten ?? "Sản phẩm"}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-600">
                        Màu {line.bienThe?.mauSac} · Cỡ {line.bienThe?.kichCo} ·
                        Mã SKU: {line.bienThe?.sku}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatVND(line.gia)} × {line.soLuong}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-slate-900">
                      {formatVND(line.gia * line.soLuong)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Status History */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">
              Lịch sử trạng thái đơn hàng
            </h2>
            <ol className="mt-6 space-y-6">
              {history.map((event, index) => {
                const isLatest = index === history.length - 1;
                const isCancelled = event.trangThai === "DA_HUY";
                return (
                  <li key={event.id} className="relative flex gap-4">
                    {index < history.length - 1 && (
                      <span
                        className="absolute left-4 top-8 h-full w-px bg-slate-200"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isCancelled
                          ? "bg-danger-light text-danger"
                          : isLatest
                          ? "bg-primary text-white"
                          : "bg-primary-50 text-primary"
                      }`}
                    >
                      {isCancelled ? (
                        <XCircle size={16} aria-hidden="true" />
                      ) : isLatest ? (
                        <Check size={16} aria-hidden="true" />
                      ) : (
                        <Clock3 size={16} aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-slate-900">
                        {getTrangThaiDonLabel(event.trangThai)}
                      </p>
                      {event.ghiChu && (
                        <p className="mt-1 text-sm text-slate-600">
                          {event.ghiChu}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDateTime(event.thoiDiem)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          {/* Recipient Info */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <MapPin size={18} className="shrink-0 text-primary" aria-hidden="true" />
              <h2>Thông tin người nhận</h2>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">
              {order.tenNguoiNhan}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              SĐT: {order.soDienThoaiNhan}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {order.diaChiGiaoHang}
            </p>
          </section>

          {/* Payment Summary */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <PackageCheck
                size={18}
                className="shrink-0 text-primary"
                aria-hidden="true"
              />
              <h2>Chi tiết thanh toán</h2>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-slate-600">
                <span>Tiền hàng</span>
                <span className="font-medium text-slate-900">
                  {formatVND(order.tongTien)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-slate-600">
                <span>Giảm giá</span>
                <span className="font-medium text-success">
                  -{formatVND(order.giamGia)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-slate-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-slate-900">
                  {order.phiVanChuyen === 0
                    ? "Miễn phí"
                    : formatVND(order.phiVanChuyen)}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
                <span>Thành tiền</span>
                <span className="text-primary">{formatVND(order.thanhTien)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600">
                {getPhuongThucThanhToanLabel(
                  order.thanhToan?.phuongThuc ?? "COD"
                )}
              </span>
              <Badge
                size="sm"
                variant={getTrangThaiThanhToanVariant(
                  order.thanhToan?.trangThai ?? "CHUA_THANH_TOAN"
                )}
              >
                {getTrangThaiThanhToanLabel(
                  order.thanhToan?.trangThai ?? "CHUA_THANH_TOAN"
                )}
              </Badge>
            </div>
          </section>

          {/* Actions */}
          {order.trangThai === "CHO_XAC_NHAN" && (
            <Button
              variant="danger"
              fullWidth
              leftIcon={<XCircle size={17} />}
              onClick={() => setCancelModalOpen(true)}
            >
              Hủy đơn hàng
            </Button>
          )}

          {order.trangThai === "HOAN_THANH" && !returnRequest && (
            <Link
              href={`/returns/new/${order.id}`}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <RefreshCw size={16} aria-hidden="true" />
              <span>Gửi yêu cầu đổi / trả hàng</span>
            </Link>
          )}

          {returnRequest && (
            <Link
              href={`/returns/${returnRequest.id}`}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-50"
            >
              <RefreshCw size={16} aria-hidden="true" />
              <span>Xem tiến trình đổi / trả</span>
            </Link>
          )}
        </aside>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Thông tin đơn hàng hiện là dữ liệu minh họa, chưa kết nối API máy chủ.
      </p>

      <ConfirmDialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        title={`Hủy đơn hàng ${order.maDonHang}?`}
        description="Đơn hàng đang ở trạng thái Chờ xác nhận. Khi hủy, đơn hàng sẽ dừng xử lý trong phiên xem trước này."
        confirmLabel="Xác nhận hủy đơn"
      />
    </section>
  );
}
