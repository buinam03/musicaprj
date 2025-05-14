<template>
    <div>
        <Header></Header>
        <div
            class="pt-16 w-container mx-auto h-auto mb-16 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div class="flex flex-col h-auto">
                <!-- Header - Đã thêm sticky -->
                <div class="bg-black text-white p-4 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <router-link to="/home">
                            <button class="p-1 rounded-full hover:bg-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </router-link>
                        <h1 class="font-bold text-xl">Messages</h1>
                    </div>
                </div>
            </div>
            <div class="flex mb-16">
                <div class="w-1/3 h-[730px] overflow-y-auto overflow-x-hidden  border-r-[1px] border-gray-200">
                    <ul >
                        <li v-for="(item) in roomMessage" :key="item.id" @click="fetchMessage(item.room_id)" class="flex h-16 hover:bg-gray-200 cursor-pointer">
                            <div class="h-12 aspect-square rounded-full m-2 flex justify-center items-center">
                                <img :src="item.partner.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                    class="rounded-full aspect-square" alt="">
                            </div>
                            <div class="block w-full">
                                <div class="w-full flex justify-between my-2 ">
                                    <div class="font-bold px-2">{{ item.partner.username }}</div>
                                    <div class="text-xs px-2">{{ formatDate(item.latest_message_time) }}</div>
                                </div>
                                <div class="w-full m-2 flex justify-start">
                                    <div class="text-sm">{{ item.latest_message }}</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="w-2/3 h-[730px] px-4 relative">
                    <!-- Nội dung chi tiết message -->
                    <div v-if="userById" class="flex justify-between items-center py-4 border-b-[1px] border-gray-200">
                        <div class="font-semibold text-xl">{{ userById.username }}</div>
                        <div
                            class="font-bold h-5 aspect-square rounded-full border-[1px] border-gray-800 flex justify-center items-center bg-gray-800 text-white">
                            <font-awesome-icon icon="fa-solid fa-info" />
                        </div>
                    </div>

                    <!-- Phần nội dung chat -->
                    <div class="h-[550px] overflow-y-auto overflow-x-hidden">
                        <ul>
                            <li v-for="(item, index) in messageByUser" :key="index" class="flex my-1 items-start"
                                :class="{
                                    'justify-end': item.sender.id === currentId,   // my message
                                    'justify-start': item.sender.id !== currentId  // their message
                                }">

                                <img v-if="item.sender.id !== currentId"
                                    :src="item.sender.profile_picture || unknownAvatar"
                                    class="w-8 h-8 rounded-full mr-2" alt="avatar" />


                                <div class="max-w-[70%] p-2 rounded-lg" :class="{
                                    'bg-blue-100 text-black': item.sender.id === currentId,
                                    'bg-gray-200 text-black': item.sender.id !== currentId
                                }">
                                    <div class="text-xs mb-1 font-semibold">
                                        {{ item.sender.username }}
                                        <span class="text-[10px] text-gray-500">
                                            • {{ formatDate(item.created_at) }}
                                        </span>
                                    </div>
                                    <div class="text-sm">
                                        {{ item.message }}
                                    </div>
                                </div>

                                <img v-if="item.sender.id === currentId"
                                    :src="item.sender.profile_picture || unknownAvatar"
                                    class="w-8 h-8 rounded-full ml-2" alt="avatar" />
                            </li>
                        </ul>
                    </div>

                    <!-- Phần input -->
                    <div class="absolute bottom-0 left-0 right-0 h-24 font-semibold text-lg px-4">
                        Write your message
                        <div class="h-16  rounded-lg flex justify-center items-center ">
                            <input @keyup.enter="sendMessage" v-model="inputMessage" type="text"
                                class="w-[90%] h-full px-4 pr-10 focus:outline-none border-[1px] border-gray-200 rounded-lg z-0">
                            <button @click="sendMessage"
                                class="ml-2 w-10 h-10 flex justify-center items-center text-gray-500 hover:text-gray-700 border-[1px] border-gray-200 rounded-full">
                                <font-awesome-icon icon="fa-regular fa-paper-plane" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <Footer></Footer>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import socket from '@/socket/socket';

