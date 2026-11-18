<template>
    <div class="min-h-screen bg-gray-50">
        <div class="pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Likes Section -->
            <div class="mb-8 sm:mb-12">
                <LibrarySectionHeader title="Likes" link-label="All Likes" :to="{ name: 'LikesPage' }" />

                <div v-if="likedSongs.length > 0"
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
                    <LikedSongTile v-for="song in likedSongs.slice(0, LIKES_PREVIEW_LIMIT)" :key="song.id" :song="song" />
                </div>
                <div v-else class="h-48 sm:h-56 md:h-64 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <font-awesome-icon icon="fa-solid fa-heart" class="text-gray-300 text-5xl sm:text-6xl mb-4" />
                    <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4">You haven't liked any tracks yet.</div>
                </div>
            </div>

            <!-- Following Section -->
            <div>
                <LibrarySectionHeader title="Following" link-label="All Following"
                    :to="currentUserId ? { name: 'FollowingPage', params: { id: currentUserId } } : null" />

                <div v-if="followingUsers.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-12 md:mb-20">
                    <FollowingUserTile v-for="user in followingUsers.slice(0, FOLLOWING_PREVIEW_LIMIT)" :key="user.id" :user="user" />
                </div>
                <div v-else class="h-48 sm:h-56 md:h-64 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm mb-8 sm:mb-12 md:mb-20">
                    <font-awesome-icon icon="fa-solid fa-user-group" class="text-gray-300 text-5xl sm:text-6xl mb-4" />
                    <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4">You aren't following anyone yet.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { followApi, likeApi } from '@/api';
import { useAuth, useFollow, useLike } from '@/composables';
import LibrarySectionHeader from '@/components/library/LibrarySectionHeader.vue';
import LikedSongTile from '@/components/library/LikedSongTile.vue';
import FollowingUserTile from '@/components/library/FollowingUserTile.vue';

const LIKES_PREVIEW_LIMIT = 12;
const FOLLOWING_PREVIEW_LIMIT = 5;

const { currentUserId } = useAuth();
const { loadLikedIds } = useLike();
const { loadFollowingIds } = useFollow();

const likedSongs = ref([]);
const followingUsers = ref([]);

const fetchLikes = async (userId) => {
    try {
        const items = await likeApi.getLikedSongs(userId);
        likedSongs.value = (items || []).map((item) => item.Song).filter(Boolean);
    } catch (error) {
        console.error('Error fetching likes:', error);
    }
};

const fetchFollowing = async (userId) => {
    try {
        const items = await followApi.getFollowing(userId);
        followingUsers.value = (items || []).map((item) => item.following).filter(Boolean);
    } catch (error) {
        // Server trả 404 khi chưa follow ai
        if (error.response?.status !== 404) console.error('Error fetching following:', error);
        followingUsers.value = [];
    }
};

onMounted(() => {
    loadLikedIds();
    loadFollowingIds();

    const userId = currentUserId.value;
    if (!userId) return;
    fetchLikes(userId);
    fetchFollowing(userId);
});
</script>
