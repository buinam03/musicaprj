<template>
    <div v-if="playerStore.isPlaylistPanelVisible" class="fixed bottom-16 right-40 w-[450px] h-[450px] border-gray-200 border-[1px] rounded-md z-50 bg-white">
        <div class="flex items-center justify-between border-b-[1px]">
            <div class="pl-4 pt-4 pb-4 text-base text-black underline">
                Next Up
            </div>
            <div class="flex items-center">
                <div @click="toggleShuffle" 
                    class="px-4 py-2 border-[1px] border-gray-400 mr-2 cursor-pointer text-[12px] text-gray-500 rounded-sm hover:border-gray-600"
                    :class="{ 'text-orange-500 border-orange-500': playerStore.isShuffle }">
                    <font-awesome-icon icon="fa-solid fa-shuffle" />
                </div>
                <div @click="removeAllFromPlaylist"
                    class="px-4 py-2 border-[1px] border-gray-400 mr-4 cursor-pointer text-[12px] text-gray-500 rounded-sm hover:border-gray-600 hover:text-orange-500">
                    Clear
                </div>
            </div>
        </div>

        <div class="overflow-y-auto h-[calc(100%-56px)] z-0">
            <div v-for="(item, index) in playerStore.playlist" :key="index" draggable="true"
                @dragstart="onDragStart(index)" @dragover="onDragOver($event)" @drop="onDrop(index)"
                class="h-14 w-full mt-2 flex items-center justify-center hover:bg-gray-200"
                :class="{ 'bg-gray-100': playerStore.currentPlayIndex === index }">
                <div class="w-full h-14 rounded-sm flex items-center cursor-pointer">
                    <div class="w-1/12 rotate-90 opacity-10 text-gray-700 cursor-grab">
                        <font-awesome-icon icon="fa-solid fa-grip" />
                    </div>
                    <div class="ml-2 w-14 h-14 flex-shrink-0 flex justify-center items-center">
                        <img :src="item.artwork || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                            class="aspect-square mx-auto w-full h-full object-cover" alt="">
                    </div>
                    <div @click="play(item)" class="text-left pl-2 w-10/12">
                        <div class="w-[250px] text-ellipsis overflow-hidden whitespace-nowrap text-gray-700 text-sm">
                            {{ item.title }}
                        </div>
                        <div class="text-gray-500 text-sm">
                            {{ item.username }}
                        </div>
                    </div>
                    <div class="w-1/6 flex justify-center items-center">
                        <div class="cursor-pointer opacity-50"
                            :class="{ 'text-orange-500': item.isLiked }" 
                            @click="LikeToggle(index, item.id)">
                            <font-awesome-icon icon="fa-solid fa-heart" />
                        </div>
                        <div @click="removeSongFromPlaylist(index)"
                            class="pl-3 cursor-pointer opacity-50 text-gray-500">
                            <font-awesome-icon icon="fa-solid fa-xmark" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlayerStore } from '@/js/state';
import { ref } from 'vue';
import apiClient from '@/apiService/apiClient';

export default {
    name: 'PlaylistPanel',
    setup() {
        const playerStore = usePlayerStore();
        const isPlaylistToggle = ref(false);
        const dragIndex = ref(null);

        const removeSongFromPlaylist = (index) => {
            playerStore.removeFromPlaylist(index);
        };

        const removeAllFromPlaylist = () => {
            playerStore.removeAllFromPlaylist();
        };

        const toggleShuffle = () => {
            playerStore.isShuffle = !playerStore.isShuffle;
            playerStore.shufflePlaylist();
        };

        const onDragStart = (index) => {
            dragIndex.value = index;
        };

        const onDragOver = (event) => {
            event.preventDefault();
        };

        const onDrop = (index) => {
            if (dragIndex.value === null) return;
            const draggedItem = playerStore.playlist[dragIndex.value];
            playerStore.playlist.splice(dragIndex.value, 1);
            playerStore.playlist.splice(index, 0, draggedItem);
            
            // Cập nhật currentPlayIndex nếu cần
            if (playerStore.currentPlayIndex === dragIndex.value) {
                playerStore.currentPlayIndex = index;
            } else if (playerStore.currentPlayIndex > dragIndex.value && playerStore.currentPlayIndex <= index) {
                playerStore.currentPlayIndex--;
            } else if (playerStore.currentPlayIndex < dragIndex.value && playerStore.currentPlayIndex >= index) {
                playerStore.currentPlayIndex++;
            }
            
            dragIndex.value = null;
        };

        const LikeToggle = async (index, songId) => {
            if (!playerStore.idUserLogin) return;
            
            try {
                const payload = {
                    song_id: songId,
                    user_id: playerStore.idUserLogin
                };
                await apiClient.post(`http://localhost:3000/api/like/toggleLike`, payload);
                
                // Cập nhật trạng thái like trong playlist
                playerStore.playlist[index].isLiked = !playerStore.playlist[index].isLiked;
                
                // Cập nhật trạng thái like của bài hát hiện tại nếu cần
                if (playerStore.currentSong.id === songId) {
                    playerStore.currentSong.isLiked = !playerStore.currentSong.isLiked;
                }
            } catch (error) {
                console.error('Error toggling like:', error);
            }
        };

        return {
            playerStore,
            isPlaylistToggle,
            removeSongFromPlaylist,
            removeAllFromPlaylist,
            onDragStart,
            onDragOver,
            onDrop,
            toggleShuffle,
            LikeToggle,
        };
    },
    methods: {
        play(item) {
            this.playerStore.play(item);
        }
    }
};
</script>

<style scoped>
/* Add any necessary styles here */
</style> 