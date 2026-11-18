<template>
    <div class="h-14 sm:h-16 mx-auto w-full bg-[#222021] fixed z-50 shadow-lg">
        <div class="mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
            <!-- Logo -->
            <div class="flex-shrink-0 font-neutra text-2xl sm:text-3xl lg:text-4xl text-white">
                <router-link to="/home" class="hover:opacity-80 transition-opacity">MUSICA</router-link>
            </div>

            <template v-if="playerStore.isLoggedIn">
                <!-- Mobile Menu Button -->
                <button @click.stop="toggleMenu('mobile')" type="button"
                    class="lg:hidden text-white p-2 hover:bg-white/10 rounded-md transition-colors z-[70] relative"
                    aria-label="Toggle mobile menu">
                    <font-awesome-icon :icon="openMenu === 'mobile' ? 'fa-solid fa-times' : 'fa-solid fa-bars'" size="lg" />
                </button>

                <!-- Desktop Navigation -->
                <div
                    class="hidden lg:flex flex-grow items-center justify-start gap-2 xl:gap-4 ml-6 xl:text-[16px] lg:text-[14px]">
                    <div class="flex justify-center items-center w-full max-w-5xl">
                        <div v-for="link in leftLinks" :key="link.to"
                            class="nav-left border-l border-white/30 px-3 xl:px-4 text-white hover:text-orange-400 transition-colors">
                            <router-link :to="link.to" class="text-sm xl:text-base">{{ link.label }}</router-link>
                        </div>
                        <HeaderSearch />
                        <div class="px-3 xl:px-4 text-white hover:text-orange-400 transition-colors">
                            <router-link to="/upload" class="text-sm xl:text-base">Upload</router-link>
                        </div>
                        <div
                            class="nav-left border-l border-white/30 px-3 xl:px-4 text-white hover:text-orange-400 transition-colors">
                            <router-link to="/chart" class="text-sm xl:text-base">Chart</router-link>
                        </div>

                        <NotificationDropdown :open="openMenu === 'notifications'"
                            @toggle="toggleMenu('notifications')" @close="closeMenu('notifications')" />

                        <!-- Message Button -->
                        <div @click="openLatestRoom"
                            class="nav-left nav-right border-l border-white/30 px-3 xl:px-2 text-white relative cursor-pointer hover:text-orange-400 transition-colors">
                            <router-link to="/message" class="block">
                                <font-awesome-icon icon="fa-solid fa-message" class="text-lg" />
                            </router-link>
                        </div>

                        <UserMenu :open="openMenu === 'user'" :avatar="profilePicture" @toggle="toggleMenu('user')"
                            @close="closeMenu('user')" @sign-out="signOut" />
                    </div>
                </div>

                <MobileMenu :open="openMenu === 'mobile'" @close="closeMenu('mobile')"
                    @open-messages="openLatestRoom" @sign-out="signOut" />
            </template>

            <div v-else class="flex gap-2 sm:gap-4 h-full justify-center items-center">
                <button @click="openAuth('login')"
                    class="text-white px-3 sm:px-4 py-1.5 sm:py-2 border border-white rounded-md text-xs sm:text-sm flex justify-center items-center whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">
                    Sign In
                </button>
                <button @click="openAuth('register')"
                    class="text-white px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 hover:bg-orange-600 rounded-md text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors">
                    Create Account
                </button>
            </div>
        </div>
    </div>

    <AuthModal v-model:mode="authMode" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { handleLogout, messageApi, userApi } from '@/api';
import { usePlayerStore } from '@/stores/player';
import HeaderSearch from '@/components/layout/HeaderSearch.vue';
import NotificationDropdown from '@/components/layout/NotificationDropdown.vue';
import UserMenu from '@/components/layout/UserMenu.vue';
import MobileMenu from '@/components/layout/MobileMenu.vue';
import AuthModal from '@/components/layout/AuthModal.vue';

const DEFAULT_PROFILE_PICTURE = '/images/profile/Unknown_person.jpg';
const DESKTOP_BREAKPOINT = 1024;

const leftLinks = [
    { label: 'Home', to: '/home' },
    { label: 'Library', to: '/library' },
    { label: 'Playlists', to: '/playlists' },
];

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();

const user = ref(null);
/** Menu đang mở: 'notifications' | 'user' | 'mobile' | null — chỉ mở một menu tại một thời điểm. */
const openMenu = ref(null);
/** Modal đăng nhập/đăng ký: 'login' | 'register' | null. */
const authMode = ref(null);

const profilePicture = computed(() => user.value?.profile_picture || DEFAULT_PROFILE_PICTURE);

const toggleMenu = (name) => {
    openMenu.value = openMenu.value === name ? null : name;
};

// Chỉ đóng nếu menu đó vẫn đang mở (tránh click-outside của menu cũ đóng menu vừa mở)
const closeMenu = (name) => {
    if (openMenu.value === name) openMenu.value = null;
};

const openAuth = (mode) => {
    openMenu.value = null;
    authMode.value = mode;
};

// Khoá cuộn trang khi mobile menu hoặc modal đăng nhập đang mở
watchEffect(() => {
    document.body.style.overflow = openMenu.value === 'mobile' || authMode.value ? 'hidden' : '';
});

const loadCurrentUser = async () => {
    try {
        user.value = await userApi.getCurrentUser();
    } catch (error) {
        console.error('Error loading current user:', error);
    }
};

/** Mở phòng chat gần nhất của user (nếu có). */
const openLatestRoom = async () => {
    try {
        const room = await messageApi.getFirstSentMessage();
        const roomId = room?.room_id;
        if (roomId && String(route.params.id) !== String(roomId)) {
            router.push({ name: 'MessagePage', params: { id: roomId } });
        }
    } catch (error) {
        // 404: user chưa có cuộc trò chuyện nào -> giữ trang /message
        if (error.response?.status !== 404) console.error('Error opening latest room:', error);
    }
};

const signOut = () => {
    openMenu.value = null;
    handleLogout();
};

// Làm mới thông tin user khi đổi trang (vd: sau khi đổi ảnh đại diện)
watch(
    () => route.fullPath,
    () => {
        if (playerStore.isLoggedIn) loadCurrentUser();
    },
);

watch(
    () => playerStore.isLoggedIn,
    (loggedIn) => {
        openMenu.value = null;
        if (loggedIn) loadCurrentUser();
        else user.value = null;
    },
);

const handleResize = () => {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) closeMenu('mobile');
};

onMounted(() => {
    if (playerStore.isLoggedIn) loadCurrentUser();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    document.body.style.overflow = '';
});
</script>

<style scoped>
/* Áp dụng cho cả các component con của header */
:deep(button),
:deep(a),
:deep(input) {
    transition: all 0.2s ease;
}

:deep(button:focus-visible),
:deep(a:focus-visible) {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

:deep(.overflow-y-auto) {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar) {
    width: 6px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
    background: transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background-color: rgba(156, 163, 175, 0.7);
}
</style>
