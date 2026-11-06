import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductListing } from "@/features/catalog/components/product-listing";
import {
  getSanPhamByThuongHieu,
  mockThuongHieu,
} from "@/features/catalog/data/mock";

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = mockThuongHieu.find((item) => toSlug(item.ten) === slug);
  if (!brand) notFound();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Thương hiệu", href: "/brands" },
          { label: brand.ten },
        ]}
        className="mb-4"
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Thương hiệu chính hãng
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {brand.ten}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Tuyển tập sản phẩm {brand.ten} chính hãng phù hợp cho luyện tập hằng ngày và thi đấu phong trào.
      </p>

      <div className="mt-8">
        <ProductListing
          products={getSanPhamByThuongHieu(brand.id)}
          showBrandFilter={false}
        />
      </div>
    </section>
  );
}
