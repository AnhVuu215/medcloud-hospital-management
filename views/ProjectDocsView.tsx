import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Database, 
  Server, 
  HelpCircle, 
  Lightbulb, 
  Code2, 
  ArrowRight,
  GitBranch,
  Rocket,
  Zap,
  Globe,
  MessageSquare,
  Activity,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

const ProjectDocsView: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100 mb-2">
          <Rocket size={14} />
          <span>PHIÊN BẢN 1.0 - GRADUATION PROJECT</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hồ sơ Đồ án Tốt nghiệp</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Đề tài: "Xây dựng Hệ thống Quản lý Bệnh viện & Phòng khám Thông minh tích hợp Bảo mật Dữ liệu Y tế"
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold shadow-sm">Frontend: React/TS</span>
          <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold shadow-sm">Backend: NestJS/Node.js</span>
          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold shadow-sm">DB: PostgreSQL</span>
        </div>
      </div>

      {/* Section 1: Bài toán */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-blue-600">
          <Lightbulb size={28} />
          <h2 className="text-2xl font-bold">1. Bài toán thực tế</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center"><Zap size={16} className="mr-2 text-amber-500" /> Vấn đề hiện tại:</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Quản lý lịch khám thủ công gây ùn tắc tại sảnh chờ.</li>
              <li>Hồ sơ bệnh án giấy dễ hư hỏng, khó tra cứu lịch sử bệnh.</li>
              <li>Dữ liệu y tế phân tán, khó khăn trong thống kê doanh thu/dịch tễ.</li>
              <li>Nguy cơ rò rỉ thông tin nhạy cảm của bệnh nhân cao.</li>
            </ul>
          </div>
          <div className="space-y-3">
            {/* Added CheckCircle2 to imports above */}
            <h3 className="font-bold text-slate-900 flex items-center"><CheckCircle2 size={16} className="mr-2 text-emerald-500" /> Mục tiêu hệ thống:</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Số hóa toàn bộ quy trình từ đặt lịch đến cấp thuốc.</li>
              <li>Tối ưu hóa trải nghiệm bệnh nhân thông qua đặt lịch Online.</li>
              <li>Đảm bảo tính bảo mật tuyệt đối cho dữ liệu y tế (Electronic Health Records).</li>
              <li>Cung cấp dashboard thống kê thời gian thực cho Admin.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Security */}
      <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center space-x-3 text-blue-400">
          <ShieldCheck size={28} />
          <h2 className="text-2xl font-bold">2. Phân tích Bảo mật (Trọng tâm Đồ án)</h2>
        </div>
        <p className="text-slate-400 text-sm italic">
          "Tại sao dữ liệu y tế lại đặc biệt? Vì nó liên quan đến bí mật đời tư, pháp lý và tính mạng bệnh nhân."
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Phân quyền RBAC', desc: 'Sử dụng Role-Based Access Control. Bác sĩ chỉ xem được bệnh án họ đang điều trị. Lễ tân không xem được chẩn đoán chi tiết.' },
            { title: 'Mã hóa Dữ liệu', desc: 'Mật khẩu băm (BCrypt), dữ liệu nhạy cảm được mã hóa AES-256 trong DB. Token truy cập JWT với thời hạn ngắn.' },
            { title: 'Audit Logging', desc: 'Mọi hành động READ/WRITE trên bệnh án đều được ghi lại (Who, When, Where, What) và không thể xóa sửa.' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
              <h4 className="font-bold text-blue-400 mb-2">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Roadmap (MỚI) */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-blue-600">
          <Rocket size={28} />
          <h2 className="text-2xl font-bold">3. Kế hoạch Phát triển & Lộ trình Mở rộng</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Globe size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Telemedicine (Y tế từ xa)</h4>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tích hợp công nghệ <b>WebRTC</b> cho phép tư vấn Video trực tuyến. Bệnh nhân có thể nhận tư vấn từ bác sĩ ngay tại nhà, hỗ trợ tốt cho các bệnh mãn tính hoặc tái khám định kỳ.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Activity size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Trợ lý Chẩn đoán AI</h4>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Nâng cấp lên <b>Gemini 3 Pro</b> để phân tích hình ảnh X-Quang, MRI tự động. AI sẽ gợi ý các vùng nghi vấn giúp bác sĩ giảm thiểu sai sót và đẩy nhanh tốc độ chẩn đoán.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-amber-300 transition-all group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Smartphone size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Mobile App cho Bệnh nhân</h4>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Phát triển ứng dụng di động (React Native/Flutter) giúp bệnh nhân chủ động quản lý lịch hẹn, nhận thông báo uống thuốc và theo dõi chỉ số sức khỏe (nhịp tim, huyết áp).
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Zap size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Kết nối BHYT & Thanh toán</h4>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tích hợp cổng <b>VNPay/Momo</b> để thanh toán không tiền mặt. Kết nối API với hệ thống Bảo hiểm Xã hội để tự động đối soát và trừ chi phí bảo hiểm cho bệnh nhân.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Q&A */}
      <section className="bg-amber-50 p-8 rounded-3xl border border-amber-200 space-y-6 shadow-sm">
        <div className="flex items-center space-x-3 text-amber-700">
          <HelpCircle size={28} />
          <h2 className="text-2xl font-bold">4. Kịch bản Hội đồng hỏi & Trả lời</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2 underline decoration-amber-400">Câu hỏi 1: Làm sao đảm bảo 2 người không đặt cùng 1 khung giờ khám?</h4>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "Dạ, em sử dụng **Database Transaction** kết hợp với cơ chế **Optimistic Locking** hoặc **Unique Constraint** trên bộ (doctor_id, appointment_date, time_slot). Khi có 2 request đến cùng lúc, hệ thống sẽ thực thi Transaction, request nào commit trước sẽ thành công, request sau sẽ nhận lỗi Conflict (409) và yêu cầu chọn lại giờ."
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2 underline decoration-amber-400">Câu hỏi 2: Tại sao em lại cần Audit Log trong khi đã có log hệ thống?</h4>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "Dạ, Log hệ thống thường lưu các lỗi kỹ thuật. Còn **Audit Log** này là Business Log để theo dõi hành vi người dùng. Ví dụ: Nếu một hồ sơ VIP bị lộ, ta cần biết chính xác Account nào đã thực hiện lệnh 'View' vào thời điểm nào, từ IP nào. Đây là yêu cầu bắt buộc của các chuẩn bảo mật y tế như HIPAA."
            </p>
          </div>
        </div>
      </section>
      
      <div className="text-center text-slate-400 text-sm border-t border-slate-100 pt-8">
        <p className="font-bold">Sinh viên thực hiện: Đồ án Tốt nghiệp CNTT</p>
        <p>Giảng viên hướng dẫn: Senior Fullstack Architect</p>
        <div className="flex justify-center space-x-4 mt-4">
          <GitBranch size={16} />
          <span>Phiên bản: 1.0.0-stable</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDocsView;