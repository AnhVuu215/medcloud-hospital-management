import React from 'react';

/**
 * Skeleton loader for card layouts
 */
export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
        </div>
    );
};

/**
 * Skeleton loader for stat cards
 */
export const SkeletonStatCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
        </div>
    );
};

export default SkeletonCard;
