
import React from 'react';
import { UserRole, Appointment, MedicalRecord, AuditLog, Doctor, Medicine, Payment, InsuranceProfile, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 'ADMIN_01', name: 'Quản trị viên Hệ thống', role: UserRole.ADMIN, email: 'admin@medcloud.vn', status: 'ACTIVE', lastLogin: '2023-10-25 08:00' },
  { id: 'D1', name: 'BS. Trần Thị B', role: UserRole.DOCTOR, email: 'tranb@medcloud.vn', status: 'ACTIVE', lastLogin: '2023-10-25 07:30' },
  { id: 'D2', name: 'BS. Phạm Văn D', role: UserRole.DOCTOR, email: 'pham d@medcloud.vn', status: 'ACTIVE', lastLogin: '2023-10-24 14:00' },
  { id: 'R1', name: 'Lễ tân Mai Phương', role: UserRole.RECEPTIONIST, email: 'phuong.mai@medcloud.vn', status: 'ACTIVE', lastLogin: '2023-10-25 08:15' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', patientId: 'P00124', patientName: 'Nguyễn Văn A', doctorName: 'BS. Trần Thị B', specialization: 'Nội khoa', date: '2023-10-25', time: '08:30', status: 'CONFIRMED', fee: 200000 },
  { id: '2', patientId: 'P00125', patientName: 'Lê Văn C', doctorName: 'BS. Phạm Văn D', specialization: 'Nhi khoa', date: '2023-10-25', time: '09:00', status: 'PENDING', fee: 150000 },
  { id: '3', patientId: 'P00126', patientName: 'Trần Thị E', doctorName: 'BS. Trần Thị B', specialization: 'Nội khoa', date: '2023-10-24', time: '14:30', status: 'COMPLETED', fee: 200000 },
];

export const MOCK_RECORDS: MedicalRecord[] = [
  { id: 'R1', patientId: 'P1', date: '2023-10-24', diagnosis: 'Viêm họng cấp', prescription: 'Amoxicillin 500mg x 10 viên', doctorName: 'BS. Trần Thị B' },
  { id: 'R2', patientId: 'P2', date: '2023-10-20', diagnosis: 'Sốt xuất huyết D1', prescription: 'Paracetamol 500mg, Oresol', doctorName: 'BS. Phạm Văn D' },
];

export const MOCK_LOGS: AuditLog[] = [
  { id: 'L1', userId: 'U1', userName: 'Admin_Super', action: 'TRUY_CAP_BENH_AN', target: 'Hồ sơ BN Nguyễn Văn A', timestamp: '2023-10-25 10:20:15', ipAddress: '192.168.1.1' },
  { id: 'L2', userId: 'U2', userName: 'BS. Trần Thị B', action: 'CAP_NHAT_TOA_THUOC', target: 'Hồ sơ BN Trần Thị E', timestamp: '2023-10-25 11:05:44', ipAddress: '192.168.1.5' },
];

export const MOCK_MEDICINES: Medicine[] = [
  { id: 'M1', name: 'Paracetamol 500mg', category: 'Giảm đau, hạ sốt', unit: 'Viên', stock: 1250, minThreshold: 200, expiryDate: '2025-12-01', price: 2000 },
  { id: 'M2', name: 'Amoxicillin 500mg', category: 'Kháng sinh', unit: 'Viên', stock: 85, minThreshold: 100, expiryDate: '2024-06-15', price: 5000 },
  { id: 'M3', name: 'Oresol 27.9g', category: 'Bù nước', unit: 'Gói', stock: 500, minThreshold: 50, expiryDate: '2025-01-10', price: 3000 },
  { id: 'M4', name: 'Augmentin 1g', category: 'Kháng sinh', unit: 'Viên', stock: 0, minThreshold: 50, expiryDate: '2023-12-20', price: 15000 },
  { id: 'M5', name: 'Cetirizine 10mg', category: 'Kháng dị ứng', unit: 'Viên', stock: 450, minThreshold: 100, expiryDate: '2026-03-22', price: 2500 },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'PAY1', appointmentId: '1', patientName: 'Nguyễn Văn A', totalAmount: 200000, insuranceAmount: 160000, patientPaidAmount: 40000, status: 'PAID', method: 'MOMO', timestamp: '2023-10-25 09:15:00' },
  { id: 'PAY2', appointmentId: '2', patientName: 'Lê Văn C', totalAmount: 150000, insuranceAmount: 0, patientPaidAmount: 150000, status: 'UNPAID', timestamp: '2023-10-25 10:00:00' },
  { id: 'PAY3', appointmentId: '3', patientName: 'Trần Thị E', totalAmount: 200000, insuranceAmount: 200000, patientPaidAmount: 0, status: 'PAID', method: 'CASH', timestamp: '2023-10-24 15:00:00' },
];

export const MOCK_INSURANCE: InsuranceProfile[] = [
  { patientId: 'P00124', insuranceNumber: 'DN4012400100234', coveragePercentage: 80, expiryDate: '2024-12-31', fullName: 'Nguyễn Văn A' },
  { patientId: 'P00126', insuranceNumber: 'GD4012600100567', coveragePercentage: 100, expiryDate: '2025-06-30', fullName: 'Trần Thị E' },
];

export const DOCTORS: Doctor[] = [
  { id: 'D1', name: 'BS. Trần Thị B', specialization: 'Nội khoa', department: 'Khoa Nội Tổng Hợp', availableSlots: ['08:00', '08:30', '09:00', '10:00', '14:00', '15:30'] },
  { id: 'D2', name: 'BS. Phạm Văn D', specialization: 'Nhi khoa', department: 'Khoa Nhi', availableSlots: ['08:30', '09:00', '11:00', '14:30', '15:00', '16:00'] },
  { id: 'D3', name: 'BS. Lê Hoàng Nam', specialization: 'Ngoại khoa', department: 'Khoa Ngoại', availableSlots: ['09:00', '10:30', '13:00', '13:30', '15:00'] },
  { id: 'D4', name: 'BS. Đặng Thu Thảo', specialization: 'Sản phụ khoa', department: 'Khoa Phụ Sản', availableSlots: ['08:00', '09:00', '10:00', '11:00', '14:00'] },
  { id: 'D5', name: 'BS. Ngô Bảo Châu', specialization: 'Nội khoa', department: 'Khoa Nội Tổng Hợp', availableSlots: ['08:00', '09:00', '10:00', '11:00', '14:00'] },
];

export const SPECIALIZATIONS = [
  'Nội khoa',
  'Nhi khoa',
  'Ngoại khoa',
  'Sản phụ khoa',
  'Da liễu',
  'Mắt',
  'Tai Mũi Họng'
];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];
