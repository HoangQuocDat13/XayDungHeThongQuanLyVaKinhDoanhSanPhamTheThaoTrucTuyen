import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductListing } from "@/features/catalog/components/product-listing";
import {
  getSanPhamByMonTheThao,
  mockMonTheThao,
} from "@/features/catalog/data/mock";

export default async function SportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sport = mockMonTheThao.find((item) => item.duongDanNgan === slug);
  if (!sport) notFound();
  const products = getSanPhamByMonTheThao(slug);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Môn thể thao", href: "/sports" },
          { label: sport.ten },
        ]}
        className="mb-4"
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Bộ môn thể thao
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {sport.ten}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Trang phục, giày và dụng cụ {sport.ten.toLowerCase()} được tuyển chọn cho buổi tập thoải mái, hiệu quả.
      </p>

      <div className="mt-8">
        <ProductListing products={products} showSportFilter={false} />
      </div>
    </section>
  );
}
