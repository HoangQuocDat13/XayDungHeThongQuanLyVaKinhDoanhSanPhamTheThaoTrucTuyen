"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/auth-store";

const registerSchema = z
  .object({
    hoTen: z.string().trim().min(2, "Họ và tên cần có ít nhất 2 ký tự."),
    email: z.string().trim().email("Vui lòng nhập địa chỉ email hợp lệ."),
    tenDangNhap: z
      .string()
      .trim()
      .min(3, "Tên đăng nhập cần có ít nhất 3 ký tự.")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Tên đăng nhập chỉ gồm chữ không dấu, số và dấu gạch ngang."
      ),
    matKhau: z.string().min(8, "Mật khẩu cần có ít nhất 8 ký tự."),
    xacNhanMatKhau: z.string().min(1, "Vui lòng nhập lại mật khẩu xác nhận."),
    dongYDieuKhoan: z.boolean().refine((v) => v === true, {
      message: "Vui lòng đồng ý với điều khoản sử dụng để tiếp tục.",
    }),
  })
  .refine((values) => values.matKhau === values.xacNhanMatKhau, {
    path: ["xacNhanMatKhau"],
    message: "Mật khẩu xác nhận chưa trùng khớp.",
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { dongYDieuKhoan: false },
  });

  const onSubmit = async (values: RegisterValues) => {
    login({
      id: "tk-new-preview",
      email: values.email,
      hoTen: values.hoTen,
      vaiTro: "KHACH_HANG",
      nguoiDung: {
        id: "nd-new-preview",
        taiKhoanId: "tk-new-preview",
        hoTen: values.hoTen,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
        diaChi: [],
      },
    });
    toast.success(
      "Tạo tài khoản xem trước thành công! Dữ liệu hiện lưu cục bộ trên trình duyệt."
    );
    router.push("/profile");
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Tạo tài khoản mới
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Tham gia SportZone để lưu địa chỉ nhận hàng và theo dõi đơn mua dễ dàng.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Họ và tên"
          placeholder="Nguyễn Văn An"
          autoComplete="name"
          required
          leftIcon={<UserRound size={18} />}
          error={errors.hoTen?.message}
          {...register("hoTen")}
        />
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
        <Input
          label="Tên đăng nhập"
          placeholder="nguyenvanan"
          autoComplete="username"
          required
          leftIcon={<UserRound size={18} />}
          error={errors.tenDangNhap?.message}
          {...register("tenDangNhap")}
        />
        <Input
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder="Tối thiểu 8 ký tự"
          autoComplete="new-password"
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
        <Input
          label="Xác nhận mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu phía trên"
          autoComplete="new-password"
          required
          leftIcon={<LockKeyhole size={18} />}
          error={errors.xacNhanMatKhau?.message}
          {...register("xacNhanMatKhau")}
        />

        <Checkbox
          label="Tôi đồng ý với điều khoản dịch vụ và chính sách bảo mật của SportZone."
          error={errors.dongYDieuKhoan?.message}
          {...register("dongYDieuKhoan")}
        />

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Đăng ký tài khoản
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-dark"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
