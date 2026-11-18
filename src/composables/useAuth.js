import { computed } from 'vue';
import { notification } from 'ant-design-vue';
import { usePlayerStore } from '@/stores/player';
import { getUserIdFromJWT } from '@/utils/jwt';

/** Thông tin đăng nhập của user hiện tại. */
export function useAuth() {
    const playerStore = usePlayerStore();

    const currentUserId = computed(() => playerStore.idUserLogin ?? getUserIdFromJWT());
    const isLoggedIn = computed(() => Boolean(currentUserId.value));

    /** So sánh id an toàn (id từ route là string, từ API là number). */
    const isCurrentUser = (userId) => currentUserId.value != null && Number(userId) === Number(currentUserId.value);

    /** Trả về true nếu đã đăng nhập, ngược lại hiện cảnh báo và trả về false. */
    const requireLogin = (description = 'You need to log in to continue.') => {
        if (isLoggedIn.value) return true;
        notification.warning({ message: 'Warning', description });
        return false;
    };

    return { currentUserId, isLoggedIn, isCurrentUser, requireLogin };
}
