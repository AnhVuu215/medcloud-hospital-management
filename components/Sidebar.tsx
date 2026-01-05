
import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  FileText, 
  ShieldCheck, 
  PlusCircle,
  Image as ImageIcon,
  Pill,
  CreditCard,
  User as UserIcon,
  Activity,
  Users as UsersIcon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
    { id: 'appointments', label: 'Quản lý lịch khám', icon: <CalendarCheck size={20} />, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.PATIENT] },
    { id: 'users', label: 'Quản lý nhân sự', icon: <UsersIcon size={20} />, roles: [UserRole.ADMIN] },
    { id: 'patient-portal', label: 'Cổng Bệnh nhân', icon: <UserIcon size={20} />, roles: [UserRole.PATIENT] },
    { id: 'patient-records', label: 'Sổ sức khỏe', icon: <Activity size={20} />, roles: [UserRole.PATIENT] },
    { id: 'records', label: 'Bệnh án điện tử', icon: <FileText size={20} />, roles: [UserRole.ADMIN, UserRole.DOCTOR] },
    { id: 'pharmacy', label: 'Nhà thuốc & Kho', icon: <Pill size={20} />, roles: [UserRole.ADMIN, UserRole.RECEPTIONIST] },
    { id: 'payments', label: 'Thanh toán & BHYT', icon: <CreditCard size={20} />, roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT] },
    { id: 'image-edit', label: 'Xử lý ảnh y tế', icon: <ImageIcon size={20} />, roles: [UserRole.ADMIN, UserRole.DOCTOR] },
    { id: 'logs', label: 'Nhật ký hệ thống', icon: <ShieldCheck size={20} />, roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="hidden lg:flex w-64 bg-[#da251d] text-[#fffe00] flex-col shadow-xl z-40">
      <div className="p-6 flex items-center space-x-3 border-b border-red-800">
        <div className="bg-[#fffe00] p-2 rounded-lg shadow-lg">
          <PlusCircle className="text-[#da251d]" size={24} />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-[#fffe00] drop-shadow-sm">MedCloud VN</span>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1">
        {menuItems.filter(item => item.roles.includes(userRole)).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-[#b21c16] text-[#fffe00] shadow-inner shadow-black/20 font-bold border-l-4 border-[#fffe00]' 
                : 'text-red-100 hover:bg-[#b21c16] hover:text-[#fffe00]'
            }`}
          >
            <span className={activeTab === item.id ? 'text-[#fffe00]' : 'text-red-200'}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-red-900/40 m-4 rounded-xl text-[10px] text-red-200 text-center font-bold uppercase tracking-widest">
        Hệ thống lõi Y tế số
      </div>
    </div>
  );
};

export default Sidebar;
