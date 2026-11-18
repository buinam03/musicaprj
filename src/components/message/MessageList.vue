<template>
    <div ref="container" class="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 bg-gradient-to-b from-gray-50 to-white">
        <div v-if="messages.length === 0" class="h-full flex flex-col justify-center items-center text-gray-400">
            <div class="bg-white rounded-full p-6 mb-4 shadow-lg">
                <font-awesome-icon icon="fa-solid fa-comments" class="text-4xl text-gray-300" />
            </div>
            <p class="text-base sm:text-lg font-medium">{{ emptyText }}</p>
        </div>
        <div v-else class="space-y-4">
            <MessageBubble v-for="(item, index) in messages" :key="item.id || index"
                :message="item" :mine="isCurrentUser(item.sender?.id)" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuth } from '@/composables';
import MessageBubble from './MessageBubble.vue';

const props = defineProps({
    messages: { type: Array, default: () => [] },
    emptyText: { type: String, default: '' },
});

const { isCurrentUser } = useAuth();
const container = ref(null);

const scrollToBottom = () => {
    if (container.value) container.value.scrollTop = container.value.scrollHeight;
};

// Cuộn xuống cuối khi đổi phòng hoặc có tin nhắn mới.
watch(() => [props.messages, props.messages.length], scrollToBottom, { flush: 'post' });
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.space-y-4 > div {
    animation: slideIn 0.3s ease-out;
}

@media (max-width: 640px) {
    .space-y-4 > div {
        max-width: 85%;
    }
}
</style>
