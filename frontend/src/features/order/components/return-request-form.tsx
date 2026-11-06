"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Minus, Plus, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockSanPham } from "@/features/catalog/data/mock";
import { cn, formatVND } from "@/lib/utils";
import type { DonHang, LoaiDoiTra } from "@/types";

interface SelectedReturnItem {
  checked: boolean;
  soLuong: number;
  loai: LoaiDoiTra;
  bienTheMoiId: string;
}

export function ReturnRequestForm({ order }: { order: DonHang }) {
  const lines = order.chiTiet ?? [];

  const [itemStates, setItemStates] = useState<Record<string, SelectedReturnItem>>(
    () => {
      const initial: Record<string, SelectedReturnItem> = {};
      lines.forEach((line, idx) => {
        const productFull = mockSanPham.find(
          (sp) => sp.id === line.bienThe?.sanPhamId
        );
        const alternativeVariants =
          productFull?.bienThe?.filter(
            (v) => v.id !== line.bienTheId && v.soLuongTon > 0
          ) ?? [];
        initial[line.id] = {
          checked: idx === 0,
          soLuong: 1,
          loai: "DOI_HANG",
          bienTheMoiId: alternativeVariants[0]?.id ?? "",
        };
      });
      return initial;
    }
  );

  const [lyDo, setLyDo] = useState("");
  const [proofFiles, setProofFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const updateLine = (
    lineId: string,
    patch: Partial<SelectedReturnItem>
  ) => {
    setItemStates((prev) => ({
      ...prev,
      [lineId]: { ...prev[lineId], ...patch },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setProofFiles(files.map((f) => f.name));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chosenLines = lines.filter((l) => itemStates[l.id]?.checked);
    if (chosenLines.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm cần đổi hoặc trả.");
      return;
    }
    if (lyDo.trim().length < 10) {
      toast.error("Vui lòng mô tả lý do đổi/trả tối thiểu 10 ký tự.");
      return;
    }
    for (const line of chosenLines) {
      const st = itemStates[line.id];
      if (st.loai === "DOI_HANG" && !st.bienTheMoiId) {
        toast.error(
          `Vui lòng chọn biến thể mới muốn đổi cho "${line.bienThe?.sanPham?.ten}".`
        );
        return;
      }
    }

    setSubmitted(true);
    toast.success("Đã tạo yêu cầu đổi/trả xem trước thành công!");
  };

  if (submitted) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-light text-success">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Đã ghi nhận yêu cầu đổi / trả mẫu
        </h2>
        <p className="mt-2 max-w-md mx-auto text-sm leading-relaxed text-slate-600">
          Yêu cầu của bạn đối với đơn <strong>{order.maDonHang}</strong> đang ở trạng thái <strong>Chờ duyệt</strong> (dữ liệu minh họa trên trình duyệt, chưa lưu lên máy chủ).
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/returns"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Xem danh sách đổi / trả
          </Link>
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Quay lại đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
      {/* Step 1: Select items & quantities */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">
          1. Chọn sản phẩm và hình thức xử lý
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Đánh dấu các sản phẩm trong đơn cần đổi sang kích cỡ/màu khác hoặc trả hàng
        </p>

        <div className="mt-6 space-y-4">
          {lines.map((line) => {
            const state = itemStates[line.id];
            if (!state) return null;
            const productFull = mockSanPham.find(
              (sp) => sp.id === line.bienThe?.sanPhamId
            );
            const availableVariants =
              productFull?.bienThe?.filter(
                (v) => v.id !== line.bienTheId && v.soLuongTon > 0
              ) ?? [];

            return (
              <div
                key={line.id}
                className={cn(
                  "rounded-2xl border p-4 sm:p-6 transition",
                  state.checked
                    ? "border-primary bg-primary-50/30"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={state.checked}
                    onChange={(e) =>
                      updateLine(line.id, { checked: e.target.checked })
                    }
                    aria-label={`Chọn ${line.bienThe?.sanPham?.ten}`}
                  />
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
                    <p className="text-sm font-semibold text-slate-900">
                      {line.bienThe?.sanPham?.ten ?? "Sản phẩm"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Đã mua: Màu {line.bienThe?.mauSac} · Cỡ{" "}
                      {line.bienThe?.kichCo} · Tối đa {line.soLuong} sản phẩm (
                      {formatVND(line.gia)})
                    </p>
                  </div>
                </div>

                {state.checked && (
                  <div className="mt-6 grid gap-4 border-t border-slate-200/70 pt-4 sm:grid-cols-2">
                    {/* Quantity */}
                    <div>
                      <span className="block text-sm font-medium text-slate-800 mb-2">
                        Số lượng cần đổi / trả
                      </span>
                      <div className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white">
                        <button
                          type="button"
                          disabled={state.soLuong <= 1}
                          onClick={() =>
                            updateLine(line.id, {
                              soLuong: Math.max(1, state.soLuong - 1),
                            })
                          }
                          className="inline-flex h-11 w-11 items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                          aria-label="Giảm số lượng đổi trả"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="min-w-10 px-2 text-center text-sm font-semibold">
                          {state.soLuong}
                        </span>
                        <button
                          type="button"
                          disabled={state.soLuong >= line.soLuong}
                          onClick={() =>
                            updateLine(line.id, {
                              soLuong: Math.min(line.soLuong, state.soLuong + 1),
                            })
                          }
                          className="inline-flex h-11 w-11 items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                          aria-label="Tăng số lượng đổi trả"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Type */}
                    <Select
                      label="Hình thức yêu cầu"
                      value={state.loai}
                      onChange={(e) =>
                        updateLine(line.id, {
                          loai: e.target.value as LoaiDoiTra,
                        })
                      }
                      options={[
                        { value: "DOI_HANG", label: "Đổi sang biến thể khác" },
                        { value: "TRA_HANG", label: "Trả hàng & hoàn tiền" },
                      ]}
                    />

                    {/* Target Variant when exchanging */}
                    {state.loai === "DOI_HANG" && (
                      <div className="sm:col-span-2">
                        {availableVariants.length > 0 ? (
                          <Select
                            label="Chọn biến thể mới muốn đổi (còn hàng)"
                            required
                            value={state.bienTheMoiId}
                            onChange={(e) =>
                              updateLine(line.id, {
                                bienTheMoiId: e.target.value,
                              })
                            }
                            options={availableVariants.map((v) => ({
                              value: v.id,
                              label: `Màu ${v.mauSac} – Cỡ ${v.kichCo} (SKU: ${v.sku} · Còn ${v.soLuongTon})`,
                            }))}
                          />
                        ) : (
                          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                            Sản phẩm này hiện không có biến thể khác còn tồn kho để đổi. Vui lòng chuyển sang hình thức &ldquo;Trả hàng &amp; hoàn tiền&rdquo;.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 2: Reason & Evidence */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          2. Lý do và hình ảnh minh chứng
        </h2>

        <Textarea
          label="Lý do đổi / trả chi tiết"
          required
          value={lyDo}
          onChange={(e) => setLyDo(e.target.value)}
          placeholder="Ví dụ: Giày cỡ 41 hơi chật ở mũi chân, mong muốn đổi sang cỡ 42 cùng màu..."
          hint="Tối thiểu 10 ký tự để nhân viên nắm rõ tình trạng sản phẩm."
        />

        <div>
          <label
            htmlFor="return-proof"
            className="block text-sm font-medium text-slate-800 mb-2"
          >
            Tải ảnh minh chứng tình trạng sản phẩm
          </label>
          <label
            htmlFor="return-proof"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 text-center transition hover:border-primary hover:bg-primary-50/40"
          >
            <Upload size={22} className="text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-800">
              Nhấn để chọn hình ảnh từ thiết bị
            </span>
            <span className="text-xs text-slate-500">
              Hỗ trợ JPG, PNG, WEBP (lưu trên trình duyệt xem trước)
            </span>
            <input
              id="return-proof"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          {proofFiles.length > 0 && (
            <p className="mt-2 text-xs font-medium text-primary">
              Đã chọn {proofFiles.length} tệp: {proofFiles.join(", ")}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg">
            Gửi yêu cầu đổi / trả
          </Button>
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Hủy bỏ
          </Link>
        </div>
      </section>
    </form>
  );
}
