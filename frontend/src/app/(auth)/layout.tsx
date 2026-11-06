import Link from "next/link";
import { Dumbbell, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-teal-50/80 via-slate-50 to-white px-4 py-12 sm:px-6"
    >
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex w-full items-center justify-center gap-2 text-2xl font-bold text-primary tracking-tight"
        >
          <Dumbbell size={26} aria-hidden="true" className="shrink-0" />
          <span>SportZone</span>
        </Link>
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
          {children}
        </section>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
          <ShieldCheck size={15} aria-hidden="true" className="shrink-0 text-primary" />
          <span>Thông tin tài khoản được bảo mật an toàn</span>
        </p>
      </div>
    </main>
  );
}
