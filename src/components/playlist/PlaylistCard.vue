<template>
    <div @click="goToPlaylist(playlist.id)"
        class="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div class="aspect-square relative group bg-gradient-to-br from-orange-400 to-orange-600">
            <img v-if="playlist.artwork" class="w-full h-full object-cover" :src="playlist.artwork"
                :alt="`${playlist.name} artwork`" loading="lazy">
            <div v-else class="w-full h-full flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-music" class="text-white text-4xl" />
            </div>
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-play" class="text-white text-3xl sm:text-4xl" />
            </div>
        </div>
        <div class="p-3 sm:p-4 text-left">
            <h3 class="font-semibold text-sm sm:text-base text-gray-800 hover:text-orange-500 transition-colors duration-300 truncate mb-1">
                {{ playlist.name }}
            </h3>
            <p v-if="subtitle" class="text-xs sm:text-sm text-gray-500 truncate">{{ subtitle }}</p>
        </div>
    </div>
</template>

<script setup>
import { useNavigation } from '@/composables';

/** Thẻ playlist dạng lưới: artwork vuông + tên. Bấm để mở chi tiết playlist. */
defineProps({
    playlist: { type: Object, required: true },
    subtitle: { type: String, default: '' },
});

const { goToPlaylist } = useNavigation();
</script>
