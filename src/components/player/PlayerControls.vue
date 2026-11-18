<template>
    <div class="w-1/6 flex justify-center items-center xl:text-[16px] lg:text-[14px] md:text-[12px]">
        <div @click="playerStore.previous()" class="w-1/5">
            <font-awesome-icon icon="fa-solid fa-backward-step" size="lg" />
        </div>
        <div @keyup.space="togglePlay" @click="togglePlay" class="w-1/5" tabindex="0">
            <font-awesome-icon v-if="playerStore.isPlaying" icon="fa-solid fa-pause" size="lg" />
            <font-awesome-icon v-else icon="fa-solid fa-play" size="lg" />
        </div>
        <div @click="playerStore.next()" class="w-1/5">
            <font-awesome-icon icon="fa-solid fa-forward-step" size="lg" />
        </div>
        <div class="mx-2 w-1/5" :class="{ 'text-white': playerStore.isShuffle }" @click="playerStore.toggleShuffle()">
            <font-awesome-icon icon="fa-solid fa-shuffle" size="lg" />
        </div>
        <div class="flex w-1/5" :class="{ 'text-white': playerStore.isRepeatOne }"
            @click="playerStore.toggleRepeatOne()">
            <font-awesome-icon icon="fa-solid fa-repeat" size="lg" />
            <span v-if="playerStore.isRepeatOne" class="text-xs">1</span>
        </div>
    </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();

const togglePlay = () => {
    if (!playerStore.audio) {
        console.warn('No song selected to play');
        return;
    }
    if (playerStore.isPlaying) playerStore.pause();
    else playerStore.resume();
};
</script>
