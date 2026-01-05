// Validation utility functions

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    // Vietnamese phone number format: 09/08/07/05/03 + 8 digits
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(phone);
};

export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};

export const isValidTime = (timeString: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return timeRegex.test(timeString);
};

export const isValidRole = (role: string): boolean => {
    const validRoles = ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT'];
    return validRoles.includes(role);
};

export const isValidBloodType = (bloodType: string): boolean => {
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return validBloodTypes.includes(bloodType);
};

export const isStrongPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);
};

export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
};
