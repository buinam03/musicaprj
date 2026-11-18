<template>
    <div class="bg-gray-50 min-h-screen">
        <div class="pt-14 sm:pt-16 pb-4 sm:pb-16 w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
            <div class="flex h-full max-w-7xl mx-auto shadow-2xl bg-white">
                <RoomList :rooms="rooms" :active-room-id="roomId"
                    :class="showRoomList ? 'block' : 'hidden sm:flex'"
                    @select="selectRoom" @close="showRoomList = false" />

                <div :class="['flex-1 flex flex-col', !showRoomList ? 'block' : 'hidden sm:flex']">
                    <ChatHeader v-if="partner" :user="partner" @back="showRoomList = true" />
                    <MessageList :messages="messages" :empty-text="EMPTY_MESSAGE_TEXT" />
                    <MessageInput v-model="draft" @send="sendMessage" />
                </div>
            </div>

            <!-- Mobile: nút mở lại danh sách phòng khi đang ở khung chat -->
            <button v-if="roomId && !showRoomList"
                @click="showRoomList = true"
                class="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40">
                <font-awesome-icon icon="fa-solid fa-comments" class="text-xl" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import socket from '@/socket/socket';
import { messageApi, userApi } from '@/api';
import { useAuth } from '@/composables';
import RoomList from '@/components/message/RoomList.vue';
import ChatHeader from '@/components/message/ChatHeader.vue';
import MessageList from '@/components/message/MessageList.vue';
import MessageInput from '@/components/message/MessageInput.vue';

const EMPTY_MESSAGE_TEXT = 'Chưa có tin nhắn nào — hãy bắt đầu cuộc trò chuyện!';
const MOBILE_BREAKPOINT = 640;

const route = useRoute();
const router = useRouter();
const { currentUserId } = useAuth();

const rooms = ref([]);
const roomId = ref(null);
const partner = ref(null);
const messages = ref([]);
const draft = ref('');
const showRoomList = ref(true);

const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

/** Room id dạng "smallerId_biggerId" -> id của người còn lại. */
const getPartnerId = (id) => {
    const ids = String(id).split('_').map(Number);
    if (ids.length !== 2 || ids.some((value) => !value)) return null;
    return ids.find((value) => value !== Number(currentUserId.value)) ?? null;
};

const loadRooms = async () => {
    try {
        const list = (await messageApi.getRooms()) || [];
        const seen = new Set();
        rooms.value = list.filter((room) => {
            if (seen.has(room.room_id)) return false;
            seen.add(room.room_id);
            return true;
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
};

const joinRoom = (id) => {
    // Khi chưa kết nối, sự kiện 'connect' sẽ tự join lại phòng hiện tại.
    if (id && socket.connected) socket.emit('room', id);
};

// Chống race khi đổi phòng liên tục: chỉ nhận kết quả của lần mở phòng mới nhất.
let openToken = 0;

const openRoom = async (id) => {
    const token = ++openToken;
    roomId.value = id || null;
    // Hiện tạm partner từ danh sách phòng trong lúc tải thông tin đầy đủ.
    partner.value = rooms.value.find((room) => room.room_id === id)?.partner || null;
    if (!id) {
        messages.value = [];
        return;
    }

    const partnerId = getPartnerId(id);
    if (!partnerId) {
        console.error('Invalid room_id format:', id);
        messages.value = [];
        return;
    }

    joinRoom(id);

    userApi
        .getUserById(partnerId)
        .then((user) => {
            if (token === openToken) partner.value = user;
        })
        .catch((error) => console.error('Error loading chat partner:', error));

    try {
        const list = await messageApi.getRoomMessages(id);
        if (token === openToken) messages.value = list || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        if (token === openToken) messages.value = [];
    }
};

const selectRoom = (id) => {
    router.push({ name: 'MessagePage', params: { id } });
    if (isMobile()) showRoomList.value = false;
};

const sendMessage = (text) => {
    if (!currentUserId.value || !partner.value || !roomId.value) {
        console.error('User data not loaded');
        return;
    }
    socket.emit('send', {
        senderId: currentUserId.value,
        receiverId: partner.value.id,
        room: roomId.value,
        msg: text,
    });
    draft.value = '';
};

// ---------- socket ----------

const onConnect = () => joinRoom(roomId.value);

const onReceive = (msg) => {
    const room = rooms.value.find((item) => item.room_id === msg.room_id);
    if (room) {
        room.latest_message = msg.message;
        room.latest_message_time = msg.created_at;
    } else {
        // Cuộc trò chuyện mới chưa có trong danh sách
        loadRooms();
    }

    if (msg.room_id !== roomId.value) return;
    if (messages.value.some((item) => item.id === msg.id)) return;
    messages.value.push(msg);
};

const onMessageError = (payload) => {
    notification.error({
        message: 'Error',
        description: payload?.error || 'Không thể gửi tin nhắn',
    });
};

// ---------- layout ----------

const handleResize = () => {
    // Desktop luôn hiện danh sách phòng; mobile chỉ hiện khi chưa chọn phòng.
    showRoomList.value = isMobile() ? !roomId.value : true;
};

watch(
    () => route.params.id,
    (id) => {
        if (route.name === 'MessagePage') openRoom(id);
    },
    { immediate: true },
);

onMounted(() => {
    socket.on('connect', onConnect);
    socket.on('receive', onReceive);
    socket.on('messageError', onMessageError);
    if (socket.connected) onConnect();
    else socket.connect();

    handleResize();
    window.addEventListener('resize', handleResize);

    loadRooms();
});

onBeforeUnmount(() => {
    socket.off('connect', onConnect);
    socket.off('receive', onReceive);
    socket.off('messageError', onMessageError);
    // Ngắt kết nối cũng rời mọi phòng đã join trên server.
    socket.disconnect();
    window.removeEventListener('resize', handleResize);
    openToken++;
});
</script>
