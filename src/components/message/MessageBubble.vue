<template>
    <div class="flex items-end gap-2 group" :class="mine ? 'flex-row-reverse' : 'justify-start'">
        <img @click.stop="goToProfile(message.sender?.id)"
            :src="message.sender?.profile_picture || DEFAULT_AVATAR"
            class="w-8 h-8 rounded-full object-cover flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:ring-2 hover:ring-orange-400"
            :alt="message.sender?.username">

        <div class="flex flex-col max-w-[75%] sm:max-w-[60%]" :class="mine ? 'items-end' : 'items-start'">
            <div class="flex items-center gap-2 mb-1" :class="{ 'flex-row-reverse': mine }">
                <span class="text-xs font-medium text-gray-600">
                    {{ mine ? 'You' : message.sender?.username }}
                </span>
                <span class="text-xs text-gray-400">
                    {{ formatClock(message.created_at) }}
                </span>
            </div>
            <div class="px-4 py-2.5 rounded-2xl shadow-sm break-words"
                :class="mine
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'">
                <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{{ message.message }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { DEFAULT_AVATAR } from '@/config';
import { formatClock } from '@/utils/format';
import { useNavigation } from '@/composables';

defineProps({
    message: { type: Object, required: true },
    /** Tin nhắn do user hiện tại gửi. */
    mine: { type: Boolean, default: false },
});

const { goToProfile } = useNavigation();
</script>
