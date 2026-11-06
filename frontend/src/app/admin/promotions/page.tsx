"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Power, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import {
  AdminDataTable,
  type AdminTableRow,
} from "@/components/admin/data-table";
import { mockSanPham } from "@/features/catalog/data/mock";
import {
  mockPromotions,
  type AdminPromotion,
} from "@/features/dashboard/data/mock";
import { formatDate, formatVND, getLoaiKhuyenMaiLabel } from "@/lib/utils";
import type { LoaiKhuyenMai } from "@/types";

interface PromotionItem extends AdminPromotion {
  sanPhamIds: string[];
}

const initialPromotions: PromotionItem[] = mockPromotions.map((item) => ({
  ...item,
  sanPhamIds:
    item.id === "km-1"
      ? mockSanPham.slice(0, 8).map((p) => p.id)
      : item.id === "km-4"
      ? ["sp-1", "sp-11", "sp-12"]
      : [],
}));

function toDateInputValue(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "2026-11-04";
  return date.toISOString().slice(0, 10);
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] =
    useState<PromotionItem[]>(initialPromotions);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] =
    useState<PromotionItem | null>(null);
  const [deletingPromotion, setDeletingPromotion] =
    useState<PromotionItem | null>(null);

  const [ten, setTen] = useState("");
  const [maGiamGia, setMaGiamGia] = useState("");
  const [loai, setLoai] = useState<LoaiKhuyenMai>("PHAN_TRAM");
  const [giaTri, setGiaTri] = useState("");
  const [thoiGianBatDau, setThoiGianBatDau] = useState("2026-11-01");
  const [thoiGianKetThuc, setThoiGianKetThuc] = useState("2026-11-30");
  const [kichHoat, setKichHoat] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const openCreate = () => {
    setEditingPromotion(null);
    setTen("");
    setMaGiamGia("");
    setLoai("PHAN_TRAM");
    setGiaTri("");
    setThoiGianBatDau("2026-11-04");
    setThoiGianKetThuc("2026-12-31");
    setKichHoat(true);
    setSelectedProductIds([]);
    setModalOpen(true);
  };

  const openEdit = (promotion: PromotionItem) => {
    setEditingPromotion(promotion);
    setTen(promotion.ten);
    setMaGiamGia(promotion.maGiamGia ?? "");
    setLoai(promotion.loai as LoaiKhuyenMai);
    setGiaTri(String(promotion.giaTri));
    setThoiGianBatDau(toDateInputValue(promotion.thoiGianBatDau));
    setThoiGianKetThuc(toDateInputValue(promotion.thoiGianKetThuc));
    setKichHoat(promotion.kichHoat);
    setSelectedProductIds(promotion.sanPhamIds);
    setModalOpen(true);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = ten.trim();
    const cleanCode = maGiamGia.trim().toUpperCase();
    const numericValue = Number(giaTri);

    if (!cleanName) {
      toast.error("Vui lòng nhập tên chương trình khuyến mãi.");
      return;
    }
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      toast.error("Giá trị khuyến mãi phải lớn hơn 0.");
      return;
    }
    if (loai === "PHAN_TRAM" && numericValue > 90) {
      toast.error("Mức giảm theo phần trăm không được vượt quá 90%.");
      return;
    }
    if (new Date(thoiGianKetThuc) < new Date(thoiGianBatDau)) {
      toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
      return;
    }

    const startIso = `${thoiGianBatDau}T00:00:00Z`;
    const endIso = `${thoiGianKetThuc}T23:59:59Z`;

    if (editingPromotion) {
      setPromotions((prev) =>
        prev.map((item) =>
          item.id === editingPromotion.id
            ? {
                ...item,
                ten: cleanName,
                maGiamGia: cleanCode || undefined,
                loai,
                giaTri: numericValue,
                thoiGianBatDau: startIso,
                thoiGianKetThuc: endIso,
                kichHoat,
                sanPhamIds: selectedProductIds,
                soSanPhamApDung: selectedProductIds.length,
              }
            : item
        )
      );
      toast.success(`Đã cập nhật khuyến mãi "${cleanName}" (xem trước).`);
    } else {
      const created: PromotionItem = {
        id: `km-${Date.now()}`,
        ten: cleanName,
        maGiamGia: cleanCode || undefined,
        loai,
        giaTri: numericValue,
        thoiGianBatDau: startIso,
        thoiGianKetThuc: endIso,
        kichHoat,
        sanPhamIds: selectedProductIds,
        soSanPhamApDung: selectedProductIds.length,
        soDonSuDung: 0,
      };
      setPromotions((prev) => [created, ...prev]);
      toast.success(`Đã tạo chương trình "${cleanName}" (xem trước).`);
    }
    setModalOpen(false);
  };

  const handleToggleActive = (promotion: PromotionItem) => {
    const nextActive = !promotion.kichHoat;
    setPromotions((prev) =>
      prev.map((item) =>
        item.id === promotion.id ? { ...item, kichHoat: nextActive } : item
      )
    );
    toast.info(
      nextActive
        ? `Đã kích hoạt chương trình "${promotion.ten}".`
        : `Đã tạm tắt chương trình "${promotion.ten}".`
    );
  };

  const handleDelete = () => {
    if (!deletingPromotion) return;
    setPromotions((prev) =>
      prev.filter((item) => item.id !== deletingPromotion.id)
    );
    toast.info(`Đã xóa chương trình "${deletingPromotion.ten}" (xem trước).`);
    setDeletingPromotion(null);
  };

  const filteredPromotions = useMemo(() => {
    return promotions.filter((item) => {
      if (statusFilter === "ACTIVE" && !item.kichHoat) return false;
      if (statusFilter === "INACTIVE" && item.kichHoat) return false;
      if (typeFilter !== "ALL" && item.loai !== typeFilter) return false;
      return true;
    });
  }, [promotions, statusFilter, typeFilter]);

  const rows = useMemo<AdminTableRow[]>(
    () =>
      filteredPromotions.map((promotion) => ({
        id: promotion.id,
        searchable: `${promotion.ten} ${promotion.maGiamGia ?? "tự động"}`,
        cells: [
          <div key="name" className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-primary">
              <TicketPercent size={17} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">{promotion.ten}</p>
              {promotion.maGiamGia ? (
                <p className="mt-1 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800">
                  Mã: {promotion.maGiamGia}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-600">
                  Giảm tự động không cần mã
                </p>
              )}
            </div>
          </div>,
          <span key="type" className="text-slate-700">
            {getLoaiKhuyenMaiLabel(promotion.loai)}
          </span>,
          <span key="value" className="font-bold text-primary">
            {promotion.loai === "PHAN_TRAM"
              ? `${promotion.giaTri}%`
              : formatVND(promotion.giaTri)}
          </span>,
          <div key="date" className="text-xs text-slate-700 space-y-0.5">
            <p>Từ: {formatDate(promotion.thoiGianBatDau)}</p>
            <p>Đến: {formatDate(promotion.thoiGianKetThuc)}</p>
          </div>,
          <div key="scope" className="space-y-0.5">
            <p className="font-medium text-slate-800">
              {promotion.soSanPhamApDung > 0
                ? `${promotion.soSanPhamApDung} sản phẩm chọn lọc`
                : "Toàn bộ đơn hàng"}
            </p>
            <p className="text-xs text-slate-600">
              Đã dùng: {promotion.soDonSuDung} đơn
            </p>
          </div>,
          <Badge
            key="status"
            variant={promotion.kichHoat ? "success" : "muted"}
            dot
          >
            {promotion.kichHoat ? "Đang bật" : "Đã tắt"}
          </Badge>,
          <div key="actions" className="flex flex-wrap items-center gap-2">
            <Button
              size="xs"
              variant="outline"
              leftIcon={<Power size={13} />}
              onClick={() => handleToggleActive(promotion)}
            >
              {promotion.kichHoat ? "Tắt" : "Bật"}
            </Button>
            <Button
              size="xs"
              variant="secondary"
              leftIcon={<Pencil size={13} />}
              onClick={() => openEdit(promotion)}
            >
              Sửa
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className="text-danger hover:bg-red-50 hover:text-danger"
              leftIcon={<Trash2 size={13} />}
              onClick={() => setDeletingPromotion(promotion)}
            >
              Xóa
            </Button>
          </div>,
        ],
      })),
    [filteredPromotions]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Khuyến mãi</h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Thiết lập mã giảm giá hoặc chương trình giảm tự động theo phần trăm, số tiền và danh sách sản phẩm áp dụng.
          </p>
        </div>
        <Button leftIcon={<Plus size={17} />} onClick={openCreate}>
          Tạo khuyến mãi
        </Button>
      </div>

      <AdminDataTable
        columns={[
          "Chương trình",
          "Hình thức",
          "Mức giảm",
          "Thời gian hiệu lực",
          "Phạm vi áp dụng",
          "Trạng thái",
          "Thao tác",
        ]}
        rows={rows}
        searchPlaceholder="Tìm tên chương trình hoặc mã giảm giá..."
        toolbar={
          <>
            <Select
              aria-label="Lọc theo trạng thái khuyến mãi"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả trạng thái" },
                { value: "ACTIVE", label: "Đang bật" },
                { value: "INACTIVE", label: "Đã tắt" },
              ]}
            />
            <Select
              aria-label="Lọc theo hình thức giảm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả hình thức" },
                { value: "PHAN_TRAM", label: "Giảm theo phần trăm" },
                { value: "SO_TIEN", label: "Giảm theo số tiền" },
              ]}
            />
          </>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title={
          editingPromotion
            ? "Chỉnh sửa chương trình khuyến mãi"
            : "Tạo chương trình khuyến mãi mới"
        }
        description="Áp dụng cho toàn đơn hàng bằng mã giảm giá hoặc chọn sản phẩm cụ thể để giảm trực tiếp."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Tên chương trình"
              required
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              placeholder="Ví dụ: Ưu đãi mùa giải Marathon"
            />
            <Input
              label="Mã giảm giá (không bắt buộc)"
              value={maGiamGia}
              onChange={(e) => setMaGiamGia(e.target.value.toUpperCase())}
              placeholder="Ví dụ: RUN2026"
              hint="Để trống nếu muốn giảm tự động không cần nhập mã."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Loại khuyến mãi"
              value={loai}
              onChange={(e) => setLoai(e.target.value as LoaiKhuyenMai)}
              options={[
                { value: "PHAN_TRAM", label: "Phần trăm (%)" },
                { value: "SO_TIEN", label: "Số tiền cố định (VND)" },
              ]}
            />
            <Input
              label={
                loai === "PHAN_TRAM"
                  ? "Phần trăm giảm (%)"
                  : "Số tiền giảm (VND)"
              }
              type="number"
              min={1}
              max={loai === "PHAN_TRAM" ? 90 : undefined}
              required
              value={giaTri}
              onChange={(e) => setGiaTri(e.target.value)}
              placeholder={loai === "PHAN_TRAM" ? "15" : "50000"}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Ngày bắt đầu"
              type="date"
              required
              value={thoiGianBatDau}
              onChange={(e) => setThoiGianBatDau(e.target.value)}
            />
            <Input
              label="Ngày kết thúc"
              type="date"
              required
              value={thoiGianKetThuc}
              onChange={(e) => setThoiGianKetThuc(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800">
                Sản phẩm áp dụng ({selectedProductIds.length} đã chọn)
              </span>
              {selectedProductIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedProductIds([])}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Bỏ chọn tất cả (áp dụng toàn đơn)
                </button>
              )}
            </div>
            <div className="max-h-52 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              {mockSanPham.map((product) => (
                <Checkbox
                  key={product.id}
                  checked={selectedProductIds.includes(product.id)}
                  onChange={() => toggleProductSelection(product.id)}
                  label={
                    <span>
                      <strong className="font-medium text-slate-900">
                        {product.ten}
                      </strong>{" "}
                      <span className="text-xs text-slate-600">
                        ({product.thuongHieu?.ten} ·{" "}
                        {formatVND(product.giaHienThi ?? 0)})
                      </span>
                    </span>
                  }
                />
              ))}
            </div>
          </div>

          <Checkbox
            checked={kichHoat}
            onChange={(e) => setKichHoat(e.target.checked)}
            label="Kích hoạt chương trình ngay sau khi lưu"
          />

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {editingPromotion ? "Lưu thay đổi" : "Tạo khuyến mãi"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingPromotion)}
        onClose={() => setDeletingPromotion(null)}
        onConfirm={handleDelete}
        title={`Xóa chương trình "${deletingPromotion?.ten ?? ""}"?`}
        description="Thao tác này chỉ xóa chương trình khỏi danh sách xem trước trên trình duyệt."
      />
    </div>
  );
}
