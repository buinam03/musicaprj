<template>
    <!-- Backdrop -->
    <div v-if="open" class="lg:hidden fixed inset-0 bg-black/50 z-[55] cursor-pointer mobile-menu-backdrop"
        @click.stop="emit('close')"></div>

    <transition name="slide">
        <div v-if="open"
            class="lg:hidden fixed inset-x-0 top-14 sm:top-16 bg-[#222021] border-b border-gray-700 shadow-xl z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto mobile-menu-content">
            <div class="px-4 py-4 space-y-4">
                <HeaderSearch mobile @search="emit('close')" />

                <div class="space-y-1 text-white">
                    <router-link v-for="link in links" :key="link.label" :to="link.to" @click="onLinkClick(link)"
                        class="flex items-center px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                        <font-awesome-icon :icon="link.icon" class="mr-3 w-5" />
                        {{ link.label }}
                    </router-link>
                    <router-link
                        class="flex items-center px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors"
                        to="/discover" @click="emit('sign-out')">
                        <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" class="mr-3 w-5" />
                        Sign Out
                    </router-link>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '@/composables';
import HeaderSearch from './HeaderSearch.vue';

defineProps({
    open: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'open-messages', 'sign-out']);

const { currentUserId } = useAuth();

const links = computed(() => [
    { label: 'Home', to: '/home', icon: 'fa-solid fa-house' },
    { label: 'Library', to: '/library', icon: 'fa-solid fa-music' },
    { label: 'Playlists', to: '/playlists', icon: 'fa-solid fa-notes-medical' },
    { label: 'Upload', to: '/upload', icon: 'fa-solid fa-upload' },
    { label: 'Chart', to: '/chart', icon: 'fa-solid fa-chart-column' },
    { label: 'Messages', to: '/message', icon: 'fa-solid fa-message', messages: true },
    { label: 'Profile', to: `/profile/${currentUserId.value}`, icon: 'fa-regular fa-address-card' },
    { label: 'Tracks', to: '/tracks', icon: 'fa-solid fa-compact-disc' },
    { label: 'Likes', to: '/likes', icon: 'fa-solid fa-heart' },
]);

const onLinkClick = (link) => {
    if (link.messages) emit('open-messages');
    emit('close');
};
</script>

<style scoped>
@media (max-width: 1023px) {
    .mobile-menu-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 35;
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
