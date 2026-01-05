// Utility function to generate unique IDs for different entities
export function generateId(prefix: string, number?: number): string {
    if (number !== undefined) {
        return `${prefix}${String(number).padStart(5, '0')}`;
    }

    // Generate random ID with timestamp
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `${prefix}${timestamp}${random}`.toUpperCase();
}

// Generate specific entity IDs
export const generateUserId = (role: string, number?: number): string => {
    const prefixes: { [key: string]: string } = {
        'ADMIN': 'ADMIN_',
        'DOCTOR': 'D',
        'RECEPTIONIST': 'R',
        'PATIENT': 'P'
    };
    return generateId(prefixes[role] || 'U', number);
};

export const generateAppointmentId = (): string => generateId('APT');
export const generateRecordId = (): string => generateId('R');
export const generateMedicineId = (): string => generateId('M');
export const generatePaymentId = (): string => generateId('PAY');
export const generateInsuranceId = (): string => generateId('INS');
export const generateLogId = (): string => generateId('LOG');
export const generateScheduleId = (): string => generateId('SCH');
export const generatePrescriptionId = (): string => generateId('PRE');
