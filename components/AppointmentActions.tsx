import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, CheckCircle, XCircle, Trash2, Edit, Clock } from 'lucide-react';

interface AppointmentActionsProps {
    appointmentId: string;
    status: string;
    onViewDetails: () => void;
    onUpdateStatus: (status: string) => void;
    onCancel: () => void;
    onDelete: () => void;
    userRole: string;
}

const AppointmentActions: React.FC<AppointmentActionsProps> = ({
    appointmentId,
    status,
    onViewDetails,
    onUpdateStatus,
    onCancel,
    onDelete,
    userRole
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                >
                    {/* Xem chi tiết */}
                    <button
                        onClick={() => handleAction(onViewDetails)}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-3 transition-colors"
                    >
                        <Eye size={16} className="text-blue-600" />
                        <span>Xem chi tiết</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* Chuyển sang PENDING */}
                    {status !== 'PENDING' && (
                        <button
                            onClick={() => handleAction(() => onUpdateStatus('PENDING'))}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-amber-50 flex items-center space-x-3 transition-colors"
                        >
                            <Clock size={16} className="text-amber-600" />
                            <span>Đặt về Chờ xác nhận</span>
                        </button>
                    )}

                    {/* Xác nhận (PENDING → CONFIRMED) */}
                    {status !== 'CONFIRMED' && (
                        <button
                            onClick={() => handleAction(() => onUpdateStatus('CONFIRMED'))}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50 flex items-center space-x-3 transition-colors"
                        >
                            <CheckCircle size={16} className="text-emerald-600" />
                            <span>Xác nhận lịch hẹn</span>
                        </button>
                    )}

                    {/* Hoàn thành */}
                    {status !== 'COMPLETED' && status !== 'CANCELLED' && (
                        <button
                            onClick={() => handleAction(() => onUpdateStatus('COMPLETED'))}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors"
                        >
                            <CheckCircle size={16} className="text-blue-600" />
                            <span>Đánh dấu hoàn thành</span>
                        </button>
                    )}

                    {/* Hủy lịch */}
                    {status !== 'CANCELLED' && (
                        <>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button
                                onClick={() => handleAction(onCancel)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 flex items-center space-x-3 transition-colors"
                            >
                                <XCircle size={16} className="text-orange-600" />
                                <span>Hủy lịch hẹn</span>
                            </button>
                        </>
                    )}

                    {/* Xóa (chỉ Admin) */}
                    {userRole === 'ADMIN' && (
                        <>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button
                                onClick={() => handleAction(onDelete)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-3 transition-colors"
                            >
                                <Trash2 size={16} />
                                <span>Xóa lịch hẹn</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppointmentActions;
