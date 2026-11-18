<template>
    <div class="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200 bg-white shadow-sm">
        <div class="flex items-center gap-3">
            <button @click="emit('back')"
                class="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors mr-1">
                <font-awesome-icon icon="fa-solid fa-arrow-left" class="text-gray-700" />
            </button>
            <img @click="goToProfile(user.id)"
                :src="user.profile_picture || DEFAULT_AVATAR"
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:border-orange-400 transition-colors"
                :alt="user.username">
            <div>
                <div @click="goToProfile(user.id)"
                    class="font-semibold text-base sm:text-lg text-gray-900 cursor-pointer hover:text-orange-500 transition-colors">{{ user.username }}</div>
                <div class="text-xs text-green-500 flex items-center gap-1">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                </div>
            </div>
        </div>
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
            <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
        </button>
    </div>
</template>

<script setup>
import { DEFAULT_AVATAR } from '@/config';
import { useNavigation } from '@/composables';

defineProps({
    user: { type: Object, required: true },
});

const emit = defineEmits(['back']);

const { goToProfile } = useNavigation();
</script>
