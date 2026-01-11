<template>
    <div class="mb-8 sm:mb-12">
        <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Recently Played</h2>
            <button 
                v-if="recentlyPlayed.length > 0"
                @click="clearAll"
                class="text-sm sm:text-base text-gray-500 hover:text-orange-500 cursor-pointer transition-colors duration-200 flex items-center gap-2">
                <font-awesome-icon icon="fa-solid fa-trash" class="text-xs" />
                <span>Clear All</span>
            </button>
        </div>
        
        <div v-if="recentlyPlayed.length > 0" class="space-y-2 sm:space-y-3">
            <div 
                v-for="(item, index) in recentlyPlayed.slice(0, 3)" 
                :key="`${item.id}-${item.playedAt}`"
                class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300">
                <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative cursor-pointer"
                    @click="togglePlay(index, item)">
                    <img class="w-full h-full rounded-lg object-cover shadow-md" 
                        :src="item.artwork" 
                        :alt="item.title" />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer">
                        <font-awesome-icon 
                            :icon="Number(playerStore.currentSong?.id) === Number(item.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                            class="text-white text-lg" />
                    </div>
                </div>
                <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                    <div class="flex-grow min-w-0">
                        <div @click="redirectToTrack(item.id)"
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
                        <button @click.stop="togglePlay(index, item)"
                            class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                            <font-awesome-icon
                                :icon="Number(playerStore.currentSong?.id) === Number(item.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                class="text-xs sm:text-sm" />
                        </button>
                        <button @click.stop="removeItem(item.id)"
                            class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer">
                            <font-awesome-icon icon="fa-solid fa-xmark" class="text-xs sm:text-sm" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="h-48 sm:h-56 md:h-64 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm">
            <font-awesome-icon icon="fa-solid fa-clock-rotate-left" class="text-gray-300 text-5xl sm:text-6xl mb-4" />
            <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4">No recently played songs yet. Start playing music to see them here!</div>
        </div>
    </div>
</template>

<script>
import { usePlayerStore } from '@/js/state';
import { getRecentlyPlayed, clearRecentlyPlayed, removeFromRecentlyPlayed, getTimeAgo } from '@/utils/recentlyPlayed';

export default {
    name: 'RecentlyPlayed',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        };
    },
    data() {
        return {
            recentlyPlayed: [],
        };
    },
    mounted() {
        this.loadRecentlyPlayed();
        // Listen for storage changes (from other tabs)
        window.addEventListener('storage', this.handleStorageChange);
        // Poll for changes (same tab)
        this.pollInterval = setInterval(() => {
            this.loadRecentlyPlayed();
        }, 2000); // Check every 2 seconds
    },
    beforeUnmount() {
        window.removeEventListener('storage', this.handleStorageChange);
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    },
    methods: {
        loadRecentlyPlayed() {
            const data = getRecentlyPlayed();
            this.recentlyPlayed = data;
        },
        handleStorageChange(event) {
            if (event.key === 'musica_recently_played') {
                this.loadRecentlyPlayed();
            }
        },
        getTimeAgo(isoString) {
            return getTimeAgo(isoString);
        },
        togglePlay(index, song) {
            const playerStore = usePlayerStore();
            const currentSongId = Number(playerStore.currentSong?.id);
            const songId = Number(song.id);
            
            if (currentSongId === songId && !isNaN(currentSongId) && !isNaN(songId)) {
                if (playerStore.isPlaying) {
                    playerStore.pause();
                } else {
                    playerStore.resume();
                }
            } else {
                playerStore.play({
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    username: song.username,
                    duration: song.duration || 0,
                    path: song.path,
                });
            }
        },
        redirectToTrack(trackId) {
            this.$router.push({ path: `/trackinfo/${trackId}` });
        },
        removeItem(songId) {
            removeFromRecentlyPlayed(songId);
            this.loadRecentlyPlayed();
        },
        clearAll() {
            if (confirm('Are you sure you want to clear all recently played songs?')) {
                clearRecentlyPlayed();
                this.loadRecentlyPlayed();
            }
        },
    },
};
</script>

<style scoped></style>

