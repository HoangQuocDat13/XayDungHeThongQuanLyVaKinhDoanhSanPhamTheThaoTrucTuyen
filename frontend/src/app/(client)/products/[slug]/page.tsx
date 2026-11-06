import { notFound } from "next/navigation";
import { ProductDetail } from "@/features/catalog/components/product-detail";
import {
  getSanPhamBySlug,
  getSanPhamLienQuan,
} from "@/features/catalog/data/mock";
import { getDanhGiaByProduct } from "@/features/order/data/mock";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getSanPhamBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <ProductDetail
        product={product}
        relatedProducts={getSanPhamLienQuan(product.id, product.monTheThaoId)}
        reviews={getDanhGiaByProduct(product.id)}
      />
      <p className="mx-auto max-w-7xl px-4 pb-12 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        Thông tin sản phẩm và đánh giá đang hiển thị từ bộ dữ liệu mẫu giao diện.
      </p>
    </>
  );
}
