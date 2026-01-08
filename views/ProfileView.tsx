import React, { useState, useEffect } from 'react';
import { User, Edit2, Lock, Camera, Save, X, Mail, Phone, MapPin, Calendar as CalendarIcon, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../services/apiService';
import { sanitizeText, sanitizePhone } from '../utils/sanitize';
import { LoadingSpinner } from '../components/LoadingFallback';

const ProfileView: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile form state
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        dateOfBirth: user?.dateOfBirth || ''
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Password strength indicator
    const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

        return {
            strength,
            label: labels[strength - 1] || 'Rất yếu',
            color: colors[strength - 1] || 'bg-red-500'
        };
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);

            // Sanitize inputs
            const sanitizedData = {
                fullName: sanitizeText(formData.fullName),
                phone: sanitizePhone(formData.phone),
                address: sanitizeText(formData.address),
                dateOfBirth: formData.dateOfBirth
            };

            const response = await profileAPI.updateProfile(sanitizedData);

            // Update context
            updateUser(response.user);

            toast.success('Cập nhật hồ sơ thành công!');
            setIsEditing(false);
        } catch (error: any) {
            console.error('Update profile error:', error);
            toast.error(error.message || 'Không thể cập nhật hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            // Validation
            if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                toast.error('Vui lòng điền đầy đủ thông tin');
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error('Mật khẩu xác nhận không khớp');
                return;
            }

            if (passwordData.newPassword.length < 8) {
                toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
                return;
            }

            setLoading(true);

            await profileAPI.changePassword(passwordData.oldPassword, passwordData.newPassword);

            toast.success('Đổi mật khẩu thành công!');
            setIsChangingPassword(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error('Change password error:', error);
            toast.error(error.message || 'Không thể đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(passwordData.newPassword);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Hồ sơ cá nhân</h1>
                    <p className="text-slate-600 mt-1">Quản lý thông tin tài khoản của bạn</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Cover & Avatar */}
                <div className="relative h-32 bg-gradient-to-r from-red-500 to-red-600">
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <User size={48} className="text-slate-400" />
                            </div>
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                                <Camera size={20} className="text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20 px-8 pb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`
                  inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold
                  ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        user?.role === 'DOCTOR' ? 'bg-blue-100 text-blue-700' :
                                            user?.role === 'RECEPTIONIST' ? 'bg-green-100 text-green-700' :
                                                'bg-slate-100 text-slate-700'}
                `}>
                                    <Shield size={14} />
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                            >
                                <Edit2 size={18} />
                                Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <Mail size={16} className="inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 cursor-not-allowed"
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <User size={16} className="inline mr-2" />
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                value={isEditing ? formData.fullName : user?.name || ''}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl ${isEditing
                                        ? 'border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                                    }`}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <Phone size={16} className="inline mr-2" />
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                value={isEditing ? formData.phone : user?.phone || 'Chưa cập nhật'}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                disabled={!isEditing}
                                placeholder="0123456789"
                                className={`w-full px-4 py-3 border rounded-xl ${isEditing
                                        ? 'border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                                    }`}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <CalendarIcon size={16} className="inline mr-2" />
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                value={isEditing ? formData.dateOfBirth : user?.dateOfBirth || ''}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl ${isEditing
                                        ? 'border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                                    }`}
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <MapPin size={16} className="inline mr-2" />
                                Địa chỉ
                            </label>
                            <textarea
                                value={isEditing ? formData.address : user?.address || 'Chưa cập nhật'}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                disabled={!isEditing}
                                rows={3}
                                placeholder="Nhập địa chỉ của bạn"
                                className={`w-full px-4 py-3 border rounded-xl resize-none ${isEditing
                                        ? 'border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'bg-slate-50 border-slate-200 cursor-not-allowed'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Edit Actions */}
                    {isEditing && (
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <LoadingSpinner size="sm" /> : <Save size={18} />}
                                Lưu thay đổi
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        fullName: user?.name || '',
                                        phone: user?.phone || '',
                                        address: user?.address || '',
                                        dateOfBirth: user?.dateOfBirth || ''
                                    });
                                }}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                <X size={18} />
                                Hủy
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Lock size={24} />
                            Đổi mật khẩu
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">Cập nhật mật khẩu để bảo mật tài khoản</p>
                    </div>

                    {!isChangingPassword && (
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Đổi mật khẩu
                        </button>
                    )}
                </div>

                {isChangingPassword && (
                    <div className="space-y-4">
                        {/* Old Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Mật khẩu hiện tại
                            </label>
                            <input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                placeholder="Nhập mật khẩu mới"
                            />

                            {/* Password Strength Indicator */}
                            {passwordData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600">{passwordStrength.label}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Xác nhận mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <p className="text-xs text-red-600 mt-1">Mật khẩu không khớp</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleChangePassword}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <LoadingSpinner size="sm" /> : <Lock size={18} />}
                                Đổi mật khẩu
                            </button>
                            <button
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                disabled={loading}
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileView;
