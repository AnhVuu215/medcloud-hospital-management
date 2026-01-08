import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'default' | 'subtle';
}

/**
 * Reusable empty state component
 * Displays when there's no data to show with optional action button
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    variant = 'default'
}) => {
    const isSubtle = variant === 'subtle';

    return (
        <div className={`
      text-center py-16 px-6 rounded-3xl
      ${isSubtle ? 'bg-transparent' : 'bg-white border border-dashed border-slate-200'}
    `}>
            {/* Icon */}
            <div className="flex justify-center mb-6">
                <div className={`
          p-4 rounded-2xl
          ${isSubtle ? 'bg-slate-100' : 'bg-gradient-to-br from-slate-50 to-slate-100'}
        `}>
                    <Icon
                        size={48}
                        className={isSubtle ? 'text-slate-300' : 'text-slate-400'}
                        strokeWidth={1.5}
                    />
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 mb-2">
                {title}
            </h3>

            {/* Description */}
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {description}
            </p>

            {/* Action Button */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gradient-to-r from-red-600 to-red-700
            hover:from-red-700 hover:to-red-800
            text-white font-bold rounded-xl
            shadow-lg shadow-red-200
            transition-all duration-200
            hover:scale-105 active:scale-95
          "
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
