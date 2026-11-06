import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { mockTinTuc, getTinTucBySlug } from "@/features/news/data/mock";
import { formatDate } from "@/lib/utils";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getTinTucBySlug(slug);
  if (!article) notFound();
  const related = mockTinTuc.filter((item) => item.id !== article.id).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Tin tức", href: "/news" },
          { label: article.tieuDe },
        ]}
        className="mb-6"
      />

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs">
        <header className="border-b border-slate-100 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Góc kiến thức thể thao
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {article.tieuDe}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <Avatar
              src={article.tacGia?.anhDaiDien}
              name={article.tacGia?.hoTen ?? "SportZone"}
              size="sm"
            />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900">
                {article.tacGia?.hoTen ?? "Ban biên tập SportZone"}
              </span>{" "}
              · Đăng ngày {formatDate(article.ngayDang)}
            </div>
          </div>
        </header>

        {article.anhBia && (
          <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={article.anhBia}
              alt={article.tieuDe}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose mx-auto"
          dangerouslySetInnerHTML={{ __html: article.noiDung }}
        />
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">
            Bài viết cùng chuyên mục
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/news/${item.duongDanNgan}`}
                  className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-primary/30 hover:shadow-sm"
                >
                  <div>
                    <p className="text-xs text-slate-500">
                      {formatDate(item.ngayDang)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                      {item.tieuDe}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <span>Đọc tiếp</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-center text-xs text-slate-500">
        Nội dung bài viết hiện là dữ liệu mẫu minh họa, chưa kết nối API.
      </p>
    </article>
  );
}
