"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Star,
  Trash2,
  UserCheck,
  UserRound,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { StarRating } from "@/components/ui/star-rating";
import { DEMO_ACCOUNTS, useAuthStore } from "@/features/auth/store/auth-store";
import { mockSanPham } from "@/features/catalog/data/mock";
import { mockDanhGia } from "@/features/order/data/mock";
import {
  cn,
  formatDate,
  formatDiaChi,
  getVaiTroLabel,
} from "@/lib/utils";
import type { DiaChi, GioiTinh } from "@/types";

type ProfileTab = "profile" | "addresses" | "reviews" | "security";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const updateAddresses = useAuthStore((state) => state.updateAddresses);

  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [name, setName] = useState(user?.hoTen ?? "");
  const [phone, setPhone] = useState(user?.nguoiDung?.soDienThoai ?? "");
  const [gender, setGender] = useState<GioiTinh | "">(
    user?.nguoiDung?.gioiTinh ?? ""
  );
  const [height, setHeight] = useState(
    user?.nguoiDung?.chieuCao?.toString() ?? ""
  );
  const [weight, setWeight] = useState(
    user?.nguoiDung?.canNang?.toString() ?? ""
  );

  // Address Modal state
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [deleteAddrId, setDeleteAddrId] = useState<string | null>(null);
  const [newReceiver, setNewReceiver] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newWard, setNewWard] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newCity, setNewCity] = useState("TP. Hồ Chí Minh");
  const [newDefault, setNewDefault] = useState(false);

  useEffect(() => {
    setName(user?.hoTen ?? "");
    setPhone(user?.nguoiDung?.soDienThoai ?? "");
    setGender(user?.nguoiDung?.gioiTinh ?? "");
    setHeight(user?.nguoiDung?.chieuCao?.toString() ?? "");
    setWeight(user?.nguoiDung?.canNang?.toString() ?? "");
  }, [user]);

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      toast.error("Họ và tên không được để trống.");
      return;
    }
    updateProfile({
      hoTen: name.trim(),
      nguoiDung: {
        id: user.nguoiDung?.id ?? `nd-${user.id}`,
        taiKhoanId: user.id,
        hoTen: name.trim(),
        soDienThoai: phone.trim() || null,
        anhDaiDien: user.anhDaiDien ?? null,
        gioiTinh: gender || null,
        chieuCao: height ? Number(height) : null,
        canNang: weight ? Number(weight) : null,
        ngayTao: user.nguoiDung?.ngayTao ?? new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
        diaChi: user.nguoiDung?.diaChi ?? [],
      },
    });
    toast.success("Đã lưu thông tin hồ sơ trên trình duyệt.");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (
      !newReceiver.trim() ||
      !newPhone.trim() ||
      !newStreet.trim() ||
      !newWard.trim() ||
      !newDistrict.trim() ||
      !newCity.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng.");
      return;
    }
    const currentList = user.nguoiDung?.diaChi ?? [];
    const shouldBeDefault = newDefault || currentList.length === 0;
    const created: DiaChi = {
      id: `dc-${Date.now()}`,
      nguoiDungId: user.nguoiDung?.id ?? "nd-1",
      tenNguoiNhan: newReceiver.trim(),
      soDienThoai: newPhone.trim(),
      duong: newStreet.trim(),
      phuong: newWard.trim(),
      quan: newDistrict.trim(),
      thanhPho: newCity.trim(),
      macDinh: shouldBeDefault,
    };
    const updatedList = shouldBeDefault
      ? [...currentList.map((a) => ({ ...a, macDinh: false })), created]
      : [...currentList, created];

    updateAddresses(updatedList);
    setAddrModalOpen(false);
    setNewReceiver("");
    setNewPhone("");
    setNewStreet("");
    setNewWard("");
    setNewDistrict("");
    setNewDefault(false);
    toast.success("Đã thêm địa chỉ nhận hàng mới.");
  };

  const handleSetDefaultAddress = (id: string) => {
    const currentList = user?.nguoiDung?.diaChi ?? [];
    updateAddresses(
      currentList.map((a) => ({ ...a, macDinh: a.id === id }))
    );
    toast.success("Đã cập nhật địa chỉ mặc định.");
  };

  const handleDeleteAddress = () => {
    if (!deleteAddrId) return;
    const currentList = user?.nguoiDung?.diaChi ?? [];
    updateAddresses(currentList.filter((a) => a.id !== deleteAddrId));
    setDeleteAddrId(null);
    toast.info("Đã xóa địa chỉ nhận hàng.");
  };

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <EmptyState
          icon={UserRound}
          title="Đăng nhập để quản lý hồ sơ của bạn"
          description="Lưu thông tin cá nhân, chiều cao/cân nặng gợi ý kích cỡ, sổ địa chỉ nhận hàng và theo dõi đơn mua thuận tiện."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <span>Đi đến trang đăng nhập</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Button
                variant="outline"
                leftIcon={<UserCheck size={16} />}
                onClick={() => {
                  login(DEMO_ACCOUNTS[0]);
                  toast.success("Đã đăng nhập nhanh tài khoản khách hàng mẫu!");
                }}
              >
                Dùng thử tài khoản mẫu
              </Button>
            </div>
          }
        />
      </section>
    );
  }

  const addresses = user.nguoiDung?.diaChi ?? [];
  const tabs: { id: ProfileTab; label: string; icon: typeof UserRound }[] = [
    { id: "profile", label: "Thông tin cá nhân", icon: UserRound },
    { id: "addresses", label: "Sổ địa chỉ", icon: MapPin },
    { id: "reviews", label: "Đánh giá sản phẩm", icon: Star },
    { id: "security", label: "Tài khoản & Bảo mật", icon: ShieldCheck },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb items={[{ label: "Hồ sơ tài khoản" }]} className="mb-4" />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Không gian cá nhân
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Hồ sơ & Sổ địa chỉ
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 h-fit rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Avatar src={user.anhDaiDien} name={user.hoTen} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {user.hoTen}
              </p>
              <p className="truncate text-xs text-slate-600">{user.email}</p>
              <Badge size="sm" variant="primary" className="mt-1.5">
                {getVaiTroLabel(user.vaiTro)}
              </Badge>
            </div>
          </div>

          <nav
            className="mt-4 space-y-1"
            aria-label="Điều hướng hồ sơ người dùng"
          >
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-current={activeTab === id ? "page" : undefined}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  activeTab === id
                    ? "bg-primary-50 text-primary font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={17} className="shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}

            <div className="my-2 border-t border-slate-100 pt-2">
              <Link
                href="/orders"
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
              >
                <Package size={17} className="shrink-0" aria-hidden="true" />
                <span>Đơn hàng của tôi</span>
              </Link>
              <Link
                href="/returns"
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
              >
                <RefreshCw size={17} className="shrink-0" aria-hidden="true" />
                <span>Yêu cầu đổi / trả</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Tab Content */}
        <div className="lg:col-span-9 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          {activeTab === "profile" && (
            <form onSubmit={saveProfile} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Thông tin cá nhân & Chỉ số thể chất
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Thông tin chiều cao, cân nặng là tùy chọn giúp gợi ý kích cỡ quần áo, giày thể thao chuẩn xác hơn.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Địa chỉ email"
                  value={user.email}
                  readOnly
                  hint="Email đăng nhập cố định theo tài khoản."
                />
                <Input
                  label="Số điện thoại"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                />
                <Select
                  label="Giới tính (tùy chọn)"
                  value={gender}
                  onChange={(e) => {
                    const v = e.target.value;
                    setGender(v === "NAM" || v === "NU" ? v : "");
                  }}
                  options={[
                    { value: "", label: "Chưa chọn" },
                    { value: "NAM", label: "Nam" },
                    { value: "NU", label: "Nữ" },
                  ]}
                />
                <Input
                  label="Chiều cao (cm – tùy chọn)"
                  type="number"
                  min={80}
                  max={250}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ví dụ: 172"
                />
                <Input
                  label="Cân nặng (kg – tùy chọn)"
                  type="number"
                  min={20}
                  max={250}
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ví dụ: 65"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button type="submit">Lưu cập nhật</Button>
                <span className="text-xs text-slate-500">
                  Lưu trên bộ nhớ trình duyệt hiện tại
                </span>
              </div>
            </form>
          )}

          {activeTab === "addresses" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Sổ địa chỉ nhận hàng ({addresses.length})
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Quản lý các địa chỉ giao hàng để thanh toán nhanh chóng hơn.
                  </p>
                </div>
                <Button
                  leftIcon={<Plus size={16} />}
                  onClick={() => {
                    setNewReceiver(user.hoTen);
                    setNewPhone(user.nguoiDung?.soDienThoai ?? "");
                    setAddrModalOpen(true);
                  }}
                >
                  Thêm địa chỉ mới
                </Button>
              </div>

              {addresses.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {addresses.map((address) => (
                    <article
                      key={address.id}
                      className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4 sm:p-6"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">
                            {address.tenNguoiNhan}
                          </p>
                          <span className="text-slate-300">|</span>
                          <p className="text-sm text-slate-700">
                            {address.soDienThoai}
                          </p>
                          {address.macDinh && (
                            <Badge size="sm" variant="primary">
                              Mặc định
                            </Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {formatDiaChi(
                            address.duong,
                            address.phuong,
                            address.quan,
                            address.thanhPho
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!address.macDinh && (
                          <Button
                            variant="outline"
                            size="xs"
                            leftIcon={<CheckCircle2 size={14} />}
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Đặt mặc định
                          </Button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteAddrId(address.id)}
                          aria-label={`Xóa địa chỉ của ${address.tenNguoiNhan}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-red-50 hover:text-danger transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    icon={MapPin}
                    title="Chưa có địa chỉ nhận hàng nào"
                    description="Thêm địa chỉ giao hàng mặc định để tiết kiệm thời gian khi đặt đơn."
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Đánh giá sản phẩm đã gửi
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Lịch sử nhận xét của khách hàng (dữ liệu minh họa).
              </p>

              <div className="mt-6 space-y-4">
                {mockDanhGia.slice(0, 3).map((review) => {
                  const prod = mockSanPham.find(
                    (p) => p.id === review.sanPhamId
                  );
                  return (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-slate-200 p-4 sm:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {prod ? (
                          <Link
                            href={`/products/${prod.duongDanNgan}`}
                            className="text-sm font-bold text-primary hover:underline"
                          >
                            {prod.ten}
                          </Link>
                        ) : (
                          <span className="text-sm font-bold text-slate-900">
                            Sản phẩm thể thao
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          {formatDate(review.ngayTao)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <StarRating value={review.soSao} size="sm" />
                      </div>
                      {review.binhLuan && (
                        <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                          {review.binhLuan}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Thông tin đăng nhập & Bảo mật
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Quản lý phương thức xác thực tài khoản của bạn.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">
                  Vai trò tài khoản
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {getVaiTroLabel(user.vaiTro)} ({user.email})
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">
                  Đổi mật khẩu định kỳ
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Chức năng cập nhật mật khẩu trực tiếp sẽ được kích hoạt ngay khi kết nối dịch vụ xác thực phía máy chủ.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        open={addrModalOpen}
        onClose={() => setAddrModalOpen(false)}
        title="Thêm địa chỉ nhận hàng mới"
        description="Điền đầy đủ thông tin người nhận để giao hàng chính xác."
      >
        <form id="add-address-form" onSubmit={handleAddAddress} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Họ và tên người nhận"
              required
              value={newReceiver}
              onChange={(e) => setNewReceiver(e.target.value)}
            />
            <Input
              label="Số điện thoại"
              type="tel"
              required
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>
          <Input
            label="Số nhà, tên đường"
            required
            value={newStreet}
            onChange={(e) => setNewStreet(e.target.value)}
            placeholder="Ví dụ: 123 Nguyễn Trãi"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phường / Xã"
              required
              value={newWard}
              onChange={(e) => setNewWard(e.target.value)}
              placeholder="Phường 2"
            />
            <Input
              label="Quận / Huyện"
              required
              value={newDistrict}
              onChange={(e) => setNewDistrict(e.target.value)}
              placeholder="Quận 5"
            />
          </div>
          <Input
            label="Tỉnh / Thành phố"
            required
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
          />
          <Checkbox
            label="Đặt làm địa chỉ nhận hàng mặc định"
            checked={newDefault}
            onChange={(e) => setNewDefault(e.target.checked)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAddrModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Lưu địa chỉ</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteAddrId)}
        onClose={() => setDeleteAddrId(null)}
        onConfirm={handleDeleteAddress}
        title="Xóa địa chỉ nhận hàng?"
        description="Địa chỉ này sẽ bị gỡ khỏi sổ địa chỉ trên trình duyệt của bạn."
      />
    </section>
  );
}
