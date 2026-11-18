<template>
    <Teleport to="body">
        <div v-if="open"
            class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            :class="zIndexClass"
            @click.self="close">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-h-[85vh] overflow-hidden flex flex-col" :class="widthClass">
                <div v-if="title || $slots.header"
                    class="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <slot name="header">
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">{{ title }}</h2>
                    </slot>
                    <button type="button" class="text-gray-500 hover:text-gray-700 transition-colors" @click="close">
                        <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto" :class="bodyClass">
                    <slot />
                </div>

                <div v-if="$slots.footer" class="border-t border-gray-200 p-4 flex-shrink-0">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';

/**
 * Khung modal dùng chung: overlay, tiêu đề, nút đóng, body cuộn được, footer tuỳ chọn.
 * Dùng với v-model:open.
 */
const props = defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    size: { type: String, default: 'md' }, // sm | md | lg | xl
    bodyClass: { type: String, default: 'p-6' },
    layer: { type: Number, default: 50 }, // z-index
});

const emit = defineEmits(['update:open', 'close']);

const widthClass = computed(
    () => ({ sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' })[props.size] || 'max-w-md',
);
const zIndexClass = computed(() => (props.layer >= 60 ? 'z-[60]' : 'z-50'));

const close = () => {
    emit('update:open', false);
    emit('close');
};
</script>
