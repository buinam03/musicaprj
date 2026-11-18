<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                    <span v-if="user">{{ user.username }}'s Liked Songs</span>
                    <span v-else>Liked Songs</span>
                </h1>
                <p v-if="songs.length > 0" class="text-gray-500 text-sm sm:text-base">{{ pluralize(songs.length, 'song') }}</p>
            </div>

            <LikedSongsList v-if="songs.length > 0" :songs="songs" @like="onLike" @queue="addToQueue" />

            <!-- Empty State -->
            <div v-else class="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500 text-4xl sm:text-5xl" />
                </div>
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Liked Songs Yet</h3>
                <p class="text-gray-500 text-sm sm:text-base mb-6">
                    {{ user ? user.username + " hasn't" : "You haven't" }} liked any tracks yet. Start discovering music!
                </p>
                <router-link :to="{ name: 'HomePage' }"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                    <font-awesome-icon icon="fa-solid fa-music" />
                    Discover Music
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { likeApi, userApi } from '@/api';
import { usePlayerStore } from '@/stores/player';
import { useAuth, useLike } from '@/composables';
import { pluralize } from '@/utils/format';
import LikedSongsList from '@/components/library/LikedSongsList.vue';

const playerStore = usePlayerStore();
const { currentUserId } = useAuth();
const { loadLikedIds, toggleLike } = useLike();

const songs = ref([]);
const user = ref(null);

const fetchLikes = async (userId) => {
    try {
        const items = await likeApi.getLikedSongs(userId);
        songs.value = (items || []).map((item) => item.Song).filter(Boolean);
    } catch (error) {
        console.error('Error fetching likes:', error);
        notification.error({ message: 'Error', description: 'Failed to load liked songs. Please refresh the page.', duration: 4 });
    }
};

const fetchUser = async (userId) => {
    try {
        user.value = await userApi.getUserById(userId);
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

onMounted(() => {
    loadLikedIds();
    const userId = currentUserId.value;
    if (!userId) return;
    fetchLikes(userId);
    fetchUser(userId);
});

// Bỏ like vẫn giữ bài trong danh sách (để có thể like lại ngay).
const onLike = async (song) => {
    const liked = await toggleLike(song, { notify: false });
    if (liked === null) return;
    notification.success({
        message: liked ? 'Liked' : 'Unliked',
        description: liked ? `Added "${song.title}" to your likes.` : `Removed "${song.title}" from your likes.`,
        duration: 2,
    });
};

/** Thêm vào hàng chờ phát của player. */
const addToQueue = (song) => {
    if (playerStore.playlist.some((item) => item.id === song.id)) {
        notification.info({ message: 'Already in Playlist', description: `"${song.title}" is already in your playlist.`, duration: 2 });
        return;
    }
    playerStore.addToPlaylist(song);
    notification.success({ message: 'Added to Playlist', description: `"${song.title}" has been added to your playlist.`, duration: 3 });
};
</script>
