
import React, { useState, useMemo } from 'react';
import { MOCK_PAYMENTS, MOCK_INSURANCE } from '../constants';
import { Payment, InsuranceProfile } from '../types';
import { 
  CreditCard, 
  Search, 
  ShieldCheck, 
  QrCode, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Clock, 
  ExternalLink,
  Zap,
  ChevronRight,
  Printer,
  History
} from 'lucide-react';

const PaymentInsuranceView: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [insuranceSearch, setInsuranceSearch] = useState('');
  const [verifiedInsurance, setVerifiedInsurance] = useState<InsuranceProfile | null>(null);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [paymentStep, setPaymentStep] = useState<'METHODS' | 'QR'>('METHODS');

  const stats = useMemo(() => ({
    totalCollected: payments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.patientPaidAmount, 0),
    pendingAmount: payments.filter(p => p.status === 'UNPAID').reduce((acc, p) => acc + p.totalAmount, 0),
    insuranceClaims: payments.reduce((acc, p) => acc + p.insuranceAmount, 0),
  }), [payments]);

  const handleVerifyInsurance = () => {
    const found = MOCK_INSURANCE.find(i => i.insuranceNumber === insuranceSearch);
    if (found) {
      setVerifiedInsurance(found);
    } else {
      setVerifiedInsurance(null);
      alert('Không tìm thấy thông tin BHYT trên cổng giám định quốc gia.');
    }
  };

  const simulatePayment = (method: Payment['method']) => {
    if (!activePayment) return;
    setPaymentStep('QR');
    setTimeout(() => {
      setPayments(prev => prev.map(p => p.id === activePayment.id ? { ...p, status: 'PAID', method } : p));
      setActivePayment(null);
      setPaymentStep('METHODS');
      alert(`Thanh toán qua ${method} thành công!`);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <CreditCard className="mr-3 text-red-600" />
            Cổng thanh toán & BHYT
          </h1>
          <p className="text-slate-500 text-sm">Quản lý hóa đơn, kết nối VNPay/Momo và Cổng giám định BHYT.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <History size={16} />
            <span>Lịch sử GD</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <Printer size={16} />
            <span>In báo cáo doanh thu</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Insurance Verification */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <ShieldCheck size={120} />
            </div>
            <div className="flex items-center space-x-2 text-indigo-200">
              <ShieldCheck size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Cổng Giám định BHYT</h3>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-medium text-indigo-300">Nhập số thẻ BHYT (VD: DN4012400100234)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={insuranceSearch}
                  onChange={(e) => setInsuranceSearch(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:bg-white/20 outline-none transition-all placeholder:text-white/30"
                  placeholder="Số thẻ BHYT..."
                />
                <button 
                  onClick={handleVerifyInsurance}
                  className="bg-white text-indigo-900 p-2 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {verifiedInsurance && (
              <div className="mt-6 bg-white/10 border border-white/20 rounded-2xl p-4 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase">Họ và tên</p>
                    <p className="text-sm font-bold">{verifiedInsurance.fullName}</p>
                  </div>
                  <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Hợp lệ</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase">Tỉ lệ hưởng</p>
                    <p className="text-sm font-bold text-emerald-400">{verifiedInsurance.coveragePercentage}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase">Hạn dùng</p>
                    <p className="text-sm font-bold">{verifiedInsurance.expiryDate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center">
              <Zap size={16} className="mr-2 text-amber-500" /> Doanh thu hôm nay
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-bold text-slate-500">Tiền mặt/Chuyển khoản</span>
                <span className="text-sm font-extrabold text-slate-900">{stats.totalCollected.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-2xl">
                <span className="text-xs font-bold text-blue-600">Bảo hiểm chi trả</span>
                <span className="text-sm font-extrabold text-blue-700">{stats.insuranceClaims.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-2xl">
                <span className="text-xs font-bold text-amber-600">Công nợ chưa thu</span>
                <span className="text-sm font-extrabold text-amber-700">{stats.pendingAmount.toLocaleString()} đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payments List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Danh sách hóa đơn dịch vụ</h3>
              <div className="flex items-center text-[10px] font-bold text-slate-400 space-x-4">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Đã thanh toán</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Chờ thanh toán</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bệnh nhân / Mã GD</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Tổng tiền</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">BN Chi trả</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{pay.patientName}</p>
                        <p className="text-[10px] font-mono text-slate-400 font-bold">#{pay.id}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-600">{pay.totalAmount.toLocaleString()} đ</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-extrabold text-blue-600">{pay.patientPaidAmount.toLocaleString()} đ</span>
                        {pay.insuranceAmount > 0 && <p className="text-[9px] text-emerald-500 font-bold">BHYT: -{pay.insuranceAmount.toLocaleString()}</p>}
                      </td>
                      <td className="px-6 py-4">
                        {pay.status === 'PAID' ? (
                          <span className="flex items-center text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-full w-fit border border-emerald-100">
                            <CheckCircle2 size={12} className="mr-1" /> {pay.method || 'ĐÃ THU'}
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-600 text-[10px] font-bold bg-amber-50 px-2 py-1 rounded-full w-fit border border-amber-100">
                            <Clock size={12} className="mr-1" /> CHỜ THU
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {pay.status === 'UNPAID' ? (
                          <button 
                            onClick={() => setActivePayment(pay)}
                            className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                          >
                            THANH TOÁN
                          </button>
                        ) : (
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                            <Printer size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {activePayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Wallet size={24} />
                <div>
                  <h3 className="text-lg font-bold">Cổng thanh toán MedCloud</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Giao dịch: {activePayment.id}</p>
                </div>
              </div>
              <button onClick={() => setActivePayment(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-8">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Bệnh nhân chi trả</p>
                  <p className="text-3xl font-extrabold text-blue-600">{activePayment.patientPaidAmount.toLocaleString()} <span className="text-lg">đ</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">BHYT Chi trả</p>
                  <p className="text-sm font-bold text-emerald-600">-{activePayment.insuranceAmount.toLocaleString()} đ</p>
                </div>
              </div>

              {paymentStep === 'METHODS' ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Chọn phương thức thanh toán</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => simulatePayment('VNPAY')}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all space-y-3 group"
                    >
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <img src="https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAY.png" alt="VNPay" className="h-6 object-contain" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Cổng VNPay</span>
                    </button>
                    <button 
                      onClick={() => simulatePayment('MOMO')}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 transition-all space-y-3 group"
                    >
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" className="h-6 object-contain" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Ví Momo</span>
                    </button>
                    <button 
                      onClick={() => simulatePayment('BANK_TRANSFER')}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all space-y-3 group"
                    >
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform text-blue-600">
                        <QrCode size={24} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">QR Ngân hàng</span>
                    </button>
                    <button 
                      onClick={() => simulatePayment('CASH')}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all space-y-3 group"
                    >
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform text-emerald-600">
                        <Banknote size={24} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Tiền mặt</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="relative p-4 bg-white rounded-3xl shadow-xl border border-slate-100">
                    <QrCode size={180} className="text-slate-900" />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-3xl">
                      <div className="bg-blue-600 text-white p-3 rounded-full animate-bounce shadow-lg">
                        <Zap size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-bold text-slate-800">Vui lòng quét mã QR để thanh toán</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                      <p className="text-xs font-medium text-slate-500">Đang chờ hệ thống xác nhận...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <ShieldCheck size={12} className="mr-1.5" /> Giao dịch được bảo mật bởi MedCloud SSL
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default PaymentInsuranceView;
