<template>
    <div ref="bellContainer"
        class="nav-left nav-right border-l border-white/30 px-3 xl:px-2 text-white relative hover:text-orange-400 transition-colors">
        <button @click="emit('toggle')" class="focus:outline-none">
            <font-awesome-icon icon="fa-solid fa-bell" class="text-lg" />
        </button>
    </div>

    <div v-if="open" ref="dropdown"
        class="fixed h-80 lg:h-96 w-[calc(100vw-2rem)] sm:w-96 lg:w-[450px] bg-white lg:bg-gray-50 shadow-xl lg:shadow-lg z-50 overflow-y-auto rounded-lg border border-gray-200 overflow-x-hidden"
        :style="dropdownStyle">
        <div class="h-12 sticky top-0 border-b border-gray-300 bg-gray-50 z-50 rounded-t-lg">
            <p class="px-4 py-3 text-gray-800 font-semibold">Notifications</p>
        </div>
        <div>
            <ul v-if="notifications.length > 0">
                <li v-for="(item, index) in notifications" :key="item.id ?? index"
                    class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <a href="#" class="block py-3 px-4">
                        <div class="flex items-start gap-3">
                            <img class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 object-cover"
                                :src="item.User?.profile_picture || DEFAULT_AVATAR" alt="Profile">
                            <div class="flex-1 min-w-0">
                                <div class="text-sm sm:text-base text-gray-800 line-clamp-2">
                                    {{ item.title + ' ' + item.message }}
                                </div>
                                <div class="text-xs sm:text-sm text-gray-500 mt-1">
                                    {{ timeAgo(item.created_at) }}
                                </div>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
            <div v-else class="px-4 py-8 text-center text-gray-500">
                No notifications
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { notificationApi } from '@/api';
import { useClickOutside } from '@/composables';
import { timeAgo } from '@/utils/format';
import { DEFAULT_AVATAR } from '@/config';

const props = defineProps({
    open: { type: Boolean, default: false },
});

const emit = defineEmits(['toggle', 'close']);

const DESKTOP_BREAKPOINT = 1024;
const VIEWPORT_PADDING = 16;

const bellContainer = ref(null);
const dropdown = ref(null);
const dropdownStyle = ref({});
const notifications = ref([]);

const loadNotifications = async () => {
    try {
        notifications.value = (await notificationApi.getNotifications()) || [];
    } catch (error) {
        // Server trả 404 khi user chưa có thông báo nào
        if (error.response?.status !== 404) console.error('Error loading notifications:', error);
        notifications.value = [];
    }
};

/** Đặt dropdown (fixed) ngay dưới nút chuông, luôn nằm trong viewport. */
const positionDropdown = () => {
    if (!dropdown.value || !bellContainer.value) return;
    const rect = bellContainer.value.getBoundingClientRect();
    const top = `${rect.bottom + 8}px`;

    if (window.innerWidth < DESKTOP_BREAKPOINT) {
        dropdownStyle.value = { top, left: '50%', transform: 'translateX(-50%)', right: 'auto' };
        return;
    }

    const dropdownWidth = dropdown.value.offsetWidth || 450;
    const maxLeft = window.innerWidth - dropdownWidth - VIEWPORT_PADDING;
    let left = rect.left + rect.width / 2 - dropdownWidth / 2;
    if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING;
    else if (left > maxLeft) left = maxLeft;

    dropdownStyle.value = { top, left: `${left}px`, transform: 'none', right: 'auto' };
};

watch(
    () => props.open,
    async (open) => {
        if (!open) {
            dropdownStyle.value = {};
            return;
        }
        await nextTick();
        positionDropdown();
    },
);

const handleResize = () => {
    if (props.open) nextTick(positionDropdown);
};

useClickOutside([bellContainer, dropdown], () => {
    if (props.open) emit('close');
});

onMounted(() => {
    loadNotifications();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => window.removeEventListener('resize', handleResize));
</script>
