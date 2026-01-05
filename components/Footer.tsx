
import React from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Mail, 
  Globe, 
  Github, 
  Facebook, 
  ExternalLink,
  Activity,
  Lock,
  Heart
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-slate-200 pt-10 pb-8 bg-white/50 backdrop-blur-sm -mx-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Column 1: Branding & Status */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-[#da251d] p-1.5 rounded-lg shadow-md">
                <Heart size={18} className="text-[#fffe00]" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900">MedCloud VN</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Hệ thống lõi quản lý y tế số thế hệ mới. 
              Tối ưu hóa quy trình, bảo mật dữ liệu và nâng cao trải nghiệm bệnh nhân.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Hệ thống: Ổn định (99.9%)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Dịch vụ y tế</h4>
            <ul className="space-y-2">
              <li><button className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center group">
                <ChevronRight size={12} className="mr-1 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" /> 
                Đặt lịch khám chuyên khoa
              </button></li>
              <li><button className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center group">
                <ChevronRight size={12} className="mr-1 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" /> 
                Tra cứu bệnh án điện tử
              </button></li>
              <li><button className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center group">
                <ChevronRight size={12} className="mr-1 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" /> 
                Tư vấn Telemedicine
              </button></li>
              <li><button className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center group">
                <ChevronRight size={12} className="mr-1 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" /> 
                Hệ thống nhà thuốc GPP
              </button></li>
            </ul>
          </div>

          {/* Column 3: Security & Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Bảo mật & Hỗ trợ</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-500">
                <Phone size={14} className="text-blue-500" />
                <span className="text-xs font-bold">Hotline: 1900 6868</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500">
                <Mail size={14} className="text-blue-500" />
                <span className="text-xs font-medium">support@medcloud.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                  <Lock size={14} className="text-slate-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Chứng chỉ SSL/TLS 1.3</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                  <ShieldCheck size={14} className="text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Tiêu chuẩn HIPAA</span>
              </div>
            </div>
          </div>

          {/* Column 4: Location & Social */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Kết nối với chúng tôi</h4>
            <p className="text-[11px] text-slate-500 font-medium italic">
              Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh.
            </p>
            <div className="flex space-x-3">
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                <Facebook size={18} />
              </button>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                <Github size={18} />
              </button>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-blue-400 hover:text-white hover:border-blue-400 transition-all shadow-sm">
                <Globe size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[11px] font-bold text-slate-400 flex items-center">
            <span>© {currentYear} MEDCLOUD VN. ALL RIGHTS RESERVED.</span>
            <span className="mx-2 hidden md:inline">|</span>
            <span className="hidden md:inline">DEVELOPED FOR GRADUATION PROJECT</span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Điều khoản sử dụng</button>
            <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Chính sách bảo mật</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default Footer;
