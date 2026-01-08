
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { userAPI } from '../services/apiService';
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'DOCTOR', phone: '' });

  // Helper function to show notifications
  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000); // Clear after 3 seconds
  };

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getAll();
        setUsers(data.users);
      } catch (error: any) {
        console.error('Failed to fetch users:', error);
        showNotification(error.message || 'Không thể tải danh sách người dùng', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return <span className="flex items-center text-rose-600 bg-rose-50 px-2 py-1 rounded-lg text-[10px] font-bold border border-rose-100"><Shield size={12} className="mr-1" /> ADMIN</span>;
      case UserRole.DOCTOR: return <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-[10px] font-bold border border-blue-100"><UserCheck size={12} className="mr-1" /> BÁC SĨ</span>;
      case UserRole.RECEPTIONIST: return <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-[10px] font-bold border border-amber-100"><Users size={12} className="mr-1" /> LỄ TÂN</span>;
      default: return null;
    }
  };

  const filteredUsers = users.filter(u => {
    // Search filter
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

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
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
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
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${roleFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setRoleFilter(UserRole.DOCTOR)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${roleFilter === UserRole.DOCTOR
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              Bác sĩ
            </button>
            <button
              onClick={() => setRoleFilter(UserRole.RECEPTIONIST)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${roleFilter === UserRole.RECEPTIONIST
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              Lễ tân
            </button>
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
                      <button
                        onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => { setSelectedUser(user); setShowDeleteConfirm(true); }}
                        className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                      >
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-rose-50 rounded-full">
                  <Trash2 className="text-rose-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa người dùng</h3>
                  <p className="text-sm text-slate-500">Hành động này không thể hoàn tác</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-700">
                Bạn có chắc chắn muốn xóa người dùng <span className="font-bold">{selectedUser.name}</span>?
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Người dùng sẽ được đánh dấu là đã xóa và không còn hiển thị trong danh sách.
              </p>
            </div>

            <div className="p-6 bg-slate-50 flex space-x-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setSelectedUser(null); }}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={async () => {
                  try {
                    await userAPI.delete(selectedUser.userId);
                    setUsers(users.filter(u => u.userId !== selectedUser.userId));
                    showNotification(`Đã xóa người dùng ${selectedUser.name}`, 'success');
                  } catch (error: any) {
                    showNotification(error.message || 'Không thể xóa người dùng', 'error');
                  }
                  setShowDeleteConfirm(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <UserPlus className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Thêm nhân viên mới</h3>
                  <p className="text-sm text-slate-500">Tạo tài khoản cho cán bộ y tế</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Họ tên</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Vai trò</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none"
                >
                  <option value="DOCTOR">Bác sĩ</option>
                  <option value="RECEPTIONIST">Lễ tân</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none"
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex space-x-3">
              <button
                onClick={() => { setShowAddModal(false); setUserForm({ name: '', email: '', password: '', role: 'DOCTOR', phone: '' }); }}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:5000/api/auth/register', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify(userForm)
                    });
                    if (!response.ok) throw new Error('Failed to create user');
                    const data = await response.json();
                    setUsers([...users, data.user]);
                    showNotification(`Đã thêm nhân viên ${userForm.name}`, 'success');
                    setShowAddModal(false);
                    setUserForm({ name: '', email: '', password: '', role: 'DOCTOR', phone: '' });
                  } catch (error: any) {
                    showNotification(error.message || 'Không thể thêm nhân viên', 'error');
                  }
                }}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[200] px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-2 ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          } text-white font-bold`}>
          {notification.msg}
        </div>
      )}
    </div>
  );
};

export default UserManagementView;
