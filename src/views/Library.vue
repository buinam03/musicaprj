<template>
    <div>
        <Header></Header>
        <div
            class="pt-16 w-container mx-auto h-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div
                class="flex justify-between items-center w-full border-b-[1px] p-4 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
                <div class="text-left font-semibold text-2xl flex justify-center items-center">
                    Likes
                </div>
                <div @click="gotoLike" class="whitespace-nowrap text-gray-500 cursor-pointer">
                    All Likes
                    <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </div>
            </div>
            <div class="mt-4 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
                <div v-if="songs && songs.length > 0" class="flex flex-wrap w-full h-auto ">
                    <div v-for="(item, index) in songs.slice(0, 12)" :key="index"
                        class="pr-4 h-[250px] w-1/6 xl:h-[250px] lg:h-[200px] md:h-[150px]">
                        <div @click="playToggle(index, item.Song)"
                            class="w-full aspect-square relative cursor-pointer group">
                            <div
                                class="absolute inset-0 bg-transparent bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-75 rounded-lg ">
                            </div>
                            <div
                                class="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity ">
                                <div
                                    class="h-[45px] w-[45px] border-[1px]  border-orange-500 bg-orange-500 flex justify-center items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity ">
                                    <font-awesome-icon
                                        :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                </div>
                            </div>
                            <img :src="item.Song.artwork || defaultImage" class="z-0 object-cover aspect-square" alt="">
                        </div>
                        <div class="text-[14px] text-left w-full text-ellipsis whitespace-nowrap overflow-hidden">
                            <font-awesome-icon icon="fa-solid fa-heart" class="text-orange-500" />
                            {{ item.Song.title }}
                        </div>
                        <div v-for="(artist, index) in item.Song.User" :key="index"
                            class="text-[12px] font-semibold w-full text-ellipsis whitespace-nowrap overflow-hidden text-gray-400 text-left">
                            {{ artist.username }}
                        </div>
                    </div>
                </div>
                <div v-else class="h-[160px] w-full flex justify-center items-center py-8 bg-gray-50 rounded-xl">
                     <div class="text-[20px] text-gray-500">You haven't liked any tracks yet.</div>
                </div>
            </div>
            <div
                class="flex justify-between items-center w-full border-b-[1px] p-4 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
                <div class="text-left font-semibold text-2xl flex justify-center items-center">
                    Following
                </div>
                <div @click="gotoFollowing" class="whitespace-nowrap text-gray-500 cursor-pointer">
                    All Following
                    <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </div>
            </div>
            <div v-if="followingUsers && followingUsers.length > 0"
                class="grid grid-cols-5 gap-4 mb-20 h-auto xl:w-[1200px] xl:grid-cols-5 lg:w-[960px] lg:grid-cols-4 lg:gap-2 md:w-[700px] md:grid-cols-3 xl:mx-auto lg:mx-auto md:mx-auto">
                <div @mouseover="isHoverUser = index" @mouseleave="isHoverUser = null"
                    v-for="(user, index) in followingUsers.slice(0, 5)" :key="index"
                    class=" h-[300px] p-4 bg-white shadow-lg rounded-2xl">
                    <div class="w-[180px] aspect-square h-[180px] mx-auto">
                        <img :src="user.following.profile_picture || defaultImage" alt="Profile picture"
                            class="rounded-full mr-4 object-cover w-full h-full">
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold">{{ user.following.username }}</h2>

                        <div v-if="isHoverUser === index" @click="followToggle(user.following.id,index)"
                            class="w-[120px] max-w-[120px] h-auto rounded-3xl border-[1px] mx-auto cursor-pointer my-4 p-2 text-sm "
                            :class="user.isFollowed ? 'border-orange-500 text-orange-500' : 'border-gray-500 text-gray-500'">
                            <font-awesome-icon
                                :icon="user.isFollowed ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                            {{ user.isFollowed ? 'Following' : 'Follow' }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="h-[160px] w-full flex justify-center items-center py-8 bg-gray-50 rounded-xl mb-20">
                 <div class="text-[20px] text-gray-500">You aren't following anyone yet.</div>
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
            console.log('Song data:', song);
            const username = song?.User?.username || "Unknown Artist";

            if (playerStore.currentPlayIndex === index) {
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
                    duration: song.SongDetail.duration,
                    path: song.path,
                });

                playerStore.currentPlayIndex = index;
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
        togglePlay(index) {
            if (this.playerStore.currentPlayIndex === index && this.playerStore.isPlaying) {
                this.playerStore.isPlaying = false;
                this.playerStore.currentPlayIndex = null;
            } else {
                this.playerStore.isPlaying = true;
                this.playerStore.currentPlayIndex = index;
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
                console.log('Success', payload);
                this.users[index].isFollowed = !this.users[index].isFollowed;
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