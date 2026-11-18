<template>
    <div class="chart-page w-full min-h-screen mx-auto">
        <div class="w-full pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="mb-8 sm:mb-12">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                    <div class="text-left">
                        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                            #musicachart
                        </h1>
                        <p class="text-gray-400 text-sm sm:text-base">Top trending songs</p>
                    </div>
                    <div class="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-full border border-orange-500/30">
                        <span class="text-white font-semibold text-sm sm:text-base">Top 10 This Week</span>
                    </div>
                </div>
            </div>

            <div class="space-y-2 sm:space-y-3">
                <ChartSongRow v-for="(song, index) in songs" :key="song.id" :song="song" :rank="index + 1" />
            </div>

            <div v-if="!isLoading && songs.length === 0" class="flex flex-col items-center justify-center py-16 sm:py-20">
                <font-awesome-icon icon="fa-solid fa-music" class="text-gray-600 text-6xl mb-4" />
                <p class="text-gray-400 text-lg sm:text-xl">No charts available yet</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { songApi } from '@/api';
import ChartSongRow from '@/components/chart/ChartSongRow.vue';

const songs = ref([]);
const isLoading = ref(true);

onMounted(async () => {
    try {
        songs.value = (await songApi.getTopSongsByPlays()) || [];
    } catch (error) {
        console.error('Error loading chart:', error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<style scoped>
.chart-page {
    background: #222021;
}
</style>
