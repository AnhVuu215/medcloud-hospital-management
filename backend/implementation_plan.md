# MedCloud Backend API - Implementation Plan

## Goal

Develop a complete RESTful API backend for the MedCloud Hospital Management System with authentication, authorization, and full CRUD operations for all database entities.

## Database Schema Overview

The system has 9 main tables:
- **Users**: Admin, Doctor, Receptionist, Patient roles
- **Appointments**: Patient-Doctor appointment bookings
- **MedicalRecords**: Patient medical history and diagnoses
- **Medicines**: Pharmacy inventory management
- **Payments**: Payment transactions with insurance support
- **Insurance**: Patient insurance profiles
- **AuditLogs**: System activity tracking
- **DoctorSchedule**: Doctor availability schedules
- **Prescriptions**: Detailed prescription information

## Proposed Changes

### 1. Project Structure

```
backend/src/
├── config/
│   └── database.ts (✅ exists)
├── middleware/
│   ├── auth.ts (JWT authentication)
│   ├── roleCheck.ts (Role-based access control)
│   └── errorHandler.ts (Global error handling)
├── models/
│   ├── User.ts
│   ├── Appointment.ts
│   ├── MedicalRecord.ts
│   ├── Medicine.ts
│   ├── Payment.ts
│   └── ... (other models)
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── appointment.routes.ts
│   ├── medicalRecord.routes.ts
│   ├── medicine.routes.ts
│   ├── payment.routes.ts
│   └── doctorSchedule.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── appointment.controller.ts
│   ├── medicalRecord.controller.ts
│   ├── medicine.controller.ts
│   ├── payment.controller.ts
│   └── doctorSchedule.controller.ts
├── utils/
│   ├── generateId.ts
│   ├── validators.ts
│   └── auditLogger.ts
└── server.ts (✅ exists)
```

---

### 2. Authentication & Authorization Module

#### [NEW] `src/middleware/auth.ts`
- JWT token verification middleware
- Extract user info from token
- Attach user to request object

#### [NEW] `src/middleware/roleCheck.ts`
- Role-based access control
- Check if user has required role(s)
- Support multiple roles per endpoint

#### [NEW] `src/controllers/auth.controller.ts`
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

#### [NEW] `src/routes/auth.routes.ts`
- Define authentication routes
- Apply validation middleware

---

### 3. User Management Module

#### [NEW] `src/models/User.ts`
- User interface and type definitions
- Database query functions (CRUD)

#### [NEW] `src/controllers/user.controller.ts`
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Deactivate user (Admin only)
- `GET /api/users/doctors` - List all doctors
- `GET /api/users/patients` - List all patients (Admin/Receptionist)

#### [NEW] `src/routes/user.routes.ts`
- Define user management routes
- Apply authentication and role-based access control

---

### 4. Appointment Management Module

#### [NEW] `src/models/Appointment.ts`
- Appointment interface and database operations

#### [NEW] `src/controllers/appointment.controller.ts`
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments` - List appointments (filtered by role)
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/doctor/:doctorId/available-slots` - Get available time slots

#### [NEW] `src/routes/appointment.routes.ts`
- Define appointment routes with proper authorization

---

### 5. Medical Records Module

#### [NEW] `src/models/MedicalRecord.ts`
- Medical record interface and database operations

#### [NEW] `src/controllers/medicalRecord.controller.ts`
- `POST /api/medical-records` - Create medical record (Doctor only)
- `GET /api/medical-records/patient/:patientId` - Get patient medical history
- `GET /api/medical-records/:id` - Get specific record
- `PUT /api/medical-records/:id` - Update medical record (Doctor only)

#### [NEW] `src/routes/medicalRecord.routes.ts`
- Define medical record routes
- Ensure only doctors can create/update records
- Patients can only view their own records

---

### 6. Medicine Management Module

#### [NEW] `src/models/Medicine.ts`
- Medicine interface and database operations

#### [NEW] `src/controllers/medicine.controller.ts`
- `GET /api/medicines` - List all medicines
- `GET /api/medicines/:id` - Get medicine details
- `POST /api/medicines` - Add new medicine (Admin only)
- `PUT /api/medicines/:id` - Update medicine (Admin only)
- `DELETE /api/medicines/:id` - Delete medicine (Admin only)
- `GET /api/medicines/low-stock` - Get low stock medicines

#### [NEW] `src/routes/medicine.routes.ts`
- Define medicine management routes

---

### 7. Payment Module

#### [NEW] `src/models/Payment.ts`
- Payment interface and database operations

#### [NEW] `src/controllers/payment.controller.ts`
- `POST /api/payments` - Create payment record
- `GET /api/payments` - List payments (filtered by role)
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id/status` - Update payment status
- `GET /api/payments/patient/:patientId` - Get patient payment history

#### [NEW] `src/routes/payment.routes.ts`
- Define payment routes

---

### 8. Doctor Schedule Module

#### [NEW] `src/models/DoctorSchedule.ts`
- Doctor schedule interface and database operations

#### [NEW] `src/controllers/doctorSchedule.controller.ts`
- `GET /api/schedules/doctor/:doctorId` - Get doctor schedule
- `POST /api/schedules` - Create schedule (Doctor/Admin)
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

#### [NEW] `src/routes/doctorSchedule.routes.ts`
- Define doctor schedule routes

---

### 9. Utility Functions

#### [NEW] `src/utils/generateId.ts`
- Generate unique IDs for different entities
- Format: `APT001`, `P00124`, `D1`, etc.

#### [NEW] `src/utils/validators.ts`
- Email validation
- Phone number validation
- Date/time validation

#### [NEW] `src/utils/auditLogger.ts`
- Log user actions to AuditLogs table
- Track who did what and when

---

### 10. Server Configuration

#### [MODIFY] `src/server.ts`
- Import and register all route modules
- Add global error handling middleware
- Add request logging

---

## Verification Plan

### Automated Tests

Since there are no existing tests in the project, I will create a comprehensive test suite:

#### 1. **Authentication Flow Test**
```bash
# Create test file: src/__tests__/auth.test.ts
# Test user registration, login, and token validation
npm test -- auth.test.ts
```

#### 2. **API Endpoint Tests**
```bash
# Create test files for each module
# Test CRUD operations for all entities
npm test
```

### Manual Verification

#### 1. **Test Authentication**
```bash
# Start the server
npm run dev

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"PATIENT"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medcloud.vn","password":"password123"}'
```

#### 2. **Test Appointment Creation**
```bash
# Use the JWT token from login
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"patientId":"P00124","doctorId":"D1","appointmentDate":"2026-01-10","appointmentTime":"09:00:00","fee":200000,"reason":"Checkup"}'
```

#### 3. **Test Role-Based Access Control**
```bash
# Try to access admin-only endpoint with patient token (should fail)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <PATIENT_JWT_TOKEN>"

# Try with admin token (should succeed)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

#### 4. **Database Verification**
- Check that data is correctly inserted into SQL Server
- Verify foreign key relationships are maintained
- Confirm audit logs are created for sensitive operations

### Browser Testing

Use Postman or Thunder Client VS Code extension to:
1. Import all API endpoints
2. Test each endpoint with different user roles
3. Verify response formats and status codes
4. Test error handling (invalid data, unauthorized access, etc.)

---

## Notes

- All passwords will be hashed using bcrypt before storing
- JWT tokens will expire after 24 hours (configurable)
- All timestamps will use SQL Server's GETDATE()
- Audit logging will be automatic for sensitive operations
- Error responses will follow consistent format:
  ```json
  {
    "error": "Error Type",
    "message": "Detailed error message"
  }
  ```
