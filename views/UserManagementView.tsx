
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User, UserRole } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Edit2,
  Trash2,
  UserCheck
} from 'lucide-react';

const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return <span className="flex items-center text-rose-600 bg-rose-50 px-2 py-1 rounded-lg text-[10px] font-bold border border-rose-100"><Shield size={12} className="mr-1"/> ADMIN</span>;
      case UserRole.DOCTOR: return <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-[10px] font-bold border border-blue-100"><UserCheck size={12} className="mr-1"/> BÁC SĨ</span>;
      case UserRole.RECEPTIONIST: return <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-[10px] font-bold border border-amber-100"><Users size={12} className="mr-1"/> LỄ TÂN</span>;
      default: return null;
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Users className="mr-3 text-red-600" />
            Quản lý nhân sự
          </h1>
          <p className="text-slate-500 text-sm">Quản lý tài khoản cán bộ nhân viên y tế và phân quyền hệ thống.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <UserPlus size={18} /> 
          <span>Thêm nhân viên mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
          <div className="flex space-x-2">
             <button className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Tất cả</button>
             <button className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Bác sĩ</button>
             <button className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Lễ tân</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Họ tên & Tài khoản</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vai trò</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Truy cập cuối</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <div className="flex items-center text-[11px] text-slate-400">
                          <Mail size={12} className="mr-1" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit border border-emerald-100">
                      <CheckCircle2 size={12} className="mr-1" /> ĐANG HOẠT ĐỘNG
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                      <Clock size={12} className="mr-1.5 text-slate-400" />
                      {user.lastLogin || 'Chưa truy cập'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementView;
