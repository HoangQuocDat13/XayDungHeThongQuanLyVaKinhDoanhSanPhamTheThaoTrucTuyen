"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  MessageSquarePlus,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/ui/star-rating";
import { Textarea } from "@/components/ui/textarea";
import { ProductCard } from "@/features/catalog/components/product-card";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useCartStore } from "@/features/cart/store/cart-store";
import { cn, formatDate, formatVND } from "@/lib/utils";
import type { DanhGia, SanPham } from "@/types";

const EMPTY_VARIANTS: NonNullable<SanPham["bienThe"]> = [];

export function ProductDetail({
  product,
  relatedProducts,
  reviews: initialReviews,
}: {
  product: SanPham;
  relatedProducts: SanPham[];
  reviews: DanhGia[];
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const variants = product.bienThe ?? EMPTY_VARIANTS;
  const firstInStock =
    variants.find((variant) => variant.soLuongTon > 0) ?? variants[0];

  const [selectedColor, setSelectedColor] = useState(
    firstInStock?.mauSac ?? ""
  );
  const [selectedSize, setSelectedSize] = useState(
    firstInStock?.kichCo ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>(
    firstInStock?.anhBienThe ?? product.anhDaiDien ?? ""
  );

  // Reviews state
  const [reviews, setReviews] = useState<DanhGia[]>(initialReviews);
  const [starFilter, setStarFilter] = useState<number>(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const addItem = useCartStore((state) => state.addItem);

  const colors = useMemo(
    () => Array.from(new Set(variants.map((variant) => variant.mauSac))),
    [variants]
  );

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .filter((variant) => variant.mauSac === selectedColor)
            .map((variant) => variant.kichCo)
        )
      ),
    [selectedColor, variants]
  );

  const galleryImages = useMemo(() => {
    const urls = [
      product.anhDaiDien,
      ...variants.map((v) => v.anhBienThe),
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
    ].filter((u): u is string => Boolean(u));
    return Array.from(new Set(urls)).slice(0, 4);
  }, [product.anhDaiDien, variants]);

  const selectedVariant = variants.find(
    (variant) =>
      variant.mauSac === selectedColor && variant.kichCo === selectedSize
  );
  const available = selectedVariant?.soLuongTon ?? 0;
  const price = selectedVariant?.gia ?? product.giaHienThi ?? 0;
  const isOnSale =
    product.giaGoc !== undefined &&
    product.giaGoc > price &&
    (product.phanTramGiam ?? 0) > 0;

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const firstAvailable = variants.find(
      (variant) => variant.mauSac === color && variant.soLuongTon > 0
    );
    const fallbackVariant = variants.find((variant) => variant.mauSac === color);
    const chosen = firstAvailable ?? fallbackVariant;
    setSelectedSize(chosen?.kichCo ?? "");
    if (chosen?.anhBienThe) {
      setActiveImage(chosen.anhBienThe);
    }
    setQuantity(1);
  };

  const handleAddToCart = (redirectToCart = false) => {
    if (!selectedVariant || available < 1) {
      toast.error("Phiên bản này hiện đã hết hàng.");
      return;
    }

    addItem({
      bienTheId: selectedVariant.id,
      sanPhamId: product.id,
      sanPhamSlug: product.duongDanNgan,
      tenSanPham: product.ten,
      mauSac: selectedVariant.mauSac,
      kichCo: selectedVariant.kichCo,
      gia: price,
      soLuong: quantity,
      anhUrl: selectedVariant.anhBienThe ?? product.anhDaiDien ?? "",
      soLuongTon: selectedVariant.soLuongTon,
    });

    if (redirectToCart) {
      router.push("/cart");
    } else {
      toast.success(`Đã thêm ${quantity} "${product.ten}" vào giỏ hàng.`);
    }
  };

  const filteredReviews = useMemo(
    () =>
      starFilter === 0
        ? reviews
        : reviews.filter((r) => r.soSao === starFilter),
    [reviews, starFilter]
  );

  const avgStars = useMemo(() => {
    if (reviews.length === 0) return product.soSaoTrungBinh ?? 0;
    const sum = reviews.reduce((acc, r) => acc + r.soSao, 0);
    return sum / reviews.length;
  }, [reviews, product.soSaoTrungBinh]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error("Vui lòng chia sẻ cảm nhận của bạn về sản phẩm.");
      return;
    }
    const newReview: DanhGia = {
      id: `dg-local-${Date.now()}`,
      sanPhamId: product.id,
      nguoiDungId: user?.nguoiDung?.id ?? "nd-guest",
      soSao: ratingInput,
      binhLuan: commentInput.trim(),
      hinhAnh: imageInput.trim() || null,
      ngayTao: new Date().toISOString(),
      nguoiDung: {
        id: user?.nguoiDung?.id ?? "nd-guest",
        taiKhoanId: user?.id ?? "tk-guest",
        hoTen: user?.hoTen ?? "Khách trải nghiệm",
        anhDaiDien: user?.anhDaiDien ?? null,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      },
    };
    setReviews((prev) => [newReview, ...prev]);
    setCommentInput("");
    setImageInput("");
    setShowReviewForm(false);
    toast.success("Đã hiển thị đánh giá của bạn (chế độ xem trước).");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Sản phẩm", href: "/products" },
          ...(product.monTheThao
            ? [
                {
                  label: product.monTheThao.ten,
                  href: `/sports/${product.monTheThao.duongDanNgan}`,
                },
              ]
            : []),
          { label: product.ten },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.ten}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-slate-500">
                Chưa có hình ảnh
              </div>
            )}
            {isOnSale && (
              <Badge variant="danger" className="absolute left-4 top-4">
                Tiết kiệm {product.phanTramGiam}%
              </Badge>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  aria-label={`Xem ảnh sản phẩm ${idx + 1}`}
                  aria-pressed={activeImage === imgUrl}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-2xl border-2 bg-white transition-all",
                    activeImage === imgUrl
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300"
                  )}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.ten} - góc chụp ${idx + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              {product.thuongHieu?.ten && (
                <Badge variant="primary" size="sm">
                  {product.thuongHieu.ten}
                </Badge>
              )}
              {product.monTheThao?.ten && (
                <Badge variant="default" size="sm">
                  {product.monTheThao.ten}
                </Badge>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {product.ten}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StarRating value={avgStars} size="md" />
              <span className="text-sm font-semibold text-slate-800">
                {avgStars.toFixed(1)}/5
              </span>
              <span className="text-sm text-slate-600">
                ({product.tongDanhGia ?? reviews.length} đánh giá)
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3 rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-primary sm:text-3xl">
                {formatVND(price)}
              </p>
              {isOnSale && product.giaGoc && (
                <p className="text-base text-slate-500 line-through">
                  {formatVND(product.giaGoc)}
                </p>
              )}
            </div>

            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {product.moTa}
            </p>

            {/* Color selector */}
            {colors.length > 0 && (
              <fieldset className="mt-6">
                <legend className="text-sm font-semibold text-slate-900">
                  Màu sắc:{" "}
                  <span className="font-normal text-slate-600">
                    {selectedColor}
                  </span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      aria-pressed={selectedColor === color}
                      className={cn(
                        "min-h-10 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                        selectedColor === color
                          ? "border-primary bg-primary-50 text-primary ring-1 ring-primary/30"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <fieldset className="mt-6">
                <legend className="text-sm font-semibold text-slate-900">
                  Kích cỡ:{" "}
                  <span className="font-normal text-slate-600">
                    {selectedSize}
                  </span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const variant = variants.find(
                      (item) =>
                        item.mauSac === selectedColor && item.kichCo === size
                    );
                    const isAvailable = (variant?.soLuongTon ?? 0) > 0;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1);
                        }}
                        aria-pressed={selectedSize === size}
                        className={cn(
                          "min-h-10 min-w-12 rounded-xl border px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through",
                          selectedSize === size
                            ? "border-primary bg-primary-50 text-primary ring-1 ring-primary/30"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Stock indicator */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span
                className={cn(
                  "inline-flex items-center gap-2 font-medium",
                  available > 0 ? "text-success" : "text-danger"
                )}
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                {available > 0
                  ? `Còn ${available} sản phẩm trong kho`
                  : "Phiên bản này tạm hết hàng"}
              </span>
              <span className="text-xs text-slate-600">
                Mã SKU: <strong className="text-slate-800">{selectedVariant?.sku ?? "Đang cập nhật"}</strong>
              </span>
            </div>

            {/* Quantity + Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div
                className="inline-flex min-h-12 items-center rounded-xl border border-slate-200 bg-white"
                role="group"
                aria-label="Chọn số lượng"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1 || available < 1}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-l-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Giảm số lượng"
                >
                  <Minus size={16} />
                </button>
                <span
                  className="min-w-10 px-2 text-center text-sm font-semibold text-slate-900"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => Math.min(available, value + 1))
                  }
                  disabled={quantity >= available || available < 1}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-r-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Tăng số lượng"
                >
                  <Plus size={16} />
                </button>
              </div>

              <Button
                size="lg"
                leftIcon={<ShoppingBag size={18} />}
                disabled={!selectedVariant || available < 1}
                onClick={() => handleAddToCart(false)}
                className="flex-1 min-w-44"
              >
                Thêm vào giỏ hàng
              </Button>

              <Button
                size="lg"
                variant="outline"
                disabled={!selectedVariant || available < 1}
                onClick={() => handleAddToCart(true)}
              >
                Mua ngay
              </Button>
            </div>

            {/* Commitments */}
            <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
              {[
                { icon: PackageCheck, text: "Hàng chính hãng 100%" },
                { icon: Truck, text: "Miễn phí giao từ 1 triệu" },
                { icon: RefreshCw, text: "Đổi trả dễ dàng 15 ngày" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Icon size={16} className="shrink-0 text-primary" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section
        className="mt-12 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs"
        aria-labelledby="product-reviews"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 id="product-reviews" className="text-xl font-bold text-slate-900 sm:text-2xl">
              Đánh giá từ khách hàng
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StarRating value={avgStars} size="md" />
              <span className="text-sm font-semibold text-slate-900">
                {avgStars.toFixed(1)} trên 5 sao
              </span>
              <span className="text-sm text-slate-600">
                ({reviews.length} nhận xét hiển thị)
              </span>
            </div>
          </div>

          <Button
            variant={showReviewForm ? "secondary" : "outline"}
            leftIcon={<MessageSquarePlus size={17} />}
            onClick={() => setShowReviewForm((v) => !v)}
          >
            {showReviewForm ? "Đóng biểu mẫu" : "Viết đánh giá"}
          </Button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-6 rounded-2xl border border-teal-200/70 bg-primary-50/40 p-6 space-y-4"
          >
            <h3 className="text-base font-semibold text-slate-900">
              Chia sẻ trải nghiệm sử dụng sản phẩm
            </h3>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-800">
                Mức độ hài lòng của bạn *
              </p>
              <StarRating
                interactive
                size="lg"
                value={ratingInput}
                onChange={setRatingInput}
              />
            </div>
            <Textarea
              label="Nhận xét chi tiết"
              required
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Cảm nhận của bạn về chất liệu, độ êm ái, kích cỡ sản phẩm..."
            />
            <Input
              label="Đường dẫn ảnh thực tế (không bắt buộc)"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              hint="Đánh giá này chỉ hiển thị tạm thời trên phiên trình duyệt hiện tại."
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Gửi đánh giá</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowReviewForm(false)}
              >
                Hủy
              </Button>
            </div>
          </form>
        )}

        {/* Star filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[0, 5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStarFilter(star)}
              aria-pressed={starFilter === star}
              className={cn(
                "min-h-9 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                starFilter === star
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {star === 0 ? "Tất cả" : `${star} sao`}
            </button>
          ))}
        </div>

        {filteredReviews.length > 0 ? (
          <div className="mt-6 divide-y divide-slate-100">
            {filteredReviews.map((review) => {
              const reviewImages =
                review.hinhAnh?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
              return (
                <article key={review.id} className="py-6 first:pt-2 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={review.nguoiDung?.anhDaiDien}
                        name={review.nguoiDung?.hoTen ?? "Khách hàng"}
                        size="md"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {review.nguoiDung?.hoTen ?? "Khách hàng"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {formatDate(review.ngayTao)}
                        </p>
                      </div>
                    </div>
                    <StarRating value={review.soSao} size="sm" />
                  </div>

                  {review.binhLuan && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      {review.binhLuan}
                    </p>
                  )}

                  {reviewImages.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {reviewImages.map((src, i) => (
                        <a
                          key={`${src}-${i}`}
                          href={src}
                          target="_blank"
                          rel="noreferrer"
                          className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                        >
                          <Image
                            src={src}
                            alt="Ảnh thực tế từ khách hàng"
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="Chưa có đánh giá phù hợp"
              description={
                starFilter === 0
                  ? "Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này."
                  : `Hiện chưa có nhận xét nào ở mức ${starFilter} sao.`
              }
            />
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">
            Sản phẩm cùng môn thể thao
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