export default {
    name: 'MessagePage',
    data() {
        return {
            unknownAvatar: 'http://localhost:8080/images/other/Unknown_person.jpg',

            receiveId: null,
            roomId: null,
            currentId: null,
            userCurrent: null,
            userById: null,
            idCurrent: null,
            idUser: null,
            inputMessage: '',
            messageByUser: null,
            roomMessage: null,
            currentRoomId: null,
            roomValid: '',
        }
    },
    components: {
        Header,
        Footer
    },
    mounted() {
        socket.connect();

        // 1. Đăng ký listener chung nhưng chưa join room nào
        socket.on('message', msg => {
            if (msg.room_id === this.roomId) {
                // Tránh duplicate
                if (!this.messageByUser.some(m => m.id === msg.id)) {
                    this.messageByUser.unshift(msg);
                }
            }
        });

        // 2. Load user + room list + auto open room đầu tiên
        this.loadMessage();


    },
    computed: {

    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return "Invalid date";
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        async fetchMessage(roomId) {
            try {
                // Kiểm tra xem roomId có hợp lệ không
                if (!roomId) {
                    console.error('Invalid room ID');
                    return;
                }
                this.changeRoom(roomId);
                console.log('Room id', roomId);
                // Fetch tin nhắn từ API
                const res = await apiClient.get(`http://localhost:3000/api/message/getRoomMessage/${roomId}`);
                this.messageByUser = res.data.data; // Gán dữ liệu tin nhắn vào biến message
                console.log(`Fetched messages for room ${roomId}:`, this.messageByUser);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        },

        getRoomId(u1, u2) {
            return [u1, u2].sort((a, b) => a - b).join('_');
        },
        changeRoom(id) {
            this.$router.push({ name: 'MessagePage', params: { id } })
        },
        async loadMessage() {

            try {
                console.log('Room id: ', this.roomId);

                const resCurr = await apiClient.get('/users/getCurrentUser');
                this.userCurrent = resCurr.data.data;
                console.log('user current: ', this.userCurrent.id);
                const ids = this.roomId.split('_');
                if (ids.length !== 2) {
                    console.error('Invalid room_id format.');
                    return null;
                }
                console.log('ids: ', ids)
                // So sánh với currentId để xác định receiverId
                this.currentId = this.userCurrent.id; // Giả sử currentId được lưu ở đây
                const receiverId = ids
                    .map(id => Number(id))                        // [23, 26]
                    .find(id => id !== this.currentId);
                console.log(this.userCurrent.id);
                if (!receiverId) {
                    console.error('Receiver ID not found.');
                    return null;
                }

                const [resById, resRoom] = await Promise.all([

                    apiClient.get(`/users/getUserById/${receiverId}`),
                    apiClient.get('/message/getAllRoomsByUser')
                ]);

                console.log('receive', receiverId)

                this.userById = resById.data.data;
                this.roomMessage = resRoom.data.data;

                console.log('id: ', this.userById);

                if (this.roomMessage.length === 0) {
                    this.roomValid = resRoom.data.message;
                }

                const roomId = this.getRoomId(this.userCurrent.id, this.userById.id);
                console.log(roomId);
                if (!roomId) {
                    this.joinRoom(); // Tham gia phòng nếu roomId không hợp lệ
                    return;
                }
                this.fetchMessage(roomId);

            } catch (e) {
                console.error('Error loading users:', e);
            }
        },

        joinRoom() {
            if (!this.userCurrent || !this.userById) return;

            const roomId = this.getRoomId(this.userCurrent.id, this.userById.id);
            console.log('Joining room:', roomId);

            socket.emit('room', roomId); // Tham gia room
            console.log(`Joined room ${roomId}`);
        },
        listenForMessages() {
            socket.on('receive', msg => {
                this.messages.push(msg);
            });
        },
        sendMessage() {
            if (!this.userCurrent || !this.userById) return;
            if (!this.inputMessage.trim()) return;

            const roomId = this.roomId || this.$route.params.id;

            this.joinRoom();
            const receiverId = this.userById.id;
            const messageData = {
                senderId: this.userCurrent.id,
                receiverId: receiverId,
                room: roomId,
                msg: this.inputMessage
            };
            socket.emit('send', messageData);
            console.log(messageData);
            this.inputMessage = '';
            this.loadMessage();
        }
    },
    created() {
        // this.receiveId = this.$route.params.id;
    },
    watch: {
        '$route.params.id': {
            handler(newId) {
                this.roomId = newId;
                this.fetchMessage(this.roomId);
            },
            immediate: true
        },
    },
}
</script>

<style scoped></style>