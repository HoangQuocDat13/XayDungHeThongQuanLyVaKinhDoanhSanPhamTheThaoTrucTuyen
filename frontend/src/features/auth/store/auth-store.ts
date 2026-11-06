"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DiaChi, NguoiDung, VaiTro } from "@/types";

// MOCK DATA – Authentication state (Dữ liệu mẫu trải nghiệm giao diện)
// Replace with real session/cookie auth flow when backend is ready

export interface AuthUser {
  id: string;
  email: string;
  hoTen: string;
  anhDaiDien?: string | null;
  vaiTro: VaiTro;
  nguoiDung?: NguoiDung;
}

export const DEMO_ACCOUNTS: AuthUser[] = [
  {
    id: "tk-khach-1",
    email: "an.nguyen@gmail.com",
    hoTen: "Nguyễn Văn An",
    anhDaiDien: null,
    vaiTro: "KHACH_HANG",
    nguoiDung: {
      id: "nd-1",
      taiKhoanId: "tk-khach-1",
      hoTen: "Nguyễn Văn An",
      soDienThoai: "0901234567",
      anhDaiDien: null,
      gioiTinh: "NAM",
      chieuCao: 173,
      canNang: 68,
      ngayTao: "2026-03-15T00:00:00Z",
      ngayCapNhat: "2026-10-20T00:00:00Z",
      diaChi: [
        {
          id: "dc-1",
          nguoiDungId: "nd-1",
          tenNguoiNhan: "Nguyễn Văn An",
          soDienThoai: "0901234567",
          duong: "123 Nguyễn Trãi",
          phuong: "Phường 2",
          quan: "Quận 5",
          thanhPho: "TP. Hồ Chí Minh",
          macDinh: true,
        },
        {
          id: "dc-2",
          nguoiDungId: "nd-1",
          tenNguoiNhan: "Nguyễn Văn An (Văn phòng)",
          soDienThoai: "0901234567",
          duong: "45 Lê Duẩn",
          phuong: "Phường Bến Nghé",
          quan: "Quận 1",
          thanhPho: "TP. Hồ Chí Minh",
          macDinh: false,
        },
      ],
    },
  },
  {
    id: "tk-admin-1",
    email: "tuan@sportzone.vn",
    hoTen: "Nguyễn Minh Tuấn",
    anhDaiDien: "https://picsum.photos/seed/admin1/60/60",
    vaiTro: "QUAN_TRI_VIEN",
    nguoiDung: {
      id: "u-1",
      taiKhoanId: "tk-admin-1",
      hoTen: "Nguyễn Minh Tuấn",
      soDienThoai: "0901111111",
      anhDaiDien: "https://picsum.photos/seed/admin1/60/60",
      gioiTinh: "NAM",
      chieuCao: 176,
      canNang: 72,
      ngayTao: "2026-01-01T00:00:00Z",
      ngayCapNhat: "2026-11-01T00:00:00Z",
      diaChi: [
        {
          id: "dc-admin-1",
          nguoiDungId: "u-1",
          tenNguoiNhan: "Nguyễn Minh Tuấn",
          soDienThoai: "0901111111",
          duong: "123 Nguyễn Trãi",
          phuong: "Phường Bến Thành",
          quan: "Quận 1",
          thanhPho: "TP. Hồ Chí Minh",
          macDinh: true,
        },
      ],
    },
  },
  {
    id: "tk-staff-1",
    email: "lananh@sportzone.vn",
    hoTen: "Trần Thị Lan Anh",
    anhDaiDien: "https://picsum.photos/seed/admin2/60/60",
    vaiTro: "NHAN_VIEN",
    nguoiDung: {
      id: "u-2",
      taiKhoanId: "tk-staff-1",
      hoTen: "Trần Thị Lan Anh",
      soDienThoai: "0902222222",
      anhDaiDien: "https://picsum.photos/seed/admin2/60/60",
      gioiTinh: "NU",
      chieuCao: 162,
      canNang: 52,
      ngayTao: "2026-02-10T00:00:00Z",
      ngayCapNhat: "2026-10-15T00:00:00Z",
      diaChi: [],
    },
  },
];

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  updateAddresses: (addresses: DiaChi[]) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      updateAddresses: (addresses) =>
        set((state) => {
          if (!state.user) return state;
          const existingProfile: NguoiDung = state.user.nguoiDung ?? {
            id: `nd-${state.user.id}`,
            taiKhoanId: state.user.id,
            hoTen: state.user.hoTen,
            ngayTao: new Date().toISOString(),
            ngayCapNhat: new Date().toISOString(),
          };
          return {
            user: {
              ...state.user,
              nguoiDung: {
                ...existingProfile,
                diaChi: addresses,
              },
            },
          };
        }),
    }),
    {
      name: "sportzone-auth",
    }
  )
);
