<template>
    <div ref="rootRef" class="relative">
        <button type="button" @click.stop="isOpen = !isOpen" aria-label="Song options"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 text-gray-600">
            <font-awesome-icon icon="fa-solid fa-ellipsis" />
        </button>

        <div v-if="isOpen"
            class="absolute w-[240px] sm:w-[280px] bg-[#9057e0] rounded-lg right-0 bottom-full mb-2 z-30 shadow-xl overflow-hidden border border-purple-600/30 text-left">
            <div class="p-2 sm:p-3 border-b border-white/20 flex items-center gap-2 sm:gap-3">
                <img class="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover flex-shrink-0" :src="song.artwork || DEFAULT_ARTWORK"
                    alt="Artwork" loading="lazy">
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-white hover:text-purple-300 truncate text-sm sm:text-base cursor-pointer"
                        @click="run(() => goToTrack(song.id))">
                        {{ song.title }}
                    </div>
                    <div class="text-white/80 text-xs sm:text-sm truncate mt-0.5">
                        <span v-if="artist.id" class="hover:underline cursor-pointer" @click="run(() => goToProfile(artist.id))">
                            {{ artist.name }}
                        </span>
                        <span v-else>{{ artist.name }}</span>
                    </div>
                </div>
            </div>

            <ul class="py-1">
                <li v-for="action in actions" :key="action.key" @click="run(action.handler)"
                    class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                    <span class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                        <font-awesome-icon :icon="action.icon" :class="action.iconClass" />
                    </span>
                    <span>{{ action.label }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useClickOutside, useLike, useNavigation, usePlaylistPicker } from '@/composables';
import { downloadFile } from '@/utils/download';
import { DEFAULT_ARTWORK } from '@/config';
import { getSongArtist } from './songHelpers';

/** Menu "..." của bài hát: Add to playlist, Download, Play, Like/Unlike. */
const props = defineProps({
    song: { type: Object, required: true },
    playLabel: { type: String, default: 'Play' },
});

const playerStore = usePlayerStore();
const { isLiked, toggleLike } = useLike();
const { openPlaylistPicker } = usePlaylistPicker();
const { goToTrack, goToProfile } = useNavigation();

const isOpen = ref(false);
const rootRef = ref(null);
useClickOutside(rootRef, () => {
    isOpen.value = false;
});

const artist = computed(() => getSongArtist(props.song));

const actions = computed(() => {
    const liked = isLiked(props.song.id);
    return [
        { key: 'playlist', label: 'Add to Playlist', icon: 'fa-solid fa-plus', handler: () => openPlaylistPicker(props.song) },
        { key: 'download', label: 'Download', icon: 'fa-solid fa-download', handler: () => downloadFile(props.song.path, props.song.title) },
        { key: 'play', label: props.playLabel, icon: 'fa-solid fa-forward-step', handler: () => playerStore.play(props.song) },
        {
            key: 'like',
            label: liked ? 'Unlike' : 'Like',
            icon: liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart',
            iconClass: liked ? 'text-orange-400' : '',
            handler: () => toggleLike(props.song),
        },
    ];
});

const run = (handler) => {
    isOpen.value = false;
    handler();
};
</script>
