<template>
    <div class="min-h-screen bg-gray-50">
        <div class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl text-left sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    Playlists by Genre
                </h1>
                <p class="text-gray-600 text-sm text-left sm:text-base mt-2">
                    Discover curated playlists for every genre
                </p>
            </div>

            <PlaylistGrid :playlists="playlists" :loading="isLoading">
                <template #empty>
                    <EmptyState icon="fa-solid fa-music" message="Playlist not found"
                        class="h-64 sm:h-80 bg-white rounded-xl border border-gray-200 shadow-sm" />
                </template>
            </PlaylistGrid>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { playlistApi, getErrorMessage } from '@/api';
import PlaylistGrid from '@/components/playlist-page/PlaylistGrid.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const playlists = ref([]);
const isLoading = ref(true);

onMounted(async () => {
    try {
        playlists.value = (await playlistApi.getAllCmsPlaylists()) || [];
    } catch (error) {
        console.error('Error fetching CMS playlists:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to load playlists. Please try again later.'),
            duration: 4,
        });
    } finally {
        isLoading.value = false;
    }
});
</script>
