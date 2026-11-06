import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Tag } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { mockThuongHieu } from "@/features/catalog/data/mock";

function brandSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BrandsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb items={[{ label: "Thương hiệu" }]} className="mb-4" />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Đối tác chính hãng
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Thương hiệu thể thao
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Khám phá các dòng giày, trang phục và phụ kiện chuyên dụng từ những thương hiệu uy tín hàng đầu.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3">
        {mockThuongHieu.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brandSlug(brand.ten)}`}
            className="group flex min-h-44 flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-xs transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-8"
          >
            {brand.anhLogo ? (
              <div className="relative h-16 w-full">
                <Image
                  src={brand.anhLogo}
                  alt={brand.ten}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                <Tag size={24} aria-hidden="true" />
              </span>
            )}
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              {brand.ten}
            </h2>
            <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 group-hover:text-primary">
              <span>{brand._count?.sanPham ?? 0} sản phẩm</span>
              <ArrowUpRight
                size={14}
                className="shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
