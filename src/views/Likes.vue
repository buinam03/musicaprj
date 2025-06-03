<template>
    <div>
        <Header></Header>
        <div
            class="w-container pt-16 mb-16 h-auto m-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div class=" py-4 flex justify-between items-center">
                <div v-if="user" class="text-left font-semibold text-2xl">
                    Likes by {{ user.username }}
                </div>
                <div v-else class="text-left font-semibold text-2xl">
                    Likes
                </div>
            </div>
            <div v-if="songs && songs.length > 0" class="w-full">
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="w-[50%]  text-left">Track</th>
                            <th class="w-[10%]  text-left">Length</th>
                            <th class="w-[10%]  text-left">Like</th>
                            <th class="w-[10%]  text-left">Play</th>
                            <th class="w-[10%]  text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in songs" :key="index" class="hover:bg-gray-200 cursor-pointer">
                            <th class="flex justify-start items-center">
                                <div class=" w-auto h-16 justify-center flex items-center">
                                    <div class="w-full h-5/6  aspect-square">
                                        <img :src="item.Song.artwork || defaultImage" class="w-full h-full object-cover m-auto" alt="">
                                    </div>
                                </div>
                                <div class="p-2">
                                    <div class="text-sm font-semibold text-left">
                                        {{ item.Song.title }}
                                    </div>
                                    <div class="flex justify-start items-center">
                                        <div
                                            class="hover:underline text-xs font-semibold text-gray-400 flex justify-center items-center">
                                            {{ item.Song.User.username }}
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th class="text-left text-sm">{{ formatTime(item.Song.SongDetail.duration) }}</th>
                            <th class="text-left text-sm">{{ item.Song.SongDetail.likes }}</th>
                            <th class="text-left text-sm">{{ item.Song.SongDetail.plays }}</th>
                            <th class="text-left text-sm">
                                <div class="flex justify-center items-center">

                                    <div class="w-1/3 h-full aspect-square p-1">
                                        <div @click="playToggle(index, item)"
                                            class="h-full w-full border-[1px] border-gray-500 rounded-full text-gray-500 flex justify-center items-center hover:border-orange-500 hover:text-orange-500">
                                            <font-awesome-icon
                                                :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                        </div>
                                    </div>
                                    <div class="w-1/3 h-full aspect-square p-1">
                                        <div @click="toggleLike(index, item.Song.id)"
                                            class="h-full w-full border-[1px] border-gray-500 rounded-full text-gray-500 flex justify-center items-center hover:border-orange-500 hover:text-orange-500"
                                            :class="{ 'border-orange-500 text-orange-500': likedSongs.includes(item.Song.id)}">
                                            <font-awesome-icon icon="fa-solid fa-heart" />
                                        </div>
                                    </div>
                                    <div class="w-1/3 h-full aspect-square p-1">
                                        <div @click="addToPlaylist(index, item.Song)"
                                            class="h-full w-full border-[1px] border-gray-500 rounded-full text-gray-500 flex justify-center items-center hover:border-orange-500 hover:text-orange-500">
                                            <font-awesome-icon icon="fa-solid fa-plus" />
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="h-[160px] w-full flex justify-center items-center py-8">
                <div class="text-[20px] text-gray-500">{{ user ? user.username : 'User' }} hasn't liked any tracks yet.</div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
import { usePlayerStore } from '@/js/state';
export default {
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        };
    },
    name: 'LikesPage',
    data() {
        return {
            isPlaying: false,
            songs: null,
            selectedTracks: [],
            likedSongs: [],
            currentTrackPlay: null,
            user: null,
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
        }
    },
    mounted() {
        this.fetchLikes();
        this.getUserById();
    },
    methods: {
        addToPlaylist(index, song) {
            const isAlreadyInPlaylist = this.playerStore.playlist.some((item) => item.id === song.id);
            
            if (!isAlreadyInPlaylist) {
                this.playerStore.addToPlaylist(song);
                console.log("Added to playlist:", this.playerStore.playlist);
            } else {
                console.log("This song is already in the playlist.");
            }
        },
        async getUserById() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/users/getUserById/${this.playerStore.idUserLogin}`);
                this.user = response.data.data;
                console.log('user', this.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        },
        async toggleLike(index, songId) {
            if (!this.playerStore.idUserLogin) return;

            try {
                const payload = {
                    song_id: songId,
                    user_id: this.playerStore.idUserLogin
                }
                await apiClient.post(`http://localhost:3000/api/like/toggleLike`, payload);
                if (!Array.isArray(this.likedSongs)) {
                    this.likedSongs = [];
                }
                if (this.likedSongs.includes(songId)) {
                    // Nếu đã like thì bỏ like
                    this.likedSongs = this.likedSongs.filter(id => id !== songId);
                } else {
                    // Nếu chưa like thì thêm vào
                    this.likedSongs.push(songId);
                }
                
            } catch (error) {
                console.error('Error toggling like:', error);
            }
        },
        formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        },
        async fetchLikes() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/like/getSongLikeById`, {
                    params: {
                        user_id: this.playerStore.idUserLogin,
                    }
                });

                this.songs = response.data.data;
                const promises = this.songs.map(song =>
                    apiClient.get(`http://localhost:3000/api/like/getLikeStatus`, {
                        params: {
                            user_id: this.playerStore.idUserLogin,
                            song_id: song.Song.id
                        }
                    }).then(response => ({
                        songId: song.id,
                        isLiked: response.data.isLiked
                    }))
                );
                const results = await Promise.all(promises);
                console.log('results', results);
                // Cập nhật trạng thái like cho từng bài hát
                this.songs = this.songs.map(song => ({
                    ...song,
                    isLiked: results.find(result => result.songId === song.id)?.isLiked || false
                }));

                console.log('songs with like status:', this.songs);
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        },
        toggleTrackSelection(id) {
            const index = this.selectedTracks.indexOf(id);
            if (index > -1) {
                this.selectedTracks.splice(index, 1); // Bỏ chọn
            } else {
                this.selectedTracks.push(id); // Chọn thêm
            }
        },
        clearSelection() {
            this.selectedTracks = []; // Xóa tất cả lựa chọn
        },
        toggleAllTracks() {
            if (this.allSelected) {
                this.selectedTracks = this.songs.map(song => song.id); // Chọn tất cả
            } else {
                this.selectedTracks = []; // Bỏ chọn tất cả
            }
        },
        checkAllSelected() {
            this.allSelected = this.selectedTracks.length === this.songs.length; // Kiểm tra trạng thái "Chọn tất cả"
        },
        likeToggle(index) {
            this.songs[index].isLike = !this.songs[index].isLike;
        },
        playToggle(index, song) {
            const playerStore = usePlayerStore();
            const username = song.Song.User.username || "Unknown Artist";

            if (playerStore.currentPlayIndex === index) {
                if (playerStore.isPlaying) {
                    playerStore.pause();
                } else {
                    playerStore.resume();
                }
            }
            else {
                playerStore.play({
                    id: song.Song.id,
                    title: song.Song.title,
                    artwork: song.Song.artwork,
                    username: username,
                    duration: song.Song.SongDetail.duration,
                    path: song.Song.path,
                });

                playerStore.currentPlayIndex = index;
            }
        },
    },
    components: {
        Header,
    },
}
</script>

<style scoped></style>