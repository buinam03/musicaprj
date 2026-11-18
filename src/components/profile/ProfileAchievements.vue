<template>
    <div v-if="achievements.length > 0" class="mb-4">
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <span class="text-xs sm:text-sm text-gray-600 font-medium">Achievements:</span>
            <div class="flex items-center gap-2 sm:gap-3">
                <div v-for="(achievement, index) in achievements" :key="achievement.id ?? index"
                    class="relative group" :title="achievement.title">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-orange-500 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-110">
                        <img :src="achievement.img" :alt="achievement.title" class="w-full h-full object-contain p-1.5 sm:p-2" loading="lazy" />
                    </div>
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                        {{ achievement.title }}
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
/** Huy hiệu thành tích đã chọn để hiển thị trên profile. */
defineProps({
    achievements: { type: Array, default: () => [] },
});
</script>

<style scoped>
img {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto;
    height: auto;
}
</style>
