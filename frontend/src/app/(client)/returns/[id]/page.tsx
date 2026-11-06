import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, Check, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { mockYeuCauDoiTra } from "@/features/order/data/mock";
import {
  formatDateTime,
  getLoaiDoiTraLabel,
  getTrangThaiDoiTraLabel,
  getTrangThaiDoiTraVariant,
} from "@/lib/utils";

export default async function ReturnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = mockYeuCauDoiTra.find((item) => item.id === id);
  if (!request) notFound();

  const steps = ["CHO_DUYET", "DA_PHE_DUYET", "DANG_XU_LY", "HOAN_TAT"];
  const currentStep = steps.indexOf(request.trangThai);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Yêu cầu đổi / trả", href: "/returns" },
          { label: request.id.toUpperCase() },
        ]}
        className="mb-4"
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Chi tiết xử lý sau mua
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Yêu cầu {request.id.toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Thuộc đơn hàng:{" "}
            {request.donHang ? (
              <Link
                href={`/orders/${request.donHang.id}`}
                className="font-semibold text-primary hover:underline"
              >
                {request.donHang.maDonHang}
              </Link>
            ) : (
              request.donHangId
            )}
          </p>
        </div>
        <Badge variant={getTrangThaiDoiTraVariant(request.trangThai)} dot>
          {getTrangThaiDoiTraLabel(request.trangThai)}
        </Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">
              Sản phẩm đề nghị đổi / trả
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {request.chiTiet?.map((line) => (
                <div
                  key={line.id}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                    {line.bienThe?.sanPham?.anhDaiDien && (
                      <Image
                        src={line.bienThe.sanPham.anhDaiDien}
                        alt={line.bienThe.sanPham.ten}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {line.bienThe?.sanPham?.ten}
                      </p>
                      <Badge size="sm" variant="primary">
                        {getLoaiDoiTraLabel(line.loai)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Phiên bản gốc: Màu {line.bienThe?.mauSac} · Cỡ{" "}
                      {line.bienThe?.kichCo} · Số lượng: {line.soLuong}
                    </p>
                    {line.bienTheMoi && (
                      <p className="mt-1.5 inline-block rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-primary-dark">
                        Đổi sang phiên bản: Màu {line.bienTheMoi.mauSac} · Cỡ{" "}
                        {line.bienTheMoi.kichCo} (SKU: {line.bienTheMoi.sku})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">
              Lý do và hình ảnh minh chứng
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {request.lyDo}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {request.minhChung
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((src, idx) => (
                  <a
                    key={`${src}-${idx}`}
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >
                    <Image
                      src={src}
                      alt={`Ảnh minh chứng ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </a>
                ))}
            </div>
            {request.ghiChu && (
              <div className="mt-6 rounded-xl border border-teal-200 bg-primary-50/70 p-4 text-sm text-teal-950">
                <strong className="font-semibold">Ghi chú từ nhân viên xử lý:</strong>{" "}
                {request.ghiChu}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:col-span-4 h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">
            Tiến trình xử lý
          </h2>
          <ol className="mt-6 space-y-6">
            {steps.map((step, index) => {
              const isDone = currentStep >= index && currentStep >= 0;
              return (
                <li key={step} className="relative flex items-center gap-4">
                  {index < steps.length - 1 && (
                    <span
                      className="absolute left-4 top-8 h-full w-px bg-slate-200"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isDone
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isDone ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <Clock3 size={16} aria-hidden="true" />
                    )}
                  </span>
                  <span
                    className={`text-sm ${
                      isDone
                        ? "font-semibold text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {getTrangThaiDoiTraLabel(step)}
                  </span>
                </li>
              );
            })}
            {request.trangThai === "TU_CHOI" && (
              <li className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger-light text-danger">
                  <AlertCircle size={16} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-danger">
                  Yêu cầu bị từ chối
                </span>
              </li>
            )}
          </ol>
          <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-600">
            Cập nhật lần cuối: {formatDateTime(request.ngayCapNhat)}
          </p>
        </aside>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Thông tin yêu cầu đổi / trả đang hiển thị từ dữ liệu mẫu minh họa.
      </p>
    </section>
  );
}
