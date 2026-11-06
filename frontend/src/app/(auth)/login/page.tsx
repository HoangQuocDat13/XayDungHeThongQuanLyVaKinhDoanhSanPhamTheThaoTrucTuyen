"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, UserCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_ACCOUNTS, useAuthStore, type AuthUser } from "@/features/auth/store/auth-store";
import { getVaiTroLabel } from "@/lib/utils";

const loginSchema = z.object({
  taiKhoan: z.string().trim().min(1, "Vui lòng nhập email hoặc tên đăng nhập."),
  matKhau: z.string().min(6, "Mật khẩu cần có ít nhất 6 ký tự."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const handleDemoLogin = (account: AuthUser) => {
    login(account);
    toast.success(`Đã đăng nhập tài khoản mẫu: ${account.hoTen}`);
    router.push(account.vaiTro === "KHACH_HANG" ? "/" : "/admin/dashboard");
  };

  const onSubmit = async (values: LoginValues) => {
    const matched = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === values.taiKhoan.toLowerCase()
    );
    const sessionUser: AuthUser = matched ?? {
      id: "tk-preview",
      email: values.taiKhoan.includes("@")
        ? values.taiKhoan
        : `${values.taiKhoan}@sportzone.vn`,
      hoTen: values.taiKhoan.split("@")[0] || "Khách hàng SportZone",
      vaiTro: "KHACH_HANG",
    };
    login(sessionUser);
    toast.success("Đăng nhập chế độ trải nghiệm giao diện thành công.");
    router.push(sessionUser.vaiTro === "KHACH_HANG" ? "/" : "/admin/dashboard");
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Chào mừng bạn trở lại
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Đăng nhập để theo dõi đơn hàng và tận hưởng ưu đãi thể thao.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email hoặc tên đăng nhập"
          placeholder="ban@example.com"
          autoComplete="username"
          required
          leftIcon={<Mail size={18} />}
          error={errors.taiKhoan?.message}
          {...register("taiKhoan")}
        />
        <Input
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu của bạn"
          autoComplete="current-password"
          required
          leftIcon={<LockKeyhole size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
          error={errors.matKhau?.message}
          {...register("matKhau")}
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Đăng nhập
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-500">hoặc tiếp tục với</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={() =>
          toast.info("Đăng nhập Google sẽ hoạt động khi kết nối OAuth máy chủ.")
        }
        className="flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
          />
        </svg>
        <span>Đăng nhập bằng Google</span>
      </button>

      {/* Demo quick login */}
      <div className="mt-6 rounded-2xl border border-teal-200/70 bg-primary-50/70 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-primary-dark">
          <UserCheck size={15} className="shrink-0" aria-hidden="true" />
          <span>Trải nghiệm nhanh (dữ liệu mẫu, chưa kết nối API)</span>
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => handleDemoLogin(acc)}
              className="flex items-center justify-between gap-2 rounded-xl border border-teal-200/80 bg-white px-3 py-2 text-left text-xs transition hover:border-primary hover:shadow-xs"
            >
              <span className="font-semibold text-slate-900 truncate">
                {acc.hoTen}
              </span>
              <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 font-medium text-primary">
                {getVaiTroLabel(acc.vaiTro)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:text-primary-dark"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
