import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, AlertTriangle, TrendingUp, Activity, Download } from 'lucide-react';
import StatCard from '../components/StatCard';
import { reportAPI } from '../services/apiService';
import { exportDailyReport } from '../utils/excelExport';

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await reportAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportDailyReport(stats);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Xuất báo cáo thất bại. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Tổng quan hệ thống hôm nay</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          <span>{exporting ? 'Đang xuất...' : 'Xuất Excel'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Bệnh nhân"
          value={stats?.totalPatients || 0}
          icon={Users}
          color="blue"
          trend={stats?.newPatientsToday > 0 ? {
            value: stats.newPatientsToday,
            isPositive: true
          } : undefined}
        />

        <StatCard
          title="Lịch hẹn hôm nay"
          value={stats?.appointmentsToday || 0}
          icon={Calendar}
          color="green"
          trend={stats?.completedToday > 0 ? {
            value: Math.round((stats.completedToday / stats.appointmentsToday) * 100),
            isPositive: true
          } : undefined}
        />

        <StatCard
          title="Doanh thu hôm nay"
          value={`${(stats?.revenueToday || 0).toLocaleString('vi-VN')} ₫`}
          icon={DollarSign}
          color="purple"
        />

        <StatCard
          title="Thuốc sắp hết"
          value={stats?.lowStockMedicines || 0}
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Lịch hẹn hôm nay</h3>
            <Activity className="text-blue-600" size={20} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tổng số</span>
              <span className="text-2xl font-bold text-slate-900">{stats?.appointmentsToday || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Đã hoàn thành</span>
              <span className="text-lg font-bold text-emerald-600">{stats?.completedToday || 0}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{
                  width: stats?.appointmentsToday > 0
                    ? `${(stats.completedToday / stats.appointmentsToday) * 100}%`
                    : '0%'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* New Patients */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Bệnh nhân</h3>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tổng số</span>
              <span className="text-2xl font-bold text-slate-900">{stats?.totalPatients || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Mới hôm nay</span>
              <span className="text-lg font-bold text-blue-600">+{stats?.newPatientsToday || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {stats?.lowStockMedicines > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start space-x-3">
          <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-orange-900">Cảnh báo tồn kho</h4>
            <p className="text-sm text-orange-700 mt-1">
              Có {stats.lowStockMedicines} loại thuốc sắp hết hàng. Vui lòng kiểm tra và nhập thêm.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
