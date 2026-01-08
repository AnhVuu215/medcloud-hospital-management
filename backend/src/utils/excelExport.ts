import * as XLSX from 'xlsx';

interface ExportData {
    stats?: any;
    dailyReport?: any;
    appointments?: any[];
    patients?: any[];
}

export const exportToExcel = (data: ExportData, filename: string = 'bao-cao') => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Tổng quan
    if (data.stats) {
        const statsData = [
            ['BÁO CÁO TỔNG QUAN HỆ THỐNG'],
            ['Ngày xuất:', new Date().toLocaleDateString('vi-VN')],
            [],
            ['CHỈ SỐ', 'GIÁ TRỊ'],
            ['Tổng số bệnh nhân', data.stats.totalPatients || 0],
            ['Bệnh nhân mới hôm nay', data.stats.newPatientsToday || 0],
            ['Lịch hẹn hôm nay', data.stats.appointmentsToday || 0],
            ['Lịch hẹn đã hoàn thành', data.stats.completedToday || 0],
            ['Doanh thu hôm nay', data.stats.revenueToday || 0],
            ['Thuốc sắp hết hàng', data.stats.lowStockMedicines || 0],
        ];

        const ws1 = XLSX.utils.aoa_to_sheet(statsData);
        
        // Set column widths
        ws1['!cols'] = [
            { wch: 30 },
            { wch: 20 }
        ];

        XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');
    }

    // Sheet 2: Chi tiết lịch hẹn
    if (data.appointments && data.appointments.length > 0) {
        const appointmentData = [
            ['DANH SÁCH LỊCH HẸN'],
            [],
            ['STT', 'Mã lịch hẹn', 'Bệnh nhân', 'Bác sĩ', 'Ngày hẹn', 'Trạng thái', 'Lý do khám']
        ];

        data.appointments.forEach((apt, index) => {
            appointmentData.push([
                index + 1,
                apt.appointmentId || '',
                apt.patientName || '',
                apt.doctorName || '',
                apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString('vi-VN') : '',
                apt.status || '',
                apt.reason || ''
            ]);
        });

        const ws2 = XLSX.utils.aoa_to_sheet(appointmentData);
        
        ws2['!cols'] = [
            { wch: 5 },
            { wch: 15 },
            { wch: 25 },
            { wch: 25 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 }
        ];

        XLSX.utils.book_append_sheet(wb, ws2, 'Lịch hẹn');
    }

    // Sheet 3: Danh sách bệnh nhân
    if (data.patients && data.patients.length > 0) {
        const patientData = [
            ['DANH SÁCH BỆNH NHÂN'],
            [],
            ['STT', 'Mã BN', 'Họ tên', 'Ngày sinh', 'Giới tính', 'Số điện thoại', 'Email']
        ];

        data.patients.forEach((patient, index) => {
            patientData.push([
                index + 1,
                patient.userId || '',
                patient.name || '',
                patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('vi-VN') : '',
                patient.gender || '',
                patient.phone || '',
                patient.email || ''
            ]);
        });

        const ws3 = XLSX.utils.aoa_to_sheet(patientData);
        
        ws3['!cols'] = [
            { wch: 5 },
            { wch: 12 },
            { wch: 25 },
            { wch: 15 },
            { wch: 10 },
            { wch: 15 },
            { wch: 30 }
        ];

        XLSX.utils.book_append_sheet(wb, ws3, 'Bệnh nhân');
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const finalFilename = `${filename}_${timestamp}.xlsx`;

    // Write file
    XLSX.writeFile(wb, finalFilename);
};

// Export daily report
export const exportDailyReport = async (stats: any) => {
    const data: ExportData = {
        stats
    };
    
    exportToExcel(data, 'bao-cao-ngay');
};

// Export full report with appointments and patients
export const exportFullReport = async (stats: any, appointments: any[], patients: any[]) => {
    const data: ExportData = {
        stats,
        appointments,
        patients
    };
    
    exportToExcel(data, 'bao-cao-tong-hop');
};
