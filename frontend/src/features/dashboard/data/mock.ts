// MOCK DATA – Dữ liệu thống kê và dashboard
// Thay thế bằng API call thực tế khi backend sẵn sàng

export interface DoanhThuNgay {
  ngay: string; // "DD/MM"
  doanhThu: number;
  donHang: number;
}

export interface DonTheoTrangThai {
  trangThai: string;
  soLuong: number;
  color: string;
}

export interface SanPhamBanChay {
  ten: string;
  soLuong: number;
  doanhThu: number;
  anhUrl: string;
}

// Revenue last 7 days
export const mockDoanhThu7Ngay: DoanhThuNgay[] = [
  { ngay: "29/10", doanhThu: 12_500_000, donHang: 8 },
  { ngay: "30/10", doanhThu: 18_200_000, donHang: 12 },
  { ngay: "31/10", doanhThu: 9_800_000, donHang: 6 },
  { ngay: "01/11", doanhThu: 22_400_000, donHang: 15 },
  { ngay: "02/11", doanhThu: 16_700_000, donHang: 11 },
  { ngay: "03/11", doanhThu: 28_900_000, donHang: 19 },
  { ngay: "04/11", doanhThu: 15_300_000, donHang: 10 },
];

// Revenue last 30 days (grouped by week)
export const mockDoanhThu30Ngay: DoanhThuNgay[] = Array.from(
  { length: 30 },
  (_, i) => {
    const d = new Date("2026-10-05");
    d.setDate(d.getDate() + i);
    return {
      ngay: `${d.getDate()}/${d.getMonth() + 1}`,
      doanhThu: 8_000_000 + ((i * 7_319_337 + 4_205_000) % 20_000_000),
      donHang: 5 + ((i * 13 + 3) % 15),
    };
  }
);

export const mockDonTheoTrangThai: DonTheoTrangThai[] = [
  { trangThai: "Chờ xác nhận", soLuong: 23, color: "#d97706" },
  { trangThai: "Đang chuẩn bị", soLuong: 15, color: "#2563eb" },
  { trangThai: "Đang vận chuyển", soLuong: 31, color: "#0d9488" },
  { trangThai: "Hoàn thành", soLuong: 142, color: "#16a34a" },
  { trangThai: "Đã hủy", soLuong: 8, color: "#dc2626" },
];

export const mockSanPhamBanChay: SanPhamBanChay[] = [
  { ten: "Giày chạy bộ Air Zoom", soLuong: 128, doanhThu: 241_920_000, anhUrl: "https://picsum.photos/seed/nike-shoe-1/60/60" },
  { ten: "Vợt tennis Pro Staff 97", soLuong: 34, doanhThu: 108_800_000, anhUrl: "https://picsum.photos/seed/wilson-racket/60/60" },
  { ten: "Giày bóng rổ Air Force Ultra", soLuong: 71, doanhThu: 176_790_000, anhUrl: "https://picsum.photos/seed/nike-basketball/60/60" },
  { ten: "Giày Mizuno Wave Rider", soLuong: 93, doanhThu: 199_950_000, anhUrl: "https://picsum.photos/seed/mizuno-shoe/60/60" },
  { ten: "Tạ tay điều chỉnh", soLuong: 47, doanhThu: 225_600_000, anhUrl: "https://picsum.photos/seed/dumbbell/60/60" },
];

export interface KpiStats {
  doanhThuHomNay: number;
  doanhThuHomNayTangTruong: number; // %
  donHangMoi: number;
  donHangMoiTangTruong: number;
  khachHangMoi: number;
  khachHangMoiTangTruong: number;
  sanPhamHetHang: number;
}

export const mockKpi: KpiStats = {
  doanhThuHomNay: 15_300_000,
  doanhThuHomNayTangTruong: 12.5,
  donHangMoi: 10,
  donHangMoiTangTruong: -5.3,
  khachHangMoi: 4,
  khachHangMoiTangTruong: 33.3,
  sanPhamHetHang: 3,
};

