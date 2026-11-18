<template>
    <BaseModal :open="isOpen" title="Add to Playlist" body-class="p-4" @close="closePlaylistPicker">
        <div v-if="isLoading" class="flex justify-center items-center py-8">
            <font-awesome-icon icon="fa-solid fa-spinner" class="text-orange-500 text-2xl animate-spin" />
        </div>

        <div v-else-if="playlists.length > 0" class="space-y-2">
            <div v-for="playlist in playlists" :key="playlist.id" @click="addTo(playlist.id)"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group">
                <div class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                    <img v-if="playlist.artwork" :src="playlist.artwork" class="w-full h-full object-cover" :alt="playlist.name">
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-music" class="text-white text-lg" />
                    </div>
                </div>
                <div class="flex-grow min-w-0 text-left">
                    <h3 class="font-semibold text-gray-900 truncate">{{ playlist.name }}</h3>
                    <p class="text-sm text-gray-500">{{ playlist.Songs?.length || 0 }} songs</p>
                </div>
                <font-awesome-icon icon="fa-solid fa-plus" class="flex-shrink-0 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
        </div>

        <EmptyState v-else icon="fa-solid fa-notes-medical" message="No playlists found. Create one first!" />

        <template #footer>
            <button @click="isCreateOpen = true"
                class="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <font-awesome-icon icon="fa-solid fa-plus" />
                <span>Create New Playlist</span>
            </button>
        </template>
    </BaseModal>

    <CreatePlaylistModal v-model:open="isCreateOpen" submit-label="Create & Add" :loading="isCreating" :layer="60"
        @submit="createAndAdd" />
</template>

<script setup>
import { ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import { playlistApi, getErrorMessage } from '@/api';
import { useAuth, usePlaylistPicker } from '@/composables';
import BaseModal from '@/components/common/BaseModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import CreatePlaylistModal from './CreatePlaylistModal.vue';

/**
 * Modal "Add to playlist" dùng chung cho cả app.
 * Mở bằng usePlaylistPicker().openPlaylistPicker(song) từ bất kỳ component nào.
 */
const { isOpen, song, closePlaylistPicker } = usePlaylistPicker();
const { currentUserId } = useAuth();

const playlists = ref([]);
const isLoading = ref(false);
const isCreateOpen = ref(false);
const isCreating = ref(false);

const fetchPlaylists = async () => {
    if (!currentUserId.value) return;
    isLoading.value = true;
    try {
        playlists.value = (await playlistApi.getPlaylistsByUser(currentUserId.value)) || [];
    } catch (error) {
        console.error('Error fetching playlists:', error);
        notification.error({ message: 'Error', description: 'Failed to load playlists.', duration: 3 });
    } finally {
        isLoading.value = false;
    }
};

watch(isOpen, (open) => {
    if (open) fetchPlaylists();
});

const ensureSong = () => {
    if (song.value?.id) return true;
    notification.error({ message: 'Error', description: 'Invalid song data.', duration: 3 });
    return false;
};

const addTo = async (playlistId) => {
    if (!ensureSong()) return;
    try {
        await playlistApi.addSongToPlaylist({ playlistId, songId: song.value.id });
        notification.success({ message: 'Success', description: 'Song added to playlist successfully!', duration: 3 });
        closePlaylistPicker();
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to add song to playlist.'),
            duration: 4,
        });
    }
};

const createAndAdd = async (name) => {
    if (!ensureSong()) return;
    isCreating.value = true;
    try {
        const playlist = await playlistApi.createPlaylist({ name, creatorId: currentUserId.value });
        await playlistApi.addSongToPlaylist({ playlistId: playlist.id, songId: song.value.id });
        notification.success({ message: 'Success', description: 'Playlist created and song added successfully!', duration: 3 });
        isCreateOpen.value = false;
        closePlaylistPicker();
    } catch (error) {
        console.error('Error creating playlist and adding song:', error);
        notification.error({ message: 'Error', description: 'Failed to create playlist. Please try again.', duration: 4 });
    } finally {
        isCreating.value = false;
    }
};
</script>
