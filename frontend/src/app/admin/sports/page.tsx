"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { mockMonTheThao } from "@/features/catalog/data/mock";
import type { MonTheThao } from "@/types";

function slugifyVi(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminSportsPage() {
  const [sports, setSports] = useState<MonTheThao[]>(mockMonTheThao);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<MonTheThao | null>(null);
  const [deletingSport, setDeletingSport] = useState<MonTheThao | null>(null);

  const [ten, setTen] = useState("");
  const [slug, setSlug] = useState("");

  const openAdd = () => {
    setEditingSport(null);
    setTen("");
    setSlug("");
    setModalOpen(true);
  };

  const openEdit = (sport: MonTheThao) => {
    setEditingSport(sport);
    setTen(sport.ten);
    setSlug(sport.duongDanNgan);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ten.trim()) {
      toast.error("Vui lòng nhập tên môn thể thao.");
      return;
    }
    const finalSlug = slug.trim() || slugifyVi(ten);
    if (editingSport) {
      setSports((prev) =>
        prev.map((s) =>
          s.id === editingSport.id
            ? { ...s, ten: ten.trim(), duongDanNgan: finalSlug }
            : s
        )
      );
      toast.success(`Đã cập nhật môn "${ten.trim()}" (xem trước).`);
    } else {
      setSports((prev) => [
        {
          id: `mt-${Date.now()}`,
          ten: ten.trim(),
          duongDanNgan: finalSlug,
          _count: { sanPham: 0 },
        },
        ...prev,
      ]);
      toast.success(`Đã thêm môn thể thao "${ten.trim()}" (xem trước).`);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deletingSport) return;
    setSports((prev) => prev.filter((s) => s.id !== deletingSport.id));
    toast.info(`Đã xóa môn "${deletingSport.ten}" khỏi danh sách mẫu.`);
    setDeletingSport(null);
  };

  const rows = useMemo<AdminTableRow[]>(
    () =>
      sports.map((sport) => ({
        id: sport.id,
        searchable: `${sport.ten} ${sport.duongDanNgan}`,
        cells: [
          <span key="name" className="font-semibold text-slate-900">
            {sport.ten}
          </span>,
          <code
            key="slug"
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            /sports/{sport.duongDanNgan}
          </code>,
          <span key="count" className="font-medium text-slate-800">
            {sport._count?.sanPham ?? 0} sản phẩm
          </span>,
          <div key="actions" className="flex items-center gap-2">
            <Button
              size="xs"
              variant="secondary"
              leftIcon={<Pencil size={14} />}
              onClick={() => openEdit(sport)}
            >
              Sửa
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className="text-danger hover:bg-red-50 hover:text-danger"
              leftIcon={<Trash2 size={14} />}
              onClick={() => setDeletingSport(sport)}
            >
              Xóa
            </Button>
          </div>,
        ],
      })),
    [sports]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Môn thể thao</h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Quản lý các bộ môn thể thao đóng vai trò phân loại sản phẩm trên cửa hàng.
          </p>
        </div>
        <Button leftIcon={<Plus size={17} />} onClick={openAdd}>
          Thêm môn thể thao
        </Button>
      </div>

      <AdminDataTable
        columns={["Tên môn thể thao", "Đường dẫn ngắn", "Số sản phẩm", "Thao tác"]}
        rows={rows}
        searchPlaceholder="Tìm tên môn thể thao hoặc đường dẫn..."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingSport ? "Chỉnh sửa môn thể thao" : "Thêm môn thể thao mới"
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tên môn thể thao"
            required
            value={ten}
            onChange={(e) => {
              setTen(e.target.value);
              if (!editingSport) setSlug(slugifyVi(e.target.value));
            }}
            placeholder="Ví dụ: Cầu lông, Đạp xe..."
          />
          <Input
            label="Đường dẫn ngắn (slug)"
            required
            value={slug}
            onChange={(e) => setSlug(slugifyVi(e.target.value))}
            placeholder="cau-long"
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
              {editingSport ? "Lưu thay đổi" : "Tạo môn thể thao"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingSport)}
        onClose={() => setDeletingSport(null)}
        onConfirm={handleDelete}
        title={`Xóa môn thể thao "${deletingSport?.ten ?? ""}"?`}
        description="Thao tác chỉ xóa trong chế độ xem trước trên trình duyệt."
      />
    </div>
  );
}
