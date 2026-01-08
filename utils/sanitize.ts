import DOMPurify from 'dompurify';

/**
 * Input sanitization utilities for security
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target']
    });
};

/**
 * Sanitize plain text input
 * Removes HTML tags and dangerous characters
 */
export const sanitizeText = (input: string): string => {
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
};

/**
 * Sanitize email input
 */
export const sanitizeEmail = (email: string): string => {
    const sanitized = sanitizeText(email.trim().toLowerCase());
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : '';
};

/**
 * Sanitize phone number
 * Removes non-numeric characters except + and spaces
 */
export const sanitizePhone = (phone: string): string => {
    return phone.replace(/[^\d+\s()-]/g, '').trim();
};

/**
 * Sanitize SQL-like input to prevent SQL injection
 * Note: This is a basic sanitization. Always use parameterized queries on the backend!
 */
export const sanitizeSqlInput = (input: string): string => {
    // Remove common SQL injection patterns
    const dangerous = /('|"|;|--|\*|\/\*|\*\/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter|union|script|javascript|onerror|onload)/gi;
    return input.replace(dangerous, '');
};

/**
 * Sanitize file name
 * Removes path traversal attempts and dangerous characters
 */
export const sanitizeFileName = (fileName: string): string => {
    // Remove path traversal attempts
    let sanitized = fileName.replace(/\.\./g, '');
    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>:"|?*\x00-\x1F]/g, '');
    // Remove leading/trailing spaces and dots
    sanitized = sanitized.trim().replace(/^\.+/, '');
    return sanitized;
};

/**
 * Sanitize URL to prevent javascript: and data: URLs
 */
export const sanitizeUrl = (url: string): string => {
    const sanitized = url.trim();
    // Block javascript: and data: URLs
    if (/^(javascript|data):/i.test(sanitized)) {
        return '';
    }
    return sanitized;
};

/**
 * Validate and sanitize number input
 */
export const sanitizeNumber = (input: string | number, options?: {
    min?: number;
    max?: number;
    decimals?: number;
}): number | null => {
    const num = typeof input === 'string' ? parseFloat(input) : input;

    if (isNaN(num)) return null;

    let sanitized = num;

    if (options?.min !== undefined && sanitized < options.min) {
        sanitized = options.min;
    }

    if (options?.max !== undefined && sanitized > options.max) {
        sanitized = options.max;
    }

    if (options?.decimals !== undefined) {
        sanitized = parseFloat(sanitized.toFixed(options.decimals));
    }

    return sanitized;
};

/**
 * Sanitize object by applying sanitization to all string values
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeText(value);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
};

export default {
    sanitizeHtml,
    sanitizeText,
    sanitizeEmail,
    sanitizePhone,
    sanitizeSqlInput,
    sanitizeFileName,
    sanitizeUrl,
    sanitizeNumber,
    sanitizeObject
};
