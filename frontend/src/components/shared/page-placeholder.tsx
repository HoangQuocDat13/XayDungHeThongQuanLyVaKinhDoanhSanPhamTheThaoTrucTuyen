type PagePlaceholderProps = {
  title: string;
  description?: string;
};

export function PagePlaceholder({
  title,
  description = "Trang này sẽ được triển khai trong các bước tiếp theo.",
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-sm text-gray-600">{description}</p>
    </section>
  );
}
