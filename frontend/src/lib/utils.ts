// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/** Merge CSS class names, filtering out falsy values */
export function cn(...classes: (string | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(" ");
}

// ============================================================
// FORMATTERS
// ============================================================

/** Format number to Vietnamese Dong currency */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format date string/Date to dd/MM/yyyy */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

/** Format date with time */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Relative time (vd: "2 ngày trước") */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return "vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 30) return `${diffDay} ngày trước`;
  if (diffMonth < 12) return `${diffMonth} tháng trước`;
  return formatDate(date);
}

// ============================================================
// ENUM LABELS – Order Status
// ============================================================

export type TrangThaiDon =
  | "CHO_XAC_NHAN"
  | "DANG_CHUAN_BI"
  | "DANG_VAN_CHUYEN"
  | "HOAN_THANH"
  | "DA_HUY";

export const TRANG_THAI_DON_LABELS: Record<TrangThaiDon, string> = {
  CHO_XAC_NHAN: "Chờ xác nhận",
  DANG_CHUAN_BI: "Đang chuẩn bị",
  DANG_VAN_CHUYEN: "Đang vận chuyển",
  HOAN_THANH: "Hoàn thành",
  DA_HUY: "Đã hủy",
};

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

export const TRANG_THAI_DON_VARIANTS: Record<TrangThaiDon, BadgeVariant> = {
  CHO_XAC_NHAN: "warning",
  DANG_CHUAN_BI: "info",
  DANG_VAN_CHUYEN: "primary",
  HOAN_THANH: "success",
  DA_HUY: "danger",
};

export function getTrangThaiDonLabel(trangThai: string): string {
  return TRANG_THAI_DON_LABELS[trangThai as TrangThaiDon] ?? trangThai;
}

export function getTrangThaiDonVariant(trangThai: string): BadgeVariant {
  return TRANG_THAI_DON_VARIANTS[trangThai as TrangThaiDon] ?? "default";
}

// ============================================================
// ENUM LABELS – Payment Status
// ============================================================

export type TrangThaiThanhToan =
  | "CHUA_THANH_TOAN"
  | "DA_THANH_TOAN"
  | "HOAN_TIEN";

export const TRANG_THAI_THANH_TOAN_LABELS: Record<TrangThaiThanhToan, string> = {
  CHUA_THANH_TOAN: "Chưa thanh toán",
  DA_THANH_TOAN: "Đã thanh toán",
  HOAN_TIEN: "Hoàn tiền",
};

export const TRANG_THAI_THANH_TOAN_VARIANTS: Record<
  TrangThaiThanhToan,
  BadgeVariant
> = {
  CHUA_THANH_TOAN: "warning",
  DA_THANH_TOAN: "success",
  HOAN_TIEN: "info",
};

export function getTrangThaiThanhToanLabel(trangThai: string): string {
  return (
    TRANG_THAI_THANH_TOAN_LABELS[trangThai as TrangThaiThanhToan] ?? trangThai
  );
}

export function getTrangThaiThanhToanVariant(
  trangThai: string
): BadgeVariant {
  return (
    TRANG_THAI_THANH_TOAN_VARIANTS[trangThai as TrangThaiThanhToan] ??
    "default"
  );
}

// ============================================================
// ENUM LABELS – Return Status
// ============================================================

export type TrangThaiDoiTra =
  | "CHO_DUYET"
  | "DA_PHE_DUYET"
  | "TU_CHOI"
  | "DANG_XU_LY"
  | "HOAN_TAT";

export const TRANG_THAI_DOI_TRA_LABELS: Record<TrangThaiDoiTra, string> = {
  CHO_DUYET: "Chờ duyệt",
  DA_PHE_DUYET: "Đã phê duyệt",
  TU_CHOI: "Từ chối",
  DANG_XU_LY: "Đang xử lý",
  HOAN_TAT: "Hoàn tất",
};

