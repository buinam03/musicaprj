import router from "@/routers/router";
import axios from "axios";
import { Modal } from 'ant-design-vue';
import { isJWTExpired } from '@/utils/getUserIdFromJWT';
import { usePlayerStore } from '@/js/state';

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api", //url chung
    headers: {
        'Content-Type': 'application/json',
    }
});

// Flag để track xem đã show modal cảnh báo chưa
let isShowingExpirationModal = false;

// Flag để track pending request khi user đang xử lý modal
let pendingRequestAfterRefresh = null;

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

// Function để xử lý logout
const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    isShowingExpirationModal = false;
    
    // Clear player store state
    try {
        const playerStore = usePlayerStore();
        playerStore.isLoggedIn = false;
        playerStore.idUserLogin = null;
        playerStore.currentSong = {
            id: null,
            title: "",
            artwork: null,
            username: "",
            duration: 0,
            path: "",
            isLiked: false
        };
        playerStore.playlist = [];
        playerStore.originalPlaylist = [];
        playerStore.isPlaying = false;
        playerStore.currentTime = 0;
        playerStore.currentPlayIndex = null;
    } catch (error) {
        console.error('Error resetting player store:', error);
    }
    
    // Redirect to discover page
    if (router.currentRoute.value.path !== '/discover') {
        router.push('/discover');
    }
};

// Function để refresh token
const handleRefreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            handleLogout();
            return false;
        }

        // Tạo axios instance mới để không đi qua interceptor request
        const refreshAxios = axios.create({
            baseURL: "http://localhost:3000/api",
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const response = await refreshAxios.post('/auth/refresh-token', { refreshTokens: refreshToken });
        const newAccessToken = response.data.accessToken;
        
        localStorage.setItem('jwt', newAccessToken);
        isShowingExpirationModal = false;
        return true;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        handleLogout();
        return false;
    }
};

// Function để show modal cảnh báo JWT hết hạn
const showExpirationWarning = (originalRequest = null) => {
    if (isShowingExpirationModal) {
        return; // Đã đang show modal, không show thêm
    }

    isShowingExpirationModal = true;
    if (originalRequest) {
        pendingRequestAfterRefresh = originalRequest;
    }

    Modal.confirm({
        title: 'Phiên đăng nhập đã hết hạn',
        content: 'Phiên đăng nhập của bạn đã hết hạn. Bạn muốn đăng nhập lại hay tiếp tục với token mới?',
        okText: 'Tiếp tục',
        cancelText: 'Đăng xuất',
        okType: 'primary',
        centered: true,
        onOk: async () => {
            // User chọn "Tiếp tục" - refresh token
            const success = await handleRefreshToken();
            if (!success) {
                // Nếu refresh thất bại, vẫn logout
                Modal.error({
                    title: 'Lỗi',
                    content: 'Không thể làm mới token. Vui lòng đăng nhập lại.',
                    okText: 'Đồng ý',
                    onOk: () => {
                        handleLogout();
                    }
                });
            } else {
                Modal.success({
                    title: 'Thành công',
                    content: 'Token đã được làm mới. Bạn có thể tiếp tục sử dụng.',
                    okText: 'Đồng ý',
                    duration: 2,
                });
                
                // Retry pending request nếu có
                if (pendingRequestAfterRefresh) {
                    const newToken = localStorage.getItem('jwt');
                    pendingRequestAfterRefresh.headers.Authorization = `Bearer ${newToken}`;
                    pendingRequestAfterRefresh._retry = false; // Reset retry flag
                    try {
                        await apiClient(pendingRequestAfterRefresh);
                    } catch (error) {
                        console.error('Error retrying request after token refresh:', error);
                    }
                    pendingRequestAfterRefresh = null;
                }
            }
        },
        onCancel: () => {
            // User chọn "Đăng xuất"
            pendingRequestAfterRefresh = null;
            handleLogout();
        },
        afterClose: () => {
            isShowingExpirationModal = false;
            pendingRequestAfterRefresh = null;
        }
    });
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
    (response) => {
        // Kiểm tra nếu response thành công nhưng có message "Invalid Token"
        if (response.data && response.data.message === 'Invalid Token') {
            console.warn('Invalid Token detected in successful response, logging out...');
            handleLogout();
            return Promise.reject(new Error('Invalid Token'));
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra message "Invalid Token" trong error response
        if (error.response && error.response.data && error.response.data.message === 'Invalid Token') {
            console.warn('Invalid Token detected in error response, logging out...');
            handleLogout();
            return Promise.reject(error);
        }

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

            // Kiểm tra nếu JWT đã hết hạn và chưa show modal
            if (isJWTExpired() && !isShowingExpirationModal) {
                // Show modal cảnh báo cho user với original request
                showExpirationWarning(originalRequest);
                // Reject request để đợi user quyết định
                return Promise.reject(error);
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
                
                // Tự động logout và redirect về discover
                handleLogout();
                
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
                isShowingExpirationModal = false;

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
                
                // Tự động logout và redirect về discover
                handleLogout();
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;