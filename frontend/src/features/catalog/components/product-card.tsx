import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { SanPham } from "@/types";
import { formatVND } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: SanPham }) {
  const displayPrice = product.giaHienThi ?? product.bienThe?.[0]?.gia ?? 0;
  const isOnSale =
    product.giaGoc !== undefined &&
    product.giaGoc > displayPrice &&
    (product.phanTramGiam ?? 0) > 0;
  const totalStock =
    product.bienThe?.reduce((sum, v) => sum + v.soLuongTon, 0) ?? 1;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-4">
      <Link
        href={`/products/${product.duongDanNgan}`}
        className="relative block aspect-square overflow-hidden rounded-xl bg-slate-100"
      >
        {product.anhDaiDien ? (
          <Image
            src={product.anhDaiDien}
            alt={product.ten}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-slate-500">
            Chưa có hình ảnh
          </div>
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {isOnSale && (
            <Badge variant="danger" size="sm">
              -{product.phanTramGiam}%
            </Badge>
          )}
          {totalStock <= 0 && (
            <Badge variant="muted" size="sm">
              Tạm hết hàng
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
          <span className="truncate font-medium">
            {product.thuongHieu?.ten ?? "SportZone"}
          </span>
          {product.monTheThao?.ten && (
            <span className="truncate text-slate-500">
              {product.monTheThao.ten}
            </span>
          )}
        </div>

        <Link
          href={`/products/${product.duongDanNgan}`}
          className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary sm:text-base"
        >
          {product.ten}
        </Link>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-1.5 text-xs">
            <Star
              size={14}
              className="shrink-0 fill-amber-500 text-amber-500"
              aria-hidden="true"
            />
            <span className="font-semibold text-slate-800">
              {(product.soSaoTrungBinh ?? 0).toFixed(1)}
            </span>
            <span className="text-slate-500">
              ({product.tongDanhGia ?? 0} đánh giá)
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 sm:text-lg">
              {formatVND(displayPrice)}
            </span>
            {isOnSale && product.giaGoc && (
              <span className="text-xs text-slate-500 line-through">
                {formatVND(product.giaGoc)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
