import { ref } from 'vue';
import { notification } from 'ant-design-vue';
import { likeApi } from '@/api';
import { useAuth } from './useAuth';

// State dùng chung toàn app: like ở trang này thì trang khác cũng thấy.
const likedIds = ref(new Set());
let loadedForUserId = null;
let loadingPromise = null;

export function useLike() {
    const { currentUserId, requireLogin } = useAuth();

    /** Tải danh sách id bài đã like (cache theo user, `force` để tải lại). */
    const loadLikedIds = async ({ force = false } = {}) => {
        const userId = currentUserId.value;
        if (!userId) {
            likedIds.value = new Set();
            loadedForUserId = null;
            return;
        }
        if (!force && loadedForUserId === userId) return;
        if (loadingPromise && !force) return loadingPromise;

        loadingPromise = likeApi
            .getLikedSongIds(userId)
            .then((ids) => {
                likedIds.value = new Set(ids);
                loadedForUserId = userId;
            })
            .catch((error) => console.error('Error loading liked songs:', error))
            .finally(() => {
                loadingPromise = null;
            });
        return loadingPromise;
    };

    const isLiked = (songId) => likedIds.value.has(Number(songId));

    const setLiked = (songId, liked) => {
        const next = new Set(likedIds.value);
        if (liked) next.add(Number(songId));
        else next.delete(Number(songId));
        likedIds.value = next;
    };

    /**
     * Like / unlike bài hát.
     * @returns {Promise<boolean|null>} trạng thái mới, hoặc null nếu thất bại / chưa đăng nhập
     */
    const toggleLike = async (songOrId, { notify = true } = {}) => {
        if (!requireLogin('You need to log in to like/unlike a song.')) return null;
        const songId = typeof songOrId === 'object' ? songOrId.id : songOrId;

        try {
            const { isLiked: liked } = await likeApi.toggleLike({ songId, userId: currentUserId.value });
            setLiked(songId, liked);
            if (notify) {
                notification.success({
                    message: 'Success',
                    description: liked ? 'You liked the song.' : 'You unliked the song.',
                });
            }
            return liked;
        } catch (error) {
            console.error('Error toggling like:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to toggle like status. Please try again later.',
            });
            return null;
        }
    };

    return { likedIds, loadLikedIds, isLiked, toggleLike };
}
