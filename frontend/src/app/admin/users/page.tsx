"use client";

import { useMemo, useState } from "react";
import { Eye, Lock, Unlock } from "lucide-react";
import { toast } from "react-toastify";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import {
  AdminDataTable,
  type AdminTableRow,
} from "@/components/admin/data-table";
import {
  mockAdminUsers,
  type AdminUser,
} from "@/features/dashboard/data/mock";
import { formatDate, getVaiTroLabel, getVaiTroVariant } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [togglingUser, setTogglingUser] = useState<AdminUser | null>(null);

  const handleConfirmToggle = () => {
    if (!togglingUser) return;
    const nextState = !togglingUser.trangThai;
    setUsers((current) =>
      current.map((item) =>
        item.id === togglingUser.id ? { ...item, trangThai: nextState } : item
      )
    );
    toast.success(
      `Đã ${nextState ? "mở khóa" : "khóa"} tài khoản ${togglingUser.hoTen} (xem trước).`
    );
    setTogglingUser(null);
  };

  const rows = useMemo<AdminTableRow[]>(
    () =>
      users
        .filter((user) => roleFilter === "ALL" || user.vaiTro === roleFilter)
        .filter(
          (user) =>
            statusFilter === "ALL" ||
            (statusFilter === "ACTIVE" ? user.trangThai : !user.trangThai)
        )
        .map((user) => ({
          id: user.id,
          searchable: `${user.hoTen} ${user.email} ${user.soDienThoai ?? ""} ${getVaiTroLabel(user.vaiTro)}`,
          cells: [
            <div key="user" className="flex items-center gap-3 min-w-0">
              <Avatar src={user.anhDaiDien} name={user.hoTen} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {user.hoTen}
                </p>
                <p className="truncate text-xs text-slate-600">{user.email}</p>
              </div>
            </div>,
            <Badge key="role" variant={getVaiTroVariant(user.vaiTro)}>
              {getVaiTroLabel(user.vaiTro)}
            </Badge>,
            <Badge
              key="status"
              variant={user.trangThai ? "success" : "danger"}
              dot
            >
              {user.trangThai ? "Đang hoạt động" : "Đang bị khóa"}
            </Badge>,
            <span key="created" className="text-slate-600">
              {formatDate(user.ngayTao)}
            </span>,
            <div key="actions" className="flex flex-wrap items-center gap-2">
              <Button
                size="xs"
                variant="secondary"
                leftIcon={<Eye size={14} />}
                onClick={() => setViewingUser(user)}
              >
                Hồ sơ
              </Button>
              <Button
                size="xs"
                variant={user.trangThai ? "outline" : "primary"}
                leftIcon={
                  user.trangThai ? <Lock size={14} /> : <Unlock size={14} />
                }
                onClick={() => setTogglingUser(user)}
              >
                {user.trangThai ? "Khóa" : "Mở khóa"}
              </Button>
            </div>,
          ],
        })),
    [roleFilter, statusFilter, users]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Tài khoản & Người dùng
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Tra cứu hồ sơ, lọc theo vai trò và khóa/mở khóa tài khoản truy cập.
          </p>
        </div>
        <Badge variant="warning">Dữ liệu minh họa</Badge>
      </div>

      <AdminDataTable
        columns={[
          "Người dùng",
          "Vai trò",
          "Trạng thái",
          "Ngày đăng ký",
          "Thao tác",
        ]}
        rows={rows}
        searchPlaceholder="Tìm theo họ tên, email hoặc số điện thoại..."
        toolbar={
          <>
            <Select
              aria-label="Lọc theo vai trò"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Mọi vai trò" },
                { value: "QUAN_TRI_VIEN", label: "Quản trị viên" },
                { value: "NHAN_VIEN", label: "Nhân viên" },
                { value: "KHACH_HANG", label: "Khách hàng" },
              ]}
            />
            <Select
              aria-label="Lọc theo trạng thái tài khoản"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Mọi trạng thái" },
                { value: "ACTIVE", label: "Đang hoạt động" },
                { value: "LOCKED", label: "Đang bị khóa" },
              ]}
            />
          </>
        }
      />

      {/* Profile Modal */}
      <Modal
        open={Boolean(viewingUser)}
        onClose={() => setViewingUser(null)}
        title="Chi tiết hồ sơ người dùng"
        footer={
          <Button variant="secondary" onClick={() => setViewingUser(null)}>
            Đóng
          </Button>
        }
      >
        {viewingUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <Avatar
                src={viewingUser.anhDaiDien}
                name={viewingUser.hoTen}
                size="lg"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {viewingUser.hoTen}
                </h3>
                <p className="text-sm text-slate-600">{viewingUser.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge
                    size="sm"
                    variant={getVaiTroVariant(viewingUser.vaiTro)}
                  >
                    {getVaiTroLabel(viewingUser.vaiTro)}
                  </Badge>
                  <Badge
                    size="sm"
                    variant={viewingUser.trangThai ? "success" : "danger"}
                  >
                    {viewingUser.trangThai ? "Đang hoạt động" : "Đã khóa"}
                  </Badge>
                </div>
              </div>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500">Số điện thoại</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {viewingUser.soDienThoai ?? "Chưa cập nhật"}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500">Ngày tạo tài khoản</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {formatDate(viewingUser.ngayTao)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <dt className="text-xs text-slate-500">Phương thức đăng nhập</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  Tài khoản hệ thống (Email)
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      {/* Lock/Unlock Confirm */}
      <ConfirmDialog
        open={Boolean(togglingUser)}
        onClose={() => setTogglingUser(null)}
        onConfirm={handleConfirmToggle}
        variant={togglingUser?.trangThai ? "danger" : "primary"}
        title={
          togglingUser?.trangThai
            ? `Khóa tài khoản ${togglingUser.hoTen}?`
            : `Mở khóa tài khoản ${togglingUser?.hoTen ?? ""}?`
        }
        description={
          togglingUser?.trangThai
            ? "Người dùng sẽ tạm thời không thể đăng nhập hoặc đặt đơn mới cho đến khi được mở khóa lại."
            : "Tài khoản sẽ được khôi phục quyền truy cập bình thường."
        }
        confirmLabel={
          togglingUser?.trangThai ? "Xác nhận khóa" : "Mở khóa ngay"
        }
      />
    </div>
  );
}
