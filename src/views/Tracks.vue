<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    My Tracks
                </h1>
                <div class="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button type="button" @click="deleteSelected" :disabled="!selectedId"
                        class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                        <span class="hidden sm:inline">Delete</span>
                    </button>
                    <button type="button" @click="editSelected" :disabled="!selectedId"
                        class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <font-awesome-icon icon="fa-solid fa-pencil" />
                        <span class="hidden sm:inline">Edit</span>
                    </button>
                </div>
            </div>

            <!-- Tracks List -->
            <div v-if="songs.length > 0" class="bg-white rounded-2xl shadow-xl overflow-hidden">
                <!-- Desktop Table View -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th class="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                                    <input type="checkbox" :checked="selectedId !== null" @change="toggleHeaderCheckbox"
                                        class="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 cursor-pointer">
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Track</th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Length</th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
                                </th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                </th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="item in songs" :key="item.id" @click="toggleSelection(item.id)"
                                class="hover:bg-orange-50 transition-colors duration-150 cursor-pointer">
                                <td class="px-4 py-4 whitespace-nowrap" @click.stop>
                                    <input type="checkbox" :checked="selectedId === item.id" @change="toggleSelection(item.id)"
                                        class="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 cursor-pointer">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-4">
                                        <div class="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                            <img :src="item.artwork || DEFAULT_ARTWORK" class="w-full h-full aspect-square object-cover" :alt="item.title">
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm sm:text-base font-semibold text-gray-900 truncate">{{ item.title }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-600">
                                    {{ formatDuration(item.SongDetail?.duration) }}
                                </td>
                                <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-600">
                                    {{ item.SongDetail?.likes || 0 }}
                                </td>
                                <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-600">
                                    {{ item.SongDetail?.plays || 0 }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-3 py-1 text-xs font-semibold rounded-full" :class="statusClass(item)">
                                        {{ item.is_public ? 'Public' : 'Private' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Mobile Card View -->
                <div class="md:hidden divide-y divide-gray-200">
                    <div v-for="item in songs" :key="item.id" @click="toggleSelection(item.id)"
                        class="p-4 hover:bg-orange-50 transition-colors duration-150">
                        <div class="flex items-center gap-3">
                            <input type="checkbox" :checked="selectedId === item.id" @click.stop @change="toggleSelection(item.id)"
                                class="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 cursor-pointer flex-shrink-0">
                            <div class="w-16 h-16 aspect-square flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                <img :src="item.artwork || DEFAULT_ARTWORK" class="w-full h-full aspect-square object-cover" :alt="item.title">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-semibold text-gray-900 truncate mb-1">{{ item.title }}</div>
                                <div class="flex items-center gap-3 text-xs text-gray-500">
                                    <span>{{ formatDuration(item.SongDetail?.duration) }}</span>
                                    <span class="flex items-center gap-1">
                                        <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
                                        {{ item.SongDetail?.likes || 0 }}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                        {{ item.SongDetail?.plays || 0 }}
                                    </span>
                                    <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="statusClass(item)">
                                        {{ item.is_public ? 'Public' : 'Private' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading" class="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <font-awesome-icon icon="fa-solid fa-music" class="text-orange-500 text-4xl sm:text-5xl" />
                </div>
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Tracks Yet</h3>
                <p class="text-gray-500 text-sm sm:text-base mb-6">
                    You haven't uploaded any tracks yet. Start sharing your music!
                </p>
                <router-link :to="{ name: 'UploadPage' }"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                    <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
                    Upload Your First Track
                </router-link>
            </div>
        </div>

        <EditTrackModal v-model:open="isEditOpen" :song-id="selectedId" @saved="loadTracks" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { songApi } from '@/api';
import { formatDuration } from '@/utils/format';
import { DEFAULT_ARTWORK } from '@/config';
import EditTrackModal from '@/components/track/EditTrackModal.vue';
import { confirmDeleteTrack } from '@/components/track/trackActions';

const songs = ref([]);
const loading = ref(true);
const selectedId = ref(null); // chỉ chọn một bài mỗi lần
const isEditOpen = ref(false);

const statusClass = (song) => (song.is_public ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800');

const loadTracks = async () => {
    loading.value = true;
    try {
        songs.value = (await songApi.getMySongs()) || [];
    } catch (error) {
        console.error('Error loading tracks:', error);
        notification.error({
            message: 'Error',
            description: 'Failed to load tracks. Please refresh the page.',
            duration: 4,
        });
    } finally {
        loading.value = false;
    }
};

const toggleSelection = (id) => {
    selectedId.value = selectedId.value === id ? null : id;
};

/** Checkbox ở header: bỏ chọn nếu đang chọn, ngược lại chọn bài đầu tiên. */
const toggleHeaderCheckbox = () => {
    selectedId.value = selectedId.value === null ? songs.value[0]?.id ?? null : null;
};

const warnNoSelection = (action) => {
    notification.warning({
        message: 'No Track Selected',
        description: `Please select a track to ${action}.`,
        duration: 3,
    });
};

const editSelected = () => {
    if (!selectedId.value) return warnNoSelection('edit');
    isEditOpen.value = true;
};

const deleteSelected = async () => {
    if (!selectedId.value) return warnNoSelection('delete');
    if (await confirmDeleteTrack(selectedId.value)) {
        selectedId.value = null;
        loadTracks();
    }
};

onMounted(loadTracks);
</script>

<style scoped>
/* Limit image sizes to prevent UI drop and resource consumption */
img {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover;
    width: auto;
    height: auto;
}
</style>
