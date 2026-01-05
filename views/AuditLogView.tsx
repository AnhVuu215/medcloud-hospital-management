
import React, { useState, useMemo } from 'react';
import { MOCK_LOGS } from '../constants';
import { 
  ShieldCheck, 
  Info, 
  Search, 
  Download, 
  Trash2, 
  Calendar, 
  Filter, 
  User as UserIcon, 
  Activity, 
  ChevronDown,
  X
} from 'lucide-react';

const AuditLogView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      // 1. Lọc theo text (Tên người dùng hoặc IP)
      const matchesSearch = 
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery);

      // 2. Lọc theo loại hành động
      let matchesAction = true;
      if (actionFilter !== 'ALL') {
        matchesAction = log.action.startsWith(actionFilter);
      }

      // 3. Lọc theo thời gian (giả định format timestamp YYYY-MM-DD HH:mm:ss)
      let matchesDate = true;
      const logDate = log.timestamp.split(' ')[0]; // Lấy phần YYYY-MM-DD
      if (startDate && logDate < startDate) matchesDate = false;
      if (endDate && logDate > endDate) matchesDate = false;

      return matchesSearch && matchesAction && matchesDate;
    });
  }, [searchQuery, actionFilter, startDate, endDate]);

  const resetFilters = () => {
    setSearchQuery('');
    setActionFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <ShieldCheck className="mr-3 text-blue-600" />
            Nhật ký truy vết (Audit Log)
          </h1>
          <p className="text-slate-500 text-sm">Hệ thống ghi nhận mọi thao tác với dữ liệu y tế nhạy cảm theo tiêu chuẩn HIPAA.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Download size={16} />
            <span>Xuất log (CSV)</span>
          </button>
          <button className="flex items-center space-x-2 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all active:scale-95">
            <Trash2 size={16} />
            <span>Xóa log cũ</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start space-x-3 text-blue-800 text-sm shadow-sm">
        <Info className="mt-0.5 flex-shrink-0" size={18} />
        <p className="leading-relaxed">
          Nhật ký hệ thống được ghi nhận tự động và <b>bất biến</b>. 
          Các bản ghi này phục vụ công tác giám sát định kỳ, đảm bảo không có sự truy cập trái phép vào hồ sơ bệnh nhân.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Bộ lọc nâng cao</h3>
          </div>
          {(searchQuery || actionFilter !== 'ALL' || startDate || endDate) && (
            <button 
              onClick={resetFilters}
              className="text-[11px] font-bold text-rose-600 flex items-center hover:underline"
            >
              <X size={14} className="mr-1" /> Xóa tất cả bộ lọc
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by User/IP */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Người dùng / IP</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Tên nhân viên, địa chỉ IP..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Action Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Loại hành động</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer font-medium"
              >
                <option value="ALL">Tất cả hành động</option>
                <option value="TRUY_CAP">Truy cập dữ liệu (READ)</option>
                <option value="CAP_NHAT">Cập nhật dữ liệu (UPDATE)</option>
                <option value="TAO_MOI">Tạo mới (CREATE)</option>
                <option value="XOA">Xóa dữ liệu (DELETE)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Date Range Start */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Từ ngày</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Date Range End */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Đến ngày</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-700">
            <span>Dữ liệu thời gian thực</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-slate-400 ml-2 font-normal">Tìm thấy {filteredLogs.length} kết quả</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời gian</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Người thực hiện</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hành động</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đối tượng đích</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Địa chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs font-mono text-slate-600">
                        <Calendar size={12} className="mr-2 text-slate-400" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-200">
                          <UserIcon size={12} />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        log.action.includes('CAP_NHAT') 
                          ? 'bg-amber-50 text-amber-700 border-amber-100' 
                          : log.action.includes('XOA')
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : log.action.includes('TAO_MOI')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-slate-700 leading-relaxed max-w-xs truncate" title={log.target}>
                        {log.target}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {log.ipAddress}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="bg-slate-50 p-4 rounded-full">
                        <Search size={32} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-400 italic">Không có bản ghi nào khớp với điều kiện lọc</p>
                      <button 
                        onClick={resetFilters}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Thử xóa các bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Simulated) */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trang 1 / 1</p>
          <div className="flex space-x-2">
            <button disabled className="px-3 py-1 rounded bg-white border border-slate-200 text-slate-300 text-[10px] font-bold opacity-50">Trước</button>
            <button disabled className="px-3 py-1 rounded bg-white border border-slate-200 text-slate-300 text-[10px] font-bold opacity-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogView;
