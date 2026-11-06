import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Dumbbell,
  Gift,
  HeartHandshake,
  PackageCheck,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/features/catalog/components/product-card";
import {
  mockMonTheThao,
  mockSanPham,
  mockThuongHieu,
} from "@/features/catalog/data/mock";
import { mockTinTuc } from "@/features/news/data/mock";
import { formatDate } from "@/lib/utils";

function toBrandSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ClientHomePage() {
  const featuredProducts = mockSanPham
    .filter((product) => product.anHien)
    .slice(0, 4);
  const saleProducts = mockSanPham
    .filter((product) => product.anHien && (product.phanTramGiam ?? 0) > 0)
    .slice(0, 4);

  return (
    <div>
      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 lg:px-8 lg:pt-8 lg:pb-12">
        <div className="relative isolate overflow-hidden rounded-3xl bg-teal-950">
          <div className="absolute inset-0 -z-10">
            <Image
              src="https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1800&q=85"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-teal-950/75 to-teal-950/25" />
          </div>

          <div className="flex min-h-[420px] max-w-2xl flex-col justify-center p-6 text-white sm:min-h-[480px] sm:p-12 lg:p-16">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
              <Dumbbell size={14} className="shrink-0" aria-hidden="true" />
              <span>Không gian thể thao hiện đại 2026</span>
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Mỗi ngày năng động, theo cách riêng của bạn.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-teal-50/90 sm:text-base">
              Khám phá giày chạy bộ, trang phục tập luyện và dụng cụ thi đấu chính hãng từ Nike, Adidas, Mizuno, Wilson — nhẹ nhàng lựa chọn, đổi trả dễ dàng.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-50"
              >
                <span>Mua sắm ngay</span>
                <ArrowRight size={18} className="shrink-0" aria-hidden="true" />
              </Link>
              <Link
                href="/sports"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <span>Chọn theo môn thể thao</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Service Commitments */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: PackageCheck,
              title: "Sản phẩm chọn lọc kỹ lưỡng",
              text: "Thông tin kích cỡ, tồn kho và chất liệu minh bạch",
            },
            {
              icon: Truck,
              title: "Miễn phí giao từ 1.000.000 ₫",
              text: "Vận chuyển toàn quốc, theo dõi hành trình trực quan",
            },
            {
              icon: HeartHandshake,
              title: "Hỗ trợ đổi / trả thuận tiện",
              text: "Gửi yêu cầu đổi cỡ hoặc trả hàng ngay trên đơn mua",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sports Category Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Danh mục vận động
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Chọn theo môn thể thao
            </h2>
          </div>
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            <span>Xem tất cả môn</span>
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {mockMonTheThao.map((sport) => (
            <Link
              key={sport.id}
              href={`/sports/${sport.duongDanNgan}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-50/50 hover:shadow-sm sm:p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition group-hover:bg-white">
                <Dumbbell size={20} aria-hidden="true" />
              </span>
              <div className="mt-4">
                <p className="text-base font-semibold text-slate-900">
                  {sport.ten}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {sport._count?.sanPham ?? 0} sản phẩm
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <span>Khám phá</span>
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Được yêu thích nhất
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sản phẩm nổi bật
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            <span>Xem toàn bộ cửa hàng</span>
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotions + Sale Products */}
      {saleProducts.length > 0 && (
        <section className="border-y border-teal-100 bg-teal-50/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                  <Gift size={22} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Ưu đãi dành cho đơn hàng mới
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Nhập mã <strong className="rounded bg-amber-50 px-2 py-0.5 font-mono text-amber-900">NEWBIE50</strong> giảm ngay 50.000 ₫ hoặc <strong className="rounded bg-teal-50 px-2 py-0.5 font-mono text-primary">SPORTZONE10</strong> giảm 10% tại giỏ hàng (dữ liệu mẫu).
                  </p>
                </div>
              </div>
              <Link
                href="/cart"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <span>Đến giỏ hàng</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Tiết kiệm hơn mỗi ngày
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Sản phẩm đang khuyến mãi
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                <span>Xem thêm ưu đãi</span>
                <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands Showcase */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Chính hãng 100%
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Thương hiệu đồng hành
            </h2>
          </div>
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            <span>Tất cả thương hiệu</span>
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {mockThuongHieu.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${toBrandSlug(brand.ten)}`}
              className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-4 py-6 text-center shadow-xs transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
            >
              <span className="text-lg font-bold tracking-tight text-slate-800">
                {brand.ten}
              </span>
              <span className="mt-1 text-xs text-slate-600">
                {brand._count?.sanPham ?? 0} sản phẩm
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Cảm hứng tập luyện
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Góc kiến thức thể thao
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            <span>Đọc tất cả bài viết</span>
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {mockTinTuc.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.duongDanNgan}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                {article.anhBia && (
                  <Image
                    src={article.anhBia}
                    alt={article.tieuDe}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs text-slate-600">
                  {formatDate(article.ngayDang)} ·{" "}
                  {article.tacGia?.hoTen ?? "SportZone"}
                </p>
                <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary">
                  {article.tieuDe}
                </h3>
                <span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <span>Đọc chi tiết</span>
                  <ArrowRight size={15} className="shrink-0" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
