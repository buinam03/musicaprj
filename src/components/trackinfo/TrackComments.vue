<template>
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <CommentForm :current-user="currentUser" :submitting="submitting" @submit="addComment" />

        <!-- Comments Header -->
        <div class="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
            <div class="flex items-center gap-2 text-gray-600">
                <font-awesome-icon icon="fa-solid fa-comments" />
                <span class="font-semibold text-sm sm:text-base">{{ comments.length }} Comments</span>
            </div>
            <div class="border border-orange-500 rounded-lg overflow-hidden">
                <select v-model="sortOrder" class="px-3 py-2 text-sm sm:text-base text-orange-500 outline-none bg-white cursor-pointer">
                    <option value="DESC">Newest</option>
                    <option value="ASC">Oldest</option>
                </select>
            </div>
        </div>

        <!-- Comments List -->
        <div class="space-y-4">
            <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
            <div v-if="comments.length === 0" class="text-center py-8 text-gray-400">
                <font-awesome-icon icon="fa-solid fa-comments" class="text-4xl mb-3 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import { commentApi, getErrorMessage } from '@/api';
import { useAuth } from '@/composables';
import CommentForm from './CommentForm.vue';
import CommentItem from './CommentItem.vue';

/** Khối bình luận của bài hát: form thêm, sắp xếp Newest/Oldest, danh sách. Tự tải theo songId. */
const props = defineProps({
    songId: { type: [Number, String], required: true },
    currentUser: { type: Object, default: null },
});

const { currentUserId, requireLogin } = useAuth();

const comments = ref([]);
const sortOrder = ref('DESC');
const submitting = ref(false);

const fetchComments = async () => {
    const songId = props.songId;
    const order = sortOrder.value;
    let list = [];
    try {
        list = (await commentApi.getComments(songId, order)) || [];
    } catch (error) {
        // Server trả 404 khi bài hát chưa có bình luận
        if (error.response?.status !== 404) console.error('Error fetching comments:', error);
    }
    // Bỏ kết quả cũ nếu songId / thứ tự đã đổi trong lúc chờ
    if (songId === props.songId && order === sortOrder.value) comments.value = list;
};

watch([() => props.songId, sortOrder], fetchComments, { immediate: true });

const addComment = async (content, done) => {
    if (!requireLogin('You need to log in to comment.')) return;

    submitting.value = true;
    try {
        const newComment = await commentApi.addComment(props.songId, { userId: Number(currentUserId.value), content });
        const comment = { ...newComment, User: newComment.User || props.currentUser };
        if (sortOrder.value === 'ASC') comments.value.push(comment);
        else comments.value.unshift(comment);
        done(true);
        notification.success({ message: 'Comment Added', description: 'Your comment has been posted.', duration: 2 });
    } catch (error) {
        console.error('Error posting comment:', error);
        notification.error({
            message: 'Error',
            description: getErrorMessage(error, 'Failed to post comment. Please try again.'),
            duration: 3,
        });
    } finally {
        submitting.value = false;
    }
};
</script>
