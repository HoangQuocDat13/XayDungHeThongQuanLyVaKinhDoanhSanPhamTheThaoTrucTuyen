"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Search, PackageSearch } from "lucide-react";
import type { SanPham } from "@/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "./product-card";

interface ProductListingProps {
  products: SanPham[];
  showSportFilter?: boolean;
  showBrandFilter?: boolean;
}

const ITEMS_PER_PAGE = 8;

function SearchParamSync({ onQueryChange }: { onQueryChange: (q: string) => void }) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  useEffect(() => {
    onQueryChange(urlQuery);
  }, [urlQuery, onQueryChange]);

  return null;
}

export function ProductListing({
  products,
  showSportFilter = true,
  showBrandFilter = true,
}: ProductListingProps) {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("");
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const sports = useMemo(
    () =>
      Array.from(
        new Map(
          products
            .filter((product) => product.monTheThao)
            .map((product) => [product.monTheThaoId, product.monTheThao!.ten])
        ),
        ([id, name]) => ({ value: id, label: name })
      ),
    [products]
  );

  const brands = useMemo(
    () =>
      Array.from(
        new Map(
          products
            .filter((product) => product.thuongHieu)
            .map((product) => [product.thuongHieuId, product.thuongHieu!.ten])
        ),
        ([id, name]) => ({ value: id, label: name })
      ),
    [products]
  );

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap(
            (product) => product.bienThe?.map((variant) => variant.kichCo) ?? []
          )
        )
      ),
    [products]
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap(
            (product) => product.bienThe?.map((variant) => variant.mauSac) ?? []
          )
        )
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    const result = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.ten} ${product.thuongHieu?.ten ?? ""} ${product.monTheThao?.ten ?? ""}`
          .toLocaleLowerCase("vi")
          .includes(normalizedQuery);
      const currentPrice = product.giaHienThi ?? product.bienThe?.[0]?.gia ?? 0;
      const matchesPrice =
        !priceRange ||
        (priceRange === "under-500" && currentPrice < 500_000) ||
        (priceRange === "500-2m" &&
          currentPrice >= 500_000 &&
          currentPrice <= 2_000_000) ||
        (priceRange === "over-2m" && currentPrice > 2_000_000);
      const matchesVariant =
        (!size || product.bienThe?.some((variant) => variant.kichCo === size)) &&
        (!color || product.bienThe?.some((variant) => variant.mauSac === color));
      return (
        matchesQuery &&
        (!sport || product.monTheThaoId === sport) &&
        (!brand || product.thuongHieuId === brand) &&
        matchesPrice &&
        matchesVariant
      );
    });

    if (sort === "price-asc") {
      result.sort(
        (a, b) =>
          (a.giaHienThi ?? a.bienThe?.[0]?.gia ?? 0) -
          (b.giaHienThi ?? b.bienThe?.[0]?.gia ?? 0)
      );
    } else if (sort === "price-desc") {
      result.sort(
        (a, b) =>
          (b.giaHienThi ?? b.bienThe?.[0]?.gia ?? 0) -
          (a.giaHienThi ?? a.bienThe?.[0]?.gia ?? 0)
      );
    } else if (sort === "rating") {
      result.sort(
        (a, b) => (b.soSaoTrungBinh ?? 0) - (a.soSaoTrungBinh ?? 0)
      );
    }

    return result;
  }, [brand, color, priceRange, products, query, size, sort, sport]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = Boolean(
    query.trim() || sport || brand || priceRange || size || color
  );

  const resetFilters = () => {
    setQuery("");
    setSport("");
    setBrand("");
    setPriceRange("");
    setSize("");
    setColor("");
    setSort("featured");
    setPage(1);
  };

  return (
    <div>
      <Suspense fallback={null}>
        <SearchParamSync
          onQueryChange={(nextQ) => {
            setQuery(nextQ);
            setPage(1);
          }}
        />
      </Suspense>

      {/* Filter panel */}
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <Input
              label="Từ khóa tìm kiếm"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm tên sản phẩm, thương hiệu, môn thể thao..."
              leftIcon={<Search size={18} />}
            />
          </div>

          <Select
            label="Khoảng giá"
            value={priceRange}
            onChange={(e) => {
              setPriceRange(e.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "Mọi mức giá" },
              { value: "under-500", label: "Dưới 500.000 ₫" },
              { value: "500-2m", label: "500.000 ₫ – 2.000.000 ₫" },
              { value: "over-2m", label: "Trên 2.000.000 ₫" },
            ]}
          />

          <Select
            label="Sắp xếp theo"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            options={[
              { value: "featured", label: "Nổi bật nhất" },
              { value: "price-asc", label: "Giá: Thấp đến cao" },
              { value: "price-desc", label: "Giá: Cao đến thấp" },
              { value: "rating", label: "Đánh giá cao nhất" },
            ]}
          />

          {showSportFilter && sports.length > 1 && (
            <Select
              label="Môn thể thao"
              value={sport}
              onChange={(e) => {
                setSport(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "Tất cả môn thể thao" },
                ...sports,
              ]}
            />
          )}

          {showBrandFilter && brands.length > 1 && (
            <Select
              label="Thương hiệu"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "Tất cả thương hiệu" },
                ...brands,
              ]}
            />
          )}

          {sizes.length > 1 && (
            <Select
              label="Kích cỡ"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "Mọi kích cỡ" },
                ...sizes.map((item) => ({ value: item, label: `Cỡ ${item}` })),
              ]}
            />
          )}

          {colors.length > 1 && (
            <Select
              label="Màu sắc"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "Mọi màu sắc" },
                ...colors.map((item) => ({ value: item, label: item })),
              ]}
            />
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-600" aria-live="polite">
            Tìm thấy <strong className="text-slate-900">{filteredProducts.length}</strong> sản phẩm phù hợp
          </p>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw size={15} />}
              onClick={resetFilters}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                  setPage(nextPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="Chưa tìm thấy sản phẩm phù hợp"
          description="Hãy thử tìm bằng từ khóa khác hoặc đặt lại bộ lọc để xem toàn bộ danh mục sản phẩm thể thao."
          action={
            hasActiveFilters ? (
              <Button
                variant="outline"
                leftIcon={<RotateCcw size={16} />}
                onClick={resetFilters}
              >
                Đặt lại tất cả bộ lọc
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
