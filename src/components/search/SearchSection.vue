<template>
    <div v-if="!empty" class="mb-8 sm:mb-12">
        <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{{ title }}</h2>
            <div v-if="seeAllLabel" @click="emit('see-all')"
                class="flex items-center gap-2 text-sm sm:text-base text-gray-500 hover:text-orange-500 cursor-pointer transition-colors duration-200">
                <span>{{ seeAllLabel }}</span>
                <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-xs" />
            </div>
        </div>
        <slot />
    </div>
    <div v-else-if="emptyMessage" class="h-64 flex flex-col justify-center items-center bg-white rounded-xl border border-gray-200">
        <font-awesome-icon :icon="emptyIcon" class="text-gray-300 text-5xl mb-4" />
        <div class="text-lg text-gray-500">{{ emptyMessage }}</div>
    </div>
</template>

<script setup>
/**
 * Một nhóm kết quả tìm kiếm (Users / Tracks): tiêu đề, link "All ..." tuỳ chọn, nội dung qua slot.
 * Khi `empty`: hiện khung trống nếu có `emptyMessage`, ngược lại không hiện gì.
 */
defineProps({
    title: { type: String, required: true },
    seeAllLabel: { type: String, default: '' },
    empty: { type: Boolean, default: false },
    emptyIcon: { type: String, default: 'fa-solid fa-magnifying-glass' },
    emptyMessage: { type: String, default: '' },
});

const emit = defineEmits(['see-all']);
</script>
