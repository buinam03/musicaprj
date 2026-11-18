import { ref } from 'vue';
import { notification } from 'ant-design-vue';
import { followApi, getErrorMessage } from '@/api';
import { useAuth } from './useAuth';

// Id những user mà user hiện tại đang follow - dùng chung toàn app.
const followingIds = ref(new Set());
let loadedForUserId = null;
let loadingPromise = null;

export function useFollow() {
    const { currentUserId, isCurrentUser, requireLogin } = useAuth();

    /** Tải danh sách đang follow của user hiện tại (cache theo user). */
    const loadFollowingIds = async ({ force = false } = {}) => {
        const userId = currentUserId.value;
        if (!userId) {
            followingIds.value = new Set();
            loadedForUserId = null;
            return;
        }
        if (!force && loadedForUserId === userId) return;
        if (loadingPromise && !force) return loadingPromise;

        loadingPromise = followApi
            .getFollowing(userId)
            .then((items) => {
                followingIds.value = new Set(items.map((item) => item.following.id));
            })
            .catch((error) => {
                // Server trả 404 khi chưa follow ai
                if (error.response?.status !== 404) console.error('Error loading following:', error);
                followingIds.value = new Set();
            })
            .finally(() => {
                loadedForUserId = userId;
                loadingPromise = null;
            });
        return loadingPromise;
    };

    const isFollowing = (userId) => followingIds.value.has(Number(userId));

    const setFollowing = (userId, following) => {
        const next = new Set(followingIds.value);
        if (following) next.add(Number(userId));
        else next.delete(Number(userId));
        followingIds.value = next;
    };

    /**
     * Follow / unfollow user.
     * @returns {Promise<boolean|null>} trạng thái mới, hoặc null nếu thất bại / không hợp lệ
     */
    const toggleFollow = async (userId, { notify = true } = {}) => {
        if (!requireLogin('You need to log in to follow users.')) return null;
        if (isCurrentUser(userId)) return null;

        try {
            const { followed } = await followApi.toggleFollow(userId);
            setFollowing(userId, followed);
            if (notify) {
                notification.success({
                    message: 'Success',
                    description: followed ? 'Followed successfully.' : 'Unfollowed successfully.',
                });
            }
            return followed;
        } catch (error) {
            console.error('Error toggling follow:', error);
            notification.error({ message: 'Error', description: getErrorMessage(error, 'Failed to update follow status.') });
            return null;
        }
    };

    return { followingIds, loadFollowingIds, isFollowing, toggleFollow };
}
