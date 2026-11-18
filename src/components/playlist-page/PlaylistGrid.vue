<template>
    <div v-if="loading" :class="GRID_CLASS">
        <div v-for="i in skeletonCount" :key="i" class="bg-white rounded-xl shadow-md p-4">
            <div class="aspect-square bg-gray-200 animate-pulse rounded-lg mb-3"></div>
            <div class="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div class="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
        </div>
    </div>

    <div v-else-if="playlists.length > 0" :class="GRID_CLASS">
        <PlaylistCard v-for="playlist in playlists" :key="playlist.id" :playlist="playlist"
            :subtitle="showSongCount ? pluralize(playlist.Songs?.length || 0, 'song') : ''" />
    </div>

    <slot v-else name="empty" />
</template>

<script setup>
import { pluralize } from '@/utils/format';
import PlaylistCard from '@/components/playlist/PlaylistCard.vue';

/** Lưới playlist có skeleton khi đang tải và slot `empty` khi không có dữ liệu. */
defineProps({
    playlists: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    skeletonCount: { type: Number, default: 12 },
    showSongCount: { type: Boolean, default: false },
});

const GRID_CLASS = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6';
</script>
