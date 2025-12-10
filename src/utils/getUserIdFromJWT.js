import { jwtDecode } from 'jwt-decode';

/**
 * Lấy userId từ JWT token trong localStorage
 * @returns {number|null} userId nếu token hợp lệ, null nếu không có token hoặc token không hợp lệ
 */
export const getUserIdFromJWT = () => {
    try {
        const token = localStorage.getItem('jwt');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.id;
        }
        return null;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

/**
 * Lấy toàn bộ thông tin user từ JWT token (id, username, etc.)
 * @returns {object|null} Decoded token object hoặc null nếu có lỗi
 */
export const getUserFromJWT = () => {
    try {
        const token = localStorage.getItem('jwt');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken;
        }
        return null;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

