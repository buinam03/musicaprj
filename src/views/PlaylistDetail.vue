<template>
    <div class="min-h-screen bg-gray-50">
        <div v-if="playlist" class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <PlaylistDetailHeader :playlist="playlist" :is-owner="isOwner" :is-shuffled="isShuffled" :is-repeating="isRepeating"
                @play="playPlaylist" @edit="isEditModalOpen = true" @delete="confirmDelete"
                @toggle-shuffle="toggleShuffle" @toggle-repeat="toggleRepeat" />

            <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Songs</h2>

                <div v-if="songs.length > 0" class="space-y-2">
                    <PlaylistSongRow v-for="song in songs" :key="song.id" :song="song" :removable="isOwner"
                        @play="playSong" @remove="removeSong" />
                </div>
                <EmptyState v-else icon="fa-solid fa-music" message="This playlist is empty." class="h-48" />
            </div>
        </div>

        <div v-else-if="!isLoading" class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <EmptyState boxed icon="fa-solid fa-music" message="Playlist not found" />
        </div>

        <EditPlaylistModal v-model:open="isEditModalOpen" :initial-name="playlist?.name || ''" :loading="isSaving"
            @submit="updatePlaylist" />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import { playlistApi, getErrorMessage } from '@/api';
import { usePlayerStore, toPlayableSong } from '@/stores/player';
import { useAuth } from '@/composables';
import PlaylistDetailHeader from '@/components/playlist-page/PlaylistDetailHeader.vue';
import PlaylistSongRow from '@/components/playlist-page/PlaylistSongRow.vue';
import EditPlaylistModal from '@/components/playlist-page/EditPlaylistModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();
const { isCurrentUser } = useAuth();

const playlist = ref(null);
const isLoading = ref(false);
const isEditModalOpen = ref(false);
const isSaving = ref(false);
const isShuffled = ref(false);
const isRepeating = ref(false);

const songs = computed(() => playlist.value?.Songs || []);
const isOwner = computed(() => Boolean(playlist.value) && isCurrentUser(playlist.value.creator_id));

// ---------- load ----------

const fetchPlaylistDetail = async (id = route.params.id) => {
    isLoading.value = true;
    try {
        const data = await playlistApi.getPlaylistById(id);
        if (String(id) === String(route.params.id)) playlist.value = data;
    } catch (error) {
        console.error('Error fetching playlist detail:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to load playlist. Please try again later.'),
            duration: 4,
        });
    } finally {
        isLoading.value = false;
    }
};

// Chỉ theo dõi id khi còn ở trang này (tránh fetch nhầm khi chuyển sang route khác cũng có :id).
watch(
    () => (route.name === 'PlaylistDetailPage' ? route.params.id : null),
    (id) => {
        if (!id) return;
        playlist.value = null;
        fetchPlaylistDetail(id);
    },
    { immediate: true },
);

// ---------- playback ----------

const shuffleArray = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

/** Nạp toàn bộ bài của playlist vào player (trộn nếu đang bật Shuffle). */
const loadIntoPlayer = () => {
    const ordered = songs.value.map(toPlayableSong);
    playerStore.originalPlaylist = ordered;
    playerStore.playlist = isShuffled.value ? shuffleArray(ordered) : [...ordered];
    playerStore.isShuffle = isShuffled.value;
    playerStore.isRepeatOne = isRepeating.value;
    return playerStore.playlist;
};

const playSong = (song) => {
    if (Number(playerStore.currentSong?.id) === Number(song.id)) {
        if (playerStore.isPlaying) playerStore.pause();
        else playerStore.resume();
        return;
    }
    loadIntoPlayer();
    playerStore.play(song);
};

const playPlaylist = () => {
    if (songs.value.length === 0) {
        notification.warning({ message: 'Empty Playlist', description: 'This playlist has no songs to play.', duration: 3 });
        return;
    }

    const [firstSong] = loadIntoPlayer();
    if (!firstSong?.path) {
        console.error('First song is invalid:', firstSong);
        notification.error({ message: 'Error', description: 'Cannot play song. Song data is invalid.', duration: 3 });
        return;
    }
    playerStore.currentPlayIndex = 0;
    playerStore.play(firstSong);
};

const toggleShuffle = () => {
    isShuffled.value = !isShuffled.value;
    if (isShuffled.value) {
        notification.success({ message: 'Shuffle Enabled', description: 'Playlist will be shuffled when played.', duration: 2 });
    } else {
        notification.info({ message: 'Shuffle Disabled', description: 'Playlist will play in original order.', duration: 2 });
    }
    if (playerStore.playlist.length > 0) playerStore.isShuffle = isShuffled.value;
};

const toggleRepeat = () => {
    isRepeating.value = !isRepeating.value;
    if (isRepeating.value) {
        notification.success({ message: 'Repeat Enabled', description: 'Playlist will repeat when finished.', duration: 2 });
    } else {
        notification.info({ message: 'Repeat Disabled', description: 'Playlist will stop when finished.', duration: 2 });
    }
    playerStore.isRepeatOne = isRepeating.value;
};

// ---------- owner actions ----------

const updatePlaylist = async (name) => {
    isSaving.value = true;
    try {
        await playlistApi.updatePlaylist(playlist.value.id, { name });
        notification.success({ message: 'Success', description: 'Playlist updated successfully!', duration: 3 });
        isEditModalOpen.value = false;
        fetchPlaylistDetail();
    } catch (error) {
        console.error('Error updating playlist:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to update playlist. Please try again.'),
            duration: 4,
        });
    } finally {
        isSaving.value = false;
    }
};

const confirmDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) return;

    try {
        await playlistApi.deletePlaylist(playlist.value.id);
        notification.success({ message: 'Success', description: 'Playlist deleted successfully!', duration: 3 });
        router.push({ name: 'PlaylistsPage' });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to delete playlist. Please try again.'),
            duration: 4,
        });
    }
};

const removeSong = async (song) => {
    try {
        await playlistApi.removeSongFromPlaylist({ playlistId: playlist.value.id, songId: song.id });
        notification.success({ message: 'Success', description: 'Song removed from playlist.', duration: 2 });
        fetchPlaylistDetail();
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to remove song. Please try again.'),
            duration: 3,
        });
    }
};
</script>
