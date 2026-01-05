
import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  User as UserIcon, 
  Activity, 
  Settings,
  Pill,
  CreditCard
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const isPatient = userRole === UserRole.PATIENT;

  const navItems = isPatient ? [
    { id: 'patient-portal', label: 'Trang chủ', icon: <LayoutDashboard size={20} /> },
    { id: 'appointments', label: 'Lịch khám', icon: <CalendarCheck size={20} /> },
    { id: 'patient-records', label: 'Sức khỏe', icon: <Activity size={20} /> },
    { id: 'payments', label: 'Ví y tế', icon: <CreditCard size={20} /> },
  ] : [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: 'appointments', label: 'Lịch hẹn', icon: <CalendarCheck size={20} /> },
    { id: 'pharmacy', label: 'Kho thuốc', icon: <Pill size={20} /> },
    { id: 'logs', label: 'Nhật ký', icon: <Settings size={20} />, roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 pb-safe-area-inset-bottom z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.filter(item => !item.roles || item.roles.includes(userRole)).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === item.id ? 'text-[#da251d]' : 'text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-lg transition-transform ${activeTab === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-bold mt-0.5 ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <span className="w-1 h-1 bg-[#da251d] rounded-full mt-0.5"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
