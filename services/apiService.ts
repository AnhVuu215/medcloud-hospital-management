// API Configuration
const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// Generic API call function
async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Medicine API
export const medicineAPI = {
    // GET /api/medicines
    getAll: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        return apiCall<{
            medicines: any[];
            total: number;
            page: number;
            totalPages: number;
        }>(`/medicines${query ? `?${query}` : ''}`);
    },

    // GET /api/medicines/low-stock
    getLowStock: async () => {
        return apiCall<{ medicines: any[] }>('/medicines/low-stock');
    },

    // GET /api/medicines/:id
    getById: async (id: string) => {
        return apiCall<{ medicine: any }>(`/medicines/${id}`);
    },

    // POST /api/medicines
    create: async (data: any) => {
        return apiCall<{ message: string; medicine: any }>('/medicines', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // PUT /api/medicines/:id
    update: async (id: string, data: any) => {
        return apiCall<{ message: string; medicine: any }>(`/medicines/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // DELETE /api/medicines/:id
    delete: async (id: string) => {
        return apiCall<{ message: string }>(`/medicines/${id}`, {
            method: 'DELETE',
        });
    },
};

// User API
export const userAPI = {
    // GET /api/users
    getAll: async (params?: { role?: string; status?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.role) queryParams.append('role', params.role);
        if (params?.status) queryParams.append('status', params.status);

        const query = queryParams.toString();
        return apiCall<{ count: number; users: any[] }>(`/users${query ? `?${query}` : ''}`);
    },

    // GET /api/users/:id
    getById: async (id: string) => {
        return apiCall<{ user: any }>(`/users/${id}`);
    },

    // PUT /api/users/:id
    update: async (id: string, data: any) => {
        return apiCall<{ message: string; user: any }>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // DELETE /api/users/:id
    delete: async (id: string) => {
        return apiCall<{ message: string }>(`/users/${id}`, {
            method: 'DELETE',
        });
    },
};

// Auth API
export const authAPI = {
    // POST /api/auth/register
    register: async (data: { name: string; email: string; password: string; role: string }) => {
        return apiCall<{ message: string; user: any }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // POST /api/auth/login
    login: async (data: { email: string; password: string }) => {
        return apiCall<{ message: string; token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // GET /api/auth/me
    getProfile: async () => {
        return apiCall<{ user: any }>('/auth/me');
    },

    // POST /api/auth/logout
    logout: async () => {
        return apiCall<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    },
};

// Appointment API
export const appointmentAPI = {
    // GET /api/appointments
    getAll: async (params?: { status?: string; doctorId?: string; patientId?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.doctorId) queryParams.append('doctorId', params.doctorId);
        if (params?.patientId) queryParams.append('patientId', params.patientId);

        const query = queryParams.toString();
        return apiCall<{ count: number; appointments: any[] }>(`/appointments${query ? `?${query}` : ''}`);
    },

    // POST /api/appointments
    create: async (data: any) => {
        return apiCall<{ message: string; appointment: any }>('/appointments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // PUT /api/appointments/:id
    update: async (id: string, data: any) => {
        return apiCall<{ message: string; appointment: any }>(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // GET /api/appointments/:id
    getById: async (id: string) => {
        return apiCall<{ appointment: any }>(`/appointments/${id}`);
    },

    // PUT /api/appointments/:id/status
    updateStatus: async (id: string, status: string, cancellationReason?: string) => {
        return apiCall<{ message: string; appointment: any }>(`/appointments/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, cancellationReason }),
        });
    },

    // DELETE /api/appointments/:id
    delete: async (id: string, cancellationReason?: string) => {
        return apiCall<{ message: string }>(`/appointments/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ cancellationReason }),
        });
    },
};

// Medical Record API
export const medicalRecordAPI = {
    // GET /api/medical-records
    getAll: async (params?: { patientId?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.patientId) queryParams.append('patientId', params.patientId);

        const query = queryParams.toString();
        return apiCall<{ count: number; records: any[] }>(`/medical-records${query ? `?${query}` : ''}`);
    },

    // POST /api/medical-records
    create: async (data: any) => {
        return apiCall<{ message: string; record: any }>('/medical-records', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // PUT /api/medical-records/:id
    update: async (id: string, data: any) => {
        return apiCall<{ message: string; record: any }>(`/medical-records/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};

// Notification API
export const notificationAPI = {
    // GET /api/notifications
    getAll: async (limit?: number) => {
        const query = limit ? `?limit=${limit}` : '';
        return apiCall<{ count: number; notifications: any[] }>(`/notifications${query}`);
    },

    // GET /api/notifications/unread
    getUnread: async () => {
        return apiCall<{ count: number; notifications: any[] }>('/notifications/unread');
    },

    // GET /api/notifications/unread/count
    getUnreadCount: async () => {
        return apiCall<{ count: number }>('/notifications/unread/count');
    },

    // PUT /api/notifications/:id/read
    markAsRead: async (id: string) => {
        return apiCall<{ message: string }>(`/notifications/${id}/read`, {
            method: 'PUT',
        });
    },

    // PUT /api/notifications/read-all
    markAllAsRead: async () => {
        return apiCall<{ message: string }>('/notifications/read-all', {
            method: 'PUT',
        });
    },

    // DELETE /api/notifications/:id
    delete: async (id: string) => {
        return apiCall<{ message: string }>(`/notifications/${id}`, {
            method: 'DELETE',
        });
    },
};

// Report API
export const reportAPI = {
    // GET /api/reports/stats
    getStats: async () => {
        return apiCall<any>('/reports/stats');
    },

    // GET /api/reports/daily
    getDailyReport: async (date?: string) => {
        const query = date ? `?date=${date}` : '';
        return apiCall<any>(`/reports/daily${query}`);
    },

    // GET /api/reports/summary
    getSummaryReport: async () => {
        return apiCall<any>('/reports/summary');
    },

    // GET /api/reports/revenue
    getRevenueReport: async (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiCall<any>(`/reports/revenue${query}`);
    },
};