export const TRANG_THAI_DOI_TRA_VARIANTS: Record<TrangThaiDoiTra, BadgeVariant> =
  {
    CHO_DUYET: "warning",
    DA_PHE_DUYET: "primary",
    TU_CHOI: "danger",
    DANG_XU_LY: "info",
    HOAN_TAT: "success",
  };

export function getTrangThaiDoiTraLabel(trangThai: string): string {
  return TRANG_THAI_DOI_TRA_LABELS[trangThai as TrangThaiDoiTra] ?? trangThai;
}

export function getTrangThaiDoiTraVariant(trangThai: string): BadgeVariant {
  return (
    TRANG_THAI_DOI_TRA_VARIANTS[trangThai as TrangThaiDoiTra] ?? "default"
  );
}

// ============================================================
// ENUM LABELS – Role / Payment method / Return type
// ============================================================

export function getVaiTroLabel(vaiTro: string): string {
  const labels: Record<string, string> = {
    QUAN_TRI_VIEN: "Quản trị viên",
    NHAN_VIEN: "Nhân viên",
    KHACH_HANG: "Khách hàng",
  };
  return labels[vaiTro] ?? vaiTro;
}

export function getVaiTroVariant(vaiTro: string): BadgeVariant {
  const variants: Record<string, BadgeVariant> = {
    QUAN_TRI_VIEN: "danger",
    NHAN_VIEN: "info",
    KHACH_HANG: "default",
  };
  return variants[vaiTro] ?? "default";
}

export function getPhuongThucThanhToanLabel(phuongThuc: string): string {
  const labels: Record<string, string> = {
    COD: "Thanh toán khi nhận hàng",
    TRUYEN_TUYEN: "Thanh toán trực tuyến",
  };
  return labels[phuongThuc] ?? phuongThuc;
}

export function getLoaiDoiTraLabel(loai: string): string {
  const labels: Record<string, string> = {
    DOI_HANG: "Đổi hàng",
    TRA_HANG: "Trả hàng",
  };
  return labels[loai] ?? loai;
}

export function getLoaiKhuyenMaiLabel(loai: string): string {
  const labels: Record<string, string> = {
    PHAN_TRAM: "Phần trăm",
    SO_TIEN: "Số tiền",
  };
  return labels[loai] ?? loai;
}

export function getGioiTinhLabel(gioiTinh: string): string {
  const labels: Record<string, string> = {
    NAM: "Nam",
    NU: "Nữ",
  };
  return labels[gioiTinh] ?? gioiTinh;
}

// ============================================================
// HELPERS
// ============================================================

/** Generate full address string from DiaChi fields */
export function formatDiaChi(
  duong: string,
  phuong: string,
  quan: string,
  thanhPho: string
): string {
  return `${duong}, ${phuong}, ${quan}, ${thanhPho}`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Truncate string to maxLength with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

/** Calculate discounted price */
export function tinhGiaKhuyenMai(
  gia: number,
  loai: "PHAN_TRAM" | "SO_TIEN",
  giaTri: number
): number {
  if (loai === "PHAN_TRAM") {
    return Math.max(0, gia - (gia * giaTri) / 100);
  }
  return Math.max(0, gia - giaTri);
}

/** Generate initials from full name */
export function getInitials(hoTen: string): string {
  return hoTen
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Calculate preview discount for demo coupon codes */
export function calculateCouponDiscount(
  code: string | null | undefined,
  subtotal: number
): number {
  if (!code || subtotal <= 0) return 0;
  const normalized = code.trim().toUpperCase();
  if (normalized === "SPORTZONE10") return Math.round(subtotal * 0.1);
  if (normalized === "NEWBIE50") return Math.min(50_000, subtotal);
  if (normalized === "FLASH1111") return Math.round(subtotal * 0.3);
  return 0;
}

/** Convert Vietnamese text to URL-safe slug */
export function slugifyVi(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Check whether an external image URL matches Next.js configured remotePatterns */
export function isConfiguredImageHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      ["picsum.photos", "res.cloudinary.com", "images.unsplash.com"].includes(
        parsed.hostname
      )
    );
  } catch {
    return false;
  }
}
