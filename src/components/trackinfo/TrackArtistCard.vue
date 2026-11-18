<template>
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Artist</h2>
        <div v-if="artist" class="flex flex-col items-center text-center">
            <div class="w-24 h-24 sm:w-32 sm:h-32 mb-4">
                <img class="rounded-full w-full h-full object-cover cursor-pointer hover:ring-4 hover:ring-orange-200 transition-all"
                    :src="artist.profile_picture || DEFAULT_AVATAR" alt="Artist profile" @click="goToProfile(artist.id)">
            </div>
            <div class="flex items-center gap-2 mb-2">
                <h3 @click="goToProfile(artist.id)"
                    class="text-lg sm:text-xl font-semibold text-gray-900 hover:text-orange-500 cursor-pointer transition-colors">
                    {{ artist.username }}
                </h3>
                <font-awesome-icon v-if="artist.is_verified" icon="fa-solid fa-check-circle" class="text-blue-500" />
            </div>
            <div class="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <font-awesome-icon icon="fa-solid fa-users" />
                <span>{{ followerCount || 0 }} followers</span>
            </div>
            <button v-if="!isCurrentUser(artist.id)" :disabled="isBusy" @click="onFollowClick"
                class="px-6 py-2 rounded-full font-medium transition-all text-sm sm:text-base disabled:opacity-60"
                :class="following
                    ? 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                    : 'bg-orange-500 text-white hover:bg-orange-600'">
                <font-awesome-icon :icon="following ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" class="mr-2" />
                {{ following ? 'Following' : 'Follow' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuth, useFollow, useNavigation } from '@/composables';
import { DEFAULT_AVATAR } from '@/config';

/** Thẻ nghệ sĩ (uploader) ở cột phải: avatar, tên, số follower, nút follow. */
const props = defineProps({
    artist: { type: Object, default: null },
    followerCount: { type: Number, default: 0 },
});

const emit = defineEmits(['follow-change']);

const { isCurrentUser } = useAuth();
const { isFollowing, toggleFollow } = useFollow();
const { goToProfile } = useNavigation();

const isBusy = ref(false);
const following = computed(() => Boolean(props.artist) && isFollowing(props.artist.id));

const onFollowClick = async () => {
    isBusy.value = true;
    const result = await toggleFollow(props.artist.id);
    isBusy.value = false;
    if (result !== null) emit('follow-change', result);
};
</script>

<style scoped>
* {
    transition: all 0.2s ease;
}
</style>
