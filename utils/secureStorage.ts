import CryptoJS from 'crypto-js';

// Encryption key - In production, this should come from environment variables
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'medcloud-default-key-change-in-production';

/**
 * Secure storage wrapper for localStorage with AES encryption
 */
class SecureStorage {
    /**
     * Encrypt and store data
     */
    setItem(key: string, value: any, expirationMinutes?: number): void {
        try {
            const data = {
                value,
                timestamp: Date.now(),
                expiration: expirationMinutes ? Date.now() + expirationMinutes * 60 * 1000 : null
            };

            const encrypted = CryptoJS.AES.encrypt(
                JSON.stringify(data),
                ENCRYPTION_KEY
            ).toString();

            localStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('SecureStorage: Failed to set item', error);
            throw new Error('Failed to store encrypted data');
        }
    }

    /**
     * Retrieve and decrypt data
     */
    getItem<T = any>(key: string): T | null {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;

            const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
            if (!decrypted) return null;

            const data = JSON.parse(decrypted);

            // Check expiration
            if (data.expiration && Date.now() > data.expiration) {
                this.removeItem(key);
                return null;
            }

            return data.value as T;
        } catch (error) {
            console.error('SecureStorage: Failed to get item', error);
            return null;
        }
    }

    /**
     * Remove item from storage
     */
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Clear all items
     */
    clear(): void {
        localStorage.clear();
    }

    /**
     * Check if item exists and is not expired
     */
    hasItem(key: string): boolean {
        return this.getItem(key) !== null;
    }
}

// Export singleton instance
export const secureStorage = new SecureStorage();

export default secureStorage;
