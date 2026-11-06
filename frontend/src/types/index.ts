// ============================================================
// ENUMS (string union types matching Prisma schema)
// ============================================================

export type VaiTro = "QUAN_TRI_VIEN" | "NHAN_VIEN" | "KHACH_HANG";
export type PhuongThucDangNhap = "HE_THONG" | "GOOGLE";
export type GioiTinh = "NAM" | "NU";
export type LoaiKhuyenMai = "PHAN_TRAM" | "SO_TIEN";
export type TrangThaiDon =
  | "CHO_XAC_NHAN"
  | "DANG_CHUAN_BI"
  | "DANG_VAN_CHUYEN"
  | "HOAN_THANH"
  | "DA_HUY";
export type PhuongThucThanhToan = "COD" | "TRUYEN_TUYEN";
export type TrangThaiThanhToan =
  | "CHUA_THANH_TOAN"
  | "DA_THANH_TOAN"
  | "HOAN_TIEN";
export type TrangThaiDoiTra =
  | "CHO_DUYET"
  | "DA_PHE_DUYET"
  | "TU_CHOI"
  | "DANG_XU_LY"
  | "HOAN_TAT";
export type LoaiDoiTra = "DOI_HANG" | "TRA_HANG";

// ============================================================
// AUTHENTICATION & USER
// ============================================================

export interface TaiKhoan {
  id: string;
  email: string;
  tenDangNhap?: string | null;
  phuongThuc: PhuongThucDangNhap;
  vaiTro: VaiTro;
  trangThai: boolean; // true = active, false = locked
  ngayTao: string;
  ngayCapNhat: string;
  nguoiDung?: NguoiDung;
}

export interface NguoiDung {
  id: string;
  taiKhoanId: string;
  hoTen: string;
  soDienThoai?: string | null;
  anhDaiDien?: string | null;
  gioiTinh?: GioiTinh | null;
  chieuCao?: number | null; // cm
  canNang?: number | null; // kg
  ngayTao: string;
  ngayCapNhat: string;
  taiKhoan?: TaiKhoan;
  diaChi?: DiaChi[];
}

export interface DiaChi {
  id: string;
  nguoiDungId: string;
  tenNguoiNhan: string;
  soDienThoai: string;
  duong: string;
  phuong: string;
  quan: string;
  thanhPho: string;
  macDinh: boolean;
}

// ============================================================
// PRODUCT & CATALOG
// ============================================================

export interface ThuongHieu {
  id: string;
  ten: string;
  anhLogo?: string | null;
  _count?: { sanPham: number };
}

export interface MonTheThao {
  id: string;
  ten: string;
  duongDanNgan: string;
  _count?: { sanPham: number };
}

export interface BienTheSanPham {
  id: string;
  sanPhamId: string;
  sku: string;
  kichCo: string;
  mauSac: string;
  gia: number;
  soLuongTon: number;
  anhBienThe?: string | null;
  sanPham?: SanPham;
}

export interface SanPham {
  id: string;
  ten: string;
  duongDanNgan: string;
  moTa: string;
  anhDaiDien?: string | null;
  monTheThaoId: string;
  thuongHieuId: string;
  anHien: boolean;
  ngayTao: string;
  ngayCapNhat: string;
  monTheThao?: MonTheThao;
  thuongHieu?: ThuongHieu;
  bienThe?: BienTheSanPham[];
  danhGia?: DanhGia[];
  khuyenMai?: KhuyenMaiSanPham[];
  // Computed fields (populated by mock/API layer)
  giaHienThi?: number;
  giaGoc?: number;
  phanTramGiam?: number;
  soSaoTrungBinh?: number;
  tongDanhGia?: number;
}

// ============================================================
// PROMOTION
// ============================================================

export interface KhuyenMai {
  id: string;
  ten: string;
  maGiamGia?: string | null;
  loai: LoaiKhuyenMai;
  giaTri: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  kichHoat: boolean;
  sanPham?: KhuyenMaiSanPham[];
  _count?: { donHang: number };
}

export interface KhuyenMaiSanPham {
  khuyenMaiId: string;
  sanPhamId: string;
  khuyenMai?: KhuyenMai;
  sanPham?: SanPham;
}

