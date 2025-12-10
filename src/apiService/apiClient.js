import router from "@/routers/router";
import axios from "axios";


const apiClient = axios.create({
    baseURL: "http://localhost:3000/api", //url chung
    headers: {
        'Content-Type': 'application/json',
    }
});

// Flag để tránh infinite loop khi refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

//add interceptor để gắn token vào header để khi request tự động có token 
apiClient.interceptors.request.use(
    (config) => {
        // Không gắn token cho refresh token endpoint
        if (config.url === '/auth/refresh-token') {
            // Remove Authorization header cho refresh token request
            delete config.headers.Authorization;
            return config;
        }

        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý lỗi từ server
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Chỉ xử lý 401 và tránh retry request refresh token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Nếu đang refresh token, đợi nó hoàn thành
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // Không có refresh token, clear storage và redirect
                localStorage.removeItem('jwt');
                localStorage.removeItem('refreshToken');
                isRefreshing = false;
                processQueue(new Error('No refresh token'), null);
                // Chỉ redirect nếu không phải đang ở trang discover
                if (router.currentRoute.value.path !== '/discover') {
                    router.push('/discover');
                }
                return Promise.reject(error);
            }

            try {
                // Tạo axios instance mới để không đi qua interceptor request
                const refreshAxios = axios.create({
                    baseURL: "http://localhost:3000/api",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                // Gửi yêu cầu refresh token KHÔNG qua interceptor (không gắn token cũ)
                const response = await refreshAxios.post('/auth/refresh-token', { refreshTokens: refreshToken });
                const newAccessToken = response.data.accessToken;

                // Lưu lại access token mới
                localStorage.setItem('jwt', newAccessToken);

                // Gắn token mới vào request cũ
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Process queue và retry original request
                processQueue(null, newAccessToken);
                isRefreshing = false;

                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Failed to refresh access token:', refreshError);
                // Refresh token fail - clear storage
                localStorage.removeItem('jwt');
                localStorage.removeItem('refreshToken');
                isRefreshing = false;
                processQueue(refreshError, null);
                
                // Chỉ redirect nếu không phải đang ở trang discover
                if (router.currentRoute.value.path !== '/discover') {
                    router.push('/discover');
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;