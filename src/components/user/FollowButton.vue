<template>
    <button v-if="!isCurrentUser(userId)" type="button" :disabled="isBusy" @click.stop="onClick"
        class="rounded-full transition-all duration-300 flex justify-center items-center gap-1 disabled:opacity-60"
        :class="[sizeClass, following
            ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
            : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50']">
        <font-awesome-icon :icon="following ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
        <span>{{ following ? 'Following' : 'Follow' }}</span>
    </button>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuth, useFollow } from '@/composables';

/**
 * Nút Follow/Following. Tự ẩn khi userId là chính mình.
 * Trạng thái lấy từ useFollow() (cần gọi loadFollowingIds() ở trang cha).
 */
const props = defineProps({
    userId: { type: [Number, String], required: true },
    size: { type: String, default: 'md' }, // sm | md
});

const emit = defineEmits(['change']);

const { isCurrentUser } = useAuth();
const { isFollowing, toggleFollow } = useFollow();

const isBusy = ref(false);
const following = computed(() => isFollowing(props.userId));
const sizeClass = computed(() =>
    props.size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm',
);

const onClick = async () => {
    isBusy.value = true;
    const result = await toggleFollow(props.userId);
    isBusy.value = false;
    if (result !== null) emit('change', result);
};
</script>
