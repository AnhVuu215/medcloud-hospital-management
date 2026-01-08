import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Toast notification provider with custom styling matching MedCloud design
 */
export const ToastProvider: React.FC = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    borderRadius: '1rem',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
                success: {
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                    },
                    style: {
                        background: '#10b981',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                    style: {
                        background: '#ef4444',
                    },
                },
                loading: {
                    iconTheme: {
                        primary: '#3b82f6',
                        secondary: '#fff',
                    },
                    style: {
                        background: '#3b82f6',
                    },
                },
            }}
        />
    );
};

export default ToastProvider;
