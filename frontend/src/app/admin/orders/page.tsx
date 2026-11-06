"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminDataTable,
  type AdminTableRow,
} from "@/components/admin/data-table";
import { mockDonHang } from "@/features/order/data/mock";
import {
  formatDateTime,
  formatVND,
  getPhuongThucThanhToanLabel,
  getTrangThaiDonLabel,
  getTrangThaiDonVariant,
  getTrangThaiThanhToanLabel,
  getTrangThaiThanhToanVariant,
  isConfiguredImageHost,
} from "@/lib/utils";
import type { DonHang, TrangThaiDon } from "@/types";

const NEXT_STATUS_OPTIONS: Record<TrangThaiDon, TrangThaiDon[]> = {
  CHO_XAC_NHAN: ["DANG_CHUAN_BI", "DA_HUY"],
  DANG_CHUAN_BI: ["DANG_VAN_CHUYEN", "DA_HUY"],
  DANG_VAN_CHUYEN: ["HOAN_THANH"],
  HOAN_THANH: [],
  DA_HUY: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DonHang[]>(() =>
    [...mockDonHang].sort(
      (a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime()
    )
  );
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<TrangThaiDon>("DANG_CHUAN_BI");
  const [note, setNote] = useState("");

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const openOrderModal = (order: DonHang) => {
    setSelectedOrderId(order.id);
    const allowed = NEXT_STATUS_OPTIONS[order.trangThai];
    setNextStatus(allowed[0] ?? order.trangThai);
    setNote("");
  };

  const handleUpdateStatus = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOrder) return;

    const allowed = NEXT_STATUS_OPTIONS[selectedOrder.trangThai];
    if (!allowed.includes(nextStatus)) {
      toast.error("Trạng thái chuyển tiếp không hợp lệ theo quy trình đơn hàng.");
      return;
    }

    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== selectedOrder.id) return order;
        const newHistoryItem = {
          id: `ls-${Date.now()}`,
          donHangId: order.id,
          trangThai: nextStatus,
          ghiChu: note.trim() || undefined,
          thoiDiem: now,
        };
        const updatedPayment =
          nextStatus === "HOAN_THANH" && order.thanhToan
            ? {
                ...order.thanhToan,
                trangThai: "DA_THANH_TOAN" as const,
                ngayThanhToan: order.thanhToan.ngayThanhToan ?? now,
              }
            : order.thanhToan;

        return {
          ...order,
          trangThai: nextStatus,
          ngayCapNhat: now,
          thanhToan: updatedPayment,
          lichSu: [...(order.lichSu ?? []), newHistoryItem],
        };
      })
    );

    toast.success(
      `Đã chuyển đơn ${selectedOrder.maDonHang} sang "${getTrangThaiDonLabel(
        nextStatus
      )}" (xem trước).`
    );
    setNote("");
    const nextAllowed = NEXT_STATUS_OPTIONS[nextStatus];
    if (nextAllowed.length > 0) {
      setNextStatus(nextAllowed[0]);
    }
  };

  const tabItems = useMemo(
    () => [
      { key: "ALL", label: "Tất cả", count: orders.length },
      {
        key: "CHO_XAC_NHAN",
        label: "Chờ xác nhận",
        count: orders.filter((o) => o.trangThai === "CHO_XAC_NHAN").length,
      },
      {
        key: "DANG_CHUAN_BI",
        label: "Đang chuẩn bị",
        count: orders.filter((o) => o.trangThai === "DANG_CHUAN_BI").length,
      },
      {
        key: "DANG_VAN_CHUYEN",
        label: "Đang vận chuyển",
        count: orders.filter((o) => o.trangThai === "DANG_VAN_CHUYEN").length,
      },
      {
        key: "HOAN_THANH",
        label: "Hoàn thành",
        count: orders.filter((o) => o.trangThai === "HOAN_THANH").length,
      },
      {
        key: "DA_HUY",
        label: "Đã hủy",
        count: orders.filter((o) => o.trangThai === "DA_HUY").length,
      },
    ],
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (statusTab === "ALL") return orders;
    return orders.filter((o) => o.trangThai === statusTab);
  }, [orders, statusTab]);

  const rows = useMemo<AdminTableRow[]>(
    () =>
      filteredOrders.map((order) => ({
        id: order.id,
        searchable: `${order.maDonHang} ${order.tenNguoiNhan} ${order.soDienThoaiNhan} ${order.diaChiGiaoHang}`,
        cells: [
          <button
            key="code"
            type="button"
            onClick={() => openOrderModal(order)}
            className="font-semibold text-primary hover:underline text-left"
          >
            {order.maDonHang}
          </button>,
          <div key="customer">
            <p className="font-medium text-slate-900">{order.tenNguoiNhan}</p>
            <p className="mt-0.5 text-xs text-slate-600">
              {order.soDienThoaiNhan}
            </p>
          </div>,
          <span key="date" className="text-slate-700">
            {formatDateTime(order.ngayTao)}
          </span>,
          <span key="amount" className="font-bold text-slate-900">
            {formatVND(order.thanhTien)}
          </span>,
          <div key="payment" className="space-y-1">
            <p className="text-xs font-medium text-slate-800">
              {getPhuongThucThanhToanLabel(order.thanhToan?.phuongThuc ?? "COD")}
            </p>
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
          </div>,
          <Badge
            key="status"
            variant={getTrangThaiDonVariant(order.trangThai)}
            dot
          >
            {getTrangThaiDonLabel(order.trangThai)}
          </Badge>,
          <Button
            key="action"
            size="xs"
            variant="secondary"
            leftIcon={<Eye size={14} />}
            onClick={() => openOrderModal(order)}
          >
            Chi tiết &amp; Xử lý
          </Button>,
        ],
      })),
    [filteredOrders]
  );

  const allowedNextStatuses = selectedOrder
    ? NEXT_STATUS_OPTIONS[selectedOrder.trangThai]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Quản lý đơn hàng
            </h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Tra cứu thông tin giao hàng, kiểm tra thanh toán, cập nhật trạng thái theo quy trình và theo dõi lịch sử xử lý.
          </p>
        </div>
      </div>

      <Tabs
        items={tabItems}
        activeKey={statusTab}
        onChange={setStatusTab}
        variant="pills"
        ariaLabel="Lọc đơn hàng theo trạng thái"
      />

      <AdminDataTable
        columns={[
          "Mã đơn hàng",
          "Người nhận",
          "Ngày đặt",
          "Thành tiền",
          "Thanh toán",
          "Trạng thái",
          "Thao tác",
        ]}
        rows={rows}
        searchPlaceholder="Tìm mã đơn, tên người nhận, số điện thoại..."
      />

      <Modal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrderId(null)}
        size="xl"
        title={
          selectedOrder
            ? `Đơn hàng ${selectedOrder.maDonHang}`
            : "Chi tiết đơn hàng"
        }
        description={
          selectedOrder
            ? `Đặt lúc ${formatDateTime(selectedOrder.ngayTao)}`
            : undefined
        }
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Recipient + Payment cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Thông tin giao hàng
                </h3>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <User size={15} className="shrink-0 text-primary" aria-hidden="true" />
                  {selectedOrder.tenNguoiNhan}
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-700">
                  <Phone size={15} className="shrink-0 text-slate-500" aria-hidden="true" />
                  {selectedOrder.soDienThoaiNhan}
                </p>
                <p className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-slate-500" aria-hidden="true" />
                  <span>{selectedOrder.diaChiGiaoHang}</span>
                </p>
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Thanh toán &amp; Trạng thái
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-600">Đơn hàng:</span>
                  <Badge
                    variant={getTrangThaiDonVariant(selectedOrder.trangThai)}
                    dot
                  >
                    {getTrangThaiDonLabel(selectedOrder.trangThai)}
                  </Badge>
                </div>
                <p className="text-sm text-slate-700">
                  Phương thức:{" "}
                  <strong className="font-medium text-slate-900">
                    {getPhuongThucThanhToanLabel(
                      selectedOrder.thanhToan?.phuongThuc ?? "COD"
                    )}
                  </strong>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-600">TT thanh toán:</span>
                  <Badge
                    size="sm"
                    variant={getTrangThaiThanhToanVariant(
                      selectedOrder.thanhToan?.trangThai ?? "CHUA_THANH_TOAN"
                    )}
                  >
                    {getTrangThaiThanhToanLabel(
                      selectedOrder.thanhToan?.trangThai ?? "CHUA_THANH_TOAN"
                    )}
                  </Badge>
                </div>
                {selectedOrder.thanhToan?.maGiaoDich && (
                  <p className="text-xs font-mono text-slate-600">
                    Mã GD: {selectedOrder.thanhToan.maGiaoDich}
                  </p>
                )}
              </div>
            </div>

            {/* Order items */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Sản phẩm trong đơn ({selectedOrder.chiTiet?.length ?? 0})
              </h3>
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
                {selectedOrder.chiTiet?.map((line) => {
                  const thumb =
                    line.bienThe?.anhBienThe ??
                    line.bienThe?.sanPham?.anhDaiDien;
                  return (
                    <div
                      key={line.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt={line.bienThe?.sanPham?.ten ?? "Sản phẩm"}
                              fill
                              sizes="56px"
                              unoptimized={!isConfiguredImageHost(thumb)}
                              className="object-cover"
                            />
                          ) : (
                            <Package size={18} className="text-slate-400" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {line.bienThe?.sanPham?.ten ?? "Sản phẩm thể thao"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-600">
                            SKU: {line.bienThe?.sku} · Màu:{" "}
                            {line.bienThe?.mauSac} · Cỡ: {line.bienThe?.kichCo}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-600">
                            Đơn giá: {formatVND(line.gia)} × {line.soLuong}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-900">
                        {formatVND(line.gia * line.soLuong)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-700">
                  <span>Tạm tính</span>
                  <span>{formatVND(selectedOrder.tongTien)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Giảm giá khuyến mãi</span>
                  <span>-{formatVND(selectedOrder.giamGia)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Phí vận chuyển</span>
                  <span>
                    {selectedOrder.phiVanChuyen === 0
                      ? "Miễn phí"
                      : formatVND(selectedOrder.phiVanChuyen)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                  <span>Tổng thanh toán</span>
                  <span className="text-primary">
                    {formatVND(selectedOrder.thanhTien)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline + Workflow Update */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-6">
                <h3 className="text-sm font-semibold text-slate-900">
                  Lịch sử trạng thái đơn hàng
                </h3>
                <ol className="space-y-3 rounded-2xl border border-slate-200 p-4">
                  {selectedOrder.lichSu?.map((entry, idx) => {
                    const isLatest =
                      idx === (selectedOrder.lichSu?.length ?? 0) - 1;
                    return (
                      <li key={entry.id} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            isLatest
                              ? "bg-teal-100 text-primary"
                              : "bg-slate-100 text-slate-500"
                          }`}
                          aria-hidden="true"
                        >
                          {isLatest ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Clock size={13} />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              {getTrangThaiDonLabel(entry.trangThai)}
                            </span>
                            <span className="text-xs text-slate-600">
                              {formatDateTime(entry.thoiDiem)}
                            </span>
                          </div>
                          {entry.ghiChu && (
                            <p className="mt-1 text-xs text-slate-600">
                              Ghi chú: {entry.ghiChu}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="lg:col-span-6">
                {allowedNextStatuses.length > 0 ? (
                  <form
                    onSubmit={handleUpdateStatus}
                    className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">
                      Cập nhật trạng thái xử lý
                    </h3>
                    <Select
                      label="Trạng thái tiếp theo"
                      value={nextStatus}
                      onChange={(e) =>
                        setNextStatus(e.target.value as TrangThaiDon)
                      }
                      options={allowedNextStatuses.map((st) => ({
                        value: st,
                        label: getTrangThaiDonLabel(st),
                      }))}
                    />
                    <Textarea
                      label="Ghi chú xử lý (tùy chọn)"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Đã bàn giao kiện hàng cho đơn vị vận chuyển..."
                    />
                    <div className="flex justify-end">
                      <Button type="submit">Xác nhận cập nhật</Button>
                    </div>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">
                      Đơn hàng đã ở trạng thái kết thúc
                    </p>
                    <p className="mt-1 leading-relaxed">
                      Đơn hàng đang ở trạng thái{" "}
                      <strong>
                        {getTrangThaiDonLabel(selectedOrder.trangThai)}
                      </strong>{" "}
                      nên không thể chuyển đổi thêm.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
