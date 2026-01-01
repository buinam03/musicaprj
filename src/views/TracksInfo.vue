<template>
    <div class="min-h-screen bg-gray-50">
        <Header></Header>
        <div v-if="trackInfo" class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section with Artwork and Controls -->
            <div class="mb-6 sm:mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden">
                <div class="flex flex-col md:flex-row">
                    <!-- Artwork -->
                    <div class="w-full md:w-80 lg:w-96 flex-shrink-0 aspect-square md:aspect-auto">
                        <img :src="trackInfo.artwork" 
                            class="w-full h-full object-cover" 
                            alt="artwork">
                    </div>
                    
                    <!-- Track Info and Controls -->
                    <div class="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                            <h1 class="text-2xl text-left sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 break-words">
                                {{ trackInfo.title }}
                            </h1>
                            <div v-if="userById" 
                                @click="goToArtistProfile(userById.id)"
                                class="text-base text-left sm:text-lg text-gray-300 hover:text-orange-400 cursor-pointer transition-colors mb-2 sm:mb-4">
                                {{ userById.username }}
                                <font-awesome-icon v-if="userById.is_verified" 
                                    icon="fa-solid fa-check-circle" 
                                    class="ml-2 text-blue-400" />
                            </div>
                            <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-400">
                                <span>{{ formatDate(trackInfo.created_at) }}</span>
                                <span v-if="genreName" 
                                    class="px-3 py-1 bg-white/10 rounded-full text-white">
                                    #{{ genreName }}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Player Controls -->
                        <div class="mt-4 sm:mt-6">
                            <div class="flex items-center gap-3 sm:gap-4 mb-4">
                                <button @click="togglePlay()"
                                    class="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-lg hover:scale-105">
                                    <font-awesome-icon
                                        :icon="playerStore.currentSong && trackInfo && playerStore.currentSong.id === trackInfo.id && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                        class="text-xl sm:text-2xl" />
                                </button>
                                
                                <div class="flex-1">
                                    <div class="flex items-center justify-between text-xs sm:text-sm text-gray-300 mb-1">
                                        <span>
                                            {{ playerStore.currentSong && trackInfo && playerStore.currentSong.id === trackInfo.id ?
                                                formatDuration(playerStore.currentTime) : '0:00' }}
                                        </span>
                                        <span>{{ formatDuration(trackInfo.SongDetail?.duration || 0) }}</span>
                                    </div>
                                    <input 
                                        :style="progressPercentage" 
                                        @input="updateProgressPlay($event.target.value)"
                                        :value="playerStore.currentSong && trackInfo && playerStore.currentSong.id === trackInfo.id ? playerStore.currentTime : 0"
                                        min="0" 
                                        :max="trackInfo.SongDetail?.duration || 0" 
                                        step="0.1" 
                                        type="range"
                                        class="playSlider w-full h-1 sm:h-1.5 cursor-pointer"
                                        :disabled="!(playerStore.currentSong && trackInfo && playerStore.currentSong.id === trackInfo.id)">
                                </div>
                            </div>
                            
                            <!-- Action Buttons -->
                            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                                <button @click="toggleLike(trackInfo.id)"
                                    class="px-4 sm:px-6 py-2 border-2 rounded-full font-medium transition-all flex items-center gap-2"
                                    :class="isLiked 
                                        ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600' 
                                        : 'border-gray-400 text-gray-300 hover:border-orange-500 hover:text-orange-500'">
                                    <font-awesome-icon icon="fa-solid fa-heart" />
                                    <span class="text-sm sm:text-base">Like</span>
                                </button>
                                <button @click="addToPlaylist(trackInfo)"
                                    class="px-4 sm:px-6 py-2 border-2 border-gray-400 text-gray-300 hover:border-orange-500 hover:text-orange-500 rounded-full font-medium transition-all flex items-center gap-2">
                                    <font-awesome-icon icon="fa-solid fa-notes-medical" />
                                    <span class="text-sm sm:text-base">Add to Playlist</span>
                                </button>
                                <div class="flex items-center gap-4 sm:gap-6 ml-auto">
                                    <div class="text-gray-300 text-sm sm:text-base flex items-center gap-2">
                                        <font-awesome-icon icon="fa-solid fa-play" />
                                        <span>{{ trackInfo.SongDetail?.plays || 0 }}</span>
                                    </div>
                                    <div class="text-gray-300 text-sm sm:text-base flex items-center gap-2">
                                        <font-awesome-icon icon="fa-solid fa-heart" />
                                        <span>{{ trackInfo.SongDetail?.likes || 0 }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
                <!-- Left Column: Comments -->
                <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <!-- Comment Input -->
                    <div class="mb-6 flex items-center gap-3 sm:gap-4">
                        <div v-if="user" class="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                            <img class="rounded-full object-cover w-full h-full cursor-pointer"
                                :src="profilePicture" 
                                alt="Profile picture"
                                @click="goToProfile">
                        </div>
                        <div class="flex-1 flex gap-2 sm:gap-3">
                            <input v-model="commentValue" 
                                type="text" 
                                placeholder="Write your comment"
                                @keyup.enter="commentSong"
                                class="flex-1 px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 transition-all text-sm sm:text-base">
                            <button @click="commentSong"
                                class="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full aspect-square transition-all flex items-center justify-center">
                                <font-awesome-icon icon="fa-solid fa-paper-plane" />
                            </button>
                        </div>
                    </div>

                    <!-- Comments Header -->
                    <div class="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                        <div class="flex items-center gap-2 text-gray-600">
                            <font-awesome-icon icon="fa-solid fa-comments" />
                            <span class="font-semibold text-sm sm:text-base">{{ cmtSong.length }} Comments</span>
                        </div>
                        <div class="border border-orange-500 rounded-lg overflow-hidden">
                            <select v-model="sortOrder" 
                                @change="fetchComments" 
                                class="px-3 py-2 text-sm sm:text-base text-orange-500 outline-none bg-white cursor-pointer">
                                <option value="DESC">Newest</option>
                                <option value="ASC">Oldest</option>
                            </select>
                        </div>
                    </div>

                    <!-- Comments List -->
                    <div class="space-y-4">
                        <div v-for="(item, index) in cmtSong" :key="index"
                            class="flex gap-3 sm:gap-4 pb-4 border-b border-gray-100 last:border-0">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                <img class="rounded-full object-cover w-full h-full"
                                    :src="item.User?.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg'" 
                                    alt="User avatar">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                    <span class="font-semibold text-sm sm:text-base text-gray-900">{{ item.User?.username || 'Unknown' }}</span>
                                    <span class="text-xs sm:text-sm text-gray-400">{{ formatTime(item.created_at) }}</span>
                                </div>
                                <p class="text-sm sm:text-base text-gray-700 mb-2 whitespace-pre-wrap break-words">
                                    {{ item.content }}
                                </p>
                                <button class="text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium">
                                    Reply
                                </button>
                            </div>
                        </div>
                        <div v-if="cmtSong.length === 0" class="text-center py-8 text-gray-400">
                            <font-awesome-icon icon="fa-solid fa-comments" class="text-4xl mb-3 opacity-50" />
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Artist Info & Overview -->
                <div class="space-y-6">
                    <!-- Artist Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Artist</h2>
                        <div v-if="userById" class="flex flex-col items-center text-center">
                            <div class="w-24 h-24 sm:w-32 sm:h-32 mb-4">
                                <img class="rounded-full w-full h-full object-cover cursor-pointer hover:ring-4 hover:ring-orange-200 transition-all"
                                    :src="profilePictureArtist" 
                                    alt="Artist profile"
                                    @click="goToArtistProfile(userById.id)">
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <h3 @click="goToArtistProfile(userById.id)"
                                    class="text-lg sm:text-xl font-semibold text-gray-900 hover:text-orange-500 cursor-pointer transition-colors">
                                    {{ userById.username }}
                                </h3>
                                <font-awesome-icon v-if="userById.is_verified" 
                                    icon="fa-solid fa-check-circle" 
                                    class="text-blue-500" />
                            </div>
                            <div class="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                <font-awesome-icon icon="fa-solid fa-users" />
                                <span>{{ followerCount || 0 }} followers</span>
                            </div>
                            <button v-if="userById.id !== user_current"
                                @click="followUser"
                                class="px-6 py-2 rounded-full font-medium transition-all text-sm sm:text-base"
                                :class="isFollowed
                                    ? 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                                    : 'bg-orange-500 text-white hover:bg-orange-600'">
                                <font-awesome-icon 
                                    :icon="isFollowed ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" 
                                    class="mr-2" />
                                {{ isFollowed ? 'Following' : 'Follow' }}
                            </button>
                        </div>
                    </div>

                    <!-- Overview Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">Overview</h2>
                        <div v-if="trackInfo.SongDetail?.bio" 
                            class="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">
                            {{ trackInfo.SongDetail.bio }}
                        </div>
                        <div v-else class="text-sm text-gray-400 italic">
                            No description available.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add to Playlist Modal -->
        <AddToPlaylistModal 
            :isOpen="isAddToPlaylistModalOpen"
            :song="selectedSongForPlaylist"
            @close="isAddToPlaylistModalOpen = false; selectedSongForPlaylist = null"
        />
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import Header from '@/components/Header.vue';
import { usePlayerStore } from '@/js/state';
import { formatDistanceToNow } from 'date-fns';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
import AddToPlaylistModal from '@/components/AddToPlaylistModal.vue';
import { notification } from 'ant-design-vue';

export default {
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        };
    },
    name: 'TracksInfoPage',
    data() {
        return {
            cmtSong: [],
            playVal: 0,
            id: null,
            commentValue: "",
            allCommentByUser: [],
            trackInfo: null,
            isUploader: false,
            user_current: null,
            user: null,
            userById: null,
            userByIdCMT: null,
            userComment: [],
            currentTimeFormated: "0:00",
            sortOrder: 'DESC',
            isLiked: false,
            isFollowed: false,
            followerCount: 0,
            follower: null,
            isAddToPlaylistModalOpen: false,
            selectedSongForPlaylist: null,
            genreList: [],
        }
    },
    mounted() {
        this.id = this.$route.params.id;

        if (this.id) {
            apiClient.get("/users/getCurrentUser").then(res => {
                this.user = res.data.data;
                this.user_current = this.user.id;
            });

            apiClient.get(`/song/getSongById/${this.id}`).then(res => {
                this.trackInfo = res.data.data;
                const user_id = this.trackInfo.uploader_id;

                if (this.trackInfo.uploader_id == this.user_current) {
                    this.isUploader = true;
                }
                
                // Check like status after trackInfo is loaded
                if (this.trackInfo && this.trackInfo.id) {
                    this.checkLikeStatus();
                }
                
                this.getUserById(user_id).then(() => {
                    // Check follow status after getting user info
                    this.checkFollowStatus();
                });
            })

            this.fetchComments();
            this.getUserFollower();
            this.getGenre();
        }
    },
    computed: {
        progressPercentage() {
            const isCurrentTrackInfoSong = this.playerStore.currentSong && this.trackInfo && this.playerStore.currentSong.id === this.trackInfo.id;

            const percentage =
                isCurrentTrackInfoSong && this.playerStore.currentSong.duration > 0
                    ? (this.playerStore.currentTime / this.playerStore.currentSong.duration) * 100
                    : 0;

            return {
                '--progressPlay': `${percentage}%`,
            };
        },
        profilePicture() {
            const profilePicture = this.user?.profile_picture;
            if (profilePicture) {
                return `${profilePicture}`;
            }
            return 'http://localhost:8080/images/other/Unknown_person.jpg';
        },
        profilePictureArtist() {
            const profilePicture = this.userById?.profile_picture;
            if (profilePicture) {
                return `${profilePicture}`;
            }
            return 'http://localhost:8080/images/other/Unknown_person.jpg';
        },
        genreName() {
            if (!this.trackInfo?.SongDetail?.genre) return null;
            const genreId = this.trackInfo.SongDetail.genre;
            const genre = this.genreList.find(g => g.id === genreId || g.id === Number(genreId));
            return genre ? genre.name : null;
        },
    },
    methods: {
        goToProfile() {
            const userId = getUserIdFromJWT();
            if (userId) {
                this.$router.push({ path: `/profile/${userId}` });
            }
        },
        goToArtistProfile(userId) {
            this.$router.push({ path: `/profile/${userId}` });
        },
        async getFollowerById() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId) return;
                try {
                    const res = await apiClient.get(`http://localhost:3000/api/follow/getFollowerById/${userId}`);
                    this.follower = res.data.data;
                    if (this.follower) {
                        this.isFollowed = true;
                    }
                    else {
                        this.isFollowed = false;
                    }

                } catch (error) {
                    console.error("Failed to fetch followers:", error);
                }
            } catch (error) {
                console.error("Failed to fetch followers:", error);
            }
        },
        async checkFollowStatus() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId || !this.userById) return;
                const response = await apiClient.get('/follow/getFollowStatus', {
                    params: {
                        follower_id: userId,
                        following_id: this.userById.id
                    }
                });
                this.isFollowed = response.data.data.isFollowing;
            } catch (error) {
                console.error("Failed to check follow status:", error);
            }
        },
        async followUser() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId) return;
                const payload = {
                    following_id: this.userById.id,
                    follower_id: userId
                }

                if (this.isFollowed) {
                    await apiClient.delete(`/follow/unfollow`, { data: payload });
                    this.followerCount--;
                } else {
                    await apiClient.post('/follow/addNewFollower', payload);
                    this.followerCount++;
                }

                this.isFollowed = !this.isFollowed;
            } catch (error) {
                console.error("Failed to follow/unfollow:", error);
            }
        },
        async getUserFollower() {
            try {
                if (!this.userById?.id) return;
                const res = await apiClient.get('/follow/getCountFollower', {
                    params: { id: this.userById.id }
                });
                this.followerCount = res.data.data;
            } catch (error) {
                console.error('Error fetching follower count:', error);
            }
        },
        addToPlaylist(song) {
            this.selectedSongForPlaylist = song;
            this.isAddToPlaylistModalOpen = true;
        },
        async checkLikeStatus() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId || !this.trackInfo || !this.trackInfo.id) {
                    console.warn('Cannot check like status: missing userId or trackInfo');
                    return;
                }
                
                const response = await apiClient.get('http://localhost:3000/api/like/getLikeStatus', {
                    params: {
                        user_id: userId,
                        song_id: this.trackInfo.id
                    }
                });
                
                console.log('Like status response:', response.data);
                this.isLiked = response.data.isLiked || false;
                console.log('isLiked set to:', this.isLiked);
            } catch (error) {
                console.error('Error checking like status:', error);
                this.isLiked = false;
            }
        },
        async toggleLike(songId) {
            const userId = getUserIdFromJWT();
            if (!userId) {
                notification.warning({
                    message: 'Login Required',
                    description: 'Please log in to like songs.',
                    duration: 3,
                });
                return;
            }

            try {
                const payload = {
                    song_id: songId,
                    user_id: userId
                }
                await apiClient.post(`/like/toggleLike`, payload);

                this.isLiked = !this.isLiked;

                if (this.isLiked) {
                    this.trackInfo.SongDetail.likes++;
                } else {
                    this.trackInfo.SongDetail.likes--;
                }

                notification.success({
                    message: this.isLiked ? 'Liked' : 'Unliked',
                    description: this.isLiked 
                        ? `Added "${this.trackInfo.title}" to your likes.`
                        : `Removed "${this.trackInfo.title}" from your likes.`,
                    duration: 2,
                });
            } catch (error) {
                console.error('Error toggling like:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to update like status. Please try again.',
                    duration: 3,
                });
            }
        },
        togglePlay() {
            const playerStore = usePlayerStore();

            const isCurrentTrackInPlayer = playerStore.currentSong && this.trackInfo && playerStore.currentSong.id === this.trackInfo.id;

            if (isCurrentTrackInPlayer) {
                if (playerStore.isPlaying) {
                    playerStore.pause();
                } else {
                    playerStore.resume();
                }
            } else {
                playerStore.play({
                    id: this.trackInfo.id,
                    title: this.trackInfo.title,
                    artwork: this.trackInfo.artwork,
                    username: this.trackInfo.User?.username || 'Unknown Artist',
                    duration: this.trackInfo.SongDetail?.duration || 0,
                    path: this.trackInfo.path,
                });
                playerStore.logUserListen(this.trackInfo.id);
                playerStore.currentPlayIndex = 0;
            }
        },
        async fetchComments() {
            try {
                const id = this.$route.params.id;
                const response = await apiClient.get(`/comment/getAllComment/${id}?time=${this.sortOrder}`);
                this.cmtSong = response.data.data;
                console.log("Fetched comments:", this.cmtSong);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        },
        async getUserById(user_id) {
            await apiClient.get(`/users/getUserById/${user_id}`).then(res => {
                this.userById = res.data.data;
                this.userByIdCMT = this.userById.id;
                // Fetch follower count after getting user info
                this.getUserFollower();
            });
        },
        async followById() {
            try {
                await apiClient.post('/follow/addNewFollower', this.user_current);
            } catch (error) {
                console.log(error);
            }
        },
        async commentSong() {
            if (!this.commentValue || !this.commentValue.trim()) {
                notification.warning({
                    message: 'Empty Comment',
                    description: 'Please enter a comment.',
                    duration: 2,
                });
                return;
            }

            try {
                const data = {
                    user_id: Number(this.user_current),
                    content: this.commentValue.trim(),
                    parent_id: null,
                };
                const res = await apiClient.post(`/comment/addNewCommentToSong/${this.id}`, data);
                const newComment = res.data.data;
                newComment.user = {
                    ...this.user,
                };
                console.log(newComment);
                this.cmtSong.unshift(newComment);
                this.commentValue = "";

                notification.success({
                    message: 'Comment Added',
                    description: 'Your comment has been posted.',
                    duration: 2,
                });
            } catch (error) {
                console.log(error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to post comment. Please try again.',
                    duration: 3,
                });
            }
        },
        updateProgress(value = this.volumeVal) {
            if (!this.playerStore.currentSong || !this.playerStore.currentSong.duration) return;

            const validValue = Math.max(0, Math.min(value, this.playerStore.currentSong.duration));

            if (this.playerStore.audio) {
                this.playerStore.audio.currentTime = validValue;
                this.playerStore.currentTime = validValue;
            }
        },
        formatDate(dateString) {
            if (!dateString) return "Invalid date";
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        formatGenre(genre) {
            if (!genre) return "null";
            return `#${genre}`;
        },
        formatDuration(duration) {
            if (!duration || isNaN(duration)) return "0:00";
            const roundedSeconds = Math.round(duration);
            const min = Math.floor(roundedSeconds / 60);
            const sec = roundedSeconds % 60;
            return `${min}:${sec.toString().padStart(2, "0")}`;
        },
        formatTime(timestamp) {
            return formatDistanceToNow(new Date(timestamp), {
                addSuffix: true,
            })
        },
        updateProgressPlay(value) {
            const isCurrentTrackInfoSong = this.playerStore.currentSong && this.trackInfo && this.playerStore.currentSong.id === this.trackInfo.id;

            if (isCurrentTrackInfoSong && this.playerStore.currentSong.duration > 0 && this.playerStore.audio) {
                const validValue = parseFloat(value);
                this.playerStore.audio.currentTime = validValue;
            }
        },
        async getGenre() {
            try {
                const response = await apiClient.get('/songdetail/getGenre');
                this.genreList = response.data.data;
            } catch (error) {
                console.error('Error getting genres:', error);
            }
        },
    },
    watch: {
        trackInfo: {
            handler(newValue) {
                if (newValue) {
                    document.title = `${newValue.title} - Musica`;
                }
            },
            immediate: true
        }
    },
    components: {
        Header,
        AddToPlaylistModal,
    },
}
</script>

<style scoped>
.playSlider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, 
        rgb(249, 115, 22) 0%, 
        rgb(249, 115, 22) var(--progressPlay, 0%), 
        rgba(255, 255, 255, 0.3) var(--progressPlay, 0%), 
        rgba(255, 255, 255, 0.3) 100%);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
}

.playSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
}

.playSlider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

.playSlider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.playSlider:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Smooth transitions */
* {
    transition: all 0.2s ease;
}
</style>
