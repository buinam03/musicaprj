<template>
    <div>
        <!-- Ảnh bìa + avatar -->
        <div class="relative w-full aspect-square h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-t-2xl overflow-hidden shadow-xl mb-4"
            :style="{
                backgroundImage: `url('${user.header_picture || DEFAULT_HEADER}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            <div class="absolute top-1/2 left-4 sm:left-8 md:left-12 transform -translate-y-1/2">
                <div class="relative">
                    <div @click="isOwner && emit('edit-avatar')"
                        class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full aspect-square bg-white p-1 shadow-xl"
                        :class="{ 'cursor-pointer hover:shadow-2xl transition-all hover:scale-105': isOwner }">
                        <img :src="user.profile_picture || DEFAULT_AVATAR"
                            class="rounded-full w-full h-full aspect-square object-cover" alt="profile" loading="lazy">
                    </div>
                    <button v-if="isOwner" type="button" @click.stop="emit('edit-avatar')"
                        class="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center rounded-full bg-white hover:bg-gray-100 shadow-lg border-2 border-gray-200 cursor-pointer transition-all hover:scale-110 z-10">
                        <font-awesome-icon icon="fa-solid fa-camera" class="text-gray-700 text-xs sm:text-sm" />
                    </button>
                </div>
            </div>

            <div class="absolute top-4 right-4">
                <button v-if="isOwner" type="button" @click="emit('edit-header')"
                    class="px-3 py-2 sm:px-4 sm:py-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                    <font-awesome-icon icon="fa-solid fa-camera" />
                    <span class="hidden sm:inline">Upload header</span>
                </button>
            </div>
        </div>

        <!-- Thông tin user -->
        <div class="bg-white rounded-b-2xl shadow-lg border border-gray-200 -mt-16 sm:-mt-20 md:-mt-24 pt-20 sm:pt-24 md:pt-28 pb-6 px-4 sm:px-6 md:px-8">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                <div class="flex-grow">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
                            {{ user.username }}
                            <div v-if="user.is_verified"
                                class="w-5 h-5 sm:w-6 sm:h-6 text-white bg-blue-500 rounded-full flex justify-center items-center">
                                <font-awesome-icon icon="fa-solid fa-check" class="text-xs" />
                            </div>
                        </h1>
                    </div>

                    <div class="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                        <router-link :to="{ name: 'FollowersPage', params: { id: user.id } }"
                            class="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors cursor-pointer">
                            <span class="font-semibold text-gray-900">{{ followerCount || 0 }}</span> followers
                        </router-link>
                        <router-link :to="{ name: 'FollowingPage', params: { id: user.id } }"
                            class="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors cursor-pointer">
                            <span class="font-semibold text-gray-900">{{ followingCount || 0 }}</span> following
                        </router-link>
                    </div>

                    <ProfileAchievements :achievements="achievements" />

                    <!-- Avatar những người đang follow -->
                    <div v-if="followingPictures.length > 0" class="flex items-center gap-2 mb-4">
                        <div class="flex -space-x-2">
                            <div v-for="(picture, index) in followingPictures" :key="index"
                                class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden">
                                <img :src="picture" class="w-full h-full object-cover" alt="Following user profile picture" loading="lazy">
                            </div>
                        </div>
                        <router-link :to="{ name: 'FollowingPage', params: { id: user.id } }"
                            class="text-xs sm:text-sm text-gray-600 hover:text-orange-500 transition-colors">
                            View all following
                        </router-link>
                    </div>

                    <div class="space-y-2 text-sm sm:text-base text-left">
                        <div v-if="location">
                            <span class="font-semibold text-gray-900">Location:</span>
                            <span class="text-gray-600 ml-2">{{ location }}</span>
                        </div>
                        <div v-if="user.bio">
                            <span class="font-semibold text-gray-900">Bio:</span>
                            <span class="text-gray-600 ml-2">{{ user.bio }}</span>
                        </div>
                    </div>
                </div>

                <!-- Nút hành động -->
                <div class="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 flex-shrink-0">
                    <template v-if="isOwner">
                        <button type="button" @click="emit('edit-profile')"
                            class="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-pencil" />
                            <span>Edit Profile</span>
                        </button>
                        <router-link :to="{ name: 'AchievementsPage' }"
                            class="px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-trophy" />
                            <span>Achievements</span>
                        </router-link>
                    </template>
                    <template v-else>
                        <button type="button" :disabled="followBusy" @click="onToggleFollow"
                            class="px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                            :class="followed
                                ? 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'">
                            <font-awesome-icon :icon="followed ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                            <span>{{ followed ? 'Following' : 'Follow' }}</span>
                        </button>
                        <button type="button" @click="sendMessage"
                            class="px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-message" />
                            <span>Send Message</span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuth, useFollow, useNavigation } from '@/composables';
import { DEFAULT_AVATAR } from '@/config';
import { DEFAULT_HEADER } from './constants';
import ProfileAchievements from './ProfileAchievements.vue';

/**
 * Phần đầu trang profile: ảnh bìa, avatar, tên, số follow, thành tích, bio, nút hành động.
 * Follow / nhắn tin tự xử lý; sửa thông tin / ảnh thì emit để trang cha mở modal.
 */
const props = defineProps({
    user: { type: Object, required: true },
    isOwner: { type: Boolean, default: false },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    followingPictures: { type: Array, default: () => [] },
    achievements: { type: Array, default: () => [] },
});

const emit = defineEmits(['edit-profile', 'edit-avatar', 'edit-header', 'follow-change']);

const { currentUserId, requireLogin } = useAuth();
const { isFollowing, toggleFollow } = useFollow();
const { goToMessage } = useNavigation();

const followBusy = ref(false);
const followed = computed(() => isFollowing(props.user.id));

const location = computed(() => [props.user.province, props.user.country].filter(Boolean).join(', '));

const onToggleFollow = async () => {
    followBusy.value = true;
    const result = await toggleFollow(props.user.id);
    followBusy.value = false;
    if (result !== null) emit('follow-change', result);
};

/** Room chat giữa 2 user: id sắp xếp rồi nối bằng "_". */
const sendMessage = () => {
    if (!requireLogin('You need to log in to send messages.')) return;
    goToMessage([currentUserId.value, props.user.id].sort().join('_'));
};
</script>

<style scoped>
button:focus-visible,
a:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

img {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover;
    width: auto;
    height: auto;
}
</style>
