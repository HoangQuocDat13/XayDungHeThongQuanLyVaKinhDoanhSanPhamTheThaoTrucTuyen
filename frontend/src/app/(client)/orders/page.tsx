"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { mockDonHang } from "@/features/order/data/mock";
import {
  getTrangThaiDonLabel,
  getTrangThaiDonVariant,
  formatDate,
  formatVND,
  getPhuongThucThanhToanLabel,
} from "@/lib/utils";
import type { TrangThaiDon } from "@/types";

const filterOptions: { key: "TAT_CA" | TrangThaiDon; label: string }[] = [
  { key: "TAT_CA", label: "Tất cả" },
  { key: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
  { key: "DANG_CHUAN_BI", label: "Đang chuẩn bị" },
  { key: "DANG_VAN_CHUYEN", label: "Đang vận chuyển" },
  { key: "HOAN_THANH", label: "Hoàn thành" },
  { key: "DA_HUY", label: "Đã hủy" },
];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<string>("TAT_CA");

  const tabItems = useMemo(
    () =>
      filterOptions.map((f) => ({
        key: f.key,
        label: f.label,
        count:
          f.key === "TAT_CA"
            ? mockDonHang.length
            : mockDonHang.filter((o) => o.trangThai === f.key).length,
      })),
    []
  );

  const orders = useMemo(
    () =>
      mockDonHang.filter(
        (order) => activeFilter === "TAT_CA" || order.trangThai === activeFilter
      ),
    [activeFilter]
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Tài khoản", href: "/profile" },
          { label: "Đơn hàng của tôi" },
        ]}
        className="mb-4"
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Quản lý mua sắm
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Đơn hàng của tôi
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Theo dõi trạng thái vận chuyển, xem lịch sử xử lý và gửi yêu cầu đổi/trả khi cần.
      </p>

      <div className="mt-6">
        <Tabs
          items={tabItems}
          activeKey={activeFilter}
          onChange={setActiveFilter}
          ariaLabel="Lọc đơn hàng theo trạng thái"
        />
      </div>

      {orders.length > 0 ? (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const firstItem = order.chiTiet?.[0]?.bienThe?.sanPham;
            const extraCount = Math.max(0, (order.chiTiet?.length ?? 0) - 1);

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-base font-bold text-slate-900">
                      Mã đơn: {order.maDonHang}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Đặt ngày {formatDate(order.ngayTao)} ·{" "}
                      {getPhuongThucThanhToanLabel(
                        order.thanhToan?.phuongThuc ?? "COD"
                      )}
                    </p>
                  </div>
                  <Badge
                    variant={getTrangThaiDonVariant(order.trangThai)}
                    dot
                  >
                    {getTrangThaiDonLabel(order.trangThai)}
                  </Badge>
                </div>

                {firstItem && (
                  <div className="py-4 flex items-center gap-4 border-b border-slate-100">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                      {firstItem.anhDaiDien && (
                        <Image
                          src={firstItem.anhDaiDien}
                          alt={firstItem.ten}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {firstItem.ten}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {extraCount > 0
                          ? `Cùng ${extraCount} sản phẩm khác trong đơn`
                          : `Số lượng: ${order.chiTiet?.[0]?.soLuong ?? 1}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-slate-600">
                    Thành tiền:{" "}
                    <strong className="text-base font-bold text-slate-900">
                      {formatVND(order.thanhTien)}
                    </strong>
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {order.trangThai === "HOAN_THANH" && (
                      <Link
                        href={`/returns/new/${order.id}`}
                        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
                      >
                        Yêu cầu đổi / trả
                      </Link>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
          <p className="pt-2 text-center text-xs text-slate-500">
            Danh sách đơn hàng đang hiển thị từ dữ liệu mẫu minh họa.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={PackageSearch}
            title="Chưa có đơn hàng ở trạng thái này"
            description="Hãy chọn tab trạng thái khác hoặc khám phá cửa hàng để đặt đơn mới."
          />
        </div>
      )}
    </section>
  );
}
