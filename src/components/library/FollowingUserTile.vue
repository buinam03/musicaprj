<template>
    <div class="group bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex flex-col items-center">
            <div @click="goToProfile(user.id)"
                class="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 aspect-square mb-4 relative overflow-hidden rounded-full group-hover:ring-4 group-hover:ring-orange-200 transition-all duration-300 cursor-pointer">
                <img :src="user.profile_picture || DEFAULT_AVATAR" alt="Profile picture"
                    class="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 @click="goToProfile(user.id)"
                class="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4 text-center truncate w-full cursor-pointer hover:text-orange-500 transition-colors duration-200">
                {{ user.username }}
            </h3>
            <button :disabled="isBusy" @click="onFollowClick"
                class="w-full sm:w-auto min-w-[120px] rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto sm:opacity-0 sm:group-hover:opacity-100"
                :class="following
                    ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-600'
                    : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50'">
                <font-awesome-icon :icon="following ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                <span>{{ following ? 'Following' : 'Follow' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useFollow, useNavigation } from '@/composables';
import { DEFAULT_AVATAR } from '@/config';

/** Thẻ user đang follow ở Library: avatar, tên, nút follow hiện khi hover (desktop). */
const props = defineProps({
    user: { type: Object, required: true }, // { id, username, profile_picture }
});

const { isFollowing, toggleFollow } = useFollow();
const { goToProfile } = useNavigation();

const isBusy = ref(false);
const following = computed(() => isFollowing(props.user.id));

const onFollowClick = async () => {
    isBusy.value = true;
    await toggleFollow(props.user.id);
    isBusy.value = false;
};
</script>
