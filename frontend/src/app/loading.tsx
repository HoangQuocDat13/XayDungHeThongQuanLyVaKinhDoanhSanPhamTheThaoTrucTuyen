import { PageSpinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main
      className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
      aria-live="polite"
      aria-busy="true"
    >
      <PageSpinner label="Đang tải nội dung, vui lòng đợi trong giây lát..." />
    </main>
  );
}
