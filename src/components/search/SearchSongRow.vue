<template>
    <div class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300">
        <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative cursor-pointer" @click="togglePlay">
            <img class="w-full h-full rounded-lg object-cover shadow-md" :src="song.artwork || DEFAULT_ARTWORK" :alt="song.title" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer">
                <font-awesome-icon :icon="isPlayingThis ? 'fa-solid fa-pause' : 'fa-solid fa-play'" class="text-white text-lg" />
            </div>
        </div>
        <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
            <div class="flex-grow min-w-0">
                <div @click="goToTrack(song.id)"
                    class="font-semibold text-left text-sm sm:text-base md:text-lg text-gray-900 hover:text-orange-500 cursor-pointer truncate mb-1 transition-colors">
                    {{ song.title }}
                </div>
                <div class="flex flex-wrap gap-x-2 gap-y-1">
                    <div v-for="artist in artists" :key="artist.id" @click="goToProfile(artist.id)"
                        class="text-xs text-left sm:text-sm text-gray-500 hover:text-orange-500 hover:underline cursor-pointer">
                        {{ artist.username }}
                    </div>
                </div>
            </div>
            <SongOptionsMenu class="flex-shrink-0" :song="song" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useNavigation } from '@/composables';
import { DEFAULT_ARTWORK } from '@/config';
import SongOptionsMenu from '@/components/song/SongOptionsMenu.vue';

/** Một dòng bài hát trong kết quả tìm kiếm: artwork (play/pause), tiêu đề, các nghệ sĩ, menu "...". */
const props = defineProps({
    song: { type: Object, required: true },
});

const playerStore = usePlayerStore();
const { goToTrack, goToProfile } = useNavigation();

const artists = computed(() => (props.song.SongArtists || []).map((item) => item.User).filter(Boolean));
const isCurrent = computed(() => Number(playerStore.currentSong?.id) === Number(props.song.id));
const isPlayingThis = computed(() => isCurrent.value && playerStore.isPlaying);

const togglePlay = () => {
    if (!isCurrent.value) playerStore.play(props.song);
    else if (playerStore.isPlaying) playerStore.pause();
    else playerStore.resume();
};
</script>

<style scoped>
/* Giới hạn kích thước ảnh (giữ nguyên style cũ của trang search) */
img {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover;
    width: auto;
    height: auto;
}
</style>
