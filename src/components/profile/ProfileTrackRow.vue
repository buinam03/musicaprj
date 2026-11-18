<template>
    <div class="group w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 hover:border-orange-400 transition-all duration-300"
        :class="featured ? 'rounded-xl hover:shadow-lg' : 'rounded-lg hover:shadow-md'">
        <!-- Artwork -->
        <div v-if="featured" class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative group-hover:scale-105 transition-transform">
            <img class="w-full h-full aspect-square rounded-lg object-cover shadow-md" :src="song.artwork || DEFAULT_ARTWORK" alt="" loading="lazy" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer"
                @click="togglePlay">
                <font-awesome-icon :icon="playIcon" class="text-white text-lg" />
            </div>
        </div>
        <div v-else class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
            <img class="w-full h-full aspect-square rounded-lg object-cover" :src="song.artwork || DEFAULT_ARTWORK" alt="artwork" loading="lazy" />
        </div>

        <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
            <!-- Thông tin -->
            <div class="flex-grow min-w-0 text-left">
                <router-link :to="{ name: 'TrackInfoPage', params: { id: song.id } }"
                    class="font-semibold text-gray-900 hover:text-orange-500 transition-colors cursor-pointer truncate block mb-1 text-left"
                    :class="featured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'">
                    {{ song.title }}
                </router-link>
                <div class="text-gray-600 truncate text-left" :class="featured ? 'text-sm mb-2' : 'text-xs sm:text-sm mb-1'">
                    {{ artistNames }}
                </div>
                <div class="flex items-center" :class="featured ? 'gap-4' : 'gap-3'">
                    <div class="flex items-center gap-1 text-gray-500" :class="featured ? 'text-xs sm:text-sm' : 'text-xs'">
                        <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                        <span>{{ formatCount(song.SongDetail?.plays) }}</span>
                    </div>
                    <span v-if="featured" class="text-xs px-2 py-0.5 rounded-full"
                        :class="isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
                        {{ isPublic ? 'Public' : 'Private' }}
                    </span>
                    <div v-else-if="!isPublic" class="flex items-center gap-1 text-xs text-blue-600">
                        <font-awesome-icon icon="fa-solid fa-lock" />
                        <span>Private</span>
                    </div>
                </div>
            </div>

            <!-- Nút hành động -->
            <div class="flex items-center gap-2 flex-shrink-0">
                <button type="button" :class="buttonClass" @click.stop="togglePlay">
                    <font-awesome-icon :icon="playIcon" :class="iconClass" />
                </button>
                <button type="button" :class="buttonClass" @click.stop="addToQueue">
                    <font-awesome-icon icon="fa-solid fa-plus" :class="iconClass" />
                </button>
                <button type="button" :class="buttonClass" @click.stop="downloadFile(song.path, song.title)">
                    <font-awesome-icon icon="fa-solid fa-download" :class="iconClass" />
                </button>
                <button v-if="canEdit" type="button" :class="buttonClass" @click.stop="emit('edit', song.id)">
                    <font-awesome-icon icon="fa-solid fa-pen" :class="iconClass" />
                </button>
                <button v-if="showLike" type="button" @click.stop="toggleLike(song)"
                    class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 transition-all cursor-pointer"
                    :class="isLiked(song.id)
                        ? 'border-orange-500 text-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-orange-500 hover:text-orange-500'">
                    <font-awesome-icon icon="fa-solid fa-heart" class="text-xs sm:text-sm" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { notification } from 'ant-design-vue';
import { usePlayerStore } from '@/stores/player';
import { useLike } from '@/composables';
import { downloadFile } from '@/utils/download';
import { DEFAULT_ARTWORK } from '@/config';

/**
 * Một dòng bài hát trên trang profile.
 * variant "featured": artwork lớn có nút play khi hover (Latest Upload / Most-Listened).
 * variant "compact": dòng nhỏ trong danh sách có phân trang (All Tracks / Likes).
 */
const props = defineProps({
    song: { type: Object, required: true },
    variant: { type: String, default: 'compact' }, // featured | compact
    canEdit: { type: Boolean, default: false },
    showLike: { type: Boolean, default: false },
});

const emit = defineEmits(['edit']);

const playerStore = usePlayerStore();
const { isLiked, toggleLike } = useLike();

const featured = computed(() => props.variant === 'featured');
const isPublic = computed(() => Boolean(Number(props.song.is_public)));
const isCurrent = computed(() => Number(playerStore.currentSong?.id) === Number(props.song.id));
const playIcon = computed(() => (isCurrent.value && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'));

const artistNames = computed(
    () =>
        props.song.User?.username ||
        (props.song.SongArtists || []).map((artist) => artist.User?.username).filter(Boolean).join(', ') ||
        'Unknown Uploader',
);

const buttonClass = computed(() => [
    'flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer',
    featured.value ? 'w-10 h-10' : 'w-9 h-9 sm:w-10 sm:h-10',
]);
const iconClass = computed(() => (featured.value ? '' : 'text-xs sm:text-sm'));

/** 1500 -> "1.5K", 2000000 -> "2.0M". */
const formatCount = (value) => {
    const num = Number(value) || 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return String(num);
};

const togglePlay = () => {
    if (isCurrent.value) {
        if (playerStore.isPlaying) playerStore.pause();
        else playerStore.resume();
    } else {
        playerStore.play(props.song);
    }
};

/** Thêm vào hàng đợi phát (playlist của player). */
const addToQueue = () => {
    const { title } = props.song;
    if (playerStore.playlist.some((item) => item.id === props.song.id)) {
        notification.info({ message: 'Already in Playlist', description: `${title} is already in your playlist.`, duration: 2 });
        return;
    }
    playerStore.addToPlaylist(props.song);
    notification.success({ message: 'Added to Playlist', description: `${title} has been added to your playlist.`, duration: 2 });
};
</script>

<style scoped>
button:focus-visible,
a:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

img {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover;
    width: auto;
    height: auto;
    transition: transform 0.3s ease;
}

.group:hover img {
    transform: scale(1.05);
}
</style>
