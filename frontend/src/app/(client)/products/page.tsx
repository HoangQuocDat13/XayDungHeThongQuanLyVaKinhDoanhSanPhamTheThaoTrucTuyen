import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductListing } from "@/features/catalog/components/product-listing";
import { mockSanPham } from "@/features/catalog/data/mock";

export default function ProductsPage() {
  const visibleProducts = mockSanPham.filter((product) => product.anHien);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb items={[{ label: "Sản phẩm" }]} className="mb-4" />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Danh mục cửa hàng
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Tất cả sản phẩm thể thao
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Lọc nhanh theo môn thể thao, thương hiệu, kích cỡ, màu sắc và mức giá phù hợp với nhu cầu luyện tập của bạn.
      </p>

      <div className="mt-8">
        <ProductListing products={visibleProducts} />
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Dữ liệu sản phẩm hiện là dữ liệu mẫu phục vụ giao diện, chưa kết nối API máy chủ.
      </p>
    </section>
  );
}
