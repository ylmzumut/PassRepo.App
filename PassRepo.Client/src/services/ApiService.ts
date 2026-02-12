import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5087/api', // Reverted to 5087 (HTTP) to avoid SSL/HTTPS mismatch errors with 44398.
    // Actually, let's use a relative path '/api' since we might proxy or host on same domain in IIS.
    // But for dev (Vite running on 5173, API on 5xxx), we need absolute.
    // Let's set it to 5000 for now.
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
