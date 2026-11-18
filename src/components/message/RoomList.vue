<template>
    <div class="w-full sm:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col transition-all duration-300">
        <div class="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-purple-600">
            <div class="flex items-center justify-between">
                <h1 class="text-xl sm:text-2xl font-bold text-white">Messages</h1>
                <button @click="emit('close')"
                    class="sm:hidden text-white p-2 hover:bg-white/20 rounded-full transition-colors">
                    <font-awesome-icon icon="fa-solid fa-times" />
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto">
            <ul class="divide-y divide-gray-100">
                <li v-for="room in rooms" :key="room.room_id"
                    @click="emit('select', room.room_id)"
                    :class="{
                        'bg-orange-50 border-l-4 border-orange-500': room.room_id === activeRoomId,
                        'hover:bg-gray-50': room.room_id !== activeRoomId
                    }"
                    class="flex items-center p-3 sm:p-4 cursor-pointer transition-all duration-200 group">
                    <div class="flex-shrink-0 relative">
                        <img @click.stop="goToProfile(room.partner?.id)"
                            :src="room.partner?.profile_picture || DEFAULT_AVATAR"
                            class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-orange-400 transition-colors cursor-pointer"
                            :alt="room.partner?.username">
                        <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div class="flex-grow min-w-0 ml-3">
                        <div class="flex items-center justify-between mb-1">
                            <div @click.stop="goToProfile(room.partner?.id)"
                                class="font-semibold text-sm sm:text-base text-gray-900 truncate cursor-pointer hover:text-orange-500 transition-colors">
                                {{ room.partner?.username }}
                            </div>
                            <div class="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {{ formatDate(room.latest_message_time) }}
                            </div>
                        </div>
                        <div class="text-xs sm:text-sm text-gray-600 truncate">
                            {{ room.latest_message || 'No messages yet' }}
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="rooms.length === 0" class="flex flex-col items-center justify-center py-12 px-4 text-center">
                <font-awesome-icon icon="fa-solid fa-comments" class="text-gray-400 text-4xl mb-3" />
                <p class="text-gray-500 text-sm">No conversations yet</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { DEFAULT_AVATAR } from '@/config';
import { formatDate } from '@/utils/format';
import { useNavigation } from '@/composables';

defineProps({
    rooms: { type: Array, default: () => [] },
    activeRoomId: { type: String, default: null },
});

const emit = defineEmits(['select', 'close']);

const { goToProfile } = useNavigation();
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
</style>
