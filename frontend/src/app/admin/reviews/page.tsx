"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ExternalLink, Eye, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { StarRating } from "@/components/ui/star-rating";
import {
  AdminDataTable,
  type AdminTableRow,
} from "@/components/admin/data-table";
import { mockSanPham } from "@/features/catalog/data/mock";
import { mockDanhGia } from "@/features/order/data/mock";
import {
  formatDate,
  formatDateTime,
  isConfiguredImageHost,
} from "@/lib/utils";
import type { DanhGia } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<DanhGia[]>(mockDanhGia);
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");

  const [selectedReview, setSelectedReview] = useState<DanhGia | null>(null);
  const [deletingReview, setDeletingReview] = useState<DanhGia | null>(null);

  const handleDelete = () => {
    if (!deletingReview) return;
    setReviews((prev) => prev.filter((item) => item.id !== deletingReview.id));
    if (selectedReview?.id === deletingReview.id) {
      setSelectedReview(null);
    }
    toast.info("Đã xóa đánh giá khỏi danh sách xem trước.");
    setDeletingReview(null);
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (ratingFilter !== "ALL" && review.soSao !== Number(ratingFilter)) {
        return false;
      }
      if (productFilter !== "ALL" && review.sanPhamId !== productFilter) {
        return false;
      }
      return true;
    });
  }, [reviews, ratingFilter, productFilter]);

  const rows = useMemo<AdminTableRow[]>(
    () =>
      filteredReviews.map((review) => {
        const product = mockSanPham.find(
          (item) => item.id === review.sanPhamId
        );
        const images = review.hinhAnh
          ? review.hinhAnh
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const reviewerName = review.nguoiDung?.hoTen ?? "Khách hàng";

        return {
          id: review.id,
          searchable: `${product?.ten ?? ""} ${reviewerName} ${
            review.binhLuan ?? ""
          }`,
          cells: [
            <span
              key="product"
              className="block max-w-52 truncate font-semibold text-slate-900"
              title={product?.ten}
            >
              {product?.ten ?? "Sản phẩm"}
            </span>,
            <div key="reviewer" className="flex items-center gap-2.5">
              <Avatar
                src={review.nguoiDung?.anhDaiDien}
                name={reviewerName}
                size="sm"
              />
              <span className="font-medium text-slate-800">{reviewerName}</span>
            </div>,
            <div key="rating" className="flex items-center gap-2">
              <StarRating value={review.soSao} size="sm" />
              <span className="text-xs font-semibold text-slate-700">
                {review.soSao}/5
              </span>
            </div>,
            <p
              key="comment"
              className="max-w-72 truncate text-slate-700"
              title={review.binhLuan ?? ""}
            >
              {review.binhLuan || "Không có nhận xét văn bản"}
            </p>,
            images.length > 0 ? (
              <div key="images" className="flex items-center gap-2">
                <span className="relative block h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <Image
                    src={images[0]}
                    alt={`Ảnh đánh giá từ ${reviewerName}`}
                    fill
                    sizes="40px"
                    unoptimized={!isConfiguredImageHost(images[0])}
                    className="object-cover"
                  />
                </span>
                {images.length > 1 && (
                  <Badge size="sm" variant="muted">
                    +{images.length - 1}
                  </Badge>
                )}
              </div>
            ) : (
              <span key="images" className="text-xs text-slate-500">
                Không kèm ảnh
              </span>
            ),
            <span key="date" className="text-slate-700">
              {formatDate(review.ngayTao)}
            </span>,
            <div key="actions" className="flex flex-wrap items-center gap-2">
              <Button
                size="xs"
                variant="secondary"
                leftIcon={<Eye size={13} />}
                onClick={() => setSelectedReview(review)}
              >
                Chi tiết
              </Button>
              <Button
                size="xs"
                variant="ghost"
                className="text-danger hover:bg-red-50 hover:text-danger"
                leftIcon={<Trash2 size={13} />}
                onClick={() => setDeletingReview(review)}
              >
                Gỡ
              </Button>
            </div>,
          ],
        };
      }),
    [filteredReviews]
  );

  const modalProduct = selectedReview
    ? mockSanPham.find((p) => p.id === selectedReview.sanPhamId)
    : null;
  const modalImages = selectedReview?.hinhAnh
    ? selectedReview.hinhAnh
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
              Đánh giá sản phẩm
            </h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Theo dõi phản hồi thực tế, mức điểm sao và hình ảnh trải nghiệm sản phẩm từ khách hàng.
          </p>
        </div>
      </div>

      <AdminDataTable
        columns={[
          "Sản phẩm",
          "Khách hàng",
          "Mức sao",
          "Nội dung bình luận",
          "Hình ảnh",
          "Ngày gửi",
          "Thao tác",
        ]}
        rows={rows}
        searchPlaceholder="Tìm tên sản phẩm, khách hàng hoặc nội dung đánh giá..."
        toolbar={
          <>
            <Select
              aria-label="Lọc theo số sao"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả mức sao" },
                { value: "5", label: "5 sao (Tuyệt vời)" },
                { value: "4", label: "4 sao (Hài lòng)" },
                { value: "3", label: "3 sao (Bình thường)" },
                { value: "2", label: "2 sao (Chưa tốt)" },
                { value: "1", label: "1 sao (Rất tệ)" },
              ]}
            />
            <Select
              aria-label="Lọc theo sản phẩm"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả sản phẩm" },
                ...mockSanPham.map((p) => ({ value: p.id, label: p.ten })),
              ]}
            />
          </>
        }
      />

      <Modal
        open={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        size="lg"
        title="Chi tiết đánh giá sản phẩm"
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* Product info */}
            {modalProduct && (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                {modalProduct.anhDaiDien && (
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <Image
                      src={modalProduct.anhDaiDien}
                      alt={modalProduct.ten}
                      fill
                      sizes="56px"
                      unoptimized={
                        !isConfiguredImageHost(modalProduct.anhDaiDien)
                      }
                      className="object-cover"
                    />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-600">
                    Sản phẩm được đánh giá
                  </p>
                  <p className="font-semibold text-slate-900">
                    {modalProduct.ten}
                  </p>
                  <p className="text-xs text-slate-600">
                    {modalProduct.thuongHieu?.ten} ·{" "}
                    {modalProduct.monTheThao?.ten}
                  </p>
                </div>
              </div>
            )}

            {/* Reviewer & stars */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={selectedReview.nguoiDung?.anhDaiDien}
                  name={selectedReview.nguoiDung?.hoTen ?? "Khách hàng"}
                  size="md"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {selectedReview.nguoiDung?.hoTen ?? "Khách hàng"}
                  </p>
                  <p className="text-xs text-slate-600">
                    Đăng lúc {formatDateTime(selectedReview.ngayTao)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating value={selectedReview.soSao} size="md" />
                <Badge variant="primary">{selectedReview.soSao}/5 sao</Badge>
              </div>
            </div>

            {/* Comment */}
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-800 leading-relaxed">
                {selectedReview.binhLuan ||
                  "Khách hàng chỉ chấm sao, không để lại bình luận văn bản."}
              </p>
            </div>

            {/* Images */}
            {modalImages.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Ảnh thực tế từ khách hàng ({modalImages.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {modalImages.map((imgUrl, idx) => (
                    <a
                      key={`${imgUrl}-${idx}`}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                      aria-label={`Mở ảnh đánh giá ${idx + 1} trong tab mới`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Ảnh đánh giá ${idx + 1}`}
                        fill
                        sizes="112px"
                        unoptimized={!isConfiguredImageHost(imgUrl)}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <ExternalLink size={12} aria-hidden="true" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4">
              <Button
                variant="ghost"
                className="text-danger hover:bg-red-50 hover:text-danger"
                leftIcon={<Trash2 size={15} />}
                onClick={() => setDeletingReview(selectedReview)}
              >
                Gỡ đánh giá vi phạm
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedReview(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingReview)}
        onClose={() => setDeletingReview(null)}
        onConfirm={handleDelete}
        title="Gỡ đánh giá này khỏi danh sách?"
        description="Thao tác chỉ áp dụng trên dữ liệu xem trước để kiểm duyệt nội dung không phù hợp."
        confirmLabel="Xác nhận gỡ"
      />
    </div>
  );
}
