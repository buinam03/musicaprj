<template>
    <div class="bg-gray-50 min-h-screen">
        <div class="pt-14 sm:pt-16 pb-4 sm:pb-16 w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
            <div class="flex h-full max-w-7xl mx-auto shadow-2xl bg-white">
                <!-- Room List Sidebar -->
                <div :class="[
                    'w-full sm:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col transition-all duration-300',
                    showRoomList ? 'block' : 'hidden sm:flex'
                ]">
                    <!-- Room List Header -->
                    <div class="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-purple-600">
                        <div class="flex items-center justify-between">
                            <h1 class="text-xl sm:text-2xl font-bold text-white">Messages</h1>
                            <button @click="showRoomList = false" 
                                class="sm:hidden text-white p-2 hover:bg-white/20 rounded-full transition-colors">
                                <font-awesome-icon icon="fa-solid fa-times" />
                            </button>
                        </div>
                    </div>

                    <!-- Room List -->
                    <div class="flex-1 overflow-y-auto">
                        <ul class="divide-y divide-gray-100">
                            <li v-for="(item) in roomMessage" :key="item.id" 
                                @click="selectRoom(item.room_id)"
                                :class="{
                                    'bg-orange-50 border-l-4 border-orange-500': item.room_id === roomId,
                                    'hover:bg-gray-50': item.room_id !== roomId
                                }"
                                class="flex items-center p-3 sm:p-4 cursor-pointer transition-all duration-200 group">
                                <div class="flex-shrink-0 relative">
                                    <img :src="item.partner.profile_picture || unknownAvatar"
                                        class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-orange-400 transition-colors"
                                        :alt="item.partner.username">
                                    <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div class="flex-grow min-w-0 ml-3">
                                    <div class="flex items-center justify-between mb-1">
                                        <div class="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                            {{ item.partner.username }}
                                        </div>
                                        <div class="text-xs text-gray-500 ml-2 flex-shrink-0">
                                            {{ formatDate(item.latest_message_time) }}
                                        </div>
                                    </div>
                                    <div class="text-xs sm:text-sm text-gray-600 truncate">
                                        {{ item.latest_message || 'No messages yet' }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div v-if="!roomMessage || roomMessage.length === 0" 
                            class="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <font-awesome-icon icon="fa-solid fa-comments" class="text-gray-400 text-4xl mb-3" />
                            <p class="text-gray-500 text-sm">No conversations yet</p>
                        </div>
                    </div>
                </div>

                <!-- Chat Area -->
                <div :class="[
                    'flex-1 flex flex-col',
                    !showRoomList ? 'block' : 'hidden sm:flex'
                ]">
                    <!-- Chat Header -->
                    <div v-if="userById" class="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200 bg-white shadow-sm">
                        <div class="flex items-center gap-3">
                            <button @click="showRoomList = true" 
                                class="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors mr-1">
                                <font-awesome-icon icon="fa-solid fa-arrow-left" class="text-gray-700" />
                            </button>
                            <img :src="userById.profile_picture || unknownAvatar"
                                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
                                :alt="userById.username">
                            <div>
                                <div class="font-semibold text-base sm:text-lg text-gray-900">{{ userById.username }}</div>
                                <div class="text-xs text-green-500 flex items-center gap-1">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
                            <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
                        </button>
                    </div>

                    <!-- Messages Container -->
                    <div ref="messageContainer" 
                        class="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 bg-gradient-to-b from-gray-50 to-white">
                        <div v-if="!messageByUser || messageByUser.length === 0"
                            class="h-full flex flex-col justify-center items-center text-gray-400">
                            <div class="bg-white rounded-full p-6 mb-4 shadow-lg">
                                <font-awesome-icon icon="fa-solid fa-comments" class="text-4xl text-gray-300" />
                            </div>
                            <p class="text-base sm:text-lg font-medium">{{ emptyMessageText }}</p>
                        </div>
                        <div v-else class="space-y-4">
                            <div v-for="(item, index) in messageByUser" :key="item.id || index" 
                                class="flex items-end gap-2 group"
                                :class="{
                                    'flex-row-reverse': item.sender.id === currentId,
                                    'justify-start': item.sender.id !== currentId
                                }">
                                
                                <!-- Avatar -->
                                <img :src="item.sender.profile_picture || unknownAvatar"
                                    class="w-8 h-8 rounded-full object-cover flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    :alt="item.sender.username">

                                <!-- Message Bubble -->
                                <div class="flex flex-col max-w-[75%] sm:max-w-[60%]"
                                    :class="{
                                        'items-end': item.sender.id === currentId,
                                        'items-start': item.sender.id !== currentId
                                    }">
                                    <div class="flex items-center gap-2 mb-1"
                                        :class="{
                                            'flex-row-reverse': item.sender.id === currentId
                                        }">
                                        <span class="text-xs font-medium text-gray-600">
                                            {{ item.sender.id !== currentId ? item.sender.username : 'You' }}
                                        </span>
                                        <span class="text-xs text-gray-400">
                                            {{ formatTime(item.created_at) }}
                                        </span>
                                    </div>
                                    <div class="px-4 py-2.5 rounded-2xl shadow-sm break-words" 
                                        :class="{
                                            'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-sm': item.sender.id === currentId,
                                            'bg-white text-gray-900 border border-gray-200 rounded-bl-sm': item.sender.id !== currentId
                                        }">
                                        <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{{ item.message }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="border-t border-gray-200 p-3 sm:p-4 bg-white">
                        <div class="flex items-end gap-2 sm:gap-3">
                            <div class="flex-1 relative">
                                <input 
                                    v-model="inputMessage" 
                                    @keyup.enter="sendMessage" 
                                    type="text"
                                    placeholder="Type a message..."
                                    class="w-full h-11 sm:h-12 px-4 pr-12 focus:outline-none border border-gray-300 rounded-full focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm sm:text-base">
                                <button @click="toggleEmoji" 
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <font-awesome-icon icon="fa-regular fa-face-smile" />
                                </button>
                            </div>
                            <button 
                                @click="sendMessage"
                                :disabled="!inputMessage.trim()"
                                class="w-11 h-11 sm:w-12 sm:h-12 flex justify-center items-center rounded-full transition-all shadow-sm"
                                :class="inputMessage.trim() 
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:scale-105 active:scale-95' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
                                <font-awesome-icon icon="fa-solid fa-paper-plane" class="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile: Show room list button when chat is open -->
            <button v-if="roomId && !showRoomList" 
                @click="showRoomList = true"
                class="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40">
                <font-awesome-icon icon="fa-solid fa-comments" class="text-xl" />
            </button>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import socket from '@/socket/socket';

export default {
    name: 'MessagePage',
    data() {
        return {
            unknownAvatar: 'http://localhost:8080/images/other/Unknown_person.jpg',
            emptyMessageText: "Chưa có tin nhắn nào — hãy bắt đầu cuộc trò chuyện!",
            roomId: null,
            currentId: null,
            userCurrent: null,
            userById: null,
            inputMessage: '',
            messageByUser: [],
            roomMessage: [],
            showRoomList: true, // For mobile responsive
        }
    },
    
    mounted() {
        socket.connect();
        
        // Listen for incoming messages
        socket.on('receive', msg => {
            console.log('📩 Received message:', msg);
            
            // Only add message if it belongs to current room
            if (msg.room_id === this.roomId) {
                // Prevent duplicates
                if (!this.messageByUser.some(m => m.id === msg.id)) {
                    this.messageByUser.push(msg);
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });
                }
            }
        });

        // Handle window resize for responsive
        this.handleResize();
        window.addEventListener('resize', this.handleResize);

        this.loadMessage();
    },
    
    beforeUnmount() {
        socket.off('receive');
        socket.disconnect();
        window.removeEventListener('resize', this.handleResize);
    },
    
    methods: {
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        
        formatTime(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        },
        
        selectRoom(roomId) {
            this.fetchMessage(roomId);
            // Hide room list on mobile after selecting
            if (window.innerWidth < 640) {
                this.showRoomList = false;
            }
        },
        
        async fetchMessage(roomId) {
            try {
                if (!roomId) {
                    console.error('Invalid room ID');
                    return;
                }
                
                this.roomId = roomId;
                this.changeRoom(roomId);
                
                // Join the room via socket
                socket.emit('room', roomId);
                console.log('🚪 Joined room:', roomId);
                
                // Fetch messages from API
                const res = await apiClient.get(`http://localhost:3000/api/message/getRoomMessage/${roomId}`);
                this.messageByUser = res.data.data || [];
                console.log(`📝 Fetched ${this.messageByUser.length} messages for room ${roomId}`);
                
                // Scroll to bottom after loading messages
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            } catch (error) {
                console.error('❌ Error fetching messages:', error);
            }
        },
        
        toggleEmoji() {
            // Placeholder for emoji picker
            console.log('Emoji picker - to be implemented');
        },

        getRoomId(u1, u2) {
            return [u1, u2].sort((a, b) => a - b).join('_');
        },
        
        changeRoom(id) {
            this.$router.push({ name: 'MessagePage', params: { id } });
        },
        
        async loadMessage() {
            try {
                // Get current user
                const resCurr = await apiClient.get('/users/getCurrentUser');
                this.userCurrent = resCurr.data.data;
                this.currentId = this.userCurrent.id;
                
                if (!this.roomId) {
                    console.log('⚠️ No room ID yet');
                    return;
                }
                
                // Parse room ID to get receiver ID
                const ids = this.roomId.split('_');
                if (ids.length !== 2) {
                    console.error('❌ Invalid room_id format');
                    return;
                }
                
                const receiverId = ids
                    .map(id => Number(id))
                    .find(id => id !== this.currentId);
                
                if (!receiverId) {
                    console.error('❌ Receiver ID not found');
                    return;
                }

                // Fetch receiver info and all rooms in parallel
                const [resById, resRoom] = await Promise.all([
                    apiClient.get(`/users/getUserById/${receiverId}`),
                    apiClient.get('/message/getAllRoomsByUser')
                ]);

                this.userById = resById.data.data;
                
                // Remove duplicate rooms
                const uniqueRoomIds = new Set();
                this.roomMessage = (resRoom.data.data || []).filter(room => {
                    if (uniqueRoomIds.has(room.room_id)) {
                        return false;
                    }
                    uniqueRoomIds.add(room.room_id);
                    return true;
                });

                // Fetch messages for current room
                this.fetchMessage(this.roomId);
            } catch (e) {
                console.error('❌ Error loading message:', e);
            }
        },

        sendMessage() {
            if (!this.userCurrent || !this.userById) {
                console.error('❌ User data not loaded');
                return;
            }
            
            if (!this.inputMessage.trim()) {
                return;
            }

            const messageData = {
                senderId: this.userCurrent.id,
                receiverId: this.userById.id,
                room: this.roomId,
                msg: this.inputMessage.trim()
            };
            
            console.log('📤 Sending message:', messageData);
            socket.emit('send', messageData);
            
            // Clear input immediately for better UX
            this.inputMessage = '';
        },
        
        scrollToBottom() {
            const container = this.$refs.messageContainer;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        },
        
        handleResize() {
            // Show room list on desktop, hide on mobile when room is selected
            if (window.innerWidth >= 640) {
                this.showRoomList = true;
            } else {
                // On mobile: show room list if no room selected, hide if room is selected
                this.showRoomList = !this.roomId;
            }
        }
    },
    
    watch: {
        '$route.params.id': {
            handler(newId) {
                if (newId) {
                    this.roomId = newId;
                    this.loadMessage();
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
}

/* Smooth transitions */
* {
    transition: all 0.2s ease;
}

/* Message animations */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.space-y-4 > div {
    animation: slideIn 0.3s ease-out;
}

/* Input focus effect */
input:focus {
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

/* Mobile optimizations */
@media (max-width: 640px) {
    .space-y-4 > div {
        max-width: 85%;
    }
}
</style>