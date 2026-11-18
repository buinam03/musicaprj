<template>
    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div class="flex flex-col items-center">
            <img :src="user.profile_picture || DEFAULT_AVATAR" :alt="`${user.username}'s profile picture`" loading="lazy"
                class="rounded-full h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] lg:h-[180px] lg:w-[180px] object-cover shadow-md mb-3 sm:mb-4 transition-transform duration-300 hover:scale-105 cursor-pointer"
                @click="goToProfile(user.id)">

            <div @click="goToProfile(user.id)"
                class="text-sm sm:text-base lg:text-lg font-semibold cursor-pointer hover:text-orange-500 transition-colors duration-300 flex items-center">
                <span class="truncate max-w-[120px] sm:max-w-[150px]">{{ user.username }}</span>
                <font-awesome-icon v-if="user.is_verified" icon="fa-solid fa-check" class="ml-1 sm:ml-2 text-blue-500 flex-shrink-0" />
            </div>

            <div v-if="showFollowerCount" class="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center">
                <font-awesome-icon icon="fa-solid fa-user" class="mr-1 sm:mr-2" />
                <span class="whitespace-nowrap">{{ pluralize(followerCount, 'follower') }}</span>
            </div>

            <FollowButton class="mt-3 sm:mt-4 w-full" :user-id="user.id" @change="onFollowChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useNavigation } from '@/composables';
import { pluralize } from '@/utils/format';
import { DEFAULT_AVATAR } from '@/config';
import FollowButton from './FollowButton.vue';

/** Thẻ user dạng dọc: avatar, tên, số follower, nút follow. */
const props = defineProps({
    user: { type: Object, required: true },
    showFollowerCount: { type: Boolean, default: true },
});

const { goToProfile } = useNavigation();

// Cập nhật số follower ngay khi follow/unfollow
const followerCount = ref(props.user.followerCount || 0);
watch(
    () => props.user.followerCount,
    (value) => {
        followerCount.value = value || 0;
    },
);
const onFollowChange = (followed) => {
    followerCount.value = Math.max(0, followerCount.value + (followed ? 1 : -1));
};
</script>
