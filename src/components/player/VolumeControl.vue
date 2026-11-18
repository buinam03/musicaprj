<template>
    <div class="w-1/3 flex justify-center items-center relative">
        <div @click="toggleMute" class="cursor-pointer">
            <font-awesome-icon :icon="isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high'" />
        </div>

        <div class="pl-2">
            <input :value="playerStore.volume" @input="setVolume($event.target.value)" type="range" min="0" max="1"
                step="0.01" class="h-1 block mx-auto cursor-pointer progressVolume"
                :style="{ '--progress': `${playerStore.volume * 100}%` }">
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();

// Âm lượng trước khi tắt tiếng, dùng để khôi phục
const savedVolume = ref(playerStore.volume || 1);

const isMuted = computed(() => Number(playerStore.volume) === 0);

const setVolume = (value) => {
    const volume = Math.max(0, Math.min(Number(value) || 0, 1));
    playerStore.volume = volume;
    if (playerStore.audio) playerStore.audio.volume = volume;
};

const toggleMute = () => {
    if (isMuted.value) {
        setVolume(savedVolume.value || 1);
    } else {
        savedVolume.value = playerStore.volume;
        setVolume(0);
    }
};
</script>

<style scoped>
.progressVolume {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, rgb(253, 224, 71) 0%, rgb(253, 224, 71) var(--progress, 0%), #E4D2CC var(--progress, 0%), #E4D2CC 100%);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
}

.progressVolume::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
    position: relative;
}

.progressVolume::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
}
</style>
