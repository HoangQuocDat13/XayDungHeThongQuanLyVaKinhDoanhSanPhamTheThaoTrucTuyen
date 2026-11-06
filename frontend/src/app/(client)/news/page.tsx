import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { mockTinTuc } from "@/features/news/data/mock";
import { formatDate } from "@/lib/utils";

export default function NewsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb items={[{ label: "Tin tức" }]} className="mb-4" />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Cẩm nang vận động
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Tin tức & kiến thức thể thao
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Mẹo luyện tập an toàn, hướng dẫn chọn trang bị phù hợp và dinh dưỡng thể thao mỗi tuần.
      </p>

      {mockTinTuc.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockTinTuc.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <Link
                href={`/news/${article.duongDanNgan}`}
                className="relative block aspect-[16/10] bg-slate-100 overflow-hidden"
              >
                {article.anhBia && (
                  <Image
                    src={article.anhBia}
                    alt={article.tieuDe}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs text-slate-600">
                  {formatDate(article.ngayDang)} ·{" "}
                  {article.tacGia?.hoTen ?? "SportZone"}
                </p>
                <Link href={`/news/${article.duongDanNgan}`}>
                  <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary">
                    {article.tieuDe}
                  </h2>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {article.noiDung
                    .replace(/<[^>]*>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()}
                </p>
                <Link
                  href={`/news/${article.duongDanNgan}`}
                  className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  <span>Đọc bài viết</span>
                  <ArrowRight size={15} className="shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={Newspaper}
            title="Chưa có bài viết nào"
            description="Các bài viết chia sẻ kinh nghiệm thể thao sẽ sớm được cập nhật tại đây."
          />
        </div>
      )}

      <p className="mt-8 text-center text-xs text-slate-500">
        Bài viết đang hiển thị từ dữ liệu mẫu minh họa, chưa kết nối API.
      </p>
    </section>
  );
}
