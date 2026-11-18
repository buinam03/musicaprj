<template>
    <div class="bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex flex-col items-center">
            <div @click="goToProfile(user.id)" class="cursor-pointer mb-3">
                <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-square relative overflow-hidden rounded-full ring-2 ring-gray-200 hover:ring-orange-400 transition-all duration-300">
                    <img :src="user.profile_picture || DEFAULT_AVATAR"
                        class="w-full h-full object-cover rounded-full transform hover:scale-110 transition-transform duration-300"
                        :alt="user.username">
                </div>
            </div>
            <div @click="goToProfile(user.id)" class="flex items-center justify-center gap-1 mb-2 cursor-pointer group">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {{ user.username }}
                </h3>
                <div v-if="user.is_verified" class="w-4 h-4 flex-shrink-0">
                    <div class="w-full h-full bg-blue-500 rounded-full flex justify-center items-center">
                        <font-awesome-icon icon="fa-solid fa-check" class="text-white text-xs" />
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-4">
                <font-awesome-icon icon="fa-solid fa-person" />
                <span>{{ pluralize(followerCount, 'follower') }}</span>
            </div>
            <FollowButton class="w-full" :user-id="user.id" @change="onFollowChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useNavigation } from '@/composables';
import { pluralize } from '@/utils/format';
import { DEFAULT_AVATAR } from '@/config';
import FollowButton from '@/components/user/FollowButton.vue';

/** Thẻ user trong kết quả tìm kiếm. */
const props = defineProps({
    user: { type: Object, required: true },
});

const { goToProfile } = useNavigation();

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

<style scoped>
/* Giới hạn kích thước ảnh (giữ nguyên style cũ của trang search) */
img {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover;
    width: auto;
    height: auto;
}
</style>
