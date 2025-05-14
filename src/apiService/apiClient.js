import router from "@/routers/router";
import axios from "axios";


const apiClient = axios.create({
    baseURL: "http://localhost:3000/api", //url chung
    headers: {
        'Content-Type': 'application/json',
    }
});

//add interceptor để gắn token vào header để khi request tự động có token 
apiClient.interceptors.request.use(
    (config) => {
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
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Gửi yêu cầu tới API để lấy access token mới
                    const response = await apiClient.post('/auth/refresh-token', { refreshTokens: refreshToken });
                    const newAccessToken = response.data.accessToken;

                    // Lưu lại access token mới
                    localStorage.setItem('jwt', newAccessToken);

                    // Thử lại request cũ với access token mới
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient.request(error.config);
                } catch (refreshError) {
                    console.error('Failed to refresh access token:', refreshError);
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('refreshToken');
                    router.push('/discover'); // Chuyển hướng về trang đăng nhập
                }
            } else {
                router.push('/discover'); // Không có refresh token, chuyển hướng về đăng nhập
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;