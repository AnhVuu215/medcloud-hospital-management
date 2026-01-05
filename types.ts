
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  status?: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availableSlots?: string[];
  department?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  address: string;
  bloodType: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  fee: number;
  cancellationReason?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  prescription: string;
  doctorName: string;
  treatmentPlan?: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minThreshold: number;
  expiryDate: string;
  price: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientName: string;
  totalAmount: number;
  insuranceAmount: number;
  patientPaidAmount: number;
  status: 'PAID' | 'UNPAID';
  method?: 'MOMO' | 'VNPAY' | 'CASH' | 'BANK_TRANSFER';
  timestamp: string;
}

export interface InsuranceProfile {
  patientId: string;
  insuranceNumber: string;
  coveragePercentage: number;
  expiryDate: string;
  fullName: string;
}

export interface Stats {
  totalAppointments: number;
  totalRevenue: number;
  popularDiseases: { name: string; count: number }[];
  revenueData: { date: string; amount: number }[];
}
