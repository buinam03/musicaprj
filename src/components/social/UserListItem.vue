<template>
    <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div class="p-4 sm:p-6">
            <!-- Avatar -->
            <div class="flex justify-center mb-4">
                <router-link :to="profileLink" class="relative group/avatar">
                    <div class="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover/avatar:border-orange-500 transition-all duration-300">
                        <img :src="user.profile_picture || DEFAULT_AVATAR" alt="Profile picture" class="w-full h-full object-cover">
                    </div>
                    <div class="absolute inset-0 rounded-full bg-orange-500/0 group-hover/avatar:bg-orange-500/20 transition-all duration-300"></div>
                </router-link>
            </div>

            <!-- Username -->
            <div class="text-center mb-4">
                <router-link :to="profileLink">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors truncate">
                        {{ user.username }}
                    </h3>
                </router-link>
            </div>

            <!-- Follow Button -->
            <button v-if="!isCurrentUser(user.id)" :disabled="isBusy" @click="onFollowClick"
                class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                :class="following
                    ? 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'">
                <font-awesome-icon :icon="following ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                <span>{{ following ? 'Following' : 'Follow' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { useAuth, useFollow } from '@/composables';
import { DEFAULT_AVATAR } from '@/config';

/** Thẻ user trong danh sách followers/following: avatar, tên, nút follow (trạng thái từ useFollow). */
const props = defineProps({
    user: { type: Object, required: true }, // { id, username, profile_picture }
});

const { isCurrentUser } = useAuth();
const { isFollowing, toggleFollow } = useFollow();

const isBusy = ref(false);
const following = computed(() => isFollowing(props.user.id));
const profileLink = computed(() => ({ name: 'ProfilePage', params: { id: props.user.id } }));

const onFollowClick = async () => {
    isBusy.value = true;
    const followed = await toggleFollow(props.user.id, { notify: false });
    isBusy.value = false;
    if (followed === null) return;

    notification.success({
        message: followed ? 'Following' : 'Unfollowed',
        description: `You are now ${followed ? 'following' : 'unfollowing'} ${props.user.username}.`,
        duration: 2,
    });
};
</script>

<style scoped>
button,
a {
    transition: all 0.2s ease;
}
</style>
