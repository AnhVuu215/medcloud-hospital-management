<div align="center">

<img width="1200" height="475" alt="MedCloud Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# MedCloud — Hospital Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.3-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-CC2927.svg)](https://www.microsoft.com/sql-server)

**Giải pháp quản lý bệnh viện toàn diện — hiện đại, bảo mật, dễ mở rộng**

[Tính năng](#-tính-năng) · [Công nghệ](#️-công-nghệ) · [Cài đặt](#-cài-đặt) · [Sử dụng](#-sử-dụng) · [API](#-api-documentation) · [Bảo mật](#-bảo-mật)

</div>

---

## Giới thiệu

**MedCloud** là hệ thống quản lý bệnh viện được xây dựng nhằm số hóa và tối ưu hóa toàn bộ quy trình vận hành: từ quản lý bệnh nhân, đặt lịch hẹn, hồ sơ bệnh án điện tử, đến nhà thuốc, thanh toán và bảo hiểm y tế.

Hệ thống hướng đến ba mục tiêu cốt lõi:

- **Tự động hóa** — giảm thiểu thao tác thủ công, tăng tốc độ xử lý nghiệp vụ
- **Minh bạch** — mọi thao tác đều được ghi log, dễ kiểm tra và truy vết
- **Bảo mật** — tuân thủ các tiêu chuẩn bảo mật thông tin y tế

---

## ✨ Tính năng

### Quản lý Người dùng & Phân quyền
- Hỗ trợ đa vai trò: **Admin, Bác sĩ, Y tá, Dược sĩ, Kế toán, Bệnh nhân**
- Xác thực bằng JWT + mã hóa mật khẩu bcrypt
- Phân quyền chi tiết theo vai trò (RBAC)
- Quản lý tài khoản: tạo, chỉnh sửa, xóa mềm

### Quản lý Lịch hẹn
- Đặt lịch khám trực tuyến
- Quản lý lịch làm việc bác sĩ
- Theo dõi trạng thái cuộc hẹn: `Pending` → `Confirmed` → `Completed` / `Cancelled`
- Thông báo và nhắc nhở tự động

### Hồ sơ Bệnh án Điện tử (EMR)
- Lưu trữ và truy xuất hồ sơ y tế điện tử
- Lịch sử khám bệnh, kết quả xét nghiệm, chẩn đoán
- Đơn thuốc điện tử
- Hình ảnh y tế (X-ray, CT, MRI)

### Quản lý Nhà thuốc
- Quản lý kho thuốc, theo dõi tồn kho và hạn sử dụng
- Cảnh báo thuốc sắp hết
- Quản lý đơn thuốc và xuất nhập tồn

### Thanh toán & Bảo hiểm
- Quản lý hóa đơn, tích hợp bảo hiểm y tế
- Hỗ trợ nhiều phương thức thanh toán
- Báo cáo tài chính và xuất hóa đơn Excel

### Cổng thông tin Bệnh nhân
- Xem lịch sử khám bệnh và kết quả xét nghiệm
- Đặt lịch hẹn và thanh toán trực tuyến
- Tải xuống hồ sơ y tế cá nhân

### Dashboard & Báo cáo
- Thống kê tổng quan theo thời gian thực
- Biểu đồ trực quan (Recharts)
- Báo cáo doanh thu, phân tích hiệu suất
- Xuất báo cáo Excel

### Audit Log & Bảo mật
- Ghi log toàn bộ thao tác quan trọng
- Theo dõi lịch sử thay đổi dữ liệu
- Soft delete — bảo toàn dữ liệu, không xóa vĩnh viễn

---

## 🛠️ Công nghệ

### Frontend

| Thành phần | Công nghệ |
|------------|-----------|
| Framework | React 19.2.3 + TypeScript |
| Build Tool | Vite 6.2.0 |
| Styling | TailwindCSS 3.4.1 |
| Icons | Lucide React |
| Charts | Recharts 3.6.0 |
| Export | XLSX (Excel) |

### Backend

| Thành phần | Công nghệ |
|------------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express.js 4.18.2 |
| Language | TypeScript 5.3.3 |
| Database | Microsoft SQL Server |
| Auth | JWT + bcrypt |
| Validation | Express Validator |
| Security | Helmet, CORS, Rate Limiting |
| Logging | Morgan + Custom Audit Logger |

### Database

- **DBMS**: Microsoft SQL Server 2019+
- **Driver**: mssql 10.0.4
- **Tính năng**: Stored Procedures, Triggers, Soft Delete, Audit Logging

---

## 📦 Cài đặt

### Yêu cầu hệ thống

| Thành phần | Phiên bản tối thiểu |
|------------|---------------------|
| Node.js | >= 20.0.0 |
| npm | >= 10.0.0 |
| SQL Server | 2019 |
| RAM | 4 GB |
| Disk | 2 GB trống |

### Bước 1: Clone repository

```bash
git clone https://github.com/AnhVuu215/medcloud-hospital-management.git
cd medcloud-hospital-management
```

### Bước 2: Cài đặt dependencies

```bash
# Frontend
npm install

# Backend
cd backend && npm install && cd ..
```

### Bước 3: Cấu hình database

```sql
-- Tạo database
CREATE DATABASE MedCloudDB;
```

Sau đó mở **SQL Server Management Studio** và chạy lần lượt:

```
database/schema.sql          -- Tạo schema
database/seed.sql            -- Dữ liệu mẫu (tùy chọn)
database/add-soft-delete.sql -- Tính năng soft delete (tùy chọn)
```

### Bước 4: Cấu hình biến môi trường

**Frontend** — tạo file `.env.local` tại thư mục gốc:

```env
# (Thêm các biến môi trường frontend nếu cần)
```

**Backend** — tạo file `backend/.env` từ template `backend/.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_SERVER=localhost
DB_NAME=MedCloudDB
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=1433

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Sử dụng

### Development

```bash
# Chạy riêng từng service
npm run dev              # Frontend → http://localhost:5173
npm run dev:backend      # Backend  → http://localhost:5000

# Hoặc chạy đồng thời
npm run dev:all
```

### Production

```bash
# Frontend
npm run build
npm run preview

# Backend
cd backend
npm run build
npm start
```

---

## 🔐 Tài khoản Demo

> Yêu cầu đã chạy `database/seed.sql`

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | admin@medcloud.com | admin123 |
| Bác sĩ | doctor@medcloud.com | doctor123 |
| Y tá | nurse@medcloud.com | nurse123 |
| Dược sĩ | pharmacist@medcloud.com | pharma123 |
| Kế toán | accountant@medcloud.com | account123 |
| Bệnh nhân | patient@medcloud.com | patient123 |

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

Tất cả các endpoint có yêu cầu xác thực đều cần header:

```
Authorization: Bearer <jwt_token>
```

#### POST `/api/auth/login`

```json
// Request
{
  "email": "admin@medcloud.com",
  "password": "admin123"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@medcloud.com",
    "fullName": "Admin User",
    "role": "ADMIN"
  }
}
```

### Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/auth/register` | Đăng ký | ❌ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |
| GET | `/api/users` | Danh sách người dùng | ✅ Admin |
| POST | `/api/users` | Tạo người dùng | ✅ Admin |
| PUT | `/api/users/:id` | Cập nhật người dùng | ✅ |
| DELETE | `/api/users/:id` | Xóa người dùng (soft) | ✅ Admin |
| GET | `/api/appointments` | Danh sách lịch hẹn | ✅ |
| POST | `/api/appointments` | Tạo lịch hẹn | ✅ |
| PUT | `/api/appointments/:id` | Cập nhật lịch hẹn | ✅ |
| DELETE | `/api/appointments/:id` | Hủy lịch hẹn | ✅ |
| GET | `/api/medical-records` | Danh sách hồ sơ | ✅ Doctor |
| POST | `/api/medical-records` | Tạo hồ sơ | ✅ Doctor |
| PUT | `/api/medical-records/:id` | Cập nhật hồ sơ | ✅ Doctor |
| GET | `/api/medications` | Danh sách thuốc | ✅ |
| POST | `/api/medications` | Thêm thuốc | ✅ Pharmacist |
| PUT | `/api/medications/:id` | Cập nhật thuốc | ✅ Pharmacist |
| GET | `/api/payments` | Danh sách thanh toán | ✅ |
| POST | `/api/payments` | Tạo thanh toán | ✅ |
| GET | `/api/audit-logs` | Audit logs | ✅ Admin |

