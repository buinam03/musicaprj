<template>
    <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div class="flex-1 w-full">
                <h2 class="text-lg text-left sm:text-xl font-semibold text-gray-800 mb-4">
                    Selected Achievements <span class="text-gray-500 text-sm font-normal">(max {{ slots.length }})</span>
                </h2>
                <div class="flex flex-wrap gap-3 sm:gap-4">
                    <div v-for="(item, index) in slots" :key="index" @click="emit('remove', index)" class="relative group">
                        <div class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer"
                            :class="item
                                ? 'border-orange-500 bg-white shadow-lg hover:shadow-xl hover:scale-105'
                                : 'border-gray-300 bg-gray-100 border-dashed hover:border-orange-300'">
                            <img v-if="item" :src="item.img" :alt="item.title" class="w-full h-full object-contain p-2">
                            <div v-else class="flex flex-col items-center justify-center text-gray-400">
                                <font-awesome-icon icon="fa-solid fa-plus" class="text-2xl sm:text-3xl mb-1" />
                                <span class="text-xs sm:text-sm font-medium">Empty</span>
                            </div>
                        </div>
                        <div v-if="item"
                            class="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                            title="Click to remove">
                            <font-awesome-icon icon="fa-solid fa-times" class="text-xs sm:text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button @click="emit('cancel')" type="button"
                    class="px-6 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all duration-200 whitespace-nowrap">
                    Cancel
                </button>
                <button @click="emit('save')" type="button"
                    class="px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap">
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    /** Mảng cố định độ dài, ô trống là null. */
    slots: { type: Array, required: true },
});

const emit = defineEmits(['remove', 'cancel', 'save']);
</script>

<style scoped>
.group {
    transition: all 0.2s ease;
}

.group:hover {
    transform: translateY(-2px);
}

img {
    transition: transform 0.3s ease, filter 0.3s ease;
}

button:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

@media (max-width: 640px) {
    .group:hover {
        transform: none;
    }
}
</style>
