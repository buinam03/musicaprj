<template>
    <div class="bg-white rounded-xl shadow-lg p-3 sm:p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center">
            <div class="h-[60px] sm:h-[70px] w-[60px] sm:w-[70px] flex-shrink-0 relative group">
                <img class="rounded-lg w-full h-full object-cover" :src="song.artwork || DEFAULT_ARTWORK"
                    :alt="`${song.title} artwork`" loading="lazy">
                <div @click="playerStore.play(song)"
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center cursor-pointer text-white">
                    <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                </div>
            </div>

            <div class="ml-3 sm:ml-4 flex-grow min-w-0 text-left">
                <h3 @click="goToTrack(song.id)"
                    class="font-semibold text-sm sm:text-base text-gray-800 hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate">
                    {{ song.title }}
                </h3>
                <p @click="goToProfile(artist.id)"
                    class="text-gray-600 text-xs sm:text-sm truncate mt-0.5"
                    :class="artist.id ? 'hover:text-orange-500 cursor-pointer transition-colors duration-300' : ''">
                    {{ artist.name }}
                </p>
            </div>

            <SongOptionsMenu class="flex-shrink-0" :song="song" :play-label="playLabel" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useNavigation } from '@/composables';
import { DEFAULT_ARTWORK } from '@/config';
import SongOptionsMenu from './SongOptionsMenu.vue';
import { getSongArtist } from './songHelpers';

/** Thẻ bài hát dạng ngang: artwork (bấm để phát), tiêu đề, nghệ sĩ, menu tuỳ chọn. */
const props = defineProps({
    song: { type: Object, required: true },
    playLabel: { type: String, default: 'Play' },
});

const playerStore = usePlayerStore();
const { goToTrack, goToProfile } = useNavigation();
const artist = computed(() => getSongArtist(props.song));
</script>
