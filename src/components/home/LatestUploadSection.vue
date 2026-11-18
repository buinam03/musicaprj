<template>
    <section class="mb-12 sm:mb-16">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">YOUR LATEST UPLOAD</h2>
            <div v-if="!loading && songs.length > 0" class="text-sm text-gray-500">{{ pluralize(songs.length, 'track') }}</div>
        </div>

        <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-[192px_1fr] gap-4 sm:gap-6 lg:gap-10">
            <div class="hidden lg:block h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            <div class="h-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
        </div>

        <template v-else-if="songs.length > 0">
            <div class="grid grid-cols-1 lg:grid-cols-[192px_1fr] gap-4 sm:gap-6 lg:gap-10">
                <!-- Đĩa than: bấm để play/pause bài đang phát -->
                <div class="hidden lg:grid h-48 border-4 border-[#F6E2EC] place-items-center rounded-xl shadow-lg">
                    <div class="w-5/6 h-5/6 relative">
                        <div class="tonearm absolute w-5 h-2 bg-red-500 rounded-md z-50" :class="{ 'tonearm-active': playerStore.isPlaying }">
                            <div class="absolute h-14 w-1 bg-gray-400"></div>
                        </div>
                        <div class="relative w-full h-full">
                            <img class="vinyl pointer-events-none select-none" src="@/image/banners/image-removebg-preview.png" alt="" loading="lazy">
                            <div class="absolute inset-0 flex justify-center items-center text-white z-20 cursor-pointer" @click="togglePlayback">
                                <font-awesome-icon :icon="playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" size="2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-for="song in songs" :key="song.id"
                    class="h-auto sm:h-48 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                    <div class="grid grid-cols-1 sm:grid-cols-[1fr_160px] lg:grid-cols-[1fr_192px] gap-4 sm:gap-6 lg:gap-10 h-full p-4 sm:p-0 text-left">
                        <div class="h-full flex flex-col justify-center">
                            <div @click="goToProfile(song.User?.id)"
                                class="text-sm sm:text-base pl-0 sm:pl-5 pt-0 sm:pt-5 text-white truncate w-full sm:w-3/4 cursor-pointer hover:underline">
                                {{ song.User?.username }}
                            </div>
                            <div @click="goToTrack(song.id)"
                                class="w-full sm:w-3/4 text-lg sm:text-xl pl-0 sm:pl-5 text-white truncate cursor-pointer hover:underline font-semibold">
                                {{ song.title }}
                            </div>
                            <div class="pt-4 sm:pt-7 pl-0 sm:pl-7 flex gap-4">
                                <div class="opacity-70 text-white flex items-center text-sm sm:text-base">
                                    <font-awesome-icon icon="fa-solid fa-play" />
                                    <span class="pl-2">{{ song.SongDetail?.plays || 0 }}</span>
                                </div>
                                <div class="opacity-70 text-white flex items-center text-sm sm:text-base">
                                    <font-awesome-icon icon="fa-solid fa-heart" />
                                    <span class="pl-2">{{ song.SongDetail?.likes || 0 }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="h-full flex justify-center items-center">
                            <img class="w-full sm:w-5/6 aspect-square sm:h-5/6 object-cover border-4 border-white rounded-lg"
                                :src="song.artwork || DEFAULT_ARTWORK" alt="" loading="lazy">
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 sm:mt-6">
                <div class="w-full mb-3 sm:mb-4 overflow-hidden text-left">
                    <div class="text-gray-700 font-bold text-sm sm:text-base mb-1">Track playing:</div>
                    <div class="marquee-text text-gray-700 font-bold text-sm sm:text-base">
                        {{ playerStore.currentSong.title || 'No song playing' }}
                    </div>
                </div>
                <router-link :to="{ name: 'TracksPage' }"
                    class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-400 text-gray-600 rounded-full hover:border-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center">
                    <span>See all your tracks</span>
                    <font-awesome-icon icon="fa-solid fa-arrow-right" class="ml-2" />
                </router-link>
            </div>
        </template>

        <EmptyState v-else boxed message="You haven't uploaded any tracks yet." />
    </section>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player';
import { useNavigation } from '@/composables';
import { pluralize } from '@/utils/format';
import { DEFAULT_ARTWORK } from '@/config';
import EmptyState from '@/components/common/EmptyState.vue';

defineProps({
    songs: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
});

const playerStore = usePlayerStore();
const { goToProfile, goToTrack } = useNavigation();

const togglePlayback = () => {
    if (!playerStore.currentSong?.id) return;
    if (playerStore.isPlaying) playerStore.pause();
    else playerStore.resume();
};
</script>

<style scoped>
.vinyl {
    width: 100%;
    animation: spin 3s linear infinite;
    transform-origin: center;
}

.tonearm {
    transition: transform 0.3s ease-in-out;
    transform-origin: bottom center;
}

.tonearm-active {
    transform: rotate(-30deg);
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.marquee-text {
    white-space: nowrap;
    display: inline-block;
    animation: marquee 15s linear infinite;
}

@keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
}
</style>
