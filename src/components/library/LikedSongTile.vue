<template>
    <div class="group cursor-pointer">
        <div @click="togglePlay"
            class="w-full aspect-square relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <div class="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-orange-500 hover:bg-orange-600 flex justify-center items-center rounded-full shadow-lg transform transition-transform hover:scale-110">
                    <font-awesome-icon :icon="isCurrent && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                        class="text-white text-lg sm:text-xl" />
                </div>
            </div>
            <img :src="song.artwork || DEFAULT_ARTWORK" class="w-full h-full object-cover" :alt="song.title" />
        </div>
        <div class="mt-2 sm:mt-3">
            <div class="text-xs sm:text-sm font-medium text-gray-900 truncate flex items-center gap-1">
                <font-awesome-icon icon="fa-solid fa-heart" class="text-orange-500 flex-shrink-0" />
                <span class="truncate">{{ song.title }}</span>
            </div>
            <div class="text-xs text-gray-500 truncate mt-1">{{ artistName }}</div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { DEFAULT_ARTWORK } from '@/config';
import { getSongArtist } from '@/components/song/songHelpers';

/** Ô bài hát đã like (lưới vuông ở Library). Bấm artwork để play/pause. */
const props = defineProps({
    song: { type: Object, required: true },
});

const playerStore = usePlayerStore();

const isCurrent = computed(() => Number(playerStore.currentSong?.id) === Number(props.song.id));
const artistName = computed(() => getSongArtist(props.song).name);

const togglePlay = () => {
    if (!isCurrent.value) playerStore.play(props.song);
    else if (playerStore.isPlaying) playerStore.pause();
    else playerStore.resume();
};
</script>
