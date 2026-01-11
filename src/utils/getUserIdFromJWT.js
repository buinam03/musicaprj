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

/**
 * Kiểm tra xem JWT token có hết hạn không
 * @returns {boolean} true nếu token đã hết hạn hoặc không có token, false nếu còn hiệu lực
 */
export const isJWTExpired = () => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) {
            return true;
        }
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Kiểm tra nếu token hết hạn (exp < currentTime)
        if (decodedToken.exp && decodedToken.exp < currentTime) {
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error checking JWT expiration:', error);
        return true;
    }
};

/**
 * Kiểm tra xem JWT token còn bao nhiêu thời gian trước khi hết hạn (tính bằng giây)
 * @returns {number|null} Số giây còn lại trước khi hết hạn, null nếu không có token hoặc đã hết hạn
 */
export const getJWTTimeRemaining = () => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) {
            return null;
        }
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (decodedToken.exp && decodedToken.exp > currentTime) {
            return decodedToken.exp - currentTime;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting JWT time remaining:', error);
        return null;
    }
};

