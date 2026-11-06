// MOCK DATA – Dữ liệu mẫu cho catalog (sản phẩm, thương hiệu, môn thể thao)
// Thay thế bằng API call thực tế khi backend sẵn sàng
// Cấu trúc phản ánh schema Prisma: SanPham, BienTheSanPham, ThuongHieu, MonTheThao

import type { SanPham, ThuongHieu, MonTheThao } from "@/types";

const sportsImages = {
  runningShoe:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  sportswear:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  football:
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
  swimming:
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
  tennis:
    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
  basketball:
    "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80",
  gymWear:
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
  weights:
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
  running:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
};

export const mockMonTheThao: MonTheThao[] = [
  { id: "mt-1", ten: "Bóng đá", duongDanNgan: "bong-da", _count: { sanPham: 48 } },
  { id: "mt-2", ten: "Chạy bộ", duongDanNgan: "chay-bo", _count: { sanPham: 35 } },
  { id: "mt-3", ten: "Bơi lội", duongDanNgan: "boi-loi", _count: { sanPham: 22 } },
  { id: "mt-4", ten: "Tennis", duongDanNgan: "tennis", _count: { sanPham: 18 } },
  { id: "mt-5", ten: "Bóng rổ", duongDanNgan: "bong-ro", _count: { sanPham: 29 } },
  { id: "mt-6", ten: "Gym & Fitness", duongDanNgan: "gym-fitness", _count: { sanPham: 41 } },
];

export const mockThuongHieu: ThuongHieu[] = [
  { id: "th-1", ten: "Nike", anhLogo: null, _count: { sanPham: 62 } },
  { id: "th-2", ten: "Adidas", anhLogo: null, _count: { sanPham: 54 } },
  { id: "th-3", ten: "Mizuno", anhLogo: null, _count: { sanPham: 31 } },
  { id: "th-4", ten: "Speedo", anhLogo: null, _count: { sanPham: 19 } },
  { id: "th-5", ten: "Wilson", anhLogo: null, _count: { sanPham: 23 } },
  { id: "th-6", ten: "Under Armour", anhLogo: null, _count: { sanPham: 28 } },
];

