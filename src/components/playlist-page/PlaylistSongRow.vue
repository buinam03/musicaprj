<template>
    <div class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300">
        <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
            <img class="w-full h-full rounded-lg object-cover" :src="song.artwork || DEFAULT_ARTWORK" :alt="song.title">
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer"
                @click="emit('play', song)">
                <font-awesome-icon :icon="playIcon" class="text-white text-sm" />
            </div>
        </div>
        <div class="flex-grow min-w-0 text-left">
            <div @click="goToTrack(song.id)"
                class="font-semibold text-sm sm:text-base text-gray-900 hover:text-orange-500 transition-colors cursor-pointer truncate mb-1">
                {{ song.title }}
            </div>
            <div class="text-xs sm:text-sm text-gray-600 truncate">
                {{ artistName }}
            </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
            <button @click.stop="emit('play', song)"
                class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                <font-awesome-icon :icon="playIcon" class="text-xs sm:text-sm" />
            </button>
            <button v-if="removable" @click.stop="emit('remove', song)"
                class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer">
                <font-awesome-icon icon="fa-solid fa-trash" class="text-xs sm:text-sm" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useNavigation } from '@/composables';
import { DEFAULT_ARTWORK } from '@/config';
import { getSongArtist } from '@/components/song/songHelpers';

/** Một bài trong playlist: play/pause, mở trang bài hát, xoá khỏi playlist (nếu removable). */
const props = defineProps({
    song: { type: Object, required: true },
    removable: { type: Boolean, default: false },
});

const emit = defineEmits(['play', 'remove']);

const playerStore = usePlayerStore();
const { goToTrack } = useNavigation();

const artistName = computed(() => getSongArtist(props.song).name);
const isPlayingThis = computed(
    () => playerStore.isPlaying && Number(playerStore.currentSong?.id) === Number(props.song.id),
);
const playIcon = computed(() => (isPlayingThis.value ? 'fa-solid fa-pause' : 'fa-solid fa-play'));
</script>
