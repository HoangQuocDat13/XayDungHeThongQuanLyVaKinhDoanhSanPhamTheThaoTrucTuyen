import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[75vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        <Compass size={32} aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Mã lỗi 404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Không tìm thấy trang bạn yêu cầu
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
        Đường dẫn có thể đã thay đổi hoặc sản phẩm hiện không còn hiển thị. Hãy quay về trang chủ hoặc khám phá danh mục sản phẩm thể thao.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <Home size={17} aria-hidden="true" />
          <span>Về trang chủ</span>
        </Link>
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Xem sản phẩm</span>
        </Link>
      </div>
    </main>
  );
}
