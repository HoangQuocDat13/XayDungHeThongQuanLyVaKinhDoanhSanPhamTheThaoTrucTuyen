"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminDataTable,
  type AdminTableRow,
} from "@/components/admin/data-table";
import { mockAdminUsers } from "@/features/dashboard/data/mock";
import { mockTinTuc } from "@/features/news/data/mock";
import { formatDate, isConfiguredImageHost, slugifyVi } from "@/lib/utils";
import type { TinTuc } from "@/types";

const authorOptions = mockAdminUsers.filter(
  (u) => u.vaiTro === "QUAN_TRI_VIEN" || u.vaiTro === "NHAN_VIEN"
);

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<TinTuc[]>(mockTinTuc);
  const [authorFilter, setAuthorFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<TinTuc | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<TinTuc | null>(null);

  const [tieuDe, setTieuDe] = useState("");
  const [duongDanNgan, setDuongDanNgan] = useState("");
  const [tacGiaId, setTacGiaId] = useState(authorOptions[0]?.id ?? "u-1");
  const [anhBia, setAnhBia] = useState("");
  const [noiDung, setNoiDung] = useState("");

  const openCreate = () => {
    setEditingArticle(null);
    setTieuDe("");
    setDuongDanNgan("");
    setTacGiaId(authorOptions[0]?.id ?? "u-1");
    setAnhBia("");
    setNoiDung("");
    setModalOpen(true);
  };

  const openEdit = (article: TinTuc) => {
    setEditingArticle(article);
    setTieuDe(article.tieuDe);
    setDuongDanNgan(article.duongDanNgan);
    setTacGiaId(article.tacGiaId);
    setAnhBia(article.anhBia ?? "");
    setNoiDung(article.noiDung);
    setModalOpen(true);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanTitle = tieuDe.trim();
    const cleanSlug = slugifyVi(duongDanNgan.trim() || cleanTitle);
    const cleanContent = noiDung.trim();

    if (!cleanTitle) {
      toast.error("Vui lòng nhập tiêu đề bài viết.");
      return;
    }
    if (!cleanSlug) {
      toast.error("Đường dẫn ngắn bài viết không hợp lệ.");
      return;
    }
    if (!cleanContent) {
      toast.error("Vui lòng nhập nội dung bài viết.");
      return;
    }

    const author = authorOptions.find((a) => a.id === tacGiaId);
    const now = new Date().toISOString();

    const formattedContent = cleanContent.startsWith("<")
      ? cleanContent
      : cleanContent
          .split(/\n{2,}/)
          .map((para) => `<p>${para.trim()}</p>`)
          .join("\n");

    if (editingArticle) {
      setArticles((prev) =>
        prev.map((item) =>
          item.id === editingArticle.id
            ? {
                ...item,
                tieuDe: cleanTitle,
                duongDanNgan: cleanSlug,
                tacGiaId,
                anhBia: anhBia.trim() || null,
                noiDung: formattedContent,
                tacGia: author
                  ? {
                      id: author.id,
                      taiKhoanId: author.id,
                      hoTen: author.hoTen,
                      anhDaiDien: author.anhDaiDien ?? null,
                      ngayTao: author.ngayTao,
                      ngayCapNhat: now,
                    }
                  : item.tacGia,
              }
            : item
        )
      );
      toast.success(`Đã cập nhật bài viết "${cleanTitle}" (xem trước).`);
    } else {
      const created: TinTuc = {
        id: `tn-${Date.now()}`,
        tieuDe: cleanTitle,
        duongDanNgan: cleanSlug,
        noiDung: formattedContent,
        anhBia: anhBia.trim() || null,
        tacGiaId,
        ngayDang: now,
        tacGia: author
          ? {
              id: author.id,
              taiKhoanId: author.id,
              hoTen: author.hoTen,
              anhDaiDien: author.anhDaiDien ?? null,
              ngayTao: author.ngayTao,
              ngayCapNhat: now,
            }
          : undefined,
      };
      setArticles((prev) => [created, ...prev]);
      toast.success(`Đã đăng bài viết "${cleanTitle}" (xem trước).`);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deletingArticle) return;
    setArticles((prev) =>
      prev.filter((item) => item.id !== deletingArticle.id)
    );
    toast.info(`Đã xóa bài viết "${deletingArticle.tieuDe}" (xem trước).`);
    setDeletingArticle(null);
  };

  const filteredArticles = useMemo(() => {
    if (authorFilter === "ALL") return articles;
    return articles.filter((a) => a.tacGiaId === authorFilter);
  }, [articles, authorFilter]);

  const rows = useMemo<AdminTableRow[]>(
    () =>
      filteredArticles.map((article) => {
        const authorName = article.tacGia?.hoTen ?? "Ban biên tập SportZone";
        return {
          id: article.id,
          searchable: `${article.tieuDe} ${authorName} ${article.duongDanNgan}`,
          cells: [
            <div key="article" className="flex items-center gap-3 min-w-0">
              <span className="relative flex h-12 w-18 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                {article.anhBia ? (
                  <Image
                    src={article.anhBia}
                    alt={article.tieuDe}
                    fill
                    sizes="72px"
                    unoptimized={!isConfiguredImageHost(article.anhBia)}
                    className="object-cover"
                  />
                ) : (
                  <FileText
                    size={18}
                    className="text-slate-400"
                    aria-hidden="true"
                  />
                )}
              </span>
              <div className="min-w-0">
                <p className="max-w-80 truncate font-semibold text-slate-900">
                  {article.tieuDe}
                </p>
                <p className="mt-0.5 max-w-80 truncate text-xs text-slate-600">
                  /{article.duongDanNgan}
                </p>
              </div>
            </div>,
            <div key="author" className="flex items-center gap-2.5">
              <Avatar
                src={article.tacGia?.anhDaiDien}
                name={authorName}
                size="sm"
              />
              <span className="font-medium text-slate-800">{authorName}</span>
            </div>,
            <span key="date" className="text-slate-700">
              {formatDate(article.ngayDang)}
            </span>,
            <Badge key="state" variant="success" dot>
              Đã xuất bản
            </Badge>,
            <div key="actions" className="flex flex-wrap items-center gap-2">
              <Link
                href={`/news/${article.duongDanNgan}`}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-teal-50 transition-colors"
              >
                <ExternalLink size={13} aria-hidden="true" />
                Xem bài
              </Link>
              <Button
                size="xs"
                variant="secondary"
                leftIcon={<Pencil size={13} />}
                onClick={() => openEdit(article)}
              >
                Sửa
              </Button>
              <Button
                size="xs"
                variant="ghost"
                className="text-danger hover:bg-red-50 hover:text-danger"
                leftIcon={<Trash2 size={13} />}
                onClick={() => setDeletingArticle(article)}
              >
                Xóa
              </Button>
            </div>,
          ],
        };
      }),
    [filteredArticles]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Tin tức &amp; Cẩm nang thể thao
            </h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Soạn thảo, chỉnh sửa bài viết kiến thức tập luyện, gán tác giả biên tập và quản lý ảnh bìa.
          </p>
        </div>
        <Button leftIcon={<Plus size={17} />} onClick={openCreate}>
          Soạn bài viết mới
        </Button>
      </div>

      <AdminDataTable
        columns={["Bài viết", "Tác giả", "Ngày đăng", "Trạng thái", "Thao tác"]}
        rows={rows}
        searchPlaceholder="Tìm theo tiêu đề, đường dẫn hoặc tên tác giả..."
        toolbar={
          <Select
            aria-label="Lọc theo tác giả"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            options={[
              { value: "ALL", label: "Tất cả tác giả" },
              ...authorOptions.map((a) => ({ value: a.id, label: a.hoTen })),
            ]}
          />
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="xl"
        title={
          editingArticle ? "Chỉnh sửa bài viết" : "Soạn bài viết thể thao mới"
        }
        description="Hỗ trợ văn bản thuần (tự động chia đoạn) hoặc thẻ định dạng cơ bản <h2>, <p>, <blockquote>."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tiêu đề bài viết"
            required
            value={tieuDe}
            onChange={(e) => {
              const val = e.target.value;
              setTieuDe(val);
              if (!editingArticle) {
                setDuongDanNgan(slugifyVi(val));
              }
            }}
            placeholder="Ví dụ: Hướng dẫn khởi động kỹ khớp cổ chân trước khi chạy bộ"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Đường dẫn ngắn"
              required
              value={duongDanNgan}
              onChange={(e) => setDuongDanNgan(e.target.value)}
              placeholder="huong-dan-khoi-dong-co-chan"
            />
            <Select
              label="Tác giả biên tập"
              value={tacGiaId}
              onChange={(e) => setTacGiaId(e.target.value)}
              options={authorOptions.map((a) => ({
                value: a.id,
                label: a.hoTen,
              }))}
            />
          </div>

          <Input
            label="Đường dẫn ảnh bìa (không bắt buộc)"
            value={anhBia}
            onChange={(e) => setAnhBia(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />

          <Textarea
            label="Nội dung bài viết"
            required
            rows={8}
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            placeholder="Nhập nội dung chi tiết bài viết tại đây..."
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
              {editingArticle ? "Lưu cập nhật" : "Đăng bài viết"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingArticle)}
        onClose={() => setDeletingArticle(null)}
        onConfirm={handleDelete}
        title={`Xóa bài viết "${deletingArticle?.tieuDe ?? ""}"?`}
        description="Bài viết sẽ được gỡ khỏi danh sách xem trước trên trình duyệt."
      />
    </div>
  );
}
