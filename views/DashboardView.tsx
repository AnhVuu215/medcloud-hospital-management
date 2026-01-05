
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, Calendar, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Clock, ShieldAlert } from 'lucide-react';
import { UserRole, User } from '../types';

interface DashboardViewProps {
  user: User;
}

const data = [
  { name: 'T2', revenue: 4000, visits: 24 },
  { name: 'T3', revenue: 3000, visits: 18 },
  { name: 'T4', revenue: 2000, visits: 32 },
  { name: 'T5', revenue: 2780, visits: 25 },
  { name: 'T6', revenue: 1890, visits: 15 },
  { name: 'T7', revenue: 2390, visits: 21 },
  { name: 'CN', revenue: 3490, visits: 29 },
];

const DashboardView: React.FC<DashboardViewProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const isDoctor = user.role === UserRole.DOCTOR;

  const getStats = () => {
    if (isAdmin) {
      return [
        { label: 'Doanh thu', value: '158.4M', icon: <DollarSign className="text-amber-600" />, trend: '+18%', isUp: true },
        { label: 'Nhân sự', value: '12', icon: <Users className="text-blue-600" />, trend: 'Ổn định', isUp: true },
        { label: 'Lượt khám', value: '1.2K', icon: <Activity className="text-emerald-600" />, trend: '+12%', isUp: true },
        { label: 'Cảnh báo', value: '0', icon: <ShieldAlert className="text-rose-600" />, trend: 'Safe', isUp: true },
      ];
    }
    return [
      { label: 'Bệnh nhân chờ', value: '08', icon: <Clock className="text-amber-600" />, trend: 'Cao', isUp: false },
      { label: 'Hoàn tất', value: '14', icon: <Activity className="text-emerald-600" />, trend: '+2', isUp: true },
      { label: 'Hội chẩn', value: '02', icon: <Users className="text-rose-600" />, trend: 'Cần chú ý', isUp: false },
      { label: 'Hài lòng', value: '4.9', icon: <Activity className="text-blue-600" />, trend: '+0.1', isUp: true },
    ];
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">Tổng quan hệ thống</h1>
          <p className="text-slate-500 text-xs md:text-sm italic">Hệ thống đang được giám sát bởi MedCloud AI.</p>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
          <button className="whitespace-nowrap bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm">Báo cáo ngày</button>
          <button className="whitespace-nowrap bg-[#da251d] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 shadow-md shadow-red-500/10">Xuất Excel</button>
        </div>
      </div>

      {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {getStats().map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <div className="p-2 md:p-3 bg-slate-50 rounded-xl group-hover:bg-red-50 transition-colors">
                {stat.icon}
              </div>
              <div className={`text-[9px] md:text-[10px] font-bold ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-lg md:text-2xl font-black text-slate-900 mt-0.5">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section - Stack vertically on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm md:text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Doanh thu / Lượt khám</h3>
          <div className="h-60 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#da251d" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#da251d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey={isAdmin ? "revenue" : "visits"} stroke="#da251d" strokeWidth={3} fillOpacity={1} fill="url(#colorMain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm md:text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Công suất phòng khám</h3>
          <div className="h-60 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="visits" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
