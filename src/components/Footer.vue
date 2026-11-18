<template>
    <div class="bg-[#FF6347] h-16 w-full fixed bottom-0 z-50 xl:h-16 lg:h-12 md:h-10">
        <div
            class="w-container mx-auto h-full flex justify-center items-center xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <PlayerControls />
            <div class="pl-4 h-full w-2/3 flex justify-center items-center xl:scale-100 lg:scale-90 md:scale-90">
                <ProgressBar />
                <VolumeControl />
            </div>
            <NowPlaying />
            <div class="w-1/12 relative group">
                <div @click="playerStore.togglePlaylistPanel()" class="text-white cursor-pointer">
                    <font-awesome-icon icon="fa-solid fa-bars" alt="Next-up" />
                    <div
                        class="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:flex items-center justify-center bg-gray-800 border-gray-400 text-gray-300 text-[10px] py-1 px-2 shadow-lg select-none">
                        Playlist
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { usePlayerStore } from '@/stores/player';
import PlayerControls from '@/components/player/PlayerControls.vue';
import ProgressBar from '@/components/player/ProgressBar.vue';
import VolumeControl from '@/components/player/VolumeControl.vue';
import NowPlaying from '@/components/player/NowPlaying.vue';

const playerStore = usePlayerStore();
</script>
