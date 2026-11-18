import axios from 'axios';
import { Modal } from 'ant-design-vue';
import router from '@/routers/router';
import { API_BASE_URL } from '@/config';
import { isJWTExpired } from '@/utils/jwt';
import { usePlayerStore } from '@/stores/player';

/**
 * Axios instance dùng cho mọi request tới backend.
 * - Tự gắn JWT vào header
 * - Tự refresh access token khi gặp 401
 * - Logout khi token không hợp lệ
 */
const http = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

/** Instance riêng cho refresh token (không đi qua interceptor). */
const refreshClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

const REFRESH_URL = '/auth/refresh-token';

let isShowingExpirationModal = false;
let pendingRequestAfterRefresh = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
    failedQueue = [];
};

const clearTokens = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
};

export const handleLogout = () => {
    clearTokens();
    isShowingExpirationModal = false;

    try {
        usePlayerStore().resetSession();
    } catch (error) {
        console.error('Error resetting player store:', error);
    }

    if (router.currentRoute.value.path !== '/discover') {
        router.push('/discover');
    }
};

/** Gọi API refresh, lưu access token mới. Trả về token mới. */
const requestNewAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await refreshClient.post(REFRESH_URL, { refreshTokens: refreshToken });
    const newAccessToken = response.data.data.accessToken;
    localStorage.setItem('jwt', newAccessToken);
    isShowingExpirationModal = false;
    return newAccessToken;
};

/** Hỏi user muốn tiếp tục (refresh token) hay đăng xuất khi phiên hết hạn. */
const showExpirationWarning = (originalRequest = null) => {
    if (isShowingExpirationModal) return;

    isShowingExpirationModal = true;
    if (originalRequest) pendingRequestAfterRefresh = originalRequest;

    Modal.confirm({
        title: 'Phiên đăng nhập đã hết hạn',
        content: 'Phiên đăng nhập của bạn đã hết hạn. Bạn muốn đăng nhập lại hay tiếp tục với token mới?',
        okText: 'Tiếp tục',
        cancelText: 'Đăng xuất',
        okType: 'primary',
        centered: true,
        onOk: async () => {
            let newToken;
            try {
                newToken = await requestNewAccessToken();
            } catch (error) {
                console.error('Failed to refresh token:', error);
                Modal.error({
                    title: 'Lỗi',
                    content: 'Không thể làm mới token. Vui lòng đăng nhập lại.',
                    okText: 'Đồng ý',
                    onOk: handleLogout,
                });
                return;
            }

            Modal.success({
                title: 'Thành công',
                content: 'Token đã được làm mới. Bạn có thể tiếp tục sử dụng.',
                okText: 'Đồng ý',
            });

            if (pendingRequestAfterRefresh) {
                const request = pendingRequestAfterRefresh;
                pendingRequestAfterRefresh = null;
                request.headers.Authorization = `Bearer ${newToken}`;
                request._retry = false;
                try {
                    await http(request);
                } catch (error) {
                    console.error('Error retrying request after token refresh:', error);
                }
            }
        },
        onCancel: () => {
            pendingRequestAfterRefresh = null;
            handleLogout();
        },
        afterClose: () => {
            isShowingExpirationModal = false;
            pendingRequestAfterRefresh = null;
        },
    });
};

// ---------- interceptors ----------

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const isInvalidTokenResponse = (data) => data && data.message === 'Invalid Token';

http.interceptors.response.use(
    (response) => {
        if (isInvalidTokenResponse(response.data)) {
            handleLogout();
            return Promise.reject(new Error('Invalid Token'));
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && isInvalidTokenResponse(error.response.data)) {
            handleLogout();
            return Promise.reject(error);
        }

        if (!error.response || error.response.status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Đang refresh: xếp hàng chờ token mới
        if (isRefreshing) {
            return new Promise((resolve, reject) => failedQueue.push({ resolve, reject })).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return http(originalRequest);
            });
        }

        // Token hết hạn: hỏi user trước
        if (isJWTExpired() && !isShowingExpirationModal) {
            showExpirationWarning(originalRequest);
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const newAccessToken = await requestNewAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            return http(originalRequest);
        } catch (refreshError) {
            console.error('Failed to refresh access token:', refreshError);
            processQueue(refreshError, null);
            handleLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

// ---------- helpers ----------

/**
 * Server bọc mọi response trong { status, success, message, data, pagination? }.
 * Các helper dưới đây trả thẳng `data` để component không phải viết res.data.data.
 */
export const get = (url, params) => http.get(url, { params }).then((res) => res.data.data);
export const post = (url, body) => http.post(url, body).then((res) => res.data.data);
export const put = (url, body) => http.put(url, body).then((res) => res.data.data);
export const del = (url, body) => http.delete(url, { data: body }).then((res) => res.data.data);

/** Lấy danh sách có phân trang: trả về { items, pagination }. */
export const getPage = (url, params) =>
    http.get(url, { params }).then((res) => ({ items: res.data.data, pagination: res.data.pagination || null }));

/** Lấy message lỗi từ server (nếu có) để hiển thị cho user. */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
    error?.response?.data?.message || fallback;

export default http;
