import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { notification } from 'ant-design-vue';
import { userApi } from '@/api';
import { useFollow } from '@/composables';

/**
 * Logic chung của trang Followers / Following theo `/:id`:
 * tải chủ trang, tải toàn bộ danh sách, tìm kiếm theo username (không có kết quả thì quay về danh sách đầy đủ).
 *
 * @param {object} options
 * @param {string} options.routeName  tên route của trang (để bỏ qua khi rời trang)
 * @param {string} options.listName   'followers' | 'following' (dùng trong thông báo)
 * @param {(userId) => Promise<object[]>} options.fetchAll         trả về mảng user { id, username, profile_picture }
 * @param {(userId, username) => Promise<object[]>} options.search trả về mảng user như trên
 */
export function useUserListSearch({ routeName, listName, fetchAll, search }) {
    const route = useRoute();
    const { loadFollowingIds } = useFollow();

    const profileUser = ref(null);
    const users = ref(null);
    const query = ref('');

    const profileId = () => route.params.id;

    const loadAll = async () => {
        const id = profileId();
        try {
            const list = await fetchAll(id);
            if (id === profileId()) users.value = list;
        } catch (error) {
            // Server trả 404 khi danh sách rỗng
            if (error.response?.status === 404) {
                users.value = [];
                return;
            }
            console.error(`Error fetching ${listName}:`, error);
            notification.error({
                message: 'Error',
                description: `Failed to load ${listName} list. Please refresh the page.`,
                duration: 4,
            });
        }
    };

    const loadProfileUser = async () => {
        try {
            profileUser.value = await userApi.getUserById(profileId());
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const runSearch = async () => {
        const username = query.value.trim();
        if (!username) {
            loadAll();
            return;
        }

        let results = [];
        try {
            results = await search(profileId(), username);
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error searching users:', error);
                notification.error({ message: 'Search Failed', description: 'Failed to search users. Please try again.', duration: 4 });
                return;
            }
        }

        if (results.length > 0) {
            users.value = results;
            notification.success({ message: 'Search Complete', description: `Found ${results.length} result(s).`, duration: 2 });
        } else {
            query.value = '';
            loadAll();
            notification.info({ message: 'No Results', description: `No users found. Showing all ${listName}.`, duration: 3 });
        }
    };

    watch(
        () => route.params.id,
        (id) => {
            if (!id || route.name !== routeName) return;
            users.value = null;
            profileUser.value = null;
            query.value = '';
            loadAll();
            loadProfileUser();
        },
        { immediate: true },
    );

    onMounted(() => loadFollowingIds());

    return { profileUser, users, query, runSearch };
}
