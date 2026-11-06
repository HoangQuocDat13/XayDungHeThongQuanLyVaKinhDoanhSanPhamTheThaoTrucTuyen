"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import {
  mockDonTheoTrangThai,
  mockSanPhamBanChay,
} from "@/features/dashboard/data/mock";
import { formatVND } from "@/lib/utils";

type Range = "7" | "30" | "90";

function createRevenueData(days: number) {
  const endDate = new Date("2026-11-04T12:00:00");
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (days - index - 1));
    const base = 7_500_000 + ((index * 7_319_337 + 4_205_000) % 21_000_000);
    return {
      ngay: `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,
      doanhThu: base,
      donHang: 5 + ((index * 13 + 3) % 19),
    };
  });
}

export default function AdminStatisticsPage() {
  const [range, setRange] = useState<Range>("7");
  const numericDays = Number(range);
  const revenue = useMemo(() => createRevenueData(numericDays), [numericDays]);
  const totalRevenue = revenue.reduce((sum, item) => sum + item.doanhThu, 0);
  const totalOrders = revenue.reduce((sum, item) => sum + item.donHang, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Thống kê doanh thu & sản lượng
            </h2>
            <Badge variant="warning" size="sm">
              Dữ liệu mẫu
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Phân tích biến động doanh thu, số lượng đơn hàng và danh mục bán chạy theo kỳ.
          </p>
        </div>

        <Tabs
          variant="pills"
          activeKey={range}
          onChange={(k) => setRange(k as Range)}
          ariaLabel="Chọn khoảng thời gian thống kê"
          items={[
            { key: "7", label: "7 ngày qua" },
            { key: "30", label: "30 ngày qua" },
            { key: "90", label: "90 ngày qua" },
          ]}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-slate-600">
            Tổng doanh thu trong kỳ ({numericDays} ngày)
          </p>
          <p className="mt-2 text-2xl font-bold text-primary">
            {formatVND(totalRevenue)}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-600">
            Tổng số đơn phát sinh
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalOrders.toLocaleString("vi-VN")} đơn
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-600">
            Giá trị trung bình mỗi đơn
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatVND(totalOrders ? Math.round(totalRevenue / totalOrders) : 0)}
          </p>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-base font-bold text-slate-900">
            Biểu đồ doanh thu theo ngày
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Đơn vị: Đồng Việt Nam (₫)
          </p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenue}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="ngay"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#475569" }}
                  interval={
                    numericDays === 7 ? 0 : numericDays === 30 ? 4 : 13
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#475569" }}
                  tickFormatter={(value: number) => `${value / 1_000_000}tr`}
                />
                <Tooltip
                  formatter={(value) => [formatVND(Number(value)), "Doanh thu"]}
                  labelFormatter={(label) => `Ngày ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="doanhThu"
                  name="Doanh thu"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-bold text-slate-900">
            Số lượng đơn theo trạng thái xử lý
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Đơn vị: Đơn hàng
          </p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockDonTheoTrangThai}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#475569" }}
                />
                <YAxis
                  type="category"
                  dataKey="trangThai"
                  width={120}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#334155" }}
                />
                <Tooltip formatter={(v) => [`${v} đơn`, "Số lượng"]} />
                <Bar
                  dataKey="soLuong"
                  name="Số đơn"
                  fill="#0f766e"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-base font-bold text-slate-900">
          Top sản phẩm mang lại doanh thu cao nhất
        </h3>
        <p className="mt-1 text-xs text-slate-600">
          So sánh sản lượng bán ra giữa các dòng sản phẩm chủ lực
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockSanPhamBanChay}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#475569" }}
              />
              <YAxis
                type="category"
                dataKey="ten"
                width={176}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#334155" }}
              />
              <Tooltip formatter={(v) => [`${v} sản phẩm`, "Đã bán"]} />
              <Bar
                dataKey="soLuong"
                name="Đã bán"
                fill="#d97706"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
