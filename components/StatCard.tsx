import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'blue' | 'green' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            icon: 'bg-blue-600',
            text: 'text-blue-600'
        },
        green: {
            bg: 'bg-emerald-50',
            icon: 'bg-emerald-600',
            text: 'text-emerald-600'
        },
        orange: {
            bg: 'bg-orange-50',
            icon: 'bg-orange-600',
            text: 'text-orange-600'
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'bg-purple-600',
            text: 'text-purple-600'
        }
    };

    const colors = colorClasses[color];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-bold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-slate-500 ml-2">vs yesterday</span>
                        </div>
                    )}
                </div>
                <div className={`${colors.bg} p-3 rounded-xl`}>
                    <Icon className={`${colors.text}`} size={24} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
