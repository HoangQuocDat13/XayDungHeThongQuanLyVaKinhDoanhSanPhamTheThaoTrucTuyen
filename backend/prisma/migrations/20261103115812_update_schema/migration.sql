/*
  Warnings:

  - You are about to alter the column `gia` on the `bien_the_san_pham` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,0)`.
  - You are about to alter the column `gia` on the `chi_tiet_don_hang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,0)`.
  - You are about to drop the column `daThanhToan` on the `don_hang` table. All the data in the column will be lost.
  - You are about to drop the column `phuongThucThanhToan` on the `don_hang` table. All the data in the column will be lost.
  - You are about to alter the column `tongTien` on the `don_hang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,0)`.
  - You are about to alter the column `giamGia` on the `don_hang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,0)`.
  - You are about to alter the column `thanhTien` on the `don_hang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,0)`.
  - You are about to alter the column `trangThai` on the `don_hang` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(5))`.
  - You are about to drop the column `loaiTheThao` on the `san_pham` table. All the data in the column will be lost.
  - You are about to alter the column `vaiTro` on the `tai_khoan` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(1))`.
  - You are about to alter the column `soTien` on the `thanh_toan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,0)`.
  - You are about to alter the column `trangThai` on the `thanh_toan` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(7))`.
  - You are about to alter the column `trangThai` on the `yeu_cau_doi_tra` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `Enum(EnumId(8))`.
  - A unique constraint covering the columns `[sku]` on the table `bien_the_san_pham` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sanPhamId,kichCo,mauSac]` on the table `bien_the_san_pham` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[maDonHang]` on the table `don_hang` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `bien_the_san_pham` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maDonHang` to the `don_hang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soDienThoaiNhan` to the `don_hang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenNguoiNhan` to the `don_hang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monTheThaoId` to the `san_pham` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ngayCapNhat` to the `yeu_cau_doi_tra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bien_the_san_pham` ADD COLUMN `sku` VARCHAR(191) NOT NULL,
    MODIFY `gia` DECIMAL(12, 0) NOT NULL;

-- AlterTable
ALTER TABLE `chi_tiet_don_hang` MODIFY `gia` DECIMAL(12, 0) NOT NULL;

-- AlterTable
ALTER TABLE `don_hang` DROP COLUMN `daThanhToan`,
    DROP COLUMN `phuongThucThanhToan`,
    ADD COLUMN `khuyenMaiId` VARCHAR(191) NULL,
    ADD COLUMN `maDonHang` VARCHAR(191) NOT NULL,
    ADD COLUMN `phiVanChuyen` DECIMAL(12, 0) NOT NULL DEFAULT 0,
    ADD COLUMN `soDienThoaiNhan` VARCHAR(191) NOT NULL,
    ADD COLUMN `tenNguoiNhan` VARCHAR(191) NOT NULL,
    MODIFY `tongTien` DECIMAL(12, 0) NOT NULL,
    MODIFY `giamGia` DECIMAL(12, 0) NOT NULL DEFAULT 0,
    MODIFY `thanhTien` DECIMAL(12, 0) NOT NULL,
    MODIFY `trangThai` ENUM('CHO_XAC_NHAN', 'DANG_CHUAN_BI', 'DANG_VAN_CHUYEN', 'HOAN_THANH', 'DA_HUY') NOT NULL DEFAULT 'CHO_XAC_NHAN';

-- AlterTable
ALTER TABLE `nguoi_dung` ADD COLUMN `canNang` DOUBLE NULL,
    ADD COLUMN `chieuCao` INTEGER NULL,
    ADD COLUMN `gioiTinh` ENUM('NAM', 'NU') NULL;

-- AlterTable
ALTER TABLE `san_pham` DROP COLUMN `loaiTheThao`,
    ADD COLUMN `anhDaiDien` VARCHAR(191) NULL,
    ADD COLUMN `monTheThaoId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tai_khoan` MODIFY `vaiTro` ENUM('QUAN_TRI_VIEN', 'NHAN_VIEN', 'KHACH_HANG') NOT NULL DEFAULT 'KHACH_HANG';

-- AlterTable
ALTER TABLE `thanh_toan` MODIFY `soTien` DECIMAL(12, 0) NOT NULL,
    MODIFY `trangThai` ENUM('CHUA_THANH_TOAN', 'DA_THANH_TOAN', 'HOAN_TIEN') NOT NULL DEFAULT 'CHUA_THANH_TOAN';

-- AlterTable
ALTER TABLE `yeu_cau_doi_tra` ADD COLUMN `ngayCapNhat` DATETIME(3) NOT NULL,
    ADD COLUMN `nhanVienXuLyId` VARCHAR(191) NULL,
    MODIFY `trangThai` ENUM('CHO_DUYET', 'DA_PHE_DUYET', 'TU_CHOI', 'DANG_XU_LY', 'HOAN_TAT') NOT NULL DEFAULT 'CHO_DUYET';

-- CreateTable
CREATE TABLE `mon_the_thao` (
    `id` VARCHAR(191) NOT NULL,
    `ten` VARCHAR(191) NOT NULL,
    `duongDanNgan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `mon_the_thao_ten_key`(`ten`),
    UNIQUE INDEX `mon_the_thao_duongDanNgan_key`(`duongDanNgan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khuyen_mai` (
    `id` VARCHAR(191) NOT NULL,
    `ten` VARCHAR(191) NOT NULL,
    `maGiamGia` VARCHAR(191) NULL,
    `loai` ENUM('PHAN_TRAM', 'SO_TIEN') NOT NULL,
    `giaTri` DECIMAL(12, 0) NOT NULL,
    `thoiGianBatDau` DATETIME(3) NOT NULL,
    `thoiGianKetThuc` DATETIME(3) NOT NULL,
    `kichHoat` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `khuyen_mai_maGiamGia_key`(`maGiamGia`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khuyen_mai_san_pham` (
    `khuyenMaiId` VARCHAR(191) NOT NULL,
    `sanPhamId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`khuyenMaiId`, `sanPhamId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lich_su_trang_thai_don` (
    `id` VARCHAR(191) NOT NULL,
    `donHangId` VARCHAR(191) NOT NULL,
    `trangThai` ENUM('CHO_XAC_NHAN', 'DANG_CHUAN_BI', 'DANG_VAN_CHUYEN', 'HOAN_THANH', 'DA_HUY') NOT NULL,
    `ghiChu` VARCHAR(191) NULL,
    `nhanVienId` VARCHAR(191) NULL,
    `thoiDiem` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_doi_tra` (
    `id` VARCHAR(191) NOT NULL,
    `yeuCauId` VARCHAR(191) NOT NULL,
    `bienTheId` VARCHAR(191) NOT NULL,
    `soLuong` INTEGER NOT NULL,
    `loai` ENUM('DOI_HANG', 'TRA_HANG') NOT NULL,
    `bienTheMoiId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `bien_the_san_pham_sku_key` ON `bien_the_san_pham`(`sku`);

-- CreateIndex
CREATE UNIQUE INDEX `bien_the_san_pham_sanPhamId_kichCo_mauSac_key` ON `bien_the_san_pham`(`sanPhamId`, `kichCo`, `mauSac`);

-- CreateIndex
CREATE UNIQUE INDEX `don_hang_maDonHang_key` ON `don_hang`(`maDonHang`);

-- AddForeignKey
ALTER TABLE `san_pham` ADD CONSTRAINT `san_pham_monTheThaoId_fkey` FOREIGN KEY (`monTheThaoId`) REFERENCES `mon_the_thao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `khuyen_mai_san_pham` ADD CONSTRAINT `khuyen_mai_san_pham_khuyenMaiId_fkey` FOREIGN KEY (`khuyenMaiId`) REFERENCES `khuyen_mai`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `khuyen_mai_san_pham` ADD CONSTRAINT `khuyen_mai_san_pham_sanPhamId_fkey` FOREIGN KEY (`sanPhamId`) REFERENCES `san_pham`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_hang` ADD CONSTRAINT `don_hang_khuyenMaiId_fkey` FOREIGN KEY (`khuyenMaiId`) REFERENCES `khuyen_mai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lich_su_trang_thai_don` ADD CONSTRAINT `lich_su_trang_thai_don_donHangId_fkey` FOREIGN KEY (`donHangId`) REFERENCES `don_hang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lich_su_trang_thai_don` ADD CONSTRAINT `lich_su_trang_thai_don_nhanVienId_fkey` FOREIGN KEY (`nhanVienId`) REFERENCES `nguoi_dung`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `yeu_cau_doi_tra` ADD CONSTRAINT `yeu_cau_doi_tra_nhanVienXuLyId_fkey` FOREIGN KEY (`nhanVienXuLyId`) REFERENCES `nguoi_dung`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_doi_tra` ADD CONSTRAINT `chi_tiet_doi_tra_yeuCauId_fkey` FOREIGN KEY (`yeuCauId`) REFERENCES `yeu_cau_doi_tra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_doi_tra` ADD CONSTRAINT `chi_tiet_doi_tra_bienTheId_fkey` FOREIGN KEY (`bienTheId`) REFERENCES `bien_the_san_pham`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_doi_tra` ADD CONSTRAINT `chi_tiet_doi_tra_bienTheMoiId_fkey` FOREIGN KEY (`bienTheMoiId`) REFERENCES `bien_the_san_pham`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
