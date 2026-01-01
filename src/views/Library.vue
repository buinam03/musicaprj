<template>
    <div class="min-h-screen bg-gray-50">
        <Header></Header>
        <div class="pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Likes Section -->
            <div class="mb-8 sm:mb-12">
                <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
                    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Likes</h2>
                    <div @click="gotoLike" 
                        class="flex items-center gap-2 text-sm sm:text-base text-gray-500 hover:text-orange-500 cursor-pointer transition-colors duration-200">
                        <span>All Likes</span>
                        <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-xs" />
                    </div>
                </div>
                
                <div v-if="songs && songs.length > 0" 
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
                    <div v-for="(item, index) in songs.slice(0, 12)" :key="index"
                        class="group cursor-pointer">
                        <div @click="playToggle(index, item.Song)"
                            class="w-full aspect-square relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                            <div class="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-orange-500 hover:bg-orange-600 flex justify-center items-center rounded-full shadow-lg transform transition-transform hover:scale-110">
                                    <font-awesome-icon
                                        :icon="Number(playerStore.currentSong?.id) === Number(item.Song.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                        class="text-white text-lg sm:text-xl" />
                                </div>
                            </div>
                            <img :src="item.Song.artwork || defaultImage" 
                                class="w-full h-full object-cover" 
                                :alt="item.Song.title" />
                        </div>
                        <div class="mt-2 sm:mt-3">
                            <div class="text-xs sm:text-sm font-medium text-gray-900 truncate flex items-center gap-1">
                                <font-awesome-icon icon="fa-solid fa-heart" class="text-orange-500 flex-shrink-0" />
                                <span class="truncate">{{ item.Song.title }}</span>
                            </div>
                            <div v-for="(artist, artistIndex) in item.Song.User" :key="artistIndex"
                                class="text-xs text-gray-500 truncate mt-1">
                                {{ artist.username }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-48 sm:h-56 md:h-64 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <font-awesome-icon icon="fa-solid fa-heart" class="text-gray-300 text-5xl sm:text-6xl mb-4" />
                    <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4">You haven't liked any tracks yet.</div>
                </div>
            </div>

            <!-- Following Section -->
            <div>
                <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
                    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Following</h2>
                    <div @click="gotoFollowing" 
                        class="flex items-center gap-2 text-sm sm:text-base text-gray-500 hover:text-orange-500 cursor-pointer transition-colors duration-200">
                        <span>All Following</span>
                        <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-xs" />
                    </div>
                </div>
                
                <div v-if="followingUsers && followingUsers.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-12 md:mb-20">
                    <div @mouseenter="isHoverUser = index" 
                         @mouseleave="isHoverUser = null"
                         v-for="(user, index) in followingUsers.slice(0, 5)" 
                         :key="index"
                         class="group bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div class="flex flex-col items-center">
                            <div class="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 aspect-square mb-4 relative overflow-hidden rounded-full group-hover:ring-4 group-hover:ring-orange-200 transition-all duration-300">
                                <img :src="user.following.profile_picture || defaultImage" 
                                    alt="Profile picture"
                                    class="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 class="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4 text-center truncate w-full">
                                {{ user.following.username }}
                            </h3>
                            <button @click="followToggle(user.following.id, index)"
                                    class="w-full sm:w-auto min-w-[120px] rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto sm:opacity-0 sm:group-hover:opacity-100"
                                    :class="user.isFollowed 
                                        ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-600' 
                                        : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50'">
                                <font-awesome-icon
                                    :icon="user.isFollowed ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                                <span>{{ user.isFollowed ? 'Following' : 'Follow' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="h-48 sm:h-56 md:h-64 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm mb-8 sm:mb-12 md:mb-20">
                    <font-awesome-icon icon="fa-solid fa-user-group" class="text-gray-300 text-5xl sm:text-6xl mb-4" />
                    <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4">You aren't following anyone yet.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import { usePlayerStore } from '@/js/state';
import apiClient from '@/apiService/apiClient';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
export default {
    name: 'LibraryPage',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        }
    },
    data() {
        return {
            isHoverUser: null,
            songs: [],
            selectedTracks: [],
            followingUsers: [],
            users: [],
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
        }
    },
    mounted() {
        this.fetchLikes();
        this.fetchFollowing();
    },
    methods: {
        gotoLike(){
            this.$router.push({name : 'LikesPage'});
        },
        gotoFollowing(){
            const userId = getUserIdFromJWT();
            if (!userId) return;
            this.$router.push({path: '/following/' + userId})
        },
        playToggle(index, song) {
            const playerStore = usePlayerStore();
            const username = song?.User?.[0]?.username || song?.User?.username || "Unknown Artist";

            // Check by song ID instead of index to avoid conflicts
            const currentSongId = Number(playerStore.currentSong?.id);
            const songId = Number(song.id);
            
            if (currentSongId === songId && !isNaN(currentSongId) && !isNaN(songId)) {
                if (playerStore.isPlaying) {
                    playerStore.pause();
                } else {
                    playerStore.resume();
                }
            }
            else {
                playerStore.play({
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    username: username,
                    duration: song.SongDetail?.duration || song.duration || 0,
                    path: song.path,
                });
            }
        },
        async fetchLikes() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId) return;
                const response = await apiClient.get(`http://localhost:3000/api/like/getSongLikeById`, {
                    params: {
                        user_id: userId,
                    }
                });

                this.songs = response.data.data;

                console.log('liked songs:', this.songs);
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        },
        async fetchFollowing() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId) return;
                const response = await apiClient.get(`http://localhost:3000/api/follow/getAllFollowing`, {
                    params: { id: userId }
                });
                
                // Lấy danh sách following users
                const followingUsers = response.data.data;
                
                // Tạo mảng các promise để check follow status cho từng user
                const followStatusPromises = followingUsers.map(user => 
                    apiClient.get('http://localhost:3000/api/follow/getFollowStatus', {
                        params: {
                            follower_id: userId,
                            following_id: user.following.id
                        }
                    })
                );

                // Đợi tất cả các request hoàn thành
                const followStatusResults = await Promise.all(followStatusPromises);

                // Kết hợp dữ liệu user với trạng thái follow
                this.followingUsers = followingUsers.map((user, index) => ({
                    ...user,
                    isFollowed: followStatusResults[index].data.data.isFollowing
                }));

                console.log('users with follow status:', this.followingUsers);
            } catch (error) {
                console.error('Error fetching following:', error);
            }
        },
        async followToggle(id, index) {
            try {
                const payload = {
                    following_id: id,
                }
                await apiClient.post('http://localhost:3000/api/follow/addNewFollower', payload);
                // Update the correct array (followingUsers, not users)
                this.followingUsers[index].isFollowed = !this.followingUsers[index].isFollowed;
            } catch (error) {
                console.error("Failed to follow:", error);
            }
        },
    },
    components: {
        Header,
    },
}
</script>

<style scoped></style>