# Cửa hàng thể thao trực tuyến

Frontend sử dụng Next.js App Router, React, TypeScript, Tailwind CSS và Zustand.
Giao diện gồm khu vực mua sắm, xác thực và quản trị; nội dung hiển thị bằng tiếng Việt.

## Chạy ứng dụng

```powershell
npm install
npm run dev
```

Mở http://localhost:3000.

Các lệnh kiểm tra:

```powershell
npm run lint
npm run build
```

Mỗi người phát triển tự tạo `.env.local` khi cần cấu hình môi trường cục bộ.
Không đưa thông tin bí mật vào Git.

## Dữ liệu giao diện

Các màn hình hiện dùng dữ liệu minh họa trong `src/features/*/data/mock.ts`.
Giỏ hàng được lưu cục bộ trên trình duyệt. Đăng nhập, đăng ký, thanh toán và
các thao tác quản trị chưa kết nối API; giao diện sẽ thông báo rõ khi thao tác
chưa được hỗ trợ thay vì giả lập thành công.
