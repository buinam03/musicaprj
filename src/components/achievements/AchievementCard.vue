<template>
    <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
        :class="{
            'opacity-60 cursor-not-allowed hover:shadow-lg': !achievement.isCompleted,
            'ring-2 ring-orange-500 ring-offset-2': selected
        }">
        <div class="aspect-square w-full p-4 sm:p-6 flex justify-center items-center bg-gradient-to-br from-gray-50 to-white">
            <img :src="achievement.img" :alt="achievement.title"
                class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                :class="{ 'grayscale opacity-50': !achievement.isCompleted }">
        </div>
        <div class="p-3 sm:p-4">
            <div class="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                {{ achievement.title }}
            </div>
            <div class="flex items-center justify-between">
                <span class="px-2 py-1 text-xs sm:text-sm font-semibold rounded-full"
                    :class="achievement.isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                    {{ achievement.isCompleted ? 'Completed' : 'Locked' }}
                </span>
                <font-awesome-icon v-if="selected" icon="fa-solid fa-check" class="text-orange-500 text-lg" />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    achievement: { type: Object, required: true },
    selected: { type: Boolean, default: false },
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.group {
    transition: all 0.2s ease;
}

.group:hover {
    transform: translateY(-2px);
}

.cursor-not-allowed {
    pointer-events: auto;
    cursor: not-allowed;
}

.ring-orange-500 {
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.5);
}

.grayscale {
    filter: grayscale(100%);
}

img {
    transition: transform 0.3s ease, filter 0.3s ease;
}

@media (max-width: 640px) {
    .group:hover {
        transform: none;
    }
}
</style>
