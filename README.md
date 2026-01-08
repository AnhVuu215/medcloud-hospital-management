<div align="center">
<img width="1200" height="475" alt="MedCloud Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🏥 MedCloud - Hệ Thống Quản Lý Bệnh Viện Thông Minh

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.3-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)

**Giải pháp quản lý bệnh viện toàn diện với công nghệ hiện đại**

[Tính năng](#-tính-năng) • [Công nghệ](#️-công-nghệ-sử-dụng) • [Cài đặt](#-cài-đặt) • [Sử dụng](#-sử-dụng) • [API](#-api-documentation)

</div>

---

## 📋 Giới thiệu

**MedCloud** là hệ thống quản lý bệnh viện thông minh, được xây dựng với mục tiêu số hóa và tối ưu hóa quy trình vận hành bệnh viện. Hệ thống cung cấp giải pháp toàn diện từ quản lý bệnh nhân, lịch hẹn, hồ sơ y tế, đến quản lý nhà thuốc, thanh toán và bảo hiểm.

### 🎯 Mục tiêu

- ✅ Tự động hóa quy trình quản lý bệnh viện
- ✅ Cải thiện trải nghiệm bệnh nhân
- ✅ Tăng hiệu quả làm việc của nhân viên y tế
- ✅ Đảm bảo an toàn và bảo mật thông tin y tế
- ✅ Hỗ trợ ra quyết định dựa trên dữ liệu

---

## ✨ Tính năng

### 👥 Quản lý Người dùng & Phân quyền
- **Đa vai trò**: Admin, Bác sĩ, Y tá, Dược sĩ, Kế toán, Bệnh nhân
- **Xác thực an toàn**: JWT Authentication với bcrypt
- **Phân quyền chi tiết**: Role-based access control (RBAC)
- **Quản lý tài khoản**: Tạo, sửa, xóa mềm người dùng

### 📅 Quản lý Lịch hẹn
- Đặt lịch khám trực tuyến
- Quản lý lịch làm việc bác sĩ
- Thông báo và nhắc nhở tự động
- Theo dõi trạng thái cuộc hẹn (Pending, Confirmed, Completed, Cancelled)

### 📋 Hồ sơ Bệnh án Điện tử (EMR)
- Lưu trữ hồ sơ y tế điện tử
- Lịch sử khám bệnh chi tiết
- Kết quả xét nghiệm và chẩn đoán
- Đơn thuốc điện tử
- Hình ảnh y tế (X-ray, CT, MRI)

### 💊 Quản lý Nhà thuốc
- Quản lý kho thuốc
- Theo dõi tồn kho và hạn sử dụng
- Cảnh báo thuốc sắp hết
- Quản lý đơn thuốc
- Xuất nhập tồn

### 💳 Thanh toán & Bảo hiểm
- Quản lý hóa đơn
- Tích hợp bảo hiểm y tế
- Nhiều phương thức thanh toán
- Báo cáo tài chính
- Xuất hóa đơn Excel

### 🏥 Cổng thông tin Bệnh nhân
- Xem lịch sử khám bệnh
- Đặt lịch hẹn trực tuyến
- Xem kết quả xét nghiệm
- Thanh toán trực tuyến
- Tải xuống hồ sơ y tế

### 📊 Dashboard & Báo cáo
- Thống kê tổng quan theo thời gian thực
- Biểu đồ trực quan với Recharts
- Báo cáo doanh thu
- Phân tích hiệu suất
- Xuất báo cáo Excel

### 🔍 Audit Log & Bảo mật
- Ghi log mọi thao tác quan trọng
- Theo dõi lịch sử thay đổi
- Bảo mật với Helmet.js
- Rate limiting chống DDoS
- Soft delete để bảo toàn dữ liệu

### 🖼️ Xử lý Hình ảnh Y tế
- Tích hợp Google Gemini AI
- Chỉnh sửa và phân tích hình ảnh
- Hỗ trợ chẩn đoán bằng AI

---

## 🛠️ Công nghệ Sử dụng

### Frontend
- **Framework**: React 19.2.3 + TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: TailwindCSS 3.4.1
- **Icons**: Lucide React
- **Charts**: Recharts 3.6.0
- **AI Integration**: Google Gemini AI
- **Export**: XLSX (Excel)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.3.3
- **Database**: Microsoft SQL Server (MSSQL)
- **Authentication**: JWT + bcrypt
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan + Custom Audit Logger

### Database
- **DBMS**: Microsoft SQL Server
- **ORM**: mssql 10.0.4
- **Features**: 
  - Stored Procedures
  - Triggers
  - Soft Delete
  - Audit Logging

---

## 📦 Cài đặt

### Yêu cầu hệ thống

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **SQL Server**: 2019 hoặc mới hơn
- **RAM**: >= 4GB
- **Disk**: >= 2GB trống

### Bước 1: Clone Repository

```bash
git clone https://github.com/AnhVuu215/medcloud-hospital-management.git
cd medcloud-hospital-management
```

### Bước 2: Cài đặt Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
cd ..
```

### Bước 3: Cấu hình Database

1. **Tạo database trong SQL Server**:
```sql
CREATE DATABASE MedCloudDB;
```

2. **Chạy schema**:
```bash
# Mở SQL Server Management Studio và chạy file:
database/schema.sql
```

3. **Thêm dữ liệu mẫu** (tùy chọn):
```bash
# Chạy file seed trong SSMS:
database/seed.sql
```

4. **Thêm soft delete** (tùy chọn):
```bash
# Chạy file trong SSMS:
database/add-soft-delete.sql
```

### Bước 4: Cấu hình Environment Variables

#### Frontend (.env.local)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Backend (backend/.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_SERVER=localhost
DB_NAME=MedCloudDB
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=1433

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> **Lưu ý**: Copy từ `backend/.env.example` và điền thông tin của bạn

---

## 🚀 Sử dụng

### Development Mode

#### Chạy Frontend và Backend riêng biệt:

**Terminal 1 - Frontend**:
```bash
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

**Terminal 2 - Backend**:
```bash
npm run dev:backend
```
Backend API sẽ chạy tại: `http://localhost:5000`

#### Hoặc chạy đồng thời:
```bash
npm run dev:all
```

### Production Build

#### Build Frontend:
```bash
npm run build
npm run preview
```

#### Build Backend:
```bash
cd backend
npm run build
npm start
```

---

## 🔐 Tài khoản Demo

Sau khi chạy `seed.sql`, bạn có thể đăng nhập với các tài khoản sau:

| Vai trò | Email | Mật khẩu | Mô tả |
|---------|-------|----------|-------|
| **Admin** | admin@medcloud.com | admin123 | Quản trị viên hệ thống |
| **Bác sĩ** | doctor@medcloud.com | doctor123 | Bác sĩ chuyên khoa |
| **Y tá** | nurse@medcloud.com | nurse123 | Y tá điều dưỡng |
| **Dược sĩ** | pharmacist@medcloud.com | pharma123 | Quản lý nhà thuốc |
| **Kế toán** | accountant@medcloud.com | account123 | Kế toán viên |
| **Bệnh nhân** | patient@medcloud.com | patient123 | Bệnh nhân |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /api/auth/login
Đăng nhập vào hệ thống

**Request Body**:
```json
{
  "email": "admin@medcloud.com",
  "password": "admin123"
}
```

**Response**:
```json
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

### Main API Routes

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| **Auth** |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/auth/register` | Đăng ký | ❌ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |
| **Users** |
| GET | `/api/users` | Lấy danh sách người dùng | ✅ Admin |
| GET | `/api/users/:id` | Lấy thông tin người dùng | ✅ |
| POST | `/api/users` | Tạo người dùng mới | ✅ Admin |
| PUT | `/api/users/:id` | Cập nhật người dùng | ✅ |
| DELETE | `/api/users/:id` | Xóa người dùng (soft) | ✅ Admin |
| **Appointments** |
| GET | `/api/appointments` | Lấy danh sách lịch hẹn | ✅ |
| GET | `/api/appointments/:id` | Lấy chi tiết lịch hẹn | ✅ |
| POST | `/api/appointments` | Tạo lịch hẹn mới | ✅ |
| PUT | `/api/appointments/:id` | Cập nhật lịch hẹn | ✅ |
| DELETE | `/api/appointments/:id` | Hủy lịch hẹn | ✅ |
| **Medical Records** |
| GET | `/api/medical-records` | Lấy danh sách hồ sơ | ✅ Doctor |
| GET | `/api/medical-records/:id` | Lấy chi tiết hồ sơ | ✅ |
| POST | `/api/medical-records` | Tạo hồ sơ mới | ✅ Doctor |
| PUT | `/api/medical-records/:id` | Cập nhật hồ sơ | ✅ Doctor |
| **Pharmacy** |
| GET | `/api/medications` | Lấy danh sách thuốc | ✅ |
| GET | `/api/medications/:id` | Lấy thông tin thuốc | ✅ |
| POST | `/api/medications` | Thêm thuốc mới | ✅ Pharmacist |
| PUT | `/api/medications/:id` | Cập nhật thuốc | ✅ Pharmacist |
| **Payments** |
| GET | `/api/payments` | Lấy danh sách thanh toán | ✅ |
| GET | `/api/payments/:id` | Lấy chi tiết thanh toán | ✅ |
| POST | `/api/payments` | Tạo thanh toán | ✅ |
| **Audit Logs** |
| GET | `/api/audit-logs` | Lấy audit logs | ✅ Admin |

### Authentication Header
```
Authorization: Bearer <your_jwt_token>
```

---

## 📁 Cấu trúc Thư mục

```
medcloud/
├── 📂 backend/                    # Backend API Server
│   ├── 📂 src/
│   │   ├── 📂 controllers/        # Request handlers
│   │   ├── 📂 middleware/         # Express middleware
│   │   ├── 📂 routes/             # API routes
│   │   ├── 📂 services/           # Business logic
│   │   ├── 📂 utils/              # Utilities
│   │   ├── 📂 config/             # Configuration
│   │   └── 📄 server.ts           # Entry point
│   ├── 📄 .env.example            # Environment template
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📂 components/                 # React components
│   ├── 📄 Sidebar.tsx
│   ├── 📄 Header.tsx
│   ├── 📄 Footer.tsx
│   └── 📄 MobileBottomNav.tsx
│
├── 📂 views/                      # Page components
│   ├── 📄 DashboardView.tsx
│   ├── 📄 AppointmentView.tsx
│   ├── 📄 MedicalRecordView.tsx
│   ├── 📄 PharmacyView.tsx
│   ├── 📄 PaymentInsuranceView.tsx
│   ├── 📄 PatientPortalView.tsx
│   ├── 📄 UserManagementView.tsx
│   ├── 📄 AuditLogView.tsx
│   ├── 📄 ImageEditView.tsx
│   ├── 📄 AuthView.tsx
│   └── 📄 LandingView.tsx
│
├── 📂 database/                   # Database scripts
│   ├── 📄 schema.sql              # Database schema
│   ├── 📄 seed.sql                # Sample data
│   └── 📄 add-soft-delete.sql     # Soft delete feature
│
├── 📂 services/                   # Frontend services
├── 📂 utils/                      # Frontend utilities
│
├── 📄 App.tsx                     # Main React component
├── 📄 index.tsx                   # React entry point
├── 📄 types.ts                    # TypeScript types
├── 📄 constants.tsx               # Constants
│
├── 📄 index.css                   # Global styles
├── 📄 landing.css                 # Landing page styles
├── 📄 landing.html                # Landing page HTML
├── 📄 landing.js                  # Landing page JS
│
├── 📄 package.json                # Frontend dependencies
├── 📄 tsconfig.json               # TypeScript config
├── 📄 vite.config.ts              # Vite config
├── 📄 tailwind.config.js          # Tailwind config
├── 📄 vercel.json                 # Vercel deployment
│
├── 📄 .env.local                  # Frontend environment
├── 📄 .gitignore
└── 📄 README.md                   # This file
```

---

## 🔒 Bảo mật

MedCloud được xây dựng với các tiêu chuẩn bảo mật cao:

- ✅ **JWT Authentication**: Xác thực an toàn với token
- ✅ **Password Hashing**: Mã hóa mật khẩu với bcrypt
- ✅ **Helmet.js**: Bảo vệ khỏi các lỗ hổng web phổ biến
- ✅ **CORS**: Kiểm soát truy cập cross-origin
- ✅ **Rate Limiting**: Chống DDoS và brute force
- ✅ **Input Validation**: Kiểm tra và làm sạch dữ liệu đầu vào
- ✅ **SQL Injection Prevention**: Sử dụng parameterized queries
- ✅ **Soft Delete**: Không xóa vĩnh viễn dữ liệu quan trọng
- ✅ **Audit Logging**: Ghi log mọi thao tác nhạy cảm

---

## 🧪 Testing

### Test Database Connection
```bash
cd backend
npx tsx test-db-connection.ts
```

### Manual Testing
1. Khởi động frontend và backend
2. Đăng nhập với tài khoản demo
3. Test các chức năng chính:
   - Tạo/sửa/xóa người dùng
   - Đặt lịch hẹn
   - Quản lý hồ sơ bệnh án
   - Quản lý thuốc
   - Thanh toán

---

## 📊 Database Schema

### Main Tables

- **Users**: Quản lý người dùng và phân quyền
- **Patients**: Thông tin bệnh nhân
- **Doctors**: Thông tin bác sĩ
- **Appointments**: Lịch hẹn khám
- **MedicalRecords**: Hồ sơ bệnh án
- **Medications**: Thuốc
- **Prescriptions**: Đơn thuốc
- **Payments**: Thanh toán
- **InsuranceClaims**: Bảo hiểm
- **AuditLogs**: Nhật ký hệ thống

Xem chi tiết schema tại: [`database/schema.sql`](database/schema.sql)

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Để đóng góp:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Coding Standards
- Sử dụng TypeScript
- Follow ESLint rules
- Viết code rõ ràng, dễ đọc
- Comment cho logic phức tạp
- Test trước khi commit

---

## 📝 License

Dự án này được phân phối dưới giấy phép **MIT License**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**MedCloud Team**

- GitHub: [@AnhVuu215](https://github.com/AnhVuu215)
- Email: support@medcloud.com

---

## 🙏 Lời cảm ơn

- [React](https://reactjs.org/) - UI Framework
- [Express.js](https://expressjs.com/) - Backend Framework
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Lucide](https://lucide.dev/) - Icon Library
- [Recharts](https://recharts.org/) - Chart Library
- [Google Gemini](https://ai.google.dev/) - AI Integration

---

## 📞 Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi:

- 📧 Email: support@medcloud.com
- 🐛 Issues: [GitHub Issues](https://github.com/AnhVuu215/medcloud-hospital-management/issues)
- 📖 Documentation: [Wiki](https://github.com/AnhVuu215/medcloud-hospital-management/wiki)

---

<div align="center">

**⭐ Nếu dự án hữu ích, hãy cho chúng tôi một star! ⭐**

Made with ❤️ by MedCloud Team

</div>
