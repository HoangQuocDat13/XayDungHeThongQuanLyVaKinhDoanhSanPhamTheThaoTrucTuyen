# Backend cửa hàng thể thao

Backend sử dụng NestJS, Prisma và MySQL. Mô hình dữ liệu được định nghĩa trong
`prisma/schema.prisma`.

## Cài đặt và chạy

```powershell
npm install
npm run start:dev
```

Tạo file `.env` cục bộ với `DATABASE_URL` trỏ đến database MySQL trước khi dùng
Prisma. Không đưa thông tin kết nối hoặc khóa bí mật lên Git.

## Prisma

```powershell
npm run prisma:generate
npm run prisma:migrate -- --name <ten_migration>
```

## Kiểm tra

```powershell
npm run test
npm run test:e2e
npm run build
```
