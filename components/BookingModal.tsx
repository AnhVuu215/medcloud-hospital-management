
import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, User as UserIcon, Check, ChevronRight } from 'lucide-react';
import { DOCTORS, SPECIALIZATIONS } from '../constants';
import { Doctor } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  initialData?: {
    doctorName?: string;
    specialization?: string;
    patientName?: string;
  } | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onConfirm, initialData }) => {
  const [step, setStep] = useState(1);
  const [selectedSpec, setSelectedSpec] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('');

  const filteredDoctors = selectedSpec 
    ? DOCTORS.filter(d => d.specialization === selectedSpec)
    : DOCTORS;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setPatientName(initialData.patientName || '');
        setSelectedSpec(initialData.specialization || '');
        const doctor = DOCTORS.find(d => d.name === initialData.doctorName);
        if (doctor) {
          setSelectedDoctor(doctor);
          setStep(2); // Nhảy thẳng đến bước chọn thời gian nếu đã có bác sĩ
        } else {
          setStep(1);
        }
      } else {
        setStep(1);
        setSelectedSpec('');
        setSelectedDoctor(null);
        setSelectedSlot('');
        setPatientName('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Simulate generating a new patient ID
    const generatedPatientId = `P${Math.floor(100000 + Math.random() * 900000)}`;
    
    onConfirm({
      patientId: generatedPatientId,
      patientName,
      doctorName: selectedDoctor?.name,
      specialization: selectedSpec || selectedDoctor?.specialization,
      date: selectedDate,
      time: selectedSlot,
      status: 'CONFIRMED',
      fee: 200000
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Đặt lịch khám nhanh</h2>
            <p className="text-sm text-slate-500">Hoàn thành các bước để tạo lịch hẹn mới.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="flex px-6 py-4 bg-white border-b border-slate-50">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <div className="ml-2 text-xs font-bold text-slate-600 mr-4">
                {s === 1 ? 'Chuyên khoa/Bác sĩ' : s === 2 ? 'Thời gian' : 'Thông tin'}
              </div>
              {s < 3 && <div className={`flex-1 h-px mr-4 ${step > s ? 'bg-blue-600' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Chọn chuyên khoa</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SPECIALIZATIONS.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => { setSelectedSpec(spec); setSelectedDoctor(null); }}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        selectedSpec === spec 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/10' 
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Chọn bác sĩ</label>
                <div className="space-y-2">
                  {filteredDoctors.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => { setSelectedDoctor(doc); setSelectedSpec(doc.specialization); }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        selectedDoctor?.id === doc.id
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/10'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 text-left">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{doc.name}</div>
                          <div className="text-xs text-slate-500">{doc.specialization}</div>
                        </div>
                      </div>
                      {selectedDoctor?.id === doc.id && <Check className="text-blue-600" size={18} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Chọn ngày khám</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Bác sĩ đã chọn</h4>
                  <p className="text-sm font-bold text-slate-900">{selectedDoctor?.name}</p>
                  <p className="text-xs text-slate-500">{selectedDoctor?.specialization}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Chọn giờ khám</label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {selectedDoctor?.availableSlots?.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                        selectedSlot === slot
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Họ tên bệnh nhân</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Nhập họ và tên..."
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">Tóm tắt lịch hẹn</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bệnh nhân</p>
                    <p className="text-sm font-bold text-slate-700">{patientName || 'Chưa nhập'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bác sĩ</p>
                    <p className="text-sm font-bold text-slate-700">{selectedDoctor?.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày khám</p>
                    <p className="text-sm font-bold text-slate-700">{selectedDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giờ khám</p>
                    <p className="text-sm font-bold text-slate-700">{selectedSlot || 'Chưa chọn'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-colors ${
              step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Quay lại
          </button>
          
          {step < 3 ? (
            <button 
              disabled={(step === 1 && !selectedDoctor) || (step === 2 && !selectedSlot)}
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Tiếp tục</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              disabled={!patientName}
              onClick={handleConfirm}
              className="bg-emerald-600 text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              Xác nhận đặt lịch
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
