
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, PlusCircle, Activity, ChevronRight } from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Giả lập xử lý API
    setTimeout(() => {
      const mockUser: User = {
        id: email === 'admin@medcloud.vn' ? 'ADMIN_01' : 'U_' + Math.floor(Math.random() * 1000),
        name: isLogin ? (email === 'admin@medcloud.vn' ? 'Quản trị viên Hệ thống' : 'Người dùng MedCloud') : name,
        email: email,
        role: email === 'admin@medcloud.vn' ? UserRole.ADMIN : role,
        status: 'ACTIVE'
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#da251d] text-[#fffe00] relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-800 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -left-10 top-20 w-40 h-40 bg-red-400 rounded-full opacity-20 blur-2xl"></div>
          
          <div className="relative z-10 flex items-center space-x-3">
            <div className="bg-[#fffe00] p-2 rounded-xl shadow-lg">
              <PlusCircle className="text-[#da251d]" size={32} />
            </div>
            <span className="text-3xl font-black tracking-tighter">MedCloud VN</span>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight">
              Giải pháp quản lý <br/> y tế thông minh & <br/> bảo mật tuyệt đối.
            </h1>
            <p className="text-red-100 text-lg opacity-90 max-w-sm">
              Đồng hành cùng các bệnh viện trong hành trình chuyển đổi số, tối ưu hóa quy trình thăm khám.
            </p>
            <div className="flex space-x-4 pt-4">
              <div className="bg-red-800/40 p-4 rounded-2xl border border-red-700/50 backdrop-blur-sm">
                <ShieldCheck size={24} className="mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Bảo mật</p>
                <p className="text-xs font-medium text-red-100">Chuẩn HIPAA</p>
              </div>
              <div className="bg-red-800/40 p-4 rounded-2xl border border-red-700/50 backdrop-blur-sm">
                <Activity size={24} className="mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Hiệu năng</p>
                <p className="text-xs font-medium text-red-100">Thời gian thực</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[10px] font-bold opacity-60 uppercase tracking-[0.2em]">
            © 2023 MedCloud - Hệ thống lõi Y tế số
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Đăng nhập để quản lý công việc y tế của bạn.' : 'Bắt đầu trải nghiệm chăm sóc sức khỏe số ngay hôm nay.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@medcloud.vn"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">Quên mật khẩu?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bạn là ai?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setRole(UserRole.PATIENT)}
                    className={`py-3 rounded-xl border-2 text-xs font-bold transition-all ${role === UserRole.PATIENT ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500'}`}
                  >
                    Bệnh nhân
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole(UserRole.DOCTOR)}
                    className={`py-3 rounded-xl border-2 text-xs font-bold transition-all ${role === UserRole.DOCTOR ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500'}`}
                  >
                    Bác sĩ
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLogin ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'} 
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 font-bold hover:underline"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
