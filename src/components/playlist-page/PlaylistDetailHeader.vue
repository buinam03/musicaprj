<template>
    <div class="mb-8 sm:mb-12 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-shrink-0 w-full md:w-64 md:h-64">
                <div class="aspect-square rounded-xl overflow-hidden shadow-xl">
                    <img v-if="playlist.artwork" :src="playlist.artwork" :alt="playlist.name" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-music" class="text-white text-6xl sm:text-8xl" />
                    </div>
                </div>
            </div>

            <div class="flex-grow flex flex-col justify-end">
                <div class="mb-4">
                    <h1 class="text-left text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        {{ playlist.name }}
                    </h1>
                    <div v-if="playlist.creator" class="flex items-center gap-2 mb-4">
                        <img v-if="playlist.creator.profile_picture" :src="playlist.creator.profile_picture"
                            class="w-8 h-8 rounded-full object-cover" :alt="playlist.creator.username">
                        <span class="text-gray-600">Created by {{ playlist.creator.username }}</span>
                    </div>
                    <p class="text-left text-gray-500">{{ pluralize(playlist.Songs?.length || 0, 'song') }}</p>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                    <button @click="emit('play')"
                        class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                        <font-awesome-icon icon="fa-solid fa-play" />
                        <span>Play</span>
                    </button>
                    <template v-if="isOwner">
                        <button @click="emit('edit')"
                            class="px-6 py-3 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700 rounded-full font-medium transition-all flex items-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-pencil" />
                            <span>Edit</span>
                        </button>
                        <button @click="emit('delete')"
                            class="px-6 py-3 border-2 border-red-300 hover:border-red-500 hover:text-red-500 text-red-600 rounded-full font-medium transition-all flex items-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-trash" />
                            <span>Delete</span>
                        </button>
                    </template>
                    <button @click="emit('toggle-shuffle')"
                        class="px-6 py-3 border-2 rounded-full font-medium transition-all flex items-center gap-2"
                        :class="toggleClass(isShuffled)">
                        <font-awesome-icon icon="fa-solid fa-shuffle" />
                        <span>Shuffle</span>
                    </button>
                    <button @click="emit('toggle-repeat')"
                        class="px-6 py-3 border-2 rounded-full font-medium transition-all flex items-center gap-2"
                        :class="toggleClass(isRepeating)">
                        <font-awesome-icon icon="fa-solid fa-repeat" />
                        <span>Repeat</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { pluralize } from '@/utils/format';

/** Phần đầu trang chi tiết playlist: artwork, tên, người tạo và các nút hành động. */
defineProps({
    playlist: { type: Object, required: true },
    isOwner: { type: Boolean, default: false },
    isShuffled: { type: Boolean, default: false },
    isRepeating: { type: Boolean, default: false },
});

const emit = defineEmits(['play', 'edit', 'delete', 'toggle-shuffle', 'toggle-repeat']);

const toggleClass = (active) =>
    active
        ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-600'
        : 'border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700';
</script>
