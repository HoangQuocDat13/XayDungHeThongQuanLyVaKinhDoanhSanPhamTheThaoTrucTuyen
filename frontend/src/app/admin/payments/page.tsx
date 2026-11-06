"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import {
  AdminDataTable,
  type AdminTableRow,
} from "@/components/admin/data-table";
import { mockDonHang } from "@/features/order/data/mock";
import {
  formatDateTime,
  formatVND,
  getPhuongThucThanhToanLabel,
  getTrangThaiThanhToanLabel,
  getTrangThaiThanhToanVariant,
} from "@/lib/utils";
import type {
  DonHang,
  PhuongThucThanhToan,
  ThanhToan,
  TrangThaiThanhToan,
} from "@/types";

interface PaymentRecord extends ThanhToan {
  order: DonHang;
}

const initialPayments: PaymentRecord[] = mockDonHang
  .filter((order): order is DonHang & { thanhToan: ThanhToan } =>
    Boolean(order.thanhToan)
  )
  .map((order) => ({
    ...order.thanhToan,
    order,
  }));

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(
    null
  );
  const [trangThai, setTrangThai] =
    useState<TrangThaiThanhToan>("DA_THANH_TOAN");
  const [maGiaoDich, setMaGiaoDich] = useState("");

  const openModal = (payment: PaymentRecord) => {
    setEditingPayment(payment);
    setTrangThai(payment.trangThai);
    setMaGiaoDich(payment.maGiaoDich ?? "");
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingPayment) return;

    const now = new Date().toISOString();
    setPayments((prev) =>
      prev.map((item) =>
        item.id === editingPayment.id
          ? {
              ...item,
              trangThai,
              maGiaoDich: maGiaoDich.trim() || null,
              ngayThanhToan:
                trangThai === "DA_THANH_TOAN"
                  ? item.ngayThanhToan ?? now
                  : item.ngayThanhToan,
            }
          : item
      )
    );
    toast.success(
      `Đã cập nhật thanh toán đơn ${editingPayment.order.maDonHang} (xem trước).`
    );
    setEditingPayment(null);
  };

  const summary = useMemo(() => {
    return payments.reduce(
      (acc, p) => {
        if (p.trangThai === "DA_THANH_TOAN") acc.paid += p.soTien;
        else if (p.trangThai === "CHUA_THANH_TOAN") acc.pending += p.soTien;
        else if (p.trangThai === "HOAN_TIEN") acc.refunded += p.soTien;
        return acc;
      },
      { paid: 0, pending: 0, refunded: 0 }
    );
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      if (methodFilter !== "ALL" && item.phuongThuc !== methodFilter) {
        return false;
      }
      if (statusFilter !== "ALL" && item.trangThai !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [payments, methodFilter, statusFilter]);

  const rows = useMemo<AdminTableRow[]>(
    () =>
      filteredPayments.map((payment) => ({
        id: payment.id,
        searchable: `${payment.order.maDonHang} ${payment.order.tenNguoiNhan} ${
          payment.maGiaoDich ?? ""
        } ${getPhuongThucThanhToanLabel(payment.phuongThuc)}`,
        cells: [
          <span key="order" className="font-semibold text-primary">
            {payment.order.maDonHang}
          </span>,
          <div key="customer">
            <p className="font-medium text-slate-900">
              {payment.order.tenNguoiNhan}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              {payment.order.soDienThoaiNhan}
            </p>
          </div>,
          <span key="amount" className="font-bold text-slate-900">
            {formatVND(payment.soTien)}
          </span>,
          <span
            key="method"
            className="inline-flex items-center gap-2 text-slate-700"
          >
            <CreditCard
              size={15}
              className="shrink-0 text-slate-500"
              aria-hidden="true"
            />
            {getPhuongThucThanhToanLabel(payment.phuongThuc)}
          </span>,
          <Badge
            key="status"
            variant={getTrangThaiThanhToanVariant(payment.trangThai)}
            dot
          >
            {getTrangThaiThanhToanLabel(payment.trangThai)}
          </Badge>,
          <span
            key="tx"
            className="font-mono text-xs font-medium text-slate-700"
          >
            {payment.maGiaoDich || "—"}
          </span>,
          <span key="time" className="text-slate-700">
            {formatDateTime(payment.ngayThanhToan ?? payment.ngayTao)}
          </span>,
          <Button
            key="action"
            size="xs"
            variant="secondary"
            leftIcon={<Pencil size={13} />}
            onClick={() => openModal(payment)}
          >
            Đối soát
          </Button>,
        ],
      })),
    [filteredPayments]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Thanh toán</h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Theo dõi phương thức thanh toán, mã giao dịch trực tuyến và đối soát trạng thái thu tiền của từng đơn hàng.
          </p>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="md" className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-800">
            <CheckCircle2 size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-600">Đã thanh toán</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatVND(summary.paid)}
            </p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
            <Clock size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-600">
              Chờ thu (chưa thanh toán)
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatVND(summary.pending)}
            </p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-800">
            <RotateCcw size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-600">Đã hoàn tiền</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatVND(summary.refunded)}
            </p>
          </div>
        </Card>
      </div>

      <AdminDataTable
        columns={[
          "Mã đơn hàng",
          "Khách hàng",
          "Số tiền",
          "Phương thức",
          "Trạng thái",
          "Mã giao dịch",
          "Thời gian",
          "Thao tác",
        ]}
        rows={rows}
        searchPlaceholder="Tìm mã đơn hàng, tên khách hoặc mã giao dịch..."
        toolbar={
          <>
            <Select
              aria-label="Lọc theo phương thức thanh toán"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả phương thức" },
                {
                  value: "COD" satisfies PhuongThucThanhToan,
                  label: "Thanh toán khi nhận hàng",
                },
                {
                  value: "TRUYEN_TUYEN" satisfies PhuongThucThanhToan,
                  label: "Thanh toán trực tuyến",
                },
              ]}
            />
            <Select
              aria-label="Lọc theo trạng thái thanh toán"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả trạng thái" },
                { value: "CHUA_THANH_TOAN", label: "Chưa thanh toán" },
                { value: "DA_THANH_TOAN", label: "Đã thanh toán" },
                { value: "HOAN_TIEN", label: "Hoàn tiền" },
              ]}
            />
          </>
        }
      />

      <Modal
        open={Boolean(editingPayment)}
        onClose={() => setEditingPayment(null)}
        title={
          editingPayment
            ? `Đối soát thanh toán – ${editingPayment.order.maDonHang}`
            : "Đối soát thanh toán"
        }
        description="Cập nhật trạng thái thu tiền hoặc mã đối soát giao dịch trên dữ liệu xem trước."
      >
        {editingPayment && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-slate-600">Khách hàng:</span>
                <span className="font-semibold text-slate-900">
                  {editingPayment.order.tenNguoiNhan}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-600">Phương thức:</span>
                <span className="font-medium text-slate-900">
                  {getPhuongThucThanhToanLabel(editingPayment.phuongThuc)}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-t border-slate-200 pt-2">
                <span className="text-slate-600">Số tiền thanh toán:</span>
                <span className="font-bold text-primary">
                  {formatVND(editingPayment.soTien)}
                </span>
              </div>
            </div>

            <Select
              label="Trạng thái thanh toán"
              value={trangThai}
              onChange={(e) =>
                setTrangThai(e.target.value as TrangThaiThanhToan)
              }
              options={[
                { value: "CHUA_THANH_TOAN", label: "Chưa thanh toán" },
                { value: "DA_THANH_TOAN", label: "Đã thanh toán" },
                { value: "HOAN_TIEN", label: "Hoàn tiền" },
              ]}
            />

            <Input
              label="Mã giao dịch ngân hàng / ví điện tử (nếu có)"
              value={maGiaoDich}
              onChange={(e) => setMaGiaoDich(e.target.value)}
              placeholder="Ví dụ: VNPAY20261104091500"
            />

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingPayment(null)}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu đối soát</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
