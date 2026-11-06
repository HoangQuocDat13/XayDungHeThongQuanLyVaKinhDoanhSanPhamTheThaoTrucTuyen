"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  AdminDataTable,
  type AdminTableRow,
} from "@/components/admin/data-table";
import { mockThuongHieu } from "@/features/catalog/data/mock";
import { isConfiguredImageHost } from "@/lib/utils";
import type { ThuongHieu } from "@/types";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<ThuongHieu[]>(mockThuongHieu);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ThuongHieu | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<ThuongHieu | null>(null);

  const [ten, setTen] = useState("");
  const [anhLogo, setAnhLogo] = useState("");

  const openAdd = () => {
    setEditingBrand(null);
    setTen("");
    setAnhLogo("");
    setModalOpen(true);
  };

  const openEdit = (brand: ThuongHieu) => {
    setEditingBrand(brand);
    setTen(brand.ten);
    setAnhLogo(brand.anhLogo ?? "");
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ten.trim()) {
      toast.error("Vui lòng nhập tên thương hiệu.");
      return;
    }
    if (editingBrand) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id
            ? { ...b, ten: ten.trim(), anhLogo: anhLogo.trim() || null }
            : b
        )
      );
      toast.success(`Đã cập nhật thương hiệu "${ten.trim()}" (xem trước).`);
    } else {
      const created: ThuongHieu = {
        id: `th-${Date.now()}`,
        ten: ten.trim(),
        anhLogo: anhLogo.trim() || null,
        _count: { sanPham: 0 },
      };
      setBrands((prev) => [created, ...prev]);
      toast.success(`Đã thêm thương hiệu "${ten.trim()}" (xem trước).`);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deletingBrand) return;
    setBrands((prev) => prev.filter((b) => b.id !== deletingBrand.id));
    toast.info(`Đã xóa thương hiệu "${deletingBrand.ten}" khỏi danh sách mẫu.`);
    setDeletingBrand(null);
  };

  const rows = useMemo<AdminTableRow[]>(
    () =>
      brands.map((brand) => ({
        id: brand.id,
        searchable: brand.ten,
        cells: [
          <div key="brand" className="flex items-center gap-3">
            <span className="relative flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              {brand.anhLogo ? (
                <Image
                  src={brand.anhLogo}
                  alt={brand.ten}
                  fill
                  sizes="56px"
                  unoptimized={!isConfiguredImageHost(brand.anhLogo)}
                  className="object-contain p-1.5"
                />
              ) : (
                <Tag size={18} className="text-primary" aria-hidden="true" />
              )}
            </span>
            <span className="font-semibold text-slate-900">{brand.ten}</span>
          </div>,
          <span key="count" className="font-medium text-slate-800">
            {brand._count?.sanPham ?? 0} sản phẩm
          </span>,
          <Badge key="status" variant="success" dot>
            Đang hợp tác
          </Badge>,
          <div key="actions" className="flex items-center gap-2">
            <Button
              size="xs"
              variant="secondary"
              leftIcon={<Pencil size={14} />}
              onClick={() => openEdit(brand)}
            >
              Sửa
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className="text-danger hover:bg-red-50 hover:text-danger"
              leftIcon={<Trash2 size={14} />}
              onClick={() => setDeletingBrand(brand)}
            >
              Xóa
            </Button>
          </div>,
        ],
      })),
    [brands]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Thương hiệu</h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Thêm mới, chỉnh sửa thông tin thương hiệu và theo dõi số lượng sản phẩm thuộc hãng.
          </p>
        </div>
        <Button leftIcon={<Plus size={17} />} onClick={openAdd}>
          Thêm thương hiệu
        </Button>
      </div>

      <AdminDataTable
        columns={["Thương hiệu", "Số lượng sản phẩm", "Trạng thái", "Thao tác"]}
        rows={rows}
        searchPlaceholder="Tìm kiếm tên thương hiệu..."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tên thương hiệu"
            required
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            placeholder="Ví dụ: Puma, Asics..."
          />
          <Input
            label="Đường dẫn ảnh biểu trưng (không bắt buộc)"
            value={anhLogo}
            onChange={(e) => setAnhLogo(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {editingBrand ? "Lưu thay đổi" : "Tạo thương hiệu"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingBrand)}
        onClose={() => setDeletingBrand(null)}
        onConfirm={handleDelete}
        title={`Xóa thương hiệu "${deletingBrand?.ten ?? ""}"?`}
        description="Thao tác này chỉ xóa trên danh sách xem trước của trình duyệt."
      />
    </div>
  );
}
