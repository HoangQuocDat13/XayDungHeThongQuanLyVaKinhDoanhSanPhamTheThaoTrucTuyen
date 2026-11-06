import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ReturnRequestForm } from "@/features/order/components/return-request-form";
import { mockDonHang } from "@/features/order/data/mock";

export default async function NewReturnPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = mockDonHang.find((item) => item.id === orderId);
  if (!order || order.trangThai !== "HOAN_THANH") notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Đơn hàng của tôi", href: "/orders" },
          { label: order.maDonHang, href: `/orders/${order.id}` },
          { label: "Tạo yêu cầu đổi / trả" },
        ]}
        className="mb-4"
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Hỗ trợ sau mua
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Tạo yêu cầu đổi / trả hàng
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Chọn sản phẩm cần hỗ trợ từ đơn <strong>{order.maDonHang}</strong>, số lượng, hình thức đổi sang biến thể mới hoặc trả hàng hoàn tiền.
      </p>

      <ReturnRequestForm order={order} />

      <p className="mt-6 text-center text-xs text-slate-500">
        Dữ liệu đơn hàng và danh sách biến thể đang sử dụng dữ liệu mẫu giao diện.
      </p>
    </section>
  );
}
