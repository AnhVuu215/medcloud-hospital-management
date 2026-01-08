import React from 'react';

/**
 * Skeleton loader for table rows (desktop)
 */
export const SkeletonTableRow: React.FC = () => {
    return (
        <tr className="animate-pulse">
            <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-20"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 rounded w-28 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-24"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 rounded w-36"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-6 bg-slate-200 rounded-full w-24"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-8 bg-slate-200 rounded w-8 ml-auto"></div>
            </td>
        </tr>
    );
};

/**
 * Skeleton loader for full table
 */
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">
                            <div className="h-3 bg-slate-300 rounded w-20 animate-pulse"></div>
                        </th>
                        <th className="px-6 py-4">
                            <div className="h-3 bg-slate-300 rounded w-16 animate-pulse"></div>
                        </th>
                        <th className="px-6 py-4">
                            <div className="h-3 bg-slate-300 rounded w-24 animate-pulse"></div>
                        </th>
                        <th className="px-6 py-4">
                            <div className="h-3 bg-slate-300 rounded w-20 animate-pulse"></div>
                        </th>
                        <th className="px-6 py-4">
                            <div className="h-3 bg-slate-300 rounded w-16 animate-pulse"></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[...Array(rows)].map((_, i) => (
                        <SkeletonTableRow key={i} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/**
 * Skeleton loader for mobile card list
 */
export const SkeletonMobileCard: React.FC = () => {
    return (
        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                    <div>
                        <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                </div>
                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
                <div>
                    <div className="h-3 bg-slate-200 rounded w-12 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                </div>
                <div>
                    <div className="h-3 bg-slate-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                </div>
            </div>

            <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
                <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
            </div>
        </div>
    );
};

export default SkeletonTable;
