<template>
    <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{{ title }}</h2>
        <component :is="to ? RouterLink : 'div'" :to="to || undefined"
            class="flex items-center gap-2 text-sm sm:text-base text-gray-500 hover:text-orange-500 cursor-pointer transition-colors duration-200">
            <span>{{ linkLabel }}</span>
            <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-xs" />
        </component>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

/** Tiêu đề một mục trong Library kèm link "All ..." (không có `to` thì link không làm gì). */
defineProps({
    title: { type: String, required: true },
    linkLabel: { type: String, required: true },
    to: { type: [Object, String], default: null },
});
</script>
