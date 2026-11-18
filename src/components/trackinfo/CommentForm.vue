<template>
    <div class="mb-6 flex items-center gap-3 sm:gap-4">
        <div v-if="currentUser" class="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
            <img class="rounded-full object-cover w-full h-full cursor-pointer"
                :src="currentUser.profile_picture || DEFAULT_AVATAR" alt="Profile picture" @click="goToProfile(currentUser.id)">
        </div>
        <div class="flex-1 flex gap-2 sm:gap-3">
            <input v-model="content" type="text" placeholder="Write your comment" @keyup.enter="submit"
                class="flex-1 px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 transition-all text-sm sm:text-base">
            <button @click="submit" :disabled="submitting"
                class="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full aspect-square transition-all flex items-center justify-center disabled:opacity-60">
                <font-awesome-icon icon="fa-solid fa-paper-plane" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { notification } from 'ant-design-vue';
import { useNavigation } from '@/composables';
import { DEFAULT_AVATAR } from '@/config';

/**
 * Ô nhập bình luận. Emit `submit(content, done)` với nội dung đã trim;
 * cha gọi `done(true)` khi gửi thành công để xoá ô nhập.
 */
defineProps({
    currentUser: { type: Object, default: null },
    submitting: { type: Boolean, default: false },
});

const emit = defineEmits(['submit']);

const { goToProfile } = useNavigation();
const content = ref('');

const submit = () => {
    const trimmed = content.value.trim();
    if (!trimmed) {
        notification.warning({ message: 'Empty Comment', description: 'Please enter a comment.', duration: 2 });
        return;
    }
    emit('submit', trimmed, (ok) => {
        if (ok) content.value = '';
    });
};
</script>
