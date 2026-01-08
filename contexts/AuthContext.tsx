import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { secureStorage } from '../utils/secureStorage';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token?: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Authentication Context Provider
 * Manages user authentication state globally
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Restore session from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const savedToken = localStorage.getItem('accessToken');

        if (savedUser && savedToken) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Failed to restore session:', error);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('accessToken');
            }
        }
    }, []);

    const login = (user: User, token?: string) => {
        setUser(user);

        // Persist to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (token) {
            localStorage.setItem('accessToken', token);
        }
    };

    const logout = () => {
        setUser(null);

        // Clear localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessToken');
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;
