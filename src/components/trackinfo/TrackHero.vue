<template>
    <div class="mb-6 sm:mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div class="flex flex-col md:flex-row">
            <!-- Artwork -->
            <div class="w-full md:w-80 lg:w-96 flex-shrink-0 aspect-square md:aspect-auto">
                <img :src="track.artwork || DEFAULT_ARTWORK" class="w-full h-full object-cover" alt="artwork">
            </div>

            <!-- Track Info and Controls -->
            <div class="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
                <div>
                    <h1 class="text-2xl text-left sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 break-words">
                        {{ track.title }}
                    </h1>
                    <div v-if="artist" @click="goToProfile(artist.id)"
                        class="text-base text-left sm:text-lg text-gray-300 hover:text-orange-400 cursor-pointer transition-colors mb-2 sm:mb-4">
                        {{ artist.username }}
                        <font-awesome-icon v-if="artist.is_verified" icon="fa-solid fa-check-circle" class="ml-2 text-blue-400" />
                    </div>
                    <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-400">
                        <span>{{ formatDate(track.created_at) || 'Invalid date' }}</span>
                        <span v-if="genreName" class="px-3 py-1 bg-white/10 rounded-full text-white">#{{ genreName }}</span>
                    </div>
                </div>

                <!-- Player Controls -->
                <div class="mt-4 sm:mt-6">
                    <div class="flex items-center gap-3 sm:gap-4 mb-4">
                        <button @click="togglePlay"
                            class="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-lg hover:scale-105">
                            <font-awesome-icon :icon="isCurrent && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                class="text-xl sm:text-2xl" />
                        </button>

                        <div class="flex-1">
                            <div class="flex items-center justify-between text-xs sm:text-sm text-gray-300 mb-1">
                                <span>{{ formatDuration(currentTime) }}</span>
                                <span>{{ formatDuration(duration) }}</span>
                            </div>
                            <input :style="{ '--progressPlay': `${progressPercent}%` }" :value="currentTime"
                                @input="seek($event.target.value)" min="0" :max="duration" step="0.1" type="range"
                                class="playSlider w-full h-1 sm:h-1.5 cursor-pointer" :disabled="!isCurrent">
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button @click="emit('like')"
                            class="px-4 sm:px-6 py-2 border-2 rounded-full font-medium transition-all flex items-center gap-2"
                            :class="liked
                                ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600'
                                : 'border-gray-400 text-gray-300 hover:border-orange-500 hover:text-orange-500'">
                            <font-awesome-icon icon="fa-solid fa-heart" />
                            <span class="text-sm sm:text-base">Like</span>
                        </button>
                        <button @click="openPlaylistPicker(track)"
                            class="px-4 sm:px-6 py-2 border-2 border-gray-400 text-gray-300 hover:border-orange-500 hover:text-orange-500 rounded-full font-medium transition-all flex items-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-notes-medical" />
                            <span class="text-sm sm:text-base">Add to Playlist</span>
                        </button>
                        <button @click.stop="downloadFile(track.path, track.title)"
                            class="px-4 sm:px-6 py-2 border-2 border-gray-400 text-gray-300 hover:border-orange-500 hover:text-orange-500 rounded-full font-medium transition-all flex items-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-download" />
                            <span class="text-sm sm:text-base">Download</span>
                        </button>
                        <div class="flex items-center gap-4 sm:gap-6 ml-auto">
                            <div class="text-gray-300 text-sm sm:text-base flex items-center gap-2">
                                <font-awesome-icon icon="fa-solid fa-play" />
                                <span>{{ track.SongDetail?.plays || 0 }}</span>
                            </div>
                            <div class="text-gray-300 text-sm sm:text-base flex items-center gap-2">
                                <font-awesome-icon icon="fa-solid fa-heart" />
                                <span>{{ track.SongDetail?.likes || 0 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useNavigation, usePlaylistPicker } from '@/composables';
import { downloadFile } from '@/utils/download';
import { formatDate, formatDuration } from '@/utils/format';
import { DEFAULT_ARTWORK } from '@/config';

/** Khối đầu trang chi tiết bài hát: artwork, thông tin, play/seek, like/playlist/download. */
const props = defineProps({
    track: { type: Object, required: true },
    artist: { type: Object, default: null },
    genreName: { type: String, default: '' },
    liked: { type: Boolean, default: false },
});

const emit = defineEmits(['like']);

const playerStore = usePlayerStore();
const { goToProfile } = useNavigation();
const { openPlaylistPicker } = usePlaylistPicker();

/** Bài đang nằm trong player có phải bài này không. */
const isCurrent = computed(() => Number(playerStore.currentSong?.id) === Number(props.track.id));
const duration = computed(() => Number(props.track.SongDetail?.duration) || 0);
const currentTime = computed(() => (isCurrent.value ? playerStore.currentTime : 0));
const progressPercent = computed(() => {
    const total = playerStore.currentSong.duration;
    return isCurrent.value && total > 0 ? (playerStore.currentTime / total) * 100 : 0;
});

const togglePlay = () => {
    if (!isCurrent.value) {
        playerStore.play(props.track);
    } else if (playerStore.isPlaying) {
        playerStore.pause();
    } else {
        playerStore.resume();
    }
};

const seek = (value) => {
    if (!isCurrent.value || !playerStore.audio) return;
    playerStore.audio.currentTime = parseFloat(value);
};
</script>

<style scoped>
.playSlider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right,
        rgb(249, 115, 22) 0%,
        rgb(249, 115, 22) var(--progressPlay, 0%),
        rgba(255, 255, 255, 0.3) var(--progressPlay, 0%),
        rgba(255, 255, 255, 0.3) 100%);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
}

.playSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
}

.playSlider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

.playSlider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.playSlider:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

* {
    transition: all 0.2s ease;
}
</style>
