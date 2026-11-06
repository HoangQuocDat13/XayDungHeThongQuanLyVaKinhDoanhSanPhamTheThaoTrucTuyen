"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Vui lòng nhập địa chỉ email hợp lệ."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setSubmittedEmail(values.email);
    toast.info(
      "Trạng thái minh họa: yêu cầu khôi phục mật khẩu chưa kết nối dịch vụ gửi email."
    );
  };

  if (submittedEmail) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-light text-success">
          <CheckCircle2 size={28} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Kiểm tra hộp thư của bạn
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Nếu địa chỉ <strong className="text-slate-900">{submittedEmail}</strong> đã đăng ký trên hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi trong ít phút.
        </p>
        <div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-left text-xs leading-relaxed text-amber-900">
          Lưu ý: Giao diện hiện chạy ở chế độ xem trước chưa kết nối máy chủ gửi thư điện tử. Không có mã khôi phục hay thông tin nhạy cảm nào được hiển thị tại đây.
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            variant="secondary"
            fullWidth
            leftIcon={<RefreshCw size={16} />}
            onClick={() => setSubmittedEmail(null)}
          >
            Nhập địa chỉ email khác
          </Button>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary hover:bg-primary-50 transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Quay lại đăng nhập</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <Mail size={22} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Khôi phục mật khẩu
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Nhập địa chỉ email liên kết với tài khoản để nhận hướng dẫn đặt lại mật khẩu.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Địa chỉ email"
          type="email"
          placeholder="ban@example.com"
          autoComplete="email"
          required
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Gửi hướng dẫn khôi phục
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 inline-flex w-full min-h-10 items-center justify-center gap-2 rounded-xl text-sm font-medium text-slate-600 transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        <span>Quay lại đăng nhập</span>
      </Link>
    </div>
  );
}
