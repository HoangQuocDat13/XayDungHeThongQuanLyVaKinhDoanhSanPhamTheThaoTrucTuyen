import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { mockYeuCauDoiTra } from "@/features/order/data/mock";
import {
  formatDate,
  getLoaiDoiTraLabel,
  getTrangThaiDoiTraLabel,
  getTrangThaiDoiTraVariant,
} from "@/lib/utils";

export default function ReturnsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Tài khoản", href: "/profile" },
          { label: "Yêu cầu đổi / trả" },
        ]}
        className="mb-4"
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Chăm sóc sau mua
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Yêu cầu đổi / trả hàng
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Theo dõi tiến trình kiểm tra và phản hồi từ đội ngũ hỗ trợ SportZone.
      </p>

      {mockYeuCauDoiTra.length > 0 ? (
        <div className="mt-8 space-y-4">
          {mockYeuCauDoiTra.map((request) => (
            <article
              key={request.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Mã yêu cầu: {request.id.toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Thuộc đơn hàng{" "}
                    <strong className="text-slate-800">
                      {request.donHang?.maDonHang ?? request.donHangId}
                    </strong>{" "}
                    · Gửi ngày {formatDate(request.ngayTao)}
                  </p>
                </div>
                <Badge
                  variant={getTrangThaiDoiTraVariant(request.trangThai)}
                  dot
                >
                  {getTrangThaiDoiTraLabel(request.trangThai)}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    Hình thức:{" "}
                    {request.chiTiet
                      ?.map((line) => getLoaiDoiTraLabel(line.loai))
                      .join(", ") ?? "Đổi / trả"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Lý do: {request.lyDo}
                  </p>
                </div>
                <Link
                  href={`/returns/${request.id}`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  <span>Xem tiến trình</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
          <p className="pt-2 text-center text-xs text-slate-500">
            Danh sách yêu cầu đang hiển thị từ dữ liệu mẫu minh họa.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={RefreshCw}
            title="Chưa có yêu cầu đổi / trả nào"
            description="Bạn có thể tạo yêu cầu đổi cỡ hoặc trả hàng từ chi tiết các đơn hàng đã hoàn thành."
            action={
              <Link
                href="/orders"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <span>Đi đến đơn hàng của tôi</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
        </div>
      )}
    </section>
  );
}
