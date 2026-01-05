
import React from 'react';
import { MOCK_RECORDS } from '../constants';
import { UserRole } from '../types';
import { FileText, Search, User as UserIcon, Calendar, Download, Eye, ShieldAlert, Lock, ChevronRight } from 'lucide-react';

interface MedicalRecordViewProps {
  role: UserRole;
}

const MedicalRecordView: React.FC<MedicalRecordViewProps> = ({ role }) => {
  const hasClinicalAccess = role === UserRole.ADMIN || role === UserRole.DOCTOR;

  if (!hasClinicalAccess) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="bg-rose-50 p-6 rounded-full text-rose-500 mb-6">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Truy cập bị giới hạn</h2>
        <p className="text-slate-500 text-sm max-w-sm">Chỉ Bác sĩ điều trị mới được phép xem bệnh án chi tiết để đảm bảo quyền riêng tư bệnh nhân.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase">Hồ sơ bệnh án điện tử</h1>
          <p className="text-slate-500 text-xs md:text-sm">Truy xuất lịch sử điều trị nhanh chóng, bảo mật.</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl border border-rose-100 font-bold text-[10px] uppercase">
          <Lock size={14} /> <span>Hệ thống giám sát bảo mật active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection Mobile List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Tìm theo Mã BN..." className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none" />
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-widest">BN vừa cập nhật</div>
            <div className="divide-y divide-slate-50">
              {['Nguyễn Văn A', 'Lê Văn C', 'Trần Thị E'].map((name, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer active:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black border border-blue-100">{name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">P00{i+124}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Medical Records */}
        <div className="lg:col-span-2 space-y-6">
          {MOCK_RECORDS.map((record) => (
            <div key={record.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{record.date}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">BS: {record.doctorName}</p>
                  </div>
                </div>
                <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500"><Download size={18} /></button>
              </div>
              
              <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Chẩn đoán lâm sàng</label>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs md:text-sm font-medium text-slate-700 leading-relaxed shadow-inner">
                    {record.diagnosis}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Toa thuốc chỉ định</label>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-xs md:text-sm font-mono font-bold text-emerald-800 shadow-inner">
                    {record.prescription}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 md:px-8 md:py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center text-[9px] font-bold text-slate-400 uppercase">
                  <Eye size={12} className="mr-2" /> ID: {record.id}
                </div>
                <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Chi tiết xét nghiệm</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordView;