---

## 📁 Cấu trúc thư mục

```
medcloud/
├── backend/
│   └── src/
│       ├── controllers/       # Request handlers
│       ├── middleware/        # Express middleware
│       ├── routes/            # API routes
│       ├── services/          # Business logic
│       ├── utils/             # Tiện ích
│       ├── config/            # Cấu hình
│       └── server.ts          # Entry point
│
├── components/                # React components dùng chung
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Footer.tsx
│
├── views/                     # Page components
│   ├── DashboardView.tsx
│   ├── AppointmentView.tsx
│   ├── MedicalRecordView.tsx
│   ├── PharmacyView.tsx
│   ├── PaymentInsuranceView.tsx
│   ├── PatientPortalView.tsx
│   ├── UserManagementView.tsx
│   ├── AuditLogView.tsx
│   └── AuthView.tsx
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── add-soft-delete.sql
│
├── services/                  # Frontend services
├── utils/                     # Frontend utilities
├── App.tsx
├── types.ts
├── constants.tsx
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🔒 Bảo mật

| Biện pháp | Mô tả |
|-----------|-------|
| JWT Authentication | Xác thực stateless, token có thời hạn |
| bcrypt | Mã hóa mật khẩu một chiều |
| Helmet.js | Bảo vệ HTTP headers |
| CORS | Kiểm soát truy cập cross-origin |
| Rate Limiting | Giới hạn request, chống brute force |
| Input Validation | Kiểm tra và làm sạch dữ liệu đầu vào |
| Parameterized Queries | Ngăn chặn SQL Injection |
| Soft Delete | Không xóa vĩnh viễn dữ liệu nhạy cảm |
| Audit Logging | Ghi log toàn bộ thao tác quan trọng |

---

## 🗄️ Database Schema

Các bảng chính trong hệ thống:

| Bảng | Mô tả |
|------|-------|
| Users | Người dùng và phân quyền |
| Patients | Thông tin bệnh nhân |
| Doctors | Thông tin bác sĩ |
| Appointments | Lịch hẹn khám |
| MedicalRecords | Hồ sơ bệnh án |
| Medications | Danh mục thuốc |
| Prescriptions | Đơn thuốc |
| Payments | Thanh toán |
| InsuranceClaims | Bảo hiểm |
| AuditLogs | Nhật ký hệ thống |

Chi tiết xem tại [`database/schema.sql`](database/schema.sql)

---

## 🧪 Kiểm thử

```bash
# Kiểm tra kết nối database
cd backend
npx tsx test-db-connection.ts
```

Kiểm thử thủ công:
1. Khởi động frontend và backend
2. Đăng nhập với tài khoản demo
3. Thực hiện các luồng chính: tạo lịch hẹn, quản lý hồ sơ bệnh án, xuất báo cáo

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh.

```bash
git checkout -b feature/ten-tinh-nang
git commit -m "feat: mô tả ngắn gọn"
git push origin feature/ten-tinh-nang
# Tạo Pull Request
```

**Coding standards:**
- Sử dụng TypeScript, tuân thủ ESLint
- Comment cho logic phức tạp
- Kiểm thử trước khi commit

---

## 📝 License

Phân phối dưới giấy phép **MIT**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**MedCloud Team**

- GitHub: [@AnhVuu215](https://github.com/AnhVuu215)
- Email: support@medcloud.com
- Issues: [GitHub Issues](https://github.com/AnhVuu215/medcloud-hospital-management/issues)

---

<div align="center">

Nếu dự án hữu ích với bạn, hãy để lại một ⭐

</div>
