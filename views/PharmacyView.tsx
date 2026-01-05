
import React, { useState, useMemo } from 'react';
import { MOCK_MEDICINES } from '../constants';
import { Medicine } from '../types';
import { 
  Pill, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  MoreVertical, 
  Package, 
  ShoppingCart,
  Calendar,
  ChevronDown,
  Download,
  X,
  Edit2,
  MinusCircle,
  TrendingUp,
  History,
  FileText,
  Printer
} from 'lucide-react';

const PharmacyView: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'ADD' | 'IMPORT' | 'DISPENSE'>('ADD');
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Form states
  const [formQty, setFormQty] = useState(0);

  const stats = useMemo(() => ({
    totalItems: medicines.length,
    lowStock: medicines.filter(m => m.stock > 0 && m.stock <= m.minThreshold).length,
    outOfStock: medicines.filter(m => m.stock === 0).length,
    expired: medicines.filter(m => new Date(m.expiryDate) < new Date()).length
  }), [medicines]);

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStockAction = () => {
    if (!selectedMed) return;

    const updatedMeds = medicines.map(m => {
      if (m.id === selectedMed.id) {
        const newStock = modalType === 'IMPORT' 
          ? m.stock + Number(formQty) 
          : Math.max(0, m.stock - Number(formQty));
        return { ...m, stock: newStock };
      }
      return m;
    });

    setMedicines(updatedMeds);
    showNotification(
      modalType === 'IMPORT' 
        ? `Đã nhập thêm ${formQty} ${selectedMed.unit} ${selectedMed.name}`
        : `Đã xuất ${formQty} ${selectedMed.unit} ${selectedMed.name} theo đơn`
    );
    setIsModalOpen(false);
    setFormQty(0);
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {notification && (
        <div className="fixed top-20 right-8 z-[70] animate-in slide-in-from-right-10 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border ${
            notification.type === 'success' ? 'bg-slate-900 text-white border-slate-700' : 'bg-rose-600 text-white border-rose-500'
          }`}>
            <div className={`${notification.type === 'success' ? 'bg-emerald-500' : 'bg-white text-rose-600'} p-1 rounded-full`}>
              <CheckCircle2 size={16} />
            </div>
            <span className="text-sm font-bold">{notification.msg}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Pill className="mr-3 text-red-600" />
            Nhà thuốc & Quản lý kho
          </h1>
          <p className="text-slate-500 text-sm">Quản lý nhập xuất, tồn kho và cảnh báo hạn dùng thuốc.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <History size={16} />
            <span>Lịch sử nhập xuất</span>
          </button>
          <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Printer size={16} />
            <span>In báo cáo kho</span>
          </button>
          <button 
            onClick={() => { setModalType('ADD'); setIsModalOpen(true); }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={16} />
            <span>Thêm thuốc mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Package size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Danh mục</p>
            <p className="text-xl font-bold text-slate-900">{stats.totalItems}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><AlertTriangle size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sắp hết hàng</p>
            <p className="text-xl font-bold text-amber-600">{stats.lowStock}</p>
          </div>
        </div>
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center space-x-4">
          <div className="bg-rose-100 p-3 rounded-xl text-rose-600"><ShoppingCart size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hết hàng</p>
            <p className="text-xl font-bold text-rose-600">{stats.outOfStock}</p>
          </div>
        </div>
        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><TrendingUp size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá trị kho</p>
            <p className="text-xl font-bold text-indigo-700">~250M</p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tên thuốc, nhóm điều trị..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center">
              Nhóm: Tất cả <ChevronDown size={14} className="ml-1" />
            </button>
            <button className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center">
              Trạng thái <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thông tin thuốc</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Tồn kho</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đơn giá</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hạn dùng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMedicines.map((med) => {
                const isExpired = new Date(med.expiryDate) < new Date();
                const isLow = med.stock > 0 && med.stock <= med.minThreshold;
                const isOut = med.stock === 0;

                return (
                  <tr key={med.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isExpired ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                          <Pill size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{med.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{med.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-bold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-700'}`}>
                          {med.stock} {med.unit}
                        </span>
                        <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min((med.stock / 1000) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-extrabold text-slate-900">{med.price.toLocaleString('vi-VN')} đ</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold flex items-center ${isExpired ? 'text-rose-600' : 'text-slate-600'}`}>
                        <Calendar size={12} className="mr-1.5" />
                        {med.expiryDate}
                        {isExpired && <span className="ml-2 text-[8px] bg-rose-600 text-white px-1 rounded uppercase">Hết hạn</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setSelectedMed(med); setModalType('IMPORT'); setIsModalOpen(true); }}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors border border-emerald-100"
                        >
                          <Plus size={12} /> <span>Nhập</span>
                        </button>
                        <button 
                          onClick={() => { setSelectedMed(med); setModalType('DISPENSE'); setIsModalOpen(true); }}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                          disabled={isOut}
                        >
                          <MinusCircle size={12} /> <span>Xuất</span>
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-6 flex items-center justify-between ${
              modalType === 'IMPORT' ? 'bg-emerald-50' : modalType === 'DISPENSE' ? 'bg-blue-50' : 'bg-slate-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${
                  modalType === 'IMPORT' ? 'bg-emerald-600 text-white' : modalType === 'DISPENSE' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                }`}>
                  {modalType === 'IMPORT' ? <Plus size={20} /> : modalType === 'DISPENSE' ? <MinusCircle size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {modalType === 'IMPORT' ? 'Phiếu nhập kho' : modalType === 'DISPENSE' ? 'Phiếu xuất thuốc' : 'Thêm danh mục mới'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Chi tiết giao dịch vật tư y tế</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              {selectedMed && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thuốc đã chọn</p>
                    <p className="text-sm font-bold text-slate-800">{selectedMed.name}</p>
                    <p className="text-xs text-slate-500">Tồn hiện tại: {selectedMed.stock} {selectedMed.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá bán</p>
                    <p className="text-sm font-bold text-blue-600">{selectedMed.price.toLocaleString()} đ</p>
                  </div>
                </div>
              )}

              {modalType !== 'ADD' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Số lượng {modalType === 'IMPORT' ? 'nhập' : 'xuất'}</label>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="number" 
                        value={formQty}
                        onChange={(e) => setFormQty(Number(e.target.value))}
                        className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-xl font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
                        placeholder="0"
                        min="1"
                      />
                      <span className="text-sm font-bold text-slate-400">{selectedMed?.unit}</span>
                    </div>
                  </div>

                  {modalType === 'DISPENSE' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Mã hồ sơ bệnh án (Option)</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="VD: P00124..."
                      />
                    </div>
                  )}

                  <div className="bg-amber-50 p-4 rounded-xl flex items-start space-x-3 text-[11px] text-amber-800">
                    <AlertTriangle size={16} className="flex-shrink-0" />
                    <p>Hành động này sẽ <b>{modalType === 'IMPORT' ? 'tăng' : 'giảm'}</b> số lượng tồn kho thực tế và ghi lại vào nhật ký Audit Log.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-center text-slate-500 italic">Tính năng thêm danh mục đang được bảo trì.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleStockAction}
                disabled={formQty <= 0 && modalType !== 'ADD'}
                className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                  modalType === 'IMPORT' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 shadow-blue-500/20'
                }`}
              >
                Xác nhận thực hiện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyView;
