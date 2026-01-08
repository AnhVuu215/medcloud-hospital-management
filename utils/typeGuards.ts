// Type guard utilities for runtime type checking

import { Appointment, UserRole } from '../types';

/**
 * Type guard to check if a string is a valid appointment status
 */
export const isValidAppointmentStatus = (
    status: string
): status is Appointment['status'] => {
    return ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status);
};

/**
 * Asserts that a string is a valid appointment status, throws error if not
 */
export const assertAppointmentStatus = (status: string): Appointment['status'] => {
    if (!isValidAppointmentStatus(status)) {
        throw new Error(`Invalid appointment status: ${status}. Must be one of: PENDING, CONFIRMED, COMPLETED, CANCELLED`);
    }
    return status;
};

/**
 * Type guard to check if a string is a valid user role
 */
export const isValidUserRole = (role: string): role is UserRole => {
    return ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT'].includes(role);
};

/**
 * Asserts that a string is a valid user role, throws error if not
 */
export const assertUserRole = (role: string): UserRole => {
    if (!isValidUserRole(role)) {
        throw new Error(`Invalid user role: ${role}. Must be one of: ADMIN, DOCTOR, RECEPTIONIST, PATIENT`);
    }
    return role as UserRole;
};
