-- CreateTable
CREATE TABLE `tai_khoan` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `tenDangNhap` VARCHAR(191) NULL,
    `matKhau` VARCHAR(191) NULL,
    `phuongThuc` ENUM('HE_THONG', 'GOOGLE') NOT NULL DEFAULT 'HE_THONG',
    `vaiTro` ENUM('QUANTRIVIEN', 'NHANVIEN', 'KHACHHANG') NOT NULL DEFAULT 'KHACHHANG',
    `trangThai` BOOLEAN NOT NULL DEFAULT true,
    `maKhoiPhucMatKhau` VARCHAR(191) NULL,
    `thoiHanKhoiPhuc` DATETIME(3) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tai_khoan_email_key`(`email`),
    UNIQUE INDEX `tai_khoan_tenDangNhap_key`(`tenDangNhap`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nguoi_dung` (
    `id` VARCHAR(191) NOT NULL,
    `taiKhoanId` VARCHAR(191) NOT NULL,
    `hoTen` VARCHAR(191) NOT NULL,
    `soDienThoai` VARCHAR(191) NULL,
    `anhDaiDien` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nguoi_dung_taiKhoanId_key`(`taiKhoanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dia_chi` (
    `id` VARCHAR(191) NOT NULL,
    `nguoiDungId` VARCHAR(191) NOT NULL,
    `tenNguoiNhan` VARCHAR(191) NOT NULL,
    `soDienThoai` VARCHAR(191) NOT NULL,
    `duong` VARCHAR(191) NOT NULL,
    `phuong` VARCHAR(191) NOT NULL,
    `quan` VARCHAR(191) NOT NULL,
    `thanhPho` VARCHAR(191) NOT NULL,
    `macDinh` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thuong_hieu` (
    `id` VARCHAR(191) NOT NULL,
    `ten` VARCHAR(191) NOT NULL,
    `anhLogo` VARCHAR(191) NULL,

    UNIQUE INDEX `thuong_hieu_ten_key`(`ten`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `san_pham` (
    `id` VARCHAR(191) NOT NULL,
    `ten` VARCHAR(191) NOT NULL,
    `duongDanNgan` VARCHAR(191) NOT NULL,
    `moTa` TEXT NOT NULL,
    `loaiTheThao` VARCHAR(191) NOT NULL,
    `thuongHieuId` VARCHAR(191) NOT NULL,
    `anHien` BOOLEAN NOT NULL DEFAULT false,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `san_pham_duongDanNgan_key`(`duongDanNgan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bien_the_san_pham` (
    `id` VARCHAR(191) NOT NULL,
    `sanPhamId` VARCHAR(191) NOT NULL,
    `kichCo` VARCHAR(191) NOT NULL,
    `mauSac` VARCHAR(191) NOT NULL,
    `gia` DECIMAL(10, 2) NOT NULL,
    `soLuongTon` INTEGER NOT NULL DEFAULT 0,
    `anhBienThe` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gio_hang` (
    `id` VARCHAR(191) NOT NULL,
    `nguoiDungId` VARCHAR(191) NOT NULL,
    `bienTheId` VARCHAR(191) NOT NULL,
    `soLuong` INTEGER NOT NULL,

    UNIQUE INDEX `gio_hang_nguoiDungId_bienTheId_key`(`nguoiDungId`, `bienTheId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `don_hang` (
    `id` VARCHAR(191) NOT NULL,
    `nguoiDungId` VARCHAR(191) NOT NULL,
    `tongTien` DECIMAL(10, 2) NOT NULL,
    `giamGia` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `thanhTien` DECIMAL(10, 2) NOT NULL,
    `trangThai` ENUM('CHOXACNHAN', 'DANGCHUANBI', 'DANGVANCHUYEN', 'HOANTHANH', 'DAHUY') NOT NULL DEFAULT 'CHOXACNHAN',
    `phuongThucThanhToan` ENUM('COD', 'TRUYEN_TUYEN') NOT NULL,
    `daThanhToan` BOOLEAN NOT NULL DEFAULT false,
    `diaChiGiaoHang` VARCHAR(191) NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_don_hang` (
    `id` VARCHAR(191) NOT NULL,
    `donHangId` VARCHAR(191) NOT NULL,
    `bienTheId` VARCHAR(191) NOT NULL,
    `soLuong` INTEGER NOT NULL,
    `gia` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thanh_toan` (
    `id` VARCHAR(191) NOT NULL,
    `donHangId` VARCHAR(191) NOT NULL,
    `soTien` DECIMAL(10, 2) NOT NULL,
    `phuongThuc` ENUM('COD', 'TRUYEN_TUYEN') NOT NULL,
    `trangThai` ENUM('CHUATHANHTOAN', 'DATHANHTOAN', 'HOANTIEN') NOT NULL DEFAULT 'CHUATHANHTOAN',
    `maGiaoDich` VARCHAR(191) NULL,
    `ngayThanhToan` DATETIME(3) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `thanh_toan_donHangId_key`(`donHangId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `yeu_cau_doi_tra` (
    `id` VARCHAR(191) NOT NULL,
    `donHangId` VARCHAR(191) NOT NULL,
    `nguoiDungId` VARCHAR(191) NOT NULL,
    `lyDo` VARCHAR(191) NOT NULL,
    `minhChung` TEXT NOT NULL,
    `trangThai` ENUM('CHODUET', 'DAPHEDUYET', 'TUCHOI') NOT NULL DEFAULT 'CHODUET',
    `ghiChu` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `yeu_cau_doi_tra_donHangId_key`(`donHangId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tin_tuc` (
    `id` VARCHAR(191) NOT NULL,
    `tieuDe` VARCHAR(191) NOT NULL,
    `duongDanNgan` VARCHAR(191) NOT NULL,
    `noiDung` TEXT NOT NULL,
    `anhBia` VARCHAR(191) NULL,
    `tacGiaId` VARCHAR(191) NOT NULL,
    `ngayDang` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tin_tuc_duongDanNgan_key`(`duongDanNgan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_gia` (
    `id` VARCHAR(191) NOT NULL,
    `sanPhamId` VARCHAR(191) NOT NULL,
    `nguoiDungId` VARCHAR(191) NOT NULL,
    `soSao` INTEGER NOT NULL,
    `binhLuan` TEXT NULL,
    `hinhAnh` TEXT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `nguoi_dung` ADD CONSTRAINT `nguoi_dung_taiKhoanId_fkey` FOREIGN KEY (`taiKhoanId`) REFERENCES `tai_khoan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dia_chi` ADD CONSTRAINT `dia_chi_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `nguoi_dung`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `san_pham` ADD CONSTRAINT `san_pham_thuongHieuId_fkey` FOREIGN KEY (`thuongHieuId`) REFERENCES `thuong_hieu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bien_the_san_pham` ADD CONSTRAINT `bien_the_san_pham_sanPhamId_fkey` FOREIGN KEY (`sanPhamId`) REFERENCES `san_pham`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gio_hang` ADD CONSTRAINT `gio_hang_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `nguoi_dung`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gio_hang` ADD CONSTRAINT `gio_hang_bienTheId_fkey` FOREIGN KEY (`bienTheId`) REFERENCES `bien_the_san_pham`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_hang` ADD CONSTRAINT `don_hang_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `nguoi_dung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_hang` ADD CONSTRAINT `chi_tiet_don_hang_donHangId_fkey` FOREIGN KEY (`donHangId`) REFERENCES `don_hang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_hang` ADD CONSTRAINT `chi_tiet_don_hang_bienTheId_fkey` FOREIGN KEY (`bienTheId`) REFERENCES `bien_the_san_pham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_donHangId_fkey` FOREIGN KEY (`donHangId`) REFERENCES `don_hang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `yeu_cau_doi_tra` ADD CONSTRAINT `yeu_cau_doi_tra_donHangId_fkey` FOREIGN KEY (`donHangId`) REFERENCES `don_hang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `yeu_cau_doi_tra` ADD CONSTRAINT `yeu_cau_doi_tra_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `nguoi_dung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tin_tuc` ADD CONSTRAINT `tin_tuc_tacGiaId_fkey` FOREIGN KEY (`tacGiaId`) REFERENCES `nguoi_dung`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danh_gia` ADD CONSTRAINT `danh_gia_sanPhamId_fkey` FOREIGN KEY (`sanPhamId`) REFERENCES `san_pham`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danh_gia` ADD CONSTRAINT `danh_gia_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `nguoi_dung`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
