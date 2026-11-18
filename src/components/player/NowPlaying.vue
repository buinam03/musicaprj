<template>
    <div class="w-3/12 h-full flex items-center justify-start xl:h-16 lg:h-12 md:h-10">
        <div class="h-16 w-16 flex items-center justify-center flex-shrink-0 xl:h-16 lg:h-12 md:h-10">
            <component :is="trackLink ? 'router-link' : 'div'" :to="trackLink"
                class="flex items-center justify-center xl:h-16 lg:h-12 md:h-10">
                <img class="h-4/5 aspect-square rounded-lg items-center justify-center object-cover xl:rounded-lg lg:rounded-md md:rounded"
                    :src="song?.artwork || DEFAULT_ARTWORK" :alt="song?.title || 'Song artwork'">
            </component>
        </div>
        <div
            class="pl-3 h-14 w-4/6 flex flex-col justify-center xl:text-[14px] xl:pl-3 lg:text-[14px] lg:pl-1 md:text-[12px] md:pl-1">
            <div class="text-white text-left text-ellipsis whitespace-nowrap overflow-hidden">
                <router-link v-if="trackLink" :to="trackLink">{{ title }}</router-link>
                <span v-else>{{ title }}</span>
            </div>
            <div class="text-white text-left text-xs">
                <span>{{ song?.username || 'The DJ is missing!' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { DEFAULT_ARTWORK } from '@/config';

const playerStore = usePlayerStore();

const song = computed(() => playerStore.currentSong);
const trackLink = computed(() => (song.value?.id ? `/trackinfo/${song.value.id}` : undefined));
const title = computed(() => song.value?.title || 'Pick a song to set the vibe!');
</script>