export const mockSanPham: SanPham[] = [
  {
    id: "sp-1",
    ten: "Giày chạy bộ Air Zoom",
    duongDanNgan: "giay-chay-bo-air-zoom",
    moTa: "Giày chạy bộ công nghệ Air Zoom với đệm khí tiên tiến, mang lại cảm giác êm ái và nhẹ nhàng. Phù hợp cho các buổi chạy dài và tập luyện cường độ cao.",
    anhDaiDien: sportsImages.runningShoe,
    monTheThaoId: "mt-2",
    thuongHieuId: "th-1",
    anHien: true,
    ngayTao: "2026-01-15T07:00:00Z",
    ngayCapNhat: "2026-10-01T07:00:00Z",
    monTheThao: { id: "mt-2", ten: "Chạy bộ", duongDanNgan: "chay-bo" },
    thuongHieu: { id: "th-1", ten: "Nike" },
    giaHienThi: 1_890_000,
    giaGoc: 2_350_000,
    phanTramGiam: 20,
    soSaoTrungBinh: 4.6,
    tongDanhGia: 128,
    bienThe: [
      { id: "bt-1-1", sanPhamId: "sp-1", sku: "NKZ-BLK-40", kichCo: "40", mauSac: "Đen", gia: 1_890_000, soLuongTon: 5, anhBienThe: sportsImages.runningShoe },
      { id: "bt-1-2", sanPhamId: "sp-1", sku: "NKZ-BLK-41", kichCo: "41", mauSac: "Đen", gia: 1_890_000, soLuongTon: 8, anhBienThe: sportsImages.runningShoe },
      { id: "bt-1-3", sanPhamId: "sp-1", sku: "NKZ-BLK-42", kichCo: "42", mauSac: "Đen", gia: 1_890_000, soLuongTon: 3, anhBienThe: sportsImages.runningShoe },
      { id: "bt-1-4", sanPhamId: "sp-1", sku: "NKZ-WHT-40", kichCo: "40", mauSac: "Trắng", gia: 1_890_000, soLuongTon: 0, anhBienThe: sportsImages.runningShoe },
      { id: "bt-1-5", sanPhamId: "sp-1", sku: "NKZ-WHT-41", kichCo: "41", mauSac: "Trắng", gia: 1_890_000, soLuongTon: 12, anhBienThe: sportsImages.runningShoe },
    ],
  },
  {
    id: "sp-2",
    ten: "Áo thun thể thao Dri-FIT",
    duongDanNgan: "ao-thun-the-thao-dri-fit",
    moTa: "Áo thun thể thao công nghệ Dri-FIT thấm hút mồ hôi nhanh, giữ cơ thể luôn khô thoáng. Chất liệu co giãn 4 chiều, phù hợp nhiều môn thể thao.",
    anhDaiDien: sportsImages.sportswear,
    monTheThaoId: "mt-6",
    thuongHieuId: "th-1",
    anHien: true,
    ngayTao: "2026-02-10T07:00:00Z",
    ngayCapNhat: "2026-10-05T07:00:00Z",
    monTheThao: { id: "mt-6", ten: "Gym & Fitness", duongDanNgan: "gym-fitness" },
    thuongHieu: { id: "th-1", ten: "Nike" },
    giaHienThi: 450_000,
    giaGoc: 450_000,
    phanTramGiam: 0,
    soSaoTrungBinh: 4.3,
    tongDanhGia: 56,
    bienThe: [
      { id: "bt-2-1", sanPhamId: "sp-2", sku: "NKT-RED-S", kichCo: "S", mauSac: "Đỏ", gia: 450_000, soLuongTon: 15, anhBienThe: sportsImages.sportswear },
      { id: "bt-2-2", sanPhamId: "sp-2", sku: "NKT-RED-M", kichCo: "M", mauSac: "Đỏ", gia: 450_000, soLuongTon: 20, anhBienThe: sportsImages.sportswear },
      { id: "bt-2-3", sanPhamId: "sp-2", sku: "NKT-RED-L", kichCo: "L", mauSac: "Đỏ", gia: 450_000, soLuongTon: 10, anhBienThe: sportsImages.sportswear },
      { id: "bt-2-4", sanPhamId: "sp-2", sku: "NKT-NVY-S", kichCo: "S", mauSac: "Xanh navy", gia: 450_000, soLuongTon: 8, anhBienThe: sportsImages.sportswear },
      { id: "bt-2-5", sanPhamId: "sp-2", sku: "NKT-NVY-M", kichCo: "M", mauSac: "Xanh navy", gia: 450_000, soLuongTon: 11, anhBienThe: sportsImages.sportswear },
    ],
  },
  {
    id: "sp-3",
    ten: "Bóng đá chính thức Champions Cup",
    duongDanNgan: "bong-da-chinh-thuc-champions-cup",
    moTa: "Bóng đá tiêu chuẩn thi đấu size 5. Vỏ bóng PU cao cấp bền bỉ, giữ áp suất tốt, thiết kế khí động học cho đường banh chính xác.",
    anhDaiDien: sportsImages.football,
    monTheThaoId: "mt-1",
    thuongHieuId: "th-2",
    anHien: true,
    ngayTao: "2026-01-20T07:00:00Z",
    ngayCapNhat: "2026-09-15T07:00:00Z",
    monTheThao: { id: "mt-1", ten: "Bóng đá", duongDanNgan: "bong-da" },
    thuongHieu: { id: "th-2", ten: "Adidas" },
    giaHienThi: 320_000,
    giaGoc: 400_000,
    phanTramGiam: 20,
    soSaoTrungBinh: 4.7,
    tongDanhGia: 89,
    bienThe: [
      { id: "bt-3-1", sanPhamId: "sp-3", sku: "ADB-BLK-5", kichCo: "5", mauSac: "Đen/Trắng", gia: 320_000, soLuongTon: 25, anhBienThe: sportsImages.football },
    ],
  },
  {
    id: "sp-4",
    ten: "Kính bơi Mirror Pro",
    duongDanNgan: "kinh-boi-mirror-pro",
    moTa: "Kính bơi tráng gương chống chói UV400, tầm nhìn rộng. Dây đeo silicon điều chỉnh được, đệm mắt chống thấm nước siêu êm.",
    anhDaiDien: sportsImages.swimming,
    monTheThaoId: "mt-3",
    thuongHieuId: "th-4",
    anHien: true,
    ngayTao: "2026-03-05T07:00:00Z",
    ngayCapNhat: "2026-10-10T07:00:00Z",
    monTheThao: { id: "mt-3", ten: "Bơi lội", duongDanNgan: "boi-loi" },
    thuongHieu: { id: "th-4", ten: "Speedo" },
    giaHienThi: 285_000,
    giaGoc: 285_000,
    phanTramGiam: 0,
    soSaoTrungBinh: 4.5,
    tongDanhGia: 42,
    bienThe: [
      { id: "bt-4-1", sanPhamId: "sp-4", sku: "SPG-BLU", kichCo: "Một cỡ", mauSac: "Xanh", gia: 285_000, soLuongTon: 18, anhBienThe: sportsImages.swimming },
      { id: "bt-4-2", sanPhamId: "sp-4", sku: "SPG-BLK", kichCo: "Một cỡ", mauSac: "Đen", gia: 285_000, soLuongTon: 12, anhBienThe: sportsImages.swimming },
    ],
  },
  {
    id: "sp-5",
    ten: "Vợt tennis Pro Staff 97",
    duongDanNgan: "vot-tennis-pro-staff-97",
    moTa: "Vợt tennis dòng Pro Staff huyền thoại, trọng lượng 315g, diện đan 97 sq inch. Khung carbon graphite mang lại cảm giác kiểm soát bóng tuyệt vời.",
    anhDaiDien: sportsImages.tennis,
    monTheThaoId: "mt-4",
    thuongHieuId: "th-5",
    anHien: true,
    ngayTao: "2026-02-28T07:00:00Z",
    ngayCapNhat: "2026-10-20T07:00:00Z",
    monTheThao: { id: "mt-4", ten: "Tennis", duongDanNgan: "tennis" },
    thuongHieu: { id: "th-5", ten: "Wilson" },
    giaHienThi: 3_200_000,
    giaGoc: 3_200_000,
    phanTramGiam: 0,
    soSaoTrungBinh: 4.8,
    tongDanhGia: 34,
    bienThe: [
      { id: "bt-5-1", sanPhamId: "sp-5", sku: "WLR-BLK", kichCo: "Một cỡ", mauSac: "Đen/Đỏ", gia: 3_200_000, soLuongTon: 7, anhBienThe: sportsImages.tennis },
    ],
  },
  {
    id: "sp-6",
    ten: "Giày bóng rổ Air Force Ultra",
    duongDanNgan: "giay-bong-ro-air-force-ultra",
    moTa: "Giày bóng rổ hightop với đệm Air Max nâng cấp, cổ cao bảo vệ mắt cá chân. Đế ngoài cao su chống trượt, phù hợp sân nhà và sân ngoài trời.",
    anhDaiDien: sportsImages.basketball,
    monTheThaoId: "mt-5",
    thuongHieuId: "th-1",
    anHien: true,
    ngayTao: "2026-01-05T07:00:00Z",
    ngayCapNhat: "2026-11-01T07:00:00Z",
    monTheThao: { id: "mt-5", ten: "Bóng rổ", duongDanNgan: "bong-ro" },
    thuongHieu: { id: "th-1", ten: "Nike" },
    giaHienThi: 2_490_000,
    giaGoc: 2_990_000,
    phanTramGiam: 17,
    soSaoTrungBinh: 4.4,
    tongDanhGia: 71,
    bienThe: [
      { id: "bt-6-1", sanPhamId: "sp-6", sku: "NKAF-WHT-41", kichCo: "41", mauSac: "Trắng", gia: 2_490_000, soLuongTon: 4, anhBienThe: sportsImages.basketball },
      { id: "bt-6-2", sanPhamId: "sp-6", sku: "NKAF-WHT-42", kichCo: "42", mauSac: "Trắng", gia: 2_490_000, soLuongTon: 6, anhBienThe: sportsImages.basketball },
      { id: "bt-6-3", sanPhamId: "sp-6", sku: "NKAF-BLK-41", kichCo: "41", mauSac: "Đen", gia: 2_490_000, soLuongTon: 9, anhBienThe: sportsImages.basketball },
    ],
  },
  {
    id: "sp-7",
    ten: "Quần short tập gym Flex",
    duongDanNgan: "quan-short-tap-gym-flex",
    moTa: "Quần short tập gym vải 4 chiều thoáng khí, thiết kế ôm nhẹ không cản trở chuyển động. Túi kéo khóa tiện lợi, dải lưng thun điều chỉnh được.",
    anhDaiDien: sportsImages.gymWear,
    monTheThaoId: "mt-6",
    thuongHieuId: "th-6",
    anHien: true,
    ngayTao: "2026-03-15T07:00:00Z",
    ngayCapNhat: "2026-10-25T07:00:00Z",
    monTheThao: { id: "mt-6", ten: "Gym & Fitness", duongDanNgan: "gym-fitness" },
    thuongHieu: { id: "th-6", ten: "Under Armour" },
    giaHienThi: 390_000,
    giaGoc: 490_000,
    phanTramGiam: 20,
    soSaoTrungBinh: 4.2,
    tongDanhGia: 38,
    bienThe: [
      { id: "bt-7-1", sanPhamId: "sp-7", sku: "UAS-GRY-S", kichCo: "S", mauSac: "Xám", gia: 390_000, soLuongTon: 14, anhBienThe: sportsImages.gymWear },
      { id: "bt-7-2", sanPhamId: "sp-7", sku: "UAS-GRY-M", kichCo: "M", mauSac: "Xám", gia: 390_000, soLuongTon: 20, anhBienThe: sportsImages.gymWear },
      { id: "bt-7-3", sanPhamId: "sp-7", sku: "UAS-BLK-M", kichCo: "M", mauSac: "Đen", gia: 390_000, soLuongTon: 18, anhBienThe: sportsImages.gymWear },
    ],
  },
  {
    id: "sp-8",
    ten: "Giày đá bóng Predator Elite",
    duongDanNgan: "giay-da-bong-predator-elite",
    moTa: "Giày đá bóng sân cỏ nhân tạo với các gai cao su chống trượt. Mũi giày rộng, lớp lót êm ái, chốt kẹp giữ thả nút nhanh.",
    anhDaiDien: sportsImages.football,
    monTheThaoId: "mt-1",
    thuongHieuId: "th-2",
    anHien: true,
    ngayTao: "2026-02-01T07:00:00Z",
    ngayCapNhat: "2026-11-02T07:00:00Z",
    monTheThao: { id: "mt-1", ten: "Bóng đá", duongDanNgan: "bong-da" },
    thuongHieu: { id: "th-2", ten: "Adidas" },
    giaHienThi: 1_250_000,
    giaGoc: 1_250_000,
    phanTramGiam: 0,
    soSaoTrungBinh: 4.5,
    tongDanhGia: 61,
    bienThe: [
      { id: "bt-8-1", sanPhamId: "sp-8", sku: "ADP-BLK-39", kichCo: "39", mauSac: "Đen/Vàng", gia: 1_250_000, soLuongTon: 5, anhBienThe: sportsImages.runningShoe },
      { id: "bt-8-2", sanPhamId: "sp-8", sku: "ADP-BLK-40", kichCo: "40", mauSac: "Đen/Vàng", gia: 1_250_000, soLuongTon: 8, anhBienThe: sportsImages.runningShoe },
      { id: "bt-8-3", sanPhamId: "sp-8", sku: "ADP-BLK-41", kichCo: "41", mauSac: "Đen/Vàng", gia: 1_250_000, soLuongTon: 3, anhBienThe: sportsImages.runningShoe },
      { id: "bt-8-4", sanPhamId: "sp-8", sku: "ADP-WHT-40", kichCo: "40", mauSac: "Trắng/Xanh", gia: 1_250_000, soLuongTon: 0, anhBienThe: sportsImages.runningShoe },
    ],
  },
  {
    id: "sp-9",
    ten: "Mũ bơi Silicone Pro",
    duongDanNgan: "mu-boi-silicone-pro",
    moTa: "Mũ bơi silicone 100% không thấm nước, giảm lực cản trong nước. Phù hợp cho cả tập luyện và thi đấu. Nhiều màu sắc tươi sáng.",
    anhDaiDien: sportsImages.swimming,
    monTheThaoId: "mt-3",
    thuongHieuId: "th-4",
    anHien: true,
    ngayTao: "2026-04-10T07:00:00Z",
    ngayCapNhat: "2026-10-15T07:00:00Z",
    monTheThao: { id: "mt-3", ten: "Bơi lội", duongDanNgan: "boi-loi" },
    thuongHieu: { id: "th-4", ten: "Speedo" },
    giaHienThi: 95_000,
    giaGoc: 120_000,
    phanTramGiam: 21,
    soSaoTrungBinh: 4.1,
    tongDanhGia: 23,
    bienThe: [
      { id: "bt-9-1", sanPhamId: "sp-9", sku: "SPC-RED", kichCo: "Một cỡ", mauSac: "Đỏ", gia: 95_000, soLuongTon: 30, anhBienThe: sportsImages.swimming },
      { id: "bt-9-2", sanPhamId: "sp-9", sku: "SPC-BLU", kichCo: "Một cỡ", mauSac: "Xanh", gia: 95_000, soLuongTon: 25, anhBienThe: sportsImages.swimming },
      { id: "bt-9-3", sanPhamId: "sp-9", sku: "SPC-BLK", kichCo: "Một cỡ", mauSac: "Đen", gia: 95_000, soLuongTon: 20, anhBienThe: sportsImages.swimming },
    ],
  },
  {
    id: "sp-10",
    ten: "Tạ tay điều chỉnh 2–24kg",
    duongDanNgan: "ta-tay-dieu-chinh-2-24kg",
    moTa: "Tạ tay điều chỉnh đa năng thay thế 15 cặp tạ riêng lẻ. Hệ thống chốt dạo nhanh, trọng lượng từ 2kg đến 24kg. Tiết kiệm không gian tối đa.",
    anhDaiDien: sportsImages.weights,
    monTheThaoId: "mt-6",
    thuongHieuId: "th-6",
    anHien: true,
    ngayTao: "2026-01-30T07:00:00Z",
    ngayCapNhat: "2026-11-01T07:00:00Z",
    monTheThao: { id: "mt-6", ten: "Gym & Fitness", duongDanNgan: "gym-fitness" },
    thuongHieu: { id: "th-6", ten: "Under Armour" },
    giaHienThi: 4_800_000,
    giaGoc: 4_800_000,
    phanTramGiam: 0,
    soSaoTrungBinh: 4.9,
    tongDanhGia: 47,
    bienThe: [
      { id: "bt-10-1", sanPhamId: "sp-10", sku: "UAD-SET", kichCo: "2–24kg", mauSac: "Đen/Bạc", gia: 4_800_000, soLuongTon: 10, anhBienThe: sportsImages.weights },
    ],
  },
  {
    id: "sp-11",
    ten: "Giày chạy bộ Mizuno Wave Rider",
    duongDanNgan: "giay-chay-bo-mizuno-wave-rider",
    moTa: "Giày chạy cao cấp với công nghệ Wave Plate độc quyền của Mizuno, hấp thụ chấn động và phân phối năng lượng hiệu quả. Lý tưởng cho các vận động viên chạy đường dài.",
    anhDaiDien: sportsImages.running,
    monTheThaoId: "mt-2",
    thuongHieuId: "th-3",
    anHien: true,
    ngayTao: "2026-02-20T07:00:00Z",
    ngayCapNhat: "2026-10-30T07:00:00Z",
    monTheThao: { id: "mt-2", ten: "Chạy bộ", duongDanNgan: "chay-bo" },
    thuongHieu: { id: "th-3", ten: "Mizuno" },
    giaHienThi: 2_150_000,
    giaGoc: 2_550_000,
    phanTramGiam: 16,
    soSaoTrungBinh: 4.7,
    tongDanhGia: 93,
    bienThe: [
      { id: "bt-11-1", sanPhamId: "sp-11", sku: "MZW-BLU-40", kichCo: "40", mauSac: "Xanh/Trắng", gia: 2_150_000, soLuongTon: 6, anhBienThe: sportsImages.running },
      { id: "bt-11-2", sanPhamId: "sp-11", sku: "MZW-BLU-41", kichCo: "41", mauSac: "Xanh/Trắng", gia: 2_150_000, soLuongTon: 9, anhBienThe: sportsImages.running },
      { id: "bt-11-3", sanPhamId: "sp-11", sku: "MZW-BLU-42", kichCo: "42", mauSac: "Xanh/Trắng", gia: 2_150_000, soLuongTon: 4, anhBienThe: sportsImages.running },
    ],
  },
  {
    id: "sp-12",
    ten: "Áo khoác gió thể thao",
    duongDanNgan: "ao-khoac-gio-the-thao",
    moTa: "Áo khoác gió nhẹ chống nước, chắn gió hiệu quả. Thiết kế ôm sát cơ thể không cản trở vận động. Có thể gấp gọn vào túi nhỏ, tiện mang theo.",
    anhDaiDien: sportsImages.sportswear,
    monTheThaoId: "mt-2",
    thuongHieuId: "th-2",
    anHien: true,
    ngayTao: "2026-03-01T07:00:00Z",
    ngayCapNhat: "2026-11-02T07:00:00Z",
    monTheThao: { id: "mt-2", ten: "Chạy bộ", duongDanNgan: "chay-bo" },
    thuongHieu: { id: "th-2", ten: "Adidas" },
    giaHienThi: 850_000,
    giaGoc: 1_050_000,
    phanTramGiam: 19,
    soSaoTrungBinh: 4.3,
    tongDanhGia: 44,
    bienThe: [
      { id: "bt-12-1", sanPhamId: "sp-12", sku: "ADJ-GRN-S", kichCo: "S", mauSac: "Xanh lá", gia: 850_000, soLuongTon: 7, anhBienThe: sportsImages.sportswear },
      { id: "bt-12-2", sanPhamId: "sp-12", sku: "ADJ-GRN-M", kichCo: "M", mauSac: "Xanh lá", gia: 850_000, soLuongTon: 11, anhBienThe: sportsImages.sportswear },
      { id: "bt-12-3", sanPhamId: "sp-12", sku: "ADJ-GRN-L", kichCo: "L", mauSac: "Xanh lá", gia: 850_000, soLuongTon: 5, anhBienThe: sportsImages.sportswear },
      { id: "bt-12-4", sanPhamId: "sp-12", sku: "ADJ-BLK-M", kichCo: "M", mauSac: "Đen", gia: 850_000, soLuongTon: 9, anhBienThe: sportsImages.sportswear },
    ],
  },
];

/** Get products by sport slug */
export function getSanPhamByMonTheThao(slug: string): SanPham[] {
  const mon = mockMonTheThao.find((m) => m.duongDanNgan === slug);
  if (!mon) return [];
  return mockSanPham.filter((sp) => sp.monTheThaoId === mon.id && sp.anHien);
}

/** Get products by brand id */
export function getSanPhamByThuongHieu(thuongHieuId: string): SanPham[] {
  return mockSanPham.filter(
    (sp) => sp.thuongHieuId === thuongHieuId && sp.anHien
  );
}

/** Get product by slug */
export function getSanPhamBySlug(slug: string): SanPham | undefined {
  return mockSanPham.find((sp) => sp.duongDanNgan === slug);
}

/** Get related products (same sport, exclude current) */
export function getSanPhamLienQuan(currentId: string, monTheThaoId: string): SanPham[] {
  return mockSanPham
    .filter(
      (sp) =>
        sp.id !== currentId &&
        sp.monTheThaoId === monTheThaoId &&
        sp.anHien
    )
    .slice(0, 4);
}
