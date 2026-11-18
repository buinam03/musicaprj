<template>
    <div @click="playerStore.play(song)"
        class="chart-row group relative w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-orange-500/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.01]"
        :class="rank <= 3 ? `rank-${rank}` : ''"
        :style="{ animationDelay: rank <= 10 ? `${rank * 0.05}s` : '0s' }">
        <div class="flex-shrink-0 w-8 sm:w-12 flex items-center justify-center">
            <div class="text-lg sm:text-2xl lg:text-3xl font-bold" :class="rankColor">
                {{ rank }}
            </div>
        </div>

        <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative group-hover:scale-105 transition-transform duration-300">
            <img class="rounded-lg w-full h-full object-cover shadow-md" :src="song.artwork || DEFAULT_ARTWORK" :alt="song.title">
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity duration-300">
                <font-awesome-icon icon="fa-solid fa-play" class="text-white text-lg" />
            </div>
        </div>

        <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
            <div class="flex-grow min-w-0">
                <div @click.stop="goToTrack(song.id)"
                    class="text-base sm:text-lg font-semibold text-white mb-1 truncate hover:text-orange-400 transition-colors cursor-pointer">
                    {{ song.title }}
                </div>
                <div class="flex items-center gap-2">
                    <div @click.stop="goToProfile(artist.id)"
                        class="text-xs sm:text-sm text-gray-400 hover:text-orange-400 hover:underline transition-colors cursor-pointer truncate">
                        {{ artist.name }}
                    </div>
                </div>
            </div>

            <div class="flex-shrink-0 flex items-center gap-2 text-gray-400 text-xs sm:text-sm px-3 py-1.5 bg-white/5 rounded-full">
                <font-awesome-icon icon="fa-solid fa-play" class="text-orange-400" />
                <span class="font-medium">{{ formatCount(song.SongDetail?.plays || 0) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useNavigation } from '@/composables';
import { DEFAULT_ARTWORK } from '@/config';
import { getSongArtist } from '@/components/song/songHelpers';

/** Một dòng bảng xếp hạng: thứ hạng, artwork, tên bài, nghệ sĩ, lượt nghe. Bấm dòng để phát. */
const props = defineProps({
    song: { type: Object, required: true },
    rank: { type: Number, required: true }, // bắt đầu từ 1
});

const playerStore = usePlayerStore();
const { goToTrack, goToProfile } = useNavigation();

const artist = computed(() => getSongArtist(props.song));
const rankColor = computed(
    () => ({ 1: 'text-yellow-400', 2: 'text-gray-300', 3: 'text-orange-400' })[props.rank] || 'text-gray-400',
);

/** 1500 -> "1.5K", 2300000 -> "2.3M". */
const formatCount = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return String(num);
};
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chart-row {
    animation: fadeInUp 0.4s ease-out both;
}

.chart-row:hover {
    box-shadow: 0 10px 25px rgba(249, 115, 22, 0.2);
}

/* Top 3 */
.chart-row.rank-1 {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
    border-color: rgba(251, 191, 36, 0.3);
}

.chart-row.rank-2 {
    background: linear-gradient(135deg, rgba(209, 213, 219, 0.1) 0%, rgba(156, 163, 175, 0.1) 100%);
    border-color: rgba(209, 213, 219, 0.3);
}

.chart-row.rank-3 {
    background: linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
    border-color: rgba(251, 146, 60, 0.3);
}
</style>
