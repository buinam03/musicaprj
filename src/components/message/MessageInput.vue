<template>
    <div class="border-t border-gray-200 p-3 sm:p-4 bg-white">
        <div class="flex items-end gap-2 sm:gap-3">
            <div class="flex-1 relative">
                <input :value="modelValue"
                    @input="emit('update:modelValue', $event.target.value)"
                    @keyup.enter="submit"
                    type="text"
                    placeholder="Type a message..."
                    class="w-full h-11 sm:h-12 px-4 pr-12 focus:outline-none border border-gray-300 rounded-full focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm sm:text-base">
                <!-- Emoji picker chưa được làm, nút chỉ để hiển thị -->
                <button type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <font-awesome-icon icon="fa-regular fa-face-smile" />
                </button>
            </div>
            <button @click="submit"
                :disabled="!canSend"
                class="w-11 h-11 sm:w-12 sm:h-12 flex justify-center items-center rounded-full transition-all shadow-sm"
                :class="canSend
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:scale-105 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
                <font-awesome-icon icon="fa-solid fa-paper-plane" class="text-sm" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'send']);

const canSend = computed(() => props.modelValue.trim().length > 0);

const submit = () => {
    if (canSend.value) emit('send', props.modelValue.trim());
};
</script>

<style scoped>
input:focus {
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}
</style>
