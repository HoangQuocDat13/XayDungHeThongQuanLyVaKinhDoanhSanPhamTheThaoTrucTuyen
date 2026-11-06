"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CircleDollarSign,
  ShoppingBag,
  UsersRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  mockDoanhThu7Ngay,
  mockDonTheoTrangThai,
  mockKpi,
  mockSanPhamBanChay,
} from "@/features/dashboard/data/mock";
import { mockDonHang } from "@/features/order/data/mock";
import {
  formatDate,
  formatVND,
  getTrangThaiDonLabel,
  getTrangThaiDonVariant,
} from "@/lib/utils";

const kpis = [
  {
    label: "Doanh thu hôm nay",
    value: formatVND(mockKpi.doanhThuHomNay),
    change: mockKpi.doanhThuHomNayTangTruong,
    icon: CircleDollarSign,
    tone: "bg-primary-50 text-primary",
  },
  {
    label: "Đơn hàng mới",
    value: String(mockKpi.donHangMoi),
    change: mockKpi.donHangMoiTangTruong,
    icon: ShoppingBag,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    label: "Khách hàng mới",
    value: String(mockKpi.khachHangMoi),
    change: mockKpi.khachHangMoiTangTruong,
    icon: UsersRound,
    tone: "bg-violet-50 text-violet-700",
  },
  {
    label: "Sản phẩm hết hàng",
    value: String(mockKpi.sanPhamHetHang),
    change: null,
    icon: AlertTriangle,
    tone: "bg-amber-50 text-amber-800",
  },
];

export default function AdminDashboardPage() {
  const latestOrders = [...mockDonHang].sort(
    (a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-600">
            Theo dõi nhanh hiệu quả vận hành cửa hàng trong ngày.
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Tổng quan kinh doanh
          </h2>
        </div>
        <Badge variant="warning">Dữ liệu minh họa</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, change, icon: Icon, tone }) => (
          <Card key={label} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-600">{label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {value}
              </p>
              {change !== null ? (
                <p
                  className={`mt-2 text-xs font-medium ${
                    change >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {change >= 0 ? "+" : ""}
                  {change}% so với hôm qua
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  Cần kiểm tra bổ sung tồn kho
                </p>
              )}
            </div>
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}
            >
              <Icon size={22} aria-hidden="true" />
            </span>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Doanh thu 7 ngày gần nhất
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Đơn vị tiền tệ: Đồng Việt Nam (₫)
              </p>
            </div>
            <Link
              href="/admin/statistics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Báo cáo chi tiết</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockDoanhThu7Ngay}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="ngay"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#475569" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#475569" }}
                  tickFormatter={(value: number) => `${value / 1_000_000}tr`}
                />
                <Tooltip
                  formatter={(value) => [formatVND(Number(value)), "Doanh thu"]}
                  labelFormatter={(label) => `Ngày ${label}`}
                />
                <Bar
                  dataKey="doanhThu"
                  name="Doanh thu"
                  fill="#0f766e"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-4 flex flex-col">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tỷ trọng trạng thái đơn
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Phân bổ toàn bộ đơn hàng
            </p>
          </div>
          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockDonTheoTrangThai}
                  dataKey="soLuong"
                  nameKey="trangThai"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {mockDonTheoTrangThai.map((item) => (
                    <Cell key={item.trangThai} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} đơn`, "Số lượng"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">
            {mockDonTheoTrangThai.map((item) => (
              <div
                key={item.trangThai}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="flex items-center gap-2 text-slate-700">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.trangThai}
                </span>
                <span className="font-semibold text-slate-900">
                  {item.soLuong} đơn
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tables Summary */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <h3 className="text-base font-bold text-slate-900">
              Đơn hàng mới nhất
            </h3>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {latestOrders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {order.maDonHang}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {order.tenNguoiNhan} · {formatDate(order.ngayTao)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900">
                    {formatVND(order.thanhTien)}
                  </span>
                  <Badge
                    variant={getTrangThaiDonVariant(order.trangThai)}
                    size="sm"
                  >
                    {getTrangThaiDonLabel(order.trangThai)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <h3 className="text-base font-bold text-slate-900">
              Sản phẩm bán chạy
            </h3>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Quản lý kho</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {mockSanPhamBanChay.slice(0, 4).map((product, index) => (
              <div
                key={product.ten}
                className="flex items-center gap-4 px-6 py-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {product.ten}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Đã bán {product.soLuong} sản phẩm
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-slate-900">
                  {formatVND(product.doanhThu)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <p className="text-center text-xs text-slate-500">
        Các số liệu và biểu đồ trên được tổng hợp từ dữ liệu mẫu phục vụ giao diện quản trị.
      </p>
    </div>
  );
}
