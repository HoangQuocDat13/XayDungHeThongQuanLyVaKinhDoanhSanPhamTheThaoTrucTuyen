import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { mockMonTheThao } from "@/features/catalog/data/mock";

export default function SportsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb items={[{ label: "Môn thể thao" }]} className="mb-4" />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Phân loại theo bộ môn
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Môn thể thao
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Chọn bộ môn bạn yêu thích để xem ngay trang phục, giày dép và dụng cụ chuyên biệt.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockMonTheThao.map((sport, index) => (
          <Link
            key={sport.id}
            href={`/sports/${sport.duongDanNgan}`}
            className="group flex min-h-44 flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  index % 2
                    ? "bg-amber-50 text-amber-800"
                    : "bg-primary-50 text-primary"
                }`}
              >
                <Dumbbell size={22} aria-hidden="true" />
              </span>
              <ArrowRight
                size={18}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-primary"
                aria-hidden="true"
              />
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-bold text-slate-900">{sport.ten}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {sport._count?.sanPham ?? 0} sản phẩm sẵn sàng khám phá
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
