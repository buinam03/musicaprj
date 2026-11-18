<template>
    <div class="mb-8 sm:mb-12">
        <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Recently Played</h2>
            <button v-if="recentlyPlayed.length > 0" @click="clearAll"
                class="text-sm sm:text-base text-gray-500 hover:text-orange-500 cursor-pointer transition-colors duration-200 flex items-center gap-2">
                <font-awesome-icon icon="fa-solid fa-trash" class="text-xs" />
                <span>Clear All</span>
            </button>
        </div>

        <div v-if="recentlyPlayed.length > 0" class="space-y-2 sm:space-y-3">
            <div v-for="item in visibleItems" :key="`${item.id}-${item.playedAt}`"
                class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300">
                <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative cursor-pointer"
                    @click="togglePlay(item)">
                    <img class="w-full h-full rounded-lg object-cover shadow-md" :src="item.artwork" :alt="item.title" />
                    <div
                        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer">
                        <font-awesome-icon :icon="playIcon(item)" class="text-white text-lg" />
                    </div>
                </div>
                <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                    <div class="flex-grow min-w-0">
                        <div @click="goToTrack(item.id)"
                            class="font-semibold text-left text-sm sm:text-base md:text-lg text-gray-900 hover:text-orange-500 cursor-pointer truncate mb-1 transition-colors">
                            {{ item.title }}
                        </div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs sm:text-sm text-gray-500 hover:text-orange-500 cursor-pointer">
                                {{ item.username }}
                            </span>
                            <span class="text-xs text-gray-400">•</span>
                            <span class="text-xs sm:text-sm text-gray-400">
                                {{ getTimeAgo(item.playedAt) }}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <button @click.stop="togglePlay(item)"
                            class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                            <font-awesome-icon :icon="playIcon(item)" class="text-xs sm:text-sm" />
                        </button>
                        <button @click.stop="removeItem(item.id)"
                            class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer">
                            <font-awesome-icon icon="fa-solid fa-xmark" class="text-xs sm:text-sm" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else
            class="h-48 sm:h-56 md:h-64 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm">
            <font-awesome-icon icon="fa-solid fa-clock-rotate-left" class="text-gray-300 text-5xl sm:text-6xl mb-4" />
            <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4">No recently played songs yet.
                Start playing music to see them here!</div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useNavigation } from '@/composables';
import {
    clearRecentlyPlayed,
    getRecentlyPlayed,
    getTimeAgo,
    removeFromRecentlyPlayed,
} from '@/utils/recentlyPlayed';

const STORAGE_KEY = 'musica_recently_played';
const VISIBLE_COUNT = 3;
const REFRESH_INTERVAL_MS = 60 * 1000;

const playerStore = usePlayerStore();
const { goToTrack } = useNavigation();

const recentlyPlayed = ref([]);
const visibleItems = computed(() => recentlyPlayed.value.slice(0, VISIBLE_COUNT));

const load = () => {
    recentlyPlayed.value = getRecentlyPlayed();
};

const isCurrent = (item) => {
    const currentId = Number(playerStore.currentSong?.id);
    return !Number.isNaN(currentId) && currentId === Number(item.id);
};

const playIcon = (item) => (isCurrent(item) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play');

const togglePlay = (item) => {
    if (!isCurrent(item)) {
        playerStore.play(item);
    } else if (playerStore.isPlaying) {
        playerStore.pause();
    } else {
        playerStore.resume();
    }
};

const removeItem = (songId) => {
    removeFromRecentlyPlayed(songId);
    load();
};

const clearAll = () => {
    if (confirm('Are you sure you want to clear all recently played songs?')) {
        clearRecentlyPlayed();
        load();
    }
};

// player.play() ghi vào localStorage mỗi khi đổi bài -> tải lại danh sách
watch(() => playerStore.currentSong, load);

// Đồng bộ khi tab khác thay đổi
const handleStorageChange = (event) => {
    if (event.key === STORAGE_KEY) load();
};

let refreshTimer = null;

onMounted(() => {
    load();
    window.addEventListener('storage', handleStorageChange);
    // Cập nhật lại nhãn "x minutes ago"
    refreshTimer = setInterval(load, REFRESH_INTERVAL_MS);
});

onBeforeUnmount(() => {
    window.removeEventListener('storage', handleStorageChange);
    clearInterval(refreshTimer);
});
</script>
