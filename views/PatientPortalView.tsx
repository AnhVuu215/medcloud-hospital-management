
import React from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Pill, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  Video, 
  CreditCard,
  MessageCircle,
  TrendingUp,
  MapPin,
  Phone,
  Cake,
  User as UserIcon,
  CheckCircle
} from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_RECORDS, MOCK_INSURANCE } from '../constants';

interface PatientPortalViewProps {
  patientId: string;
}

const PatientPortalView: React.FC<PatientPortalViewProps> = ({ patientId }) => {
  const myAppointments = MOCK_APPOINTMENTS.filter(a => a.patientId === patientId);
  const myRecords = MOCK_RECORDS.filter(r => r.patientId === 'P1'); // Giả lập dữ liệu cá nhân
  const myInsurance = MOCK_INSURANCE.find(i => i.patientId === patientId);

  // Mock detailed info for the demo
  const patientDetails = {
    dob: '15/05/1990',
    phone: '090-123-4567',
    address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    gender: 'Nam',
    bloodType: 'O+'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Chào mừng trở lại, Nguyễn Văn A
            <CheckCircle size={20} className="text-blue-500" />
          </h1>
          <p className="text-slate-500 text-sm">Hệ thống ghi nhận bạn đang có trạng thái sức khỏe ổn định.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <Calendar size={18} />
          <span>Đặt lịch khám ngay</span>
        </button>
      </div>

      {/* Visually Distinct Personal Info Section */}
      <div className="bg-white rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        <div className="bg-slate-50/80 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <UserIcon size={14} className="text-blue-500" /> Thông tin định danh bệnh nhân
          </h3>
          <button className="text-[10px] font-bold text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors">
            Chỉnh sửa hồ sơ
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Cake size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngày sinh</p>
              <p className="text-sm font-bold text-slate-900">{patientDetails.dob}</p>
              <p className="text-[10px] text-slate-500">33 Tuổi</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Số điện thoại</p>
              <p className="text-sm font-bold text-slate-900">{patientDetails.phone}</p>
              <p className="text-[10px] text-slate-500">Đã xác thực OTP</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 lg:col-span-2">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Địa chỉ thường trú</p>
              <p className="text-sm font-bold text-slate-900">{patientDetails.address}</p>
              <p className="text-[10px] text-slate-500">Khu vực ưu tiên: Quận 1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Activity size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="bg-white/20 w-fit p-2 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Lịch khám sắp tới</p>
              <h3 className="text-2xl font-bold">Thứ 4, 25 Th10</h3>
              <p className="text-blue-100 text-sm">08:30 - BS. Trần Thị B</p>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold transition-colors border border-white/20">
              Xem chi tiết lịch hẹn
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Đang hiệu lực</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Thẻ BHYT của bạn</p>
            <h3 className="text-lg font-bold text-slate-900">{myInsurance?.insuranceNumber || 'DN4012400100xxx'}</h3>
            <p className="text-slate-500 text-sm">Mức hưởng: <span className="text-emerald-600 font-bold">{myInsurance?.coveragePercentage || 80}%</span></p>
          </div>
          <div className="pt-2">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[80%]"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic">Hạn dùng đến: 31/12/2024</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 w-fit">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Chỉ số sức khỏe</p>
            <div className="flex items-end space-x-2">
              <h3 className="text-2xl font-bold text-slate-900">72</h3>
              <span className="text-slate-500 text-xs mb-1 font-bold">BPM (Nhịp tim)</span>
            </div>
            <p className="text-emerald-500 text-xs font-bold flex items-center mt-1">
              <ShieldCheck size={12} className="mr-1" /> Trạng thái: Bình thường
            </p>
          </div>
          <button className="text-blue-600 text-xs font-bold hover:underline flex items-center">
            Xem lịch sử chỉ số <ArrowRight size={14} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Health Journey */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Activity className="mr-3 text-red-600" />
            Hành trình sức khỏe
          </h2>
          
          <div className="space-y-4">
            {myRecords.map((record, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:border-blue-200 transition-all group">
                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex flex-col items-center justify-center bg-slate-50 px-6 py-4 rounded-2xl group-hover:bg-blue-50 transition-colors">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tháng 10</span>
                    <span className="text-2xl font-extrabold text-slate-900">24</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Khám nội khoa</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">{record.doctorName}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Chẩn đoán: {record.diagnosis}</h4>
                    <p className="text-sm text-slate-500 line-clamp-1 italic">Toa thuốc: {record.prescription}</p>
                  </div>
                  <button className="bg-slate-100 text-slate-600 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <FileText size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 text-white p-3 rounded-2xl">
                <Video size={24} />
              </div>
              <div>
                <h4 className="font-bold text-indigo-900">Telemedicine - Tư vấn từ xa</h4>
                <p className="text-xs text-indigo-700">Gặp gỡ bác sĩ qua cuộc gọi video an toàn.</p>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200">
              BẮT ĐẦU NGAY
            </button>
          </div>
        </div>

        {/* Sidebar for Patient */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Liên hệ hỗ trợ</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <MessageCircle size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">Trợ lý y tế AI</p>
                  <p className="text-[10px] text-slate-500">Giải đáp thắc mắc 24/7</p>
                </div>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                  <CreditCard size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">Thanh toán nhanh</p>
                  <p className="text-[10px] text-slate-500">Momo, VNPay, Ngân hàng</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-xs text-blue-400">Ghi chú y khoa</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <p className="text-xs text-slate-300 leading-relaxed">Uống thuốc Amoxicillin đúng giờ sau khi ăn no.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <p className="text-xs text-slate-300 leading-relaxed">Hạn chế đồ uống có cồn trong thời gian điều trị.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <p className="text-xs text-slate-300 leading-relaxed">Tái khám sau 7 ngày nếu có biểu hiện bất thường.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPortalView;
