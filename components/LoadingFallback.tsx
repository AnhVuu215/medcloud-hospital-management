import React from 'react';

/**
 * Loading fallback component for React.Suspense
 * Shows a professional loading spinner while lazy-loaded components are loading
 */
export const LoadingFallback: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
                {/* Spinner */}
                <div className="relative mx-auto mb-6">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
                </div>

                {/* Loading text */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">Đang tải...</h3>
                <p className="text-sm text-slate-500">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
};

/**
 * Minimal loading spinner for smaller components
 */
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div className={`${sizeClasses[size]} border-slate-200 border-t-red-600 rounded-full animate-spin`}></div>
    );
};

export default LoadingFallback;