// ============================================================
// CART
// ============================================================

export interface GioHang {
  id: string;
  nguoiDungId: string;
  bienTheId: string;
  soLuong: number;
  bienThe?: BienTheSanPham & { sanPham?: SanPham };
}

// Cart item shape used in Zustand store
export interface CartItem {
  bienTheId: string;
  sanPhamId: string;
  sanPhamSlug: string;
  tenSanPham: string;
  mauSac: string;
  kichCo: string;
  gia: number;
  soLuong: number;
  anhUrl: string;
  soLuongTon: number;
}

// ============================================================
// ORDER
// ============================================================

export interface ChiTietDonHang {
  id: string;
  donHangId: string;
  bienTheId: string;
  soLuong: number;
  gia: number; // price at time of purchase
  bienThe?: BienTheSanPham & { sanPham?: SanPham };
}

export interface LichSuTrangThaiDon {
  id: string;
  donHangId: string;
  trangThai: TrangThaiDon;
  ghiChu?: string | null;
  nhanVienId?: string | null;
  thoiDiem: string;
  nhanVien?: NguoiDung;
}

export interface DonHang {
  id: string;
  maDonHang: string;
  nguoiDungId: string;
  khuyenMaiId?: string | null;
  tenNguoiNhan: string;
  soDienThoaiNhan: string;
  diaChiGiaoHang: string;
  tongTien: number;
  giamGia: number;
  phiVanChuyen: number;
  thanhTien: number;
  trangThai: TrangThaiDon;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiDung?: NguoiDung;
  khuyenMai?: KhuyenMai;
  chiTiet?: ChiTietDonHang[];
  lichSu?: LichSuTrangThaiDon[];
  yeuCauDoiTra?: YeuCauDoiTra;
  thanhToan?: ThanhToan;
}

// ============================================================
// PAYMENT
// ============================================================

export interface ThanhToan {
  id: string;
  donHangId: string;
  soTien: number;
  phuongThuc: PhuongThucThanhToan;
  trangThai: TrangThaiThanhToan;
  maGiaoDich?: string | null;
  ngayThanhToan?: string | null;
  ngayTao: string;
  donHang?: DonHang;
}

// ============================================================
// RETURNS
// ============================================================

export interface ChiTietDoiTra {
  id: string;
  yeuCauId: string;
  bienTheId: string;
  soLuong: number;
  loai: LoaiDoiTra;
  bienTheMoiId?: string | null;
  bienThe?: BienTheSanPham & { sanPham?: SanPham };
  bienTheMoi?: BienTheSanPham & { sanPham?: SanPham };
}

export interface YeuCauDoiTra {
  id: string;
  donHangId: string;
  nguoiDungId: string;
  nhanVienXuLyId?: string | null;
  lyDo: string;
  minhChung: string; // comma-separated URLs
  trangThai: TrangThaiDoiTra;
  ghiChu?: string | null;
  ngayTao: string;
  ngayCapNhat: string;
  donHang?: DonHang;
  nguoiDung?: NguoiDung;
  nhanVienXuLy?: NguoiDung;
  chiTiet?: ChiTietDoiTra[];
}

// ============================================================
// NEWS & REVIEWS
// ============================================================

export interface TinTuc {
  id: string;
  tieuDe: string;
  duongDanNgan: string;
  noiDung: string;
  anhBia?: string | null;
  tacGiaId: string;
  ngayDang: string;
  tacGia?: NguoiDung;
}

export interface DanhGia {
  id: string;
  sanPhamId: string;
  nguoiDungId: string;
  soSao: number; // 1–5
  binhLuan?: string | null;
  hinhAnh?: string | null; // comma-separated URLs
  ngayTao: string;
  sanPham?: SanPham;
  nguoiDung?: NguoiDung;
}

// ============================================================
// API HELPERS
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ============================================================
// CHECKOUT FORM SHAPE
// ============================================================

export interface CheckoutFormData {
  tenNguoiNhan: string;
  soDienThoaiNhan: string;
  diaChiGiaoHang: string;
  phuongThucThanhToan: PhuongThucThanhToan;
  maGiamGia?: string;
  ghiChu?: string;
}
