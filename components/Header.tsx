
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Bell, Search, User as UserIcon, LogOut, ChevronDown, Settings, ShieldCheck, Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
      {/* Logo mobile */}
      <div className="flex lg:hidden items-center space-x-2 mr-4">
        <div className="bg-[#da251d] p-1.5 rounded-lg">
          <ShieldCheck className="text-[#fffe00]" size={18} />
        </div>
        <span className="text-sm font-black text-slate-900 tracking-tighter">MEDCLOUD</span>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="w-full bg-slate-50 border border-slate-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="hidden sm:flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <ShieldCheck size={14} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Secured</span>
        </div>

        <NotificationBell />

        <div className="relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 md:space-x-3 pl-2 md:pl-6 md:border-l md:border-slate-200 cursor-pointer group select-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{user.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-extrabold">
                {user.role === UserRole.PATIENT ? `BN: ${user.id}` : user.role}
              </p>
            </div>
            <div className="w-9 h-9 md:w-11 md:h-11 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm overflow-hidden group-hover:border-blue-300 transition-all">
              <UserIcon size={18} />
            </div>
          </div>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-3 border-b border-slate-50 mb-1 md:hidden">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <UserIcon size={16} className="text-slate-400" />
                  <span className="font-medium">Hồ sơ cá nhân</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <Settings size={16} className="text-slate-400" />
                  <span className="font-medium">Cài đặt</span>
                </button>
                <div className="h-px bg-slate-50 my-1 mx-4"></div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-4 py-4 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="font-bold">Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
