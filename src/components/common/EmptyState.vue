<template>
    <div class="w-full flex flex-col justify-center items-center py-8 text-center"
        :class="boxed ? 'bg-gray-50 rounded-xl border border-gray-200 min-h-[10rem]' : ''">
        <font-awesome-icon v-if="icon" :icon="icon" class="text-gray-300 text-4xl mb-3" />
        <p class="text-base sm:text-lg text-gray-500 px-4">{{ message }}</p>
        <div v-if="$slots.default" class="mt-4">
            <slot />
        </div>
    </div>
</template>

<script setup>
/** Trạng thái rỗng: icon + thông điệp + slot cho nút hành động. */
defineProps({
    icon: { type: String, default: '' },
    message: { type: String, required: true },
    boxed: { type: Boolean, default: false },
});
</script>
