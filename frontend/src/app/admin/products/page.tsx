"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Layers,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminDataTable,
  type AdminTableRow,
} from "@/components/admin/data-table";
import {
  mockMonTheThao,
  mockSanPham,
  mockThuongHieu,
} from "@/features/catalog/data/mock";
import { formatVND, isConfiguredImageHost, slugifyVi } from "@/lib/utils";
import type { BienTheSanPham, SanPham } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<SanPham[]>(mockSanPham);
  const [sportFilter, setSportFilter] = useState("ALL");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");

  // Product Add/Edit Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SanPham | null>(null);
  const [ten, setTen] = useState("");
  const [duongDanNgan, setDuongDanNgan] = useState("");
  const [thuongHieuId, setThuongHieuId] = useState(mockThuongHieu[0]?.id ?? "");
  const [monTheThaoId, setMonTheThaoId] = useState(mockMonTheThao[0]?.id ?? "");
  const [anhDaiDien, setAnhDaiDien] = useState("");
  const [moTa, setMoTa] = useState("");
  const [anHien, setAnHien] = useState(true);

  // Variant Manager Modal state
  const [variantProductId, setVariantProductId] = useState<string | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [sku, setSku] = useState("");
  const [kichCo, setKichCo] = useState("");
  const [mauSac, setMauSac] = useState("");
  const [gia, setGia] = useState("");
  const [soLuongTon, setSoLuongTon] = useState("");
  const [anhBienThe, setAnhBienThe] = useState("");
  const [deletingVariant, setDeletingVariant] = useState<{
    productId: string;
    variant: BienTheSanPham;
  } | null>(null);

  const activeVariantProduct = useMemo(
    () => products.find((item) => item.id === variantProductId) ?? null,
    [products, variantProductId]
  );

  const resetVariantForm = useCallback((defaultImage?: string | null) => {
    setEditingVariantId(null);
    setSku("");
    setKichCo("");
    setMauSac("");
    setGia("");
    setSoLuongTon("");
    setAnhBienThe(defaultImage ?? "");
  }, []);

  const openAddProduct = () => {
    setEditingProduct(null);
    setTen("");
    setDuongDanNgan("");
    setThuongHieuId(mockThuongHieu[0]?.id ?? "");
    setMonTheThaoId(mockMonTheThao[0]?.id ?? "");
    setAnhDaiDien("");
    setMoTa("");
    setAnHien(true);
    setProductModalOpen(true);
  };

  const openEditProduct = (product: SanPham) => {
    setEditingProduct(product);
    setTen(product.ten);
    setDuongDanNgan(product.duongDanNgan);
    setThuongHieuId(product.thuongHieuId);
    setMonTheThaoId(product.monTheThaoId);
    setAnhDaiDien(product.anhDaiDien ?? "");
    setMoTa(product.moTa);
    setAnHien(product.anHien);
    setProductModalOpen(true);
  };

  const openVariantManager = useCallback(
    (product: SanPham) => {
      setVariantProductId(product.id);
      resetVariantForm(product.anhDaiDien);
    },
    [resetVariantForm]
  );

  const handleSaveProduct = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = ten.trim();
    const finalSlug = slugifyVi(duongDanNgan.trim() || trimmedName);

    if (!trimmedName) {
      toast.error("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!finalSlug) {
      toast.error("Đường dẫn ngắn của sản phẩm không hợp lệ.");
      return;
    }

    const selectedBrand = mockThuongHieu.find((b) => b.id === thuongHieuId);
    const selectedSport = mockMonTheThao.find((m) => m.id === monTheThaoId);
    const now = new Date().toISOString();

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                ten: trimmedName,
                duongDanNgan: finalSlug,
                thuongHieuId,
                monTheThaoId,
                thuongHieu: selectedBrand,
                monTheThao: selectedSport,
                anhDaiDien: anhDaiDien.trim() || null,
                moTa: moTa.trim(),
                anHien,
                ngayCapNhat: now,
              }
            : item
        )
      );
      toast.success(`Đã cập nhật sản phẩm "${trimmedName}" (xem trước).`);
    } else {
      const newId = `sp-${Date.now()}`;
      const created: SanPham = {
        id: newId,
        ten: trimmedName,
        duongDanNgan: finalSlug,
        moTa: moTa.trim() || "Sản phẩm thể thao chính hãng tại SportZone.",
        anhDaiDien: anhDaiDien.trim() || null,
        monTheThaoId,
        thuongHieuId,
        monTheThao: selectedSport,
        thuongHieu: selectedBrand,
        anHien,
        ngayTao: now,
        ngayCapNhat: now,
        giaHienThi: 0,
        bienThe: [],
      };
      setProducts((prev) => [created, ...prev]);
      toast.success(
        `Đã tạo sản phẩm "${trimmedName}" (xem trước). Hãy bổ sung biến thể bán hàng.`
      );
    }
    setProductModalOpen(false);
  };

  const handleToggleVisibility = (product: SanPham) => {
    const nextState = !product.anHien;
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? {
              ...item,
              anHien: nextState,
              ngayCapNhat: new Date().toISOString(),
            }
          : item
      )
    );
    toast.info(
      nextState
        ? `Đã bật hiển thị sản phẩm "${product.ten}".`
        : `Đã tạm ẩn sản phẩm "${product.ten}" trên cửa hàng.`
    );
  };

  const handleEditVariantClick = (variant: BienTheSanPham) => {
    setEditingVariantId(variant.id);
    setSku(variant.sku);
    setKichCo(variant.kichCo);
    setMauSac(variant.mauSac);
    setGia(String(variant.gia));
    setSoLuongTon(String(variant.soLuongTon));
    setAnhBienThe(variant.anhBienThe ?? "");
  };

  const handleSaveVariant = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeVariantProduct) return;

    const cleanSku = sku.trim().toUpperCase();
    const cleanSize = kichCo.trim();
    const cleanColor = mauSac.trim();
    const parsedPrice = Number(gia);
    const parsedStock = Number(soLuongTon);

    if (!cleanSku || !cleanSize || !cleanColor) {
      toast.error("Vui lòng nhập đầy đủ mã SKU, kích cỡ và màu sắc.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      toast.error("Giá bán biến thể phải lớn hơn 0.");
      return;
    }
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      toast.error("Số lượng tồn kho phải là số nguyên không âm.");
      return;
    }

    const duplicateSku = activeVariantProduct.bienThe?.some(
      (v) => v.sku.toUpperCase() === cleanSku && v.id !== editingVariantId
    );
    if (duplicateSku) {
      toast.error(`Mã SKU "${cleanSku}" đã tồn tại trong sản phẩm này.`);
      return;
    }

    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== activeVariantProduct.id) return product;
        const currentVariants = product.bienThe ?? [];
        const updatedVariants = editingVariantId
          ? currentVariants.map((v) =>
              v.id === editingVariantId
                ? {
                    ...v,
                    sku: cleanSku,
                    kichCo: cleanSize,
                    mauSac: cleanColor,
                    gia: parsedPrice,
                    soLuongTon: parsedStock,
                    anhBienThe: anhBienThe.trim() || null,
                  }
                : v
            )
          : [
              ...currentVariants,
              {
                id: `bt-${Date.now()}`,
                sanPhamId: product.id,
                sku: cleanSku,
                kichCo: cleanSize,
                mauSac: cleanColor,
                gia: parsedPrice,
                soLuongTon: parsedStock,
                anhBienThe: anhBienThe.trim() || product.anhDaiDien || null,
              },
            ];

        const minPrice =
          updatedVariants.length > 0
            ? Math.min(...updatedVariants.map((v) => v.gia))
            : product.giaHienThi ?? 0;

        return {
          ...product,
          bienThe: updatedVariants,
          giaHienThi: minPrice,
          ngayCapNhat: new Date().toISOString(),
        };
      })
    );

    toast.success(
      editingVariantId
        ? `Đã cập nhật biến thể ${cleanSku} (xem trước).`
        : `Đã thêm biến thể ${cleanSku} (xem trước).`
    );
    resetVariantForm(activeVariantProduct.anhDaiDien);
  };

  const handleConfirmDeleteVariant = () => {
    if (!deletingVariant) return;
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== deletingVariant.productId) return product;
        const remaining = (product.bienThe ?? []).filter(
          (v) => v.id !== deletingVariant.variant.id
        );
        const minPrice =
          remaining.length > 0
            ? Math.min(...remaining.map((v) => v.gia))
            : 0;
        return {
          ...product,
          bienThe: remaining,
          giaHienThi: minPrice,
        };
      })
    );
    if (editingVariantId === deletingVariant.variant.id) {
      resetVariantForm(activeVariantProduct?.anhDaiDien);
    }
    toast.info(`Đã xóa biến thể ${deletingVariant.variant.sku} (xem trước).`);
    setDeletingVariant(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (sportFilter !== "ALL" && product.monTheThaoId !== sportFilter) {
        return false;
      }
      if (brandFilter !== "ALL" && product.thuongHieuId !== brandFilter) {
        return false;
      }
      if (visibilityFilter === "VISIBLE" && !product.anHien) return false;
      if (visibilityFilter === "HIDDEN" && product.anHien) return false;
      return true;
    });
  }, [products, sportFilter, brandFilter, visibilityFilter]);

  const rows = useMemo<AdminTableRow[]>(
    () =>
      filteredProducts.map((product) => {
        const variants = product.bienThe ?? [];
        const totalStock = variants.reduce((sum, v) => sum + v.soLuongTon, 0);
        const displayPrice =
          product.giaHienThi ?? variants[0]?.gia ?? 0;

        return {
          id: product.id,
          searchable: `${product.ten} ${product.duongDanNgan} ${
            product.thuongHieu?.ten ?? ""
          } ${product.monTheThao?.ten ?? ""} ${variants
            .map((v) => v.sku)
            .join(" ")}`,
          cells: [
            <div key="product" className="flex items-center gap-3 min-w-0">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                {product.anhDaiDien ? (
                  <Image
                    src={product.anhDaiDien}
                    alt={product.ten}
                    fill
                    sizes="48px"
                    unoptimized={!isConfiguredImageHost(product.anhDaiDien)}
                    className="object-cover"
                  />
                ) : (
                  <Package
                    size={18}
                    className="text-slate-400"
                    aria-hidden="true"
                  />
                )}
              </span>
              <div className="min-w-0">
                <p className="max-w-60 truncate font-semibold text-slate-900">
                  {product.ten}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {product.thuongHieu?.ten ?? "Chưa gắn hãng"} · /
                  {product.duongDanNgan}
                </p>
              </div>
            </div>,
            <Badge key="sport" variant="info">
              {product.monTheThao?.ten ?? "Chưa phân loại"}
            </Badge>,
            <div key="variants" className="space-y-1">
              <p className="font-medium text-slate-800">
                {variants.length} biến thể
              </p>
              {variants.length === 0 ? (
                <Badge variant="warning" size="sm">
                  Chưa có SKU
                </Badge>
              ) : totalStock === 0 ? (
                <Badge variant="danger" size="sm">
                  Hết hàng
                </Badge>
              ) : (
                <p className="text-xs text-slate-600">Tồn kho: {totalStock}</p>
              )}
            </div>,
            <span key="price" className="font-semibold text-slate-900">
              {displayPrice > 0 ? formatVND(displayPrice) : "Chưa định giá"}
            </span>,
            <Badge
              key="visible"
              variant={product.anHien ? "success" : "muted"}
              dot
            >
              {product.anHien ? "Đang hiển thị" : "Đang ẩn"}
            </Badge>,
            <div key="actions" className="flex flex-wrap items-center gap-2">
              <Button
                size="xs"
                variant="outline"
                leftIcon={<Layers size={14} />}
                onClick={() => openVariantManager(product)}
              >
                Biến thể ({variants.length})
              </Button>
              <Button
                size="xs"
                variant="secondary"
                leftIcon={<Pencil size={14} />}
                onClick={() => openEditProduct(product)}
              >
                Sửa
              </Button>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={
                  product.anHien ? <EyeOff size={14} /> : <Eye size={14} />
                }
                onClick={() => handleToggleVisibility(product)}
              >
                {product.anHien ? "Ẩn" : "Hiện"}
              </Button>
            </div>,
          ],
        };
      }),
    [filteredProducts, openVariantManager]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Sản phẩm &amp; Biến thể
            </h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Quản lý thông tin sản phẩm, thương hiệu, môn thể thao, trạng thái hiển thị và danh mục biến thể SKU.
          </p>
        </div>
        <Button leftIcon={<Plus size={17} />} onClick={openAddProduct}>
          Thêm sản phẩm mới
        </Button>
      </div>

      <AdminDataTable
        columns={[
          "Sản phẩm",
          "Môn thể thao",
          "Biến thể & Tồn kho",
          "Giá hiển thị",
          "Trạng thái",
          "Thao tác",
        ]}
        rows={rows}
        searchPlaceholder="Tìm tên sản phẩm, mã SKU, thương hiệu..."
        toolbar={
          <>
            <Select
              aria-label="Lọc theo môn thể thao"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả môn thể thao" },
                ...mockMonTheThao.map((m) => ({ value: m.id, label: m.ten })),
              ]}
            />
            <Select
              aria-label="Lọc theo thương hiệu"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả thương hiệu" },
                ...mockThuongHieu.map((b) => ({ value: b.id, label: b.ten })),
              ]}
            />
            <Select
              aria-label="Lọc theo trạng thái hiển thị"
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Tất cả trạng thái" },
                { value: "VISIBLE", label: "Đang hiển thị" },
                { value: "HIDDEN", label: "Đang ẩn" },
              ]}
            />
          </>
        }
      />

      {/* Add / Edit Product Modal */}
      <Modal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        size="lg"
        title={
          editingProduct ? "Chỉnh sửa thông tin sản phẩm" : "Thêm sản phẩm mới"
        }
        description="Thay đổi được lưu trực tiếp vào bộ nhớ xem trước trên trình duyệt."
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Tên sản phẩm"
              required
              value={ten}
              onChange={(e) => {
                const nextName = e.target.value;
                setTen(nextName);
                if (!editingProduct) {
                  setDuongDanNgan(slugifyVi(nextName));
                }
              }}
              placeholder="Ví dụ: Giày chạy bộ Pegasus 41"
            />
            <Input
              label="Đường dẫn ngắn"
              required
              value={duongDanNgan}
              onChange={(e) => setDuongDanNgan(e.target.value)}
              placeholder="giay-chay-bo-pegasus-41"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Môn thể thao"
              required
              value={monTheThaoId}
              onChange={(e) => setMonTheThaoId(e.target.value)}
              options={mockMonTheThao.map((m) => ({
                value: m.id,
                label: m.ten,
              }))}
            />
            <Select
              label="Thương hiệu"
              required
              value={thuongHieuId}
              onChange={(e) => setThuongHieuId(e.target.value)}
              options={mockThuongHieu.map((b) => ({
                value: b.id,
                label: b.ten,
              }))}
            />
          </div>

          <Input
            label="Đường dẫn ảnh đại diện"
            value={anhDaiDien}
            onChange={(e) => setAnhDaiDien(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            hint="Hỗ trợ ảnh từ Unsplash, Cloudinary hoặc đường dẫn HTTPS hợp lệ."
          />

          <Textarea
            label="Mô tả chi tiết sản phẩm"
            rows={4}
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
            placeholder="Mô tả chất liệu, công nghệ nổi bật và đối tượng sử dụng phù hợp..."
          />

          <Checkbox
            checked={anHien}
            onChange={(e) => setAnHien(e.target.checked)}
            label="Hiển thị sản phẩm công khai trên cửa hàng"
          />

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setProductModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Variant Management Modal */}
      <Modal
        open={Boolean(activeVariantProduct)}
        onClose={() => setVariantProductId(null)}
        size="xl"
        title={
          activeVariantProduct
            ? `Quản lý biến thể: ${activeVariantProduct.ten}`
            : "Quản lý biến thể"
        }
        description="Mỗi biến thể đại diện cho một tổ hợp mã SKU, kích cỡ, màu sắc, giá bán và số lượng tồn kho riêng."
      >
        {activeVariantProduct && (
          <div className="space-y-6">
            {/* Existing variants list */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Danh sách biến thể hiện có (
                  {activeVariantProduct.bienThe?.length ?? 0})
                </h3>
                {editingVariantId && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() =>
                      resetVariantForm(activeVariantProduct.anhDaiDien)
                    }
                  >
                    + Chuyển sang thêm biến thể mới
                  </Button>
                )}
              </div>

              {(activeVariantProduct.bienThe?.length ?? 0) === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                  Sản phẩm này chưa có biến thể nào. Hãy thêm biến thể đầu tiên ở biểu mẫu bên dưới.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Mã SKU</th>
                        <th className="px-4 py-3">Màu sắc / Kích cỡ</th>
                        <th className="px-4 py-3">Giá bán</th>
                        <th className="px-4 py-3">Tồn kho</th>
                        <th className="px-4 py-3">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeVariantProduct.bienThe?.map((variant) => (
                        <tr
                          key={variant.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900">
                            {variant.sku}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {variant.mauSac} · Cỡ {variant.kichCo}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {formatVND(variant.gia)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                variant.soLuongTon > 0 ? "success" : "danger"
                              }
                              size="sm"
                            >
                              {variant.soLuongTon > 0
                                ? `Còn ${variant.soLuongTon}`
                                : "Hết hàng"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                size="xs"
                                variant="secondary"
                                leftIcon={<Pencil size={13} />}
                                onClick={() => handleEditVariantClick(variant)}
                              >
                                Sửa
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                className="text-danger hover:bg-red-50 hover:text-danger"
                                leftIcon={<Trash2 size={13} />}
                                onClick={() =>
                                  setDeletingVariant({
                                    productId: activeVariantProduct.id,
                                    variant,
                                  })
                                }
                              >
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Add / Edit variant form */}
            <form
              onSubmit={handleSaveVariant}
              className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-6"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                {editingVariantId
                  ? "Chỉnh sửa biến thể đang chọn"
                  : "Thêm biến thể mới"}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  label="Mã SKU"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="VD: NKZ-BLK-43"
                />
                <Input
                  label="Kích cỡ"
                  required
                  value={kichCo}
                  onChange={(e) => setKichCo(e.target.value)}
                  placeholder="VD: 42, M, L, Một cỡ"
                />
                <Input
                  label="Màu sắc"
                  required
                  value={mauSac}
                  onChange={(e) => setMauSac(e.target.value)}
                  placeholder="VD: Đen, Trắng/Xanh"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Giá bán (VND)"
                  type="number"
                  min={1000}
                  step={1000}
                  required
                  value={gia}
                  onChange={(e) => setGia(e.target.value)}
                  placeholder="1890000"
                />
                <Input
                  label="Số lượng tồn kho"
                  type="number"
                  min={0}
                  step={1}
                  required
                  value={soLuongTon}
                  onChange={(e) => setSoLuongTon(e.target.value)}
                  placeholder="10"
                />
              </div>

              <Input
                label="Đường dẫn ảnh riêng cho biến thể (tùy chọn)"
                value={anhBienThe}
                onChange={(e) => setAnhBienThe(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                {editingVariantId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      resetVariantForm(activeVariantProduct.anhDaiDien)
                    }
                  >
                    Hủy chỉnh sửa
                  </Button>
                )}
                <Button type="submit">
                  {editingVariantId ? "Cập nhật biến thể" : "Thêm biến thể"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingVariant)}
        onClose={() => setDeletingVariant(null)}
        onConfirm={handleConfirmDeleteVariant}
        title={`Xóa biến thể "${deletingVariant?.variant.sku ?? ""}"?`}
        description="Biến thể này sẽ bị gỡ khỏi danh sách xem trước của sản phẩm."
      />
    </div>
  );
}
