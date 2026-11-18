<template>
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Track</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Length</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                        </th>
                        <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="song in songs" :key="song.id" class="hover:bg-orange-50 transition-colors duration-150">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center gap-4">
                                <div class="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                    <img :src="song.artwork || DEFAULT_ARTWORK" class="w-full h-full object-cover" :alt="song.title">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm sm:text-base font-semibold text-gray-900 truncate mb-1">{{ song.title }}</div>
                                    <router-link v-if="song.User" :to="{ name: 'ProfilePage', params: { id: song.User.id } }"
                                        class="text-xs sm:text-sm text-gray-500 hover:text-orange-500 transition-colors">
                                        {{ song.User.username }}
                                    </router-link>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDuration(song.SongDetail?.duration) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ song.SongDetail?.likes || 0 }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ song.SongDetail?.plays || 0 }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex justify-center items-center gap-2">
                                <button @click.stop="togglePlay(song)" :title="isPlayingSong(song) ? 'Pause' : 'Play'"
                                    class="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    :class="isPlayingSong(song) ? ACTIVE_PLAY_CLASS : IDLE_PLAY_CLASS">
                                    <font-awesome-icon :icon="isPlayingSong(song) ? 'fa-solid fa-pause' : 'fa-solid fa-play'" class="text-sm" />
                                </button>
                                <button @click.stop="emit('like', song)" :title="isLiked(song.id) ? 'Unlike' : 'Like'"
                                    class="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    :class="isLiked(song.id) ? ACTIVE_LIKE_CLASS : IDLE_LIKE_CLASS">
                                    <font-awesome-icon icon="fa-solid fa-heart" class="text-sm" />
                                </button>
                                <button @click.stop="emit('queue', song)" title="Add to playlist"
                                    class="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center transition-all duration-200 hover:scale-110">
                                    <font-awesome-icon icon="fa-solid fa-plus" class="text-sm" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden divide-y divide-gray-200">
            <div v-for="song in songs" :key="song.id" class="p-4 hover:bg-orange-50 transition-colors duration-150">
                <div class="flex items-center gap-3">
                    <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                        <img :src="song.artwork || DEFAULT_ARTWORK" class="w-full h-full object-cover" :alt="song.title">
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-semibold text-gray-900 truncate mb-1">{{ song.title }}</div>
                        <router-link v-if="song.User" :to="{ name: 'ProfilePage', params: { id: song.User.id } }"
                            class="text-xs text-gray-500 hover:text-orange-500 transition-colors block truncate">
                            {{ song.User.username }}
                        </router-link>
                        <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>{{ formatDuration(song.SongDetail?.duration) }}</span>
                            <span class="flex items-center gap-1">
                                <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
                                {{ song.SongDetail?.likes || 0 }}
                            </span>
                            <span class="flex items-center gap-1">
                                <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                {{ song.SongDetail?.plays || 0 }}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Action Buttons Mobile -->
                <div class="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button @click="togglePlay(song)"
                        class="flex-1 py-2.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200"
                        :class="isPlayingSong(song) ? ACTIVE_PLAY_CLASS : IDLE_PLAY_CLASS">
                        <font-awesome-icon :icon="isPlayingSong(song) ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                        <span class="text-sm font-semibold">{{ isPlayingSong(song) ? 'Pause' : 'Play' }}</span>
                    </button>
                    <button @click="emit('like', song)"
                        class="flex-1 py-2.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200"
                        :class="isLiked(song.id) ? ACTIVE_LIKE_CLASS : IDLE_LIKE_CLASS">
                        <font-awesome-icon icon="fa-solid fa-heart" />
                        <span class="text-sm font-semibold">Like</span>
                    </button>
                    <button @click="emit('queue', song)"
                        class="flex-1 py-2.5 px-4 rounded-xl border-2 border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center gap-2 transition-all duration-200">
                        <font-awesome-icon icon="fa-solid fa-plus" />
                        <span class="text-sm font-semibold">Add</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player';
import { useLike } from '@/composables';
import { formatDuration } from '@/utils/format';
import { DEFAULT_ARTWORK } from '@/config';

/**
 * Danh sách bài đã like: bảng (desktop) + thẻ (mobile).
 * Tự xử lý play/pause; like và "Add" (thêm vào hàng chờ phát) emit lên cha.
 */
defineProps({
    songs: { type: Array, required: true },
});

const emit = defineEmits(['like', 'queue']);

const ACTIVE_PLAY_CLASS = 'border-orange-500 bg-orange-500 text-white';
const IDLE_PLAY_CLASS = 'border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500';
const ACTIVE_LIKE_CLASS = 'border-red-500 bg-red-500 text-white';
const IDLE_LIKE_CLASS = 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500';

const playerStore = usePlayerStore();
const { isLiked } = useLike();

const isCurrent = (song) => Number(playerStore.currentSong?.id) === Number(song.id);
const isPlayingSong = (song) => isCurrent(song) && playerStore.isPlaying;

const togglePlay = (song) => {
    if (!isCurrent(song)) playerStore.play(song);
    else if (playerStore.isPlaying) playerStore.pause();
    else playerStore.resume();
};
</script>