// Admin user list mock
export interface AdminUser {
  id: string;
  hoTen: string;
  email: string;
  vaiTro: string;
  trangThai: boolean;
  ngayTao: string;
  anhDaiDien?: string;
  soDienThoai?: string;
}

export const mockAdminUsers: AdminUser[] = [
  { id: "u-1", hoTen: "Nguyễn Minh Tuấn", email: "tuan@sportzone.vn", vaiTro: "QUAN_TRI_VIEN", trangThai: true, ngayTao: "2026-01-01T00:00:00Z", anhDaiDien: "https://picsum.photos/seed/admin1/60/60", soDienThoai: "0901111111" },
  { id: "u-2", hoTen: "Trần Thị Lan Anh", email: "lananh@sportzone.vn", vaiTro: "NHAN_VIEN", trangThai: true, ngayTao: "2026-02-10T00:00:00Z", anhDaiDien: "https://picsum.photos/seed/admin2/60/60", soDienThoai: "0902222222" },
  { id: "u-3", hoTen: "Nguyễn Văn An", email: "an.nguyen@gmail.com", vaiTro: "KHACH_HANG", trangThai: true, ngayTao: "2026-03-15T00:00:00Z", soDienThoai: "0901234567" },
  { id: "u-4", hoTen: "Trần Bảo Châu", email: "chau.tran@gmail.com", vaiTro: "KHACH_HANG", trangThai: true, ngayTao: "2026-04-01T00:00:00Z" },
  { id: "u-5", hoTen: "Lê Thành Phong", email: "phong.le@yahoo.com", vaiTro: "KHACH_HANG", trangThai: false, ngayTao: "2026-04-20T00:00:00Z" },
  { id: "u-6", hoTen: "Phạm Minh Hiếu", email: "hieu.pm@gmail.com", vaiTro: "KHACH_HANG", trangThai: true, ngayTao: "2026-05-05T00:00:00Z" },
  { id: "u-7", hoTen: "Vũ Thị Hoa", email: "hoa.vu@gmail.com", vaiTro: "KHACH_HANG", trangThai: true, ngayTao: "2026-06-10T00:00:00Z" },
  { id: "u-8", hoTen: "Hoàng Đức Mạnh", email: "manh.hd@gmail.com", vaiTro: "NHAN_VIEN", trangThai: true, ngayTao: "2026-07-01T00:00:00Z", soDienThoai: "0908888888" },
];

// Promotion mock
export interface AdminPromotion {
  id: string;
  ten: string;
  maGiamGia?: string;
  loai: string;
  giaTri: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  kichHoat: boolean;
  soSanPhamApDung: number;
  soDonSuDung: number;
}

export const mockPromotions: AdminPromotion[] = [
  { id: "km-1", ten: "Giảm giá mùa hè 2026", loai: "PHAN_TRAM", giaTri: 20, thoiGianBatDau: "2026-06-01T00:00:00Z", thoiGianKetThuc: "2026-08-31T23:59:59Z", kichHoat: false, soSanPhamApDung: 8, soDonSuDung: 234 },
  { id: "km-2", ten: "Giảm giá nhanh 11/11", maGiamGia: "FLASH1111", loai: "PHAN_TRAM", giaTri: 30, thoiGianBatDau: "2026-11-11T00:00:00Z", thoiGianKetThuc: "2026-11-11T23:59:59Z", kichHoat: true, soSanPhamApDung: 0, soDonSuDung: 0 },
  { id: "km-3", ten: "Giảm 50K đơn hàng đầu", maGiamGia: "NEWBIE50", loai: "SO_TIEN", giaTri: 50_000, thoiGianBatDau: "2026-01-01T00:00:00Z", thoiGianKetThuc: "2026-12-31T23:59:59Z", kichHoat: true, soSanPhamApDung: 0, soDonSuDung: 1_205 },
  { id: "km-4", ten: "Khuyến mãi giày chạy bộ", loai: "PHAN_TRAM", giaTri: 15, thoiGianBatDau: "2026-10-01T00:00:00Z", thoiGianKetThuc: "2026-11-30T23:59:59Z", kichHoat: true, soSanPhamApDung: 3, soDonSuDung: 87 },
];
