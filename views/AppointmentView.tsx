

import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_APPOINTMENTS as INITIAL_APPOINTMENTS, SPECIALIZATIONS } from '../constants';
import { UserRole, Appointment, User } from '../types';
import {
  Calendar,
  Search,
  MoreVertical,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronDown,
  X,
  Check,
  ArrowUpDown,
  ChevronUp,
  LayoutGrid,
  List,
  Filter,
  CalendarDays,
  RefreshCw,
  Stethoscope,
  ClipboardList,
  Pill,
  MapPin,
  Phone
} from 'lucide-react';
import BookingModal from '../components/BookingModal';
import AppointmentActions from '../components/AppointmentActions';
import { appointmentAPI } from '../services/apiService';

interface AppointmentViewProps {
  role: UserRole;
  user?: User;
}

type SortKey = 'patientName' | 'doctorName' | 'date' | 'status' | 'fee';
interface SortConfig {
  key: SortKey;
  direction: 'asc' | 'desc';
}

const AppointmentView: React.FC<AppointmentViewProps> = ({ role, user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'date', direction: 'desc' });
  const [notification, setNotification] = useState<string | null>(null);

  // States cho thăm khám
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [activeApt, setActiveApt] = useState<Appointment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <span className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100"><CheckCircle2 size={12} className="mr-1" />Xác nhận</span>;
      case 'PENDING': return <span className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-100"><Clock size={12} className="mr-1" />Chờ</span>;
      case 'CANCELLED': return <span className="flex items-center text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-rose-100"><XCircle size={12} className="mr-1" />Đã hủy</span>;
      case 'COMPLETED': return <span className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-100"><CheckCircle2 size={12} className="mr-1" />Đã khám</span>;
      default: return null;
    }
  };

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];
    if (specFilter) result = result.filter(apt => apt.specialization === specFilter);
    if (dateFilter) result = result.filter(apt => apt.date === dateFilter);
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(apt =>
        apt.patientName.toLowerCase().includes(query) ||
        apt.doctorName.toLowerCase().includes(query)
      );
    }
    return result;
  }, [appointments, searchQuery, specFilter, dateFilter]);

  // Handlers for appointment actions
  const handleViewDetails = async (appointmentId: string) => {
    try {
      const { appointment } = await appointmentAPI.getById(appointmentId);
      alert(`Chi tiết lịch hẹn:\n${JSON.stringify(appointment, null, 2)}`);
    } catch (error) {
      console.error('Failed to get appointment details:', error);
      alert('Không thể xem chi tiết lịch hẹn');
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, newStatus);
      // Update local state
      setAppointments(prev => prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
      setNotification(`Đã cập nhật trạng thái thành ${newStatus}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const handleCancel = async (appointmentId: string) => {
    const reason = prompt('Lý do hủy lịch hẹn:');
    if (!reason) return;

    try {
      await appointmentAPI.delete(appointmentId, reason);
      setAppointments(prev => prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'CANCELLED' } : apt
      ));
      setNotification('Đã hủy lịch hẹn');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Không thể hủy lịch hẹn');
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Bạn có chắc muốn xóa lịch hẹn này?')) return;

    try {
      await appointmentAPI.delete(appointmentId);
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      setNotification('Đã xóa lịch hẹn');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('Không thể xóa lịch hẹn');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">Lịch khám của bạn</h1>
          <p className="text-slate-500 text-xs md:text-sm">Theo dõi và điều phối lịch hẹn thời gian thực.</p>
        </div>
        {(role === UserRole.ADMIN || role === UserRole.RECEPTIONIST || role === UserRole.PATIENT) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#da251d] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} /> <span>Đặt lịch mới</span>
          </button>
        )}
      </div>

      {/* Filters Mobile Friendly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Tìm bệnh nhân..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm appearance-none outline-none"
          >
            <option value="">Tất cả chuyên khoa</option>
            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm outline-none"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bệnh nhân</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bác sĩ</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.map(apt => (
              <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{apt.patientName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {apt.patientId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-800">{apt.doctorName}</div>
                  <div className="text-xs text-slate-500">{apt.specialization}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  {apt.time} | {apt.date}
                </td>
                <td className="px-6 py-4">{getStatusBadge(apt.status)}</td>
                <td className="px-6 py-4 text-right relative">
                  <AppointmentActions
                    appointmentId={apt.id}
                    status={apt.status}
                    onViewDetails={() => handleViewDetails(apt.id)}
                    onUpdateStatus={(status) => handleUpdateStatus(apt.id, status)}
                    onCancel={() => handleCancel(apt.id)}
                    onDelete={() => handleDelete(apt.id)}
                    userRole={role}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="lg:hidden space-y-4">
        {filteredAppointments.map(apt => (
          <div key={apt.id} className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm active:scale-[0.98] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border border-red-100">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{apt.patientName}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Mã: {apt.patientId}</p>
                </div>
              </div>
              {getStatusBadge(apt.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Bác sĩ</p>
                <p className="text-xs font-bold text-slate-800">{apt.doctorName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Thời gian</p>
                <p className="text-xs font-bold text-slate-800">{apt.time} - {apt.date}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-xl text-xs font-bold border border-slate-100">Chi tiết</button>
              {apt.status === 'CONFIRMED' && role === UserRole.DOCTOR && (
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-200">Thăm khám</button>
              )}
              {apt.status === 'PENDING' && (role === UserRole.RECEPTIONIST || role === UserRole.ADMIN) && (
                <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-emerald-200">Xác nhận</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold italic">Không có lịch hẹn nào được tìm thấy.</p>
        </div>
      )}

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { }} />
    </div>
  );
};

const UserIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export default AppointmentView;
