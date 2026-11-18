<template>
    <div class="w-1/12 text-white text-xs">{{ formatDuration(playerStore.currentTime) }}</div>
    <div class="relative w-3/6 h-full">
        <div class="absolute top-1/2 transform -translate-y-1/2 translate-x-0 w-full">
            <input :style="{ '--progressPlay': `${percentage}%` }" @input="seek($event.target.value)"
                :value="playerStore.currentTime || 0" min="0" :max="duration" step="0.1" type="range"
                class="playSlider h-1 block mx-auto cursor-pointer w-full" :disabled="!duration">
        </div>
    </div>
    <div class="w-1/12 text-white text-xs">{{ formatDuration(duration) }}</div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { formatDuration } from '@/utils/format';

const playerStore = usePlayerStore();

const duration = computed(() => playerStore.currentSong?.duration || 0);

const percentage = computed(() =>
    duration.value && playerStore.currentTime ? (playerStore.currentTime / duration.value) * 100 : 0,
);

const seek = (value) => {
    if (!duration.value || !playerStore.audio) return;
    const time = Math.max(0, Math.min(Number(value), duration.value));
    playerStore.audio.currentTime = time;
    playerStore.currentTime = time;
};
</script>

<style scoped>
.playSlider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, rgb(255, 255, 255) 0%, rgb(255, 255, 255) var(--progressPlay, 0%), #E4D2CC var(--progressPlay, 0%), #E4D2CC 100%);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
}

.playSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 0;
    transform: rotate(45deg);
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
    position: relative;
}

.playSlider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
}
</style>
