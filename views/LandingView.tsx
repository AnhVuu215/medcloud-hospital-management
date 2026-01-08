import React, { useEffect, useState } from 'react';
import { Users, Package, Calendar, FileText, Star } from 'lucide-react';

interface LandingViewProps {
    onNavigateToLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onNavigateToLogin }) => {
    const [scrolled, setScrolled] = useState(false);
    const [stats, setStats] = useState({ hospitals: 0, patients: 0, satisfaction: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Animate counters
        const duration = 2000;
        const targets = { hospitals: 150, patients: 50000, satisfaction: 98 };
        const increment = {
            hospitals: targets.hospitals / (duration / 16),
            patients: targets.patients / (duration / 16),
            satisfaction: targets.satisfaction / (duration / 16),
        };

        let current = { hospitals: 0, patients: 0, satisfaction: 0 };
        const timer = setInterval(() => {
            current.hospitals += increment.hospitals;
            current.patients += increment.patients;
            current.satisfaction += increment.satisfaction;

            if (current.hospitals >= targets.hospitals) {
                setStats(targets);
                clearInterval(timer);
            } else {
                setStats({
                    hospitals: Math.floor(current.hospitals),
                    patients: Math.floor(current.patients),
                    satisfaction: Math.floor(current.satisfaction),
                });
            }
        }, 16);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 2v20M2 12h20" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">MedCloud</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition">Tính Năng</a>
                            <a href="#benefits" className="text-gray-700 hover:text-blue-600 font-medium transition">Lợi Ích</a>
                            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition">Đánh Giá</a>
                            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition">Liên Hệ</a>
                        </nav>

                        <div className="flex items-center gap-3">
                            <button onClick={onNavigateToLogin} className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition">
                                Đăng Nhập
                            </button>
                            <a href="#contact" className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">
                                Dùng Thử Miễn Phí
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                <span className="text-blue-600">MedCloud</span><br />
                                Hệ Thống Quản Lý<br />
                                Bệnh Viện Thông Minh
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Số hóa quy trình y tế, nâng cao chất lượng chăm sóc sức khỏe với công nghệ hiện đại
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <a href="#contact" className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-center">
                                    Đăng Ký Dùng Thử
                                </a>
                                <button onClick={onNavigateToLogin} className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition text-center">
                                    Đăng Nhập Hệ Thống
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600">{stats.hospitals}+</div>
                                    <div className="text-sm text-gray-600 mt-1">Bệnh Viện</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600">{stats.patients.toLocaleString()}+</div>
                                    <div className="text-sm text-gray-600 mt-1">Bệnh Nhân</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600">{stats.satisfaction}%</div>
                                    <div className="text-sm text-gray-600 mt-1">Hài Lòng</div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
                                <svg viewBox="0 0 400 400" className="w-full h-auto">
                                    <rect x="100" y="120" width="200" height="200" fill="#E8F4F8" stroke="#0066CC" strokeWidth="3" />
                                    <rect x="120" y="140" width="60" height="70" fill="#FFFFFF" stroke="#00A8A8" strokeWidth="2" />
                                    <rect x="220" y="140" width="60" height="70" fill="#FFFFFF" stroke="#00A8A8" strokeWidth="2" />
                                    <rect x="120" y="230" width="60" height="70" fill="#FFFFFF" stroke="#00A8A8" strokeWidth="2" />
                                    <rect x="220" y="230" width="60" height="70" fill="#FFFFFF" stroke="#00A8A8" strokeWidth="2" />
                                    <circle cx="200" cy="80" r="35" fill="#0066CC" />
                                    <path d="M200 55v50M175 80h50" stroke="white" strokeWidth="6" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Tính Năng Nổi Bật</h2>
                        <p className="text-xl text-gray-600">Giải pháp toàn diện cho quản lý bệnh viện hiện đại</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: 'Quản Lý Người Dùng',
                                description: 'Quản lý toàn diện bác sĩ, bệnh nhân, và nhân viên với hệ thống phân quyền linh hoạt, bảo mật cao',
                                features: ['Quản lý hồ sơ bác sĩ, bệnh nhân', 'Phân quyền theo vai trò', 'Theo dõi hoạt động người dùng'],
                                color: 'bg-blue-50 border-blue-200 text-blue-600'
                            },
                            {
                                icon: <Package className="w-8 h-8" />,
                                title: 'Quản Lý Nhà Thuốc',
                                description: 'Theo dõi tồn kho thuốc thông minh với cảnh báo tự động và quản lý nhập xuất hiệu quả',
                                features: ['Theo dõi tồn kho realtime', 'Cảnh báo thuốc sắp hết', 'Quản lý nhập/xuất tự động'],
                                color: 'bg-teal-50 border-teal-200 text-teal-600'
                            },
                            {
                                icon: <Calendar className="w-8 h-8" />,
                                title: 'Quản Lý Lịch Hẹn',
                                description: 'Đặt lịch khám online dễ dàng với thông báo tự động và theo dõi trạng thái realtime',
                                features: ['Đặt lịch khám online 24/7', 'Thông báo tự động qua SMS/Email', 'Theo dõi trạng thái realtime'],
                                color: 'bg-orange-50 border-orange-200 text-orange-600'
                            },
                            {
                                icon: <FileText className="w-8 h-8" />,
                                title: 'Hồ Sơ Bệnh Án Điện Tử',
                                description: 'Lưu trữ và truy xuất hồ sơ bệnh án an toàn, chia sẻ thông tin giữa các bác sĩ nhanh chóng',
                                features: ['Lưu trữ an toàn, mã hóa', 'Truy xuất nhanh chóng', 'Chia sẻ giữa các bác sĩ'],
                                color: 'bg-red-50 border-red-200 text-red-600'
                            }
                        ].map((feature, index) => (
                            <div key={index} className={`border-2 rounded-2xl p-8 hover:shadow-xl transition ${feature.color.split(' ')[0]} ${feature.color.split(' ')[1]}`}>
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 mb-6">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-700">
                                            <span className="text-teal-600 font-bold mt-1">✓</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '150+', label: 'Bệnh Viện Đang Sử Dụng' },
                            { value: '50,000+', label: 'Bệnh Nhân Được Phục Vụ' },
                            { value: '70%', label: 'Thời Gian Tiết Kiệm' },
                            { value: '98%', label: 'Tỷ Lệ Hài Lòng' }
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Lợi Ích Vượt Trội</h2>
                        <p className="text-xl text-gray-600">Tại sao chọn MedCloud cho bệnh viện của bạn?</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { icon: '⚡', title: 'Tăng Hiệu Quả Vận Hành', description: 'Tự động hóa quy trình, giảm thiểu thời gian xử lý hành chính, tập trung vào chăm sóc bệnh nhân' },
                            { icon: '🔒', title: 'Bảo Mật Dữ Liệu Cao', description: 'Mã hóa end-to-end, tuân thủ tiêu chuẩn bảo mật y tế quốc tế, bảo vệ thông tin bệnh nhân' },
                            { icon: '📱', title: 'Truy Cập Mọi Lúc, Mọi Nơi', description: 'Responsive design, hoạt động mượt mà trên mọi thiết bị, truy cập từ xa an toàn' },
                            { icon: '💰', title: 'Tiết Kiệm Chi Phí', description: 'Giảm chi phí vận hành, tối ưu hóa nguồn lực, ROI cao chỉ sau 6 tháng sử dụng' }
                        ].map((benefit, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition">
                                <div className="text-6xl mb-4">{benefit.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Khách Hàng Nói Gì Về Chúng Tôi</h2>
                        <p className="text-xl text-gray-600">Hơn 150 bệnh viện tin tưởng sử dụng MedCloud</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'BS. Nguyễn Văn An',
                                role: 'Giám Đốc Bệnh Viện Đa Khoa Trung Ương',
                                text: 'MedCloud đã giúp bệnh viện chúng tôi tiết kiệm 70% thời gian xử lý hành chính. Bác sĩ có thể tập trung hơn vào việc chăm sóc bệnh nhân.',
                                avatar: 'BS'
                            },
                            {
                                name: 'Dược sĩ Trần Thị Bình',
                                role: 'Trưởng Khoa Dược - BV Nhi Đồng',
                                text: 'Hệ thống quản lý thuốc thông minh, không còn tình trạng thiếu thuốc đột ngột. Cảnh báo tồn kho rất chính xác và kịp thời.',
                                avatar: 'DT'
                            },
                            {
                                name: 'Lê Thị Hương',
                                role: 'Bệnh Nhân',
                                text: 'Đặt lịch khám online rất tiện lợi, không phải xếp hàng chờ đợi. Nhận thông báo tự động, rất chuyên nghiệp!',
                                avatar: 'LH'
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bắt Đầu Dùng Thử Miễn Phí</h2>
                            <p className="text-xl text-gray-600 mb-8">Trải nghiệm MedCloud trong 30 ngày, không cần thẻ tín dụng</p>

                            <div className="space-y-6">
                                {[
                                    { icon: '📞', label: 'Hotline 24/7', value: '1900 1234' },
                                    { icon: '✉️', label: 'Email', value: 'support@medcloud.vn' },
                                    { icon: '📍', label: 'Địa Chỉ', value: '123 Đường ABC, Quận 1, TP.HCM' }
                                ].map((contact, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="text-3xl">{contact.icon}</div>
                                        <div>
                                            <div className="text-sm text-gray-600">{contact.label}</div>
                                            <div className="text-lg font-semibold text-gray-900">{contact.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Họ và Tên *</label>
                                    <input type="text" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none" placeholder="Nguyễn Văn A" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                                    <input type="email" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none" placeholder="example@hospital.vn" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Số Điện Thoại *</label>
                                    <input type="tel" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none" placeholder="0912 345 678" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Tên Bệnh Viện/Phòng Khám</label>
                                    <input type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none" placeholder="Bệnh Viện ABC" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Tin Nhắn</label>
                                    <textarea rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none" placeholder="Cho chúng tôi biết nhu cầu của bạn..."></textarea>
                                </div>
                                <button type="submit" className="w-full px-8 py-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">
                                    Đăng Ký Ngay
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 2v20M2 12h20" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold">MedCloud</span>
                            </div>
                            <p className="text-gray-400">Hệ thống quản lý bệnh viện thông minh, số hóa quy trình y tế, nâng cao chất lượng chăm sóc sức khỏe.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Sản Phẩm</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white transition">Tính Năng</a></li>
                                <li><a href="#benefits" className="hover:text-white transition">Lợi Ích</a></li>
                                <li><a href="#contact" className="hover:text-white transition">Bảng Giá</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Công Ty</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#testimonials" className="hover:text-white transition">Về Chúng Tôi</a></li>
                                <li><a href="#testimonials" className="hover:text-white transition">Khách Hàng</a></li>
                                <li><a href="#contact" className="hover:text-white transition">Liên Hệ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Newsletter</h4>
                            <p className="text-gray-400 mb-4 text-sm">Nhận tin tức và cập nhật mới nhất</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email của bạn" className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-600 focus:outline-none" />
                                <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">Đăng Ký</button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400 text-sm">© 2026 MedCloud. All rights reserved.</div>
                        <div className="flex gap-6 text-gray-400 text-sm">
                            <a href="#" className="hover:text-white transition">Chính Sách Bảo Mật</a>
                            <a href="#" className="hover:text-white transition">Điều Khoản Sử Dụng</a>
                            <a href="#" className="hover:text-white transition">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingView;
