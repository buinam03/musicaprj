<template>
    <div class="min-h-screen bg-gray-50">
        <div class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="mb-6 sm:mb-8 flex justify-between items-center">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    Playlists
                </h1>
                <button @click="isCreateModalOpen = true"
                    class="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                    <span class="hidden sm:inline">Create Playlist</span>
                </button>
            </div>

            <!-- Playlists by genre -->
            <section class="mb-12 sm:mb-16">
                <div class="flex justify-between items-center mb-6 sm:mb-8">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">PLAYLISTS BY GENRE</h2>
                    <router-link :to="{ name: 'GenrePlaylistsPage' }"
                        class="px-4 sm:px-6 py-2 text-sm sm:text-base text-orange-500 hover:text-orange-600 font-medium transition-colors flex items-center gap-2">
                        <span>View All</span>
                        <font-awesome-icon icon="fa-solid fa-arrow-right" />
                    </router-link>
                </div>

                <PlaylistGrid :playlists="genrePlaylists" :loading="loading.genre" :skeleton-count="GENRE_LIMIT">
                    <template #empty>
                        <EmptyState boxed icon="fa-solid fa-music" message="Playlist not found" />
                    </template>
                </PlaylistGrid>
            </section>

            <!-- Playlist của user -->
            <PlaylistGrid :playlists="playlists" :loading="loading.mine" show-song-count>
                <template #empty>
                    <EmptyState icon="fa-solid fa-notes-medical" message="No playlists found. Create your first playlist!"
                        class="h-64 sm:h-80 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <button @click="isCreateModalOpen = true"
                            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                            Create Playlist
                        </button>
                    </EmptyState>
                </template>
            </PlaylistGrid>
        </div>

        <CreatePlaylistModal v-model:open="isCreateModalOpen" :loading="creating" @submit="createPlaylist" />
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { playlistApi, getErrorMessage } from '@/api';
import { useAuth } from '@/composables';
import PlaylistGrid from '@/components/playlist-page/PlaylistGrid.vue';
import CreatePlaylistModal from '@/components/playlist/CreatePlaylistModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const GENRE_LIMIT = 6;

const { currentUserId, requireLogin } = useAuth();

const playlists = ref([]);
const genrePlaylists = ref([]);
const loading = reactive({ mine: false, genre: true });
const isCreateModalOpen = ref(false);
const creating = ref(false);

const fetchPlaylists = async () => {
    if (!currentUserId.value) {
        playlists.value = [];
        return;
    }
    loading.mine = true;
    try {
        playlists.value = (await playlistApi.getPlaylistsByUser(currentUserId.value)) || [];
    } catch (error) {
        console.error('Error fetching playlists:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to load playlists. Please try again later.'),
            duration: 4,
        });
    } finally {
        loading.mine = false;
    }
};

const fetchGenrePlaylists = async () => {
    loading.genre = true;
    try {
        genrePlaylists.value = ((await playlistApi.getCmsPlaylists()) || []).slice(0, GENRE_LIMIT);
    } catch (error) {
        console.error('Error fetching genre playlists:', error);
        genrePlaylists.value = [];
    } finally {
        loading.genre = false;
    }
};

const createPlaylist = async (name) => {
    if (!requireLogin('Please log in to create a playlist.')) return;

    creating.value = true;
    try {
        await playlistApi.createPlaylist({ name, creatorId: currentUserId.value });
        notification.success({ message: 'Success', description: 'Playlist created successfully!', duration: 3 });
        isCreateModalOpen.value = false;
        fetchPlaylists();
    } catch (error) {
        console.error('Error creating playlist:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to create playlist. Please try again.'),
            duration: 4,
        });
    } finally {
        creating.value = false;
    }
};

onMounted(() => {
    fetchPlaylists();
    fetchGenrePlaylists();
});
</script>
