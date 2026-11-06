"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Eye,
  RotateCcw,
  X,
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
import { mockAdminUsers } from "@/features/dashboard/data/mock";
import { mockDonHang, mockYeuCauDoiTra } from "@/features/order/data/mock";
import {
  formatDate,
  formatDateTime,
  getLoaiDoiTraLabel,
  getTrangThaiDoiTraLabel,
  getTrangThaiDoiTraVariant,
  isConfiguredImageHost,
} from "@/lib/utils";
import type { TrangThaiDoiTra, YeuCauDoiTra } from "@/types";

const staffMembers = mockAdminUsers.filter(
  (u) => u.vaiTro === "QUAN_TRI_VIEN" || u.vaiTro === "NHAN_VIEN"
);

const initialReturnRequests: YeuCauDoiTra[] = [
  {
    id: "dt-2",
    donHangId: "dh-1",
    nguoiDungId: "nd-1",
    nhanVienXuLyId: null,
    lyDo: "Áo thun bị sứt đường chỉ nhẹ ở cổ tay áo, mong muốn trả hàng hoàn tiền.",
    minhChung:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    trangThai: "CHO_DUYET",
    ghiChu: null,
    ngayTao: "2026-11-04T15:30:00Z",
    ngayCapNhat: "2026-11-04T15:30:00Z",
    donHang: mockDonHang[0],
    chiTiet: [
      {
        id: "cdt-2-1",
        yeuCauId: "dt-2",
        bienTheId: "bt-2-2",
        soLuong: 1,
        loai: "TRA_HANG",
        bienTheMoiId: null,
        bienThe: mockDonHang[0]?.chiTiet?.[1]?.bienThe,
      },
    ],
  },
  ...mockYeuCauDoiTra.map((item) => ({
    ...item,
    nhanVienXuLyId: item.nhanVienXuLyId ?? "u-2",
    nhanVienXuLy:
      item.nhanVienXuLy ?? {
        id: "u-2",
        taiKhoanId: "tk-2",
        hoTen: "Trần Thị Lan Anh",
        ngayTao: "2026-02-10T00:00:00Z",
        ngayCapNhat: "2026-02-10T00:00:00Z",
      },
  })),
];

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState<YeuCauDoiTra[]>(
    initialReturnRequests
  );
  const [statusTab, setStatusTab] = useState("ALL");

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [trangThai, setTrangThai] = useState<TrangThaiDoiTra>("CHO_DUYET");
  const [nhanVienId, setNhanVienId] = useState<string>(
    staffMembers[0]?.id ?? ""
  );
  const [ghiChu, setGhiChu] = useState("");

  const selectedRequest = useMemo(
    () => requests.find((item) => item.id === selectedRequestId) ?? null,
    [requests, selectedRequestId]
  );

  const openModal = (request: YeuCauDoiTra) => {
    setSelectedRequestId(request.id);
    setTrangThai(request.trangThai);
    setNhanVienId(request.nhanVienXuLyId ?? staffMembers[0]?.id ?? "");
    setGhiChu(request.ghiChu ?? "");
  };

  const applyDecision = (
    targetStatus: TrangThaiDoiTra,
    customNote?: string
  ) => {
    if (!selectedRequest) return;
    const assignedStaff = staffMembers.find((s) => s.id === nhanVienId);
    const now = new Date().toISOString();
    const finalNote = (customNote ?? ghiChu).trim();

    setRequests((prev) =>
      prev.map((item) =>
        item.id === selectedRequest.id
          ? {
              ...item,
              trangThai: targetStatus,
              ghiChu: finalNote || null,
              nhanVienXuLyId: assignedStaff?.id ?? null,
              nhanVienXuLy: assignedStaff
                ? {
                    id: assignedStaff.id,
                    taiKhoanId: assignedStaff.id,
                    hoTen: assignedStaff.hoTen,
                    ngayTao: assignedStaff.ngayTao,
                    ngayCapNhat: now,
                  }
                : undefined,
              ngayCapNhat: now,
            }
          : item
      )
    );

    setTrangThai(targetStatus);
    if (customNote !== undefined) {
      setGhiChu(finalNote);
    }
    toast.success(
      `Đã cập nhật yêu cầu ${selectedRequest.id.toUpperCase()} sang "${getTrangThaiDoiTraLabel(
        targetStatus
      )}" (xem trước).`
    );
  };

  const handleSaveForm = (event: React.FormEvent) => {
    event.preventDefault();
    applyDecision(trangThai);
  };

  const tabItems = useMemo(
    () => [
      { key: "ALL", label: "Tất cả", count: requests.length },
      {
        key: "CHO_DUYET",
        label: "Chờ duyệt",
        count: requests.filter((r) => r.trangThai === "CHO_DUYET").length,
      },
      {
        key: "DA_PHE_DUYET",
        label: "Đã phê duyệt",
        count: requests.filter((r) => r.trangThai === "DA_PHE_DUYET").length,
      },
      {
        key: "DANG_XU_LY",
        label: "Đang xử lý",
        count: requests.filter((r) => r.trangThai === "DANG_XU_LY").length,
      },
      {
        key: "HOAN_TAT",
        label: "Hoàn tất",
        count: requests.filter((r) => r.trangThai === "HOAN_TAT").length,
      },
      {
        key: "TU_CHOI",
        label: "Từ chối",
        count: requests.filter((r) => r.trangThai === "TU_CHOI").length,
      },
    ],
    [requests]
  );

  const filteredRequests = useMemo(() => {
    if (statusTab === "ALL") return requests;
    return requests.filter((r) => r.trangThai === statusTab);
  }, [requests, statusTab]);

  const rows = useMemo<AdminTableRow[]>(
    () =>
      filteredRequests.map((request) => {
        const customerName =
          request.nguoiDung?.hoTen ??
          request.donHang?.tenNguoiNhan ??
          "Khách hàng";
        return {
          id: request.id,
          searchable: `${request.id} ${request.donHang?.maDonHang ?? ""} ${
            request.lyDo
          } ${customerName} ${request.nhanVienXuLy?.hoTen ?? ""}`,
          cells: [
            <div key="req">
              <button
                type="button"
                onClick={() => openModal(request)}
                className="font-semibold text-primary hover:underline"
              >
                {request.id.toUpperCase()}
              </button>
              <p className="mt-0.5 text-xs text-slate-600">
                Đơn: {request.donHang?.maDonHang ?? "—"}
              </p>
            </div>,
            <span key="customer" className="font-medium text-slate-900">
              {customerName}
            </span>,
            <div key="types" className="flex flex-wrap gap-1">
              {request.chiTiet?.map((line) => (
                <Badge
                  key={line.id}
                  size="sm"
                  variant={line.loai === "DOI_HANG" ? "info" : "warning"}
                >
                  {getLoaiDoiTraLabel(line.loai)}
                </Badge>
              ))}
            </div>,
            <p
              key="reason"
              className="max-w-60 truncate text-slate-700"
              title={request.lyDo}
            >
              {request.lyDo}
            </p>,
            <span key="staff" className="text-slate-700">
              {request.nhanVienXuLy?.hoTen ?? (
                <span className="text-xs italic text-slate-500">
                  Chưa phân công
                </span>
              )}
            </span>,
            <Badge
              key="status"
              variant={getTrangThaiDoiTraVariant(request.trangThai)}
              dot
            >
              {getTrangThaiDoiTraLabel(request.trangThai)}
            </Badge>,
            <span key="date" className="text-slate-700">
              {formatDate(request.ngayTao)}
            </span>,
            <Button
              key="action"
              size="xs"
              variant="secondary"
              leftIcon={<Eye size={14} />}
              onClick={() => openModal(request)}
            >
              Xử lý
            </Button>,
          ],
        };
      }),
    [filteredRequests]
  );

  const proofUrls = selectedRequest
    ? selectedRequest.minhChung
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Yêu cầu đổi / trả hàng
            </h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Kiểm tra lý do, hình ảnh minh chứng, biến thể đổi mới, phân công nhân viên phụ trách và phản hồi cho khách hàng.
          </p>
        </div>
      </div>

      <Tabs
        items={tabItems}
        activeKey={statusTab}
        onChange={setStatusTab}
        variant="pills"
        ariaLabel="Lọc yêu cầu đổi trả theo trạng thái"
      />

      <AdminDataTable
        columns={[
          "Mã yêu cầu",
          "Khách hàng",
          "Hình thức",
          "Lý do",
          "Nhân viên xử lý",
          "Trạng thái",
          "Ngày gửi",
          "Thao tác",
        ]}
        rows={rows}
        searchPlaceholder="Tìm mã yêu cầu, mã đơn hàng, tên khách hoặc lý do..."
      />

      <Modal
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequestId(null)}
        size="xl"
        title={
          selectedRequest
            ? `Xử lý yêu cầu ${selectedRequest.id.toUpperCase()}`
            : "Chi tiết đổi trả"
        }
        description={
          selectedRequest
            ? `Thuộc đơn hàng ${
                selectedRequest.donHang?.maDonHang ?? "—"
              } · Gửi lúc ${formatDateTime(selectedRequest.ngayTao)}`
            : undefined
        }
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Quick decision banner when pending */}
            {selectedRequest.trangThai === "CHO_DUYET" && (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <RotateCcw size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Yêu cầu đang chờ phê duyệt
                    </p>
                    <p className="text-xs text-slate-700">
                      Kiểm tra hình ảnh minh chứng bên dưới trước khi phê duyệt hoặc từ chối.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Check size={15} />}
                    onClick={() =>
                      applyDecision(
                        "DA_PHE_DUYET",
                        ghiChu ||
                          "Đã phê duyệt yêu cầu. Quý khách vui lòng đóng gói sản phẩm gửi về kho SportZone."
                      )
                    }
                  >
                    Phê duyệt ngay
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<X size={15} />}
                    onClick={() =>
                      applyDecision(
                        "TU_CHOI",
                        ghiChu ||
                          "Rất tiếc yêu cầu chưa đáp ứng điều kiện đổi trả do thiếu minh chứng hợp lệ."
                      )
                    }
                  >
                    Từ chối
                  </Button>
                </div>
              </div>
            )}

            {/* Requested items */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Sản phẩm yêu cầu đổi / trả ({selectedRequest.chiTiet?.length ?? 0})
              </h3>
              <div className="space-y-3">
                {selectedRequest.chiTiet?.map((detail) => (
                  <div
                    key={detail.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge
                        variant={
                          detail.loai === "DOI_HANG" ? "info" : "warning"
                        }
                      >
                        {getLoaiDoiTraLabel(detail.loai)} · Số lượng:{" "}
                        {detail.soLuong}
                      </Badge>
                      <span className="text-xs font-mono text-slate-600">
                        SKU gốc: {detail.bienThe?.sku ?? "—"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-11 md:items-center">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 md:col-span-5">
                        <p className="text-xs font-medium text-slate-600">
                          Sản phẩm đã mua
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {detail.bienThe?.sanPham?.ten ?? "Sản phẩm thể thao"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-700">
                          Màu: {detail.bienThe?.mauSac} · Cỡ:{" "}
                          {detail.bienThe?.kichCo}
                        </p>
                      </div>

                      {detail.loai === "DOI_HANG" && detail.bienTheMoi ? (
                        <>
                          <div className="flex justify-center md:col-span-1">
                            <ArrowRight
                              size={18}
                              className="text-primary"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3 md:col-span-5">
                            <p className="text-xs font-medium text-teal-800">
                              Biến thể muốn đổi sang
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                              {detail.bienTheMoi.sanPham?.ten ??
                                detail.bienThe?.sanPham?.ten}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-700">
                              SKU: {detail.bienTheMoi.sku} · Màu:{" "}
                              {detail.bienTheMoi.mauSac} · Cỡ:{" "}
                              {detail.bienTheMoi.kichCo} (Tồn:{" "}
                              {detail.bienTheMoi.soLuongTon})
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 md:col-span-6">
                          <p className="text-xs font-medium text-slate-600">
                            Hình thức giải quyết
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            Hoàn trả sản phẩm về kho &amp; hoàn tiền cho khách hàng
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason & Evidence */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Lý do khách hàng cung cấp
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {selectedRequest.lyDo}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Hình ảnh minh chứng ({proofUrls.length})
                </h3>
                {proofUrls.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    Không có ảnh minh chứng đính kèm.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {proofUrls.map((url, idx) => (
                      <a
                        key={`${url}-${idx}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white"
                        aria-label={`Mở ảnh minh chứng ${idx + 1} trong tab mới`}
                      >
                        <Image
                          src={url}
                          alt={`Minh chứng ${idx + 1}`}
                          fill
                          sizes="80px"
                          unoptimized={!isConfiguredImageHost(url)}
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <ExternalLink size={12} aria-hidden="true" />
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Processing Form */}
            <form
              onSubmit={handleSaveForm}
              className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                Cập nhật tiến trình &amp; Ghi chú xử lý
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Trạng thái xử lý"
                  value={trangThai}
                  onChange={(e) =>
                    setTrangThai(e.target.value as TrangThaiDoiTra)
                  }
                  options={[
                    { value: "CHO_DUYET", label: "Chờ duyệt" },
                    { value: "DA_PHE_DUYET", label: "Đã phê duyệt" },
                    { value: "DANG_XU_LY", label: "Đang xử lý tại kho" },
                    { value: "HOAN_TAT", label: "Hoàn tất đổi / trả" },
                    { value: "TU_CHOI", label: "Từ chối yêu cầu" },
                  ]}
                />
                <Select
                  label="Nhân viên phụ trách"
                  value={nhanVienId}
                  onChange={(e) => setNhanVienId(e.target.value)}
                  options={staffMembers.map((staff) => ({
                    value: staff.id,
                    label: `${staff.hoTen} (${
                      staff.vaiTro === "QUAN_TRI_VIEN"
                        ? "Quản trị viên"
                        : "Nhân viên"
                    })`,
                  }))}
                />
              </div>

              <Textarea
                label="Ghi chú phản hồi cho khách hàng"
                rows={3}
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="Nhập hướng dẫn gửi hàng hoặc kết quả kiểm tra sản phẩm..."
              />

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedRequestId(null)}
                >
                  Đóng
                </Button>
                <Button type="submit">Lưu cập nhật</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
