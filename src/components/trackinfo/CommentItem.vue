<template>
    <div class="flex gap-3 sm:gap-4 pb-4 border-b border-gray-100 last:border-0">
        <div class="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <img class="rounded-full object-cover w-full h-full" :src="comment.User?.profile_picture || DEFAULT_AVATAR" alt="User avatar">
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <span class="font-semibold text-sm sm:text-base text-gray-900">{{ comment.User?.username || 'Unknown' }}</span>
                <span class="text-xs sm:text-sm text-gray-400">{{ timeAgo(comment.created_at) }}</span>
            </div>
            <p class="text-sm text-left sm:text-base text-gray-700 mb-2 whitespace-pre-wrap break-words">{{ comment.content }}</p>
        </div>
    </div>
</template>

<script setup>
import { timeAgo } from '@/utils/format';
import { DEFAULT_AVATAR } from '@/config';

defineProps({
    comment: { type: Object, required: true },
});
</script>
