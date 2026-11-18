<template>
    <div ref="root" class="border-l border-white/30 px-3 xl:px-2 text-white relative">
        <button @click="emit('toggle')"
            class="logo flex items-center hover:text-orange-400 transition-colors focus:outline-none">
            <div>
                <img class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover" :src="avatar"
                    alt="User Profile Picture" />
            </div>
            <span class="ml-2 hidden xl:inline-block">
                <font-awesome-icon icon="fa-solid fa-chevron-down" class="text-xs" />
            </span>
        </button>
        <div v-if="open"
            class="fixed lg:absolute left-4 lg:left-0 mt-2 lg:mt-4 w-48 lg:w-40 xl:w-48 bg-[#222021] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <ul class="mb-0">
                <li v-for="link in links" :key="link.label"
                    class="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                    <router-link
                        class="px-4 py-2.5 text-white hover:text-orange-400 transition-colors flex items-center text-sm"
                        :to="link.to" @click="emit('close')">
                        <font-awesome-icon :icon="link.icon" class="mr-2 w-4" />
                        {{ link.label }}
                    </router-link>
                </li>
                <li class="hover:bg-gray-800 transition-colors">
                    <router-link
                        class="px-4 py-2.5 text-white hover:text-orange-400 transition-colors flex items-center text-sm"
                        to="/discover" @click="emit('sign-out')">
                        <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" class="mr-2 w-4" />
                        Sign Out
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuth, useClickOutside } from '@/composables';

const props = defineProps({
    open: { type: Boolean, default: false },
    avatar: { type: String, required: true },
});

const emit = defineEmits(['toggle', 'close', 'sign-out']);

const { currentUserId } = useAuth();
const root = ref(null);

const links = computed(() => [
    { label: 'Profile', to: `/profile/${currentUserId.value}`, icon: 'fa-regular fa-address-card' },
    { label: 'Tracks', to: '/tracks', icon: 'fa-solid fa-compact-disc' },
    { label: 'Likes', to: '/likes', icon: 'fa-solid fa-heart' },
    { label: 'Following', to: `/following/${currentUserId.value}`, icon: 'fa-solid fa-user-check' },
    { label: 'Followers', to: `/followers/${currentUserId.value}`, icon: 'fa-solid fa-user-plus' },
]);

useClickOutside(root, () => {
    if (props.open) emit('close');
});
</script>
