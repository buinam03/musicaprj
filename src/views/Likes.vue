<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Header></Header>
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                    <span v-if="user">{{ user.username }}'s Liked Songs</span>
                    <span v-else>Liked Songs</span>
                </h1>
                <p v-if="songs && songs.length > 0" class="text-gray-500 text-sm sm:text-base">
                    {{ songs.length }} {{ songs.length === 1 ? 'song' : 'songs' }}
                </p>
            </div>

            <!-- Songs List -->
            <div v-if="songs && songs.length > 0" class="bg-white rounded-2xl shadow-xl overflow-hidden">
                <!-- Desktop Table View -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Track</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Length</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                </th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr 
                                v-for="(item, index) in songs" 
                                :key="index" 
                                class="hover:bg-orange-50 transition-colors duration-150"
                            >
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-4">
                                        <div class="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                            <img 
                                                :src="item.Song.artwork || defaultImage" 
                                                class="w-full h-full object-cover" 
                                                :alt="item.Song.title"
                                            >
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm sm:text-base font-semibold text-gray-900 truncate mb-1">
                                                {{ item.Song.title }}
                                            </div>
                                            <router-link 
                                                :to="`/profile/${item.Song.User.id}`"
                                                class="text-xs sm:text-sm text-gray-500 hover:text-orange-500 transition-colors"
                                            >
                                                {{ item.Song.User.username }}
                                            </router-link>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {{ formatTime(item.Song.SongDetail?.duration || 0) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {{ item.Song.SongDetail?.likes || 0 }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {{ item.Song.SongDetail?.plays || 0 }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex justify-center items-center gap-2">
                                        <!-- Play/Pause Button -->
                                        <button
                                            @click.stop="playToggle(index, item)"
                                            class="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                            :class="playerStore.currentPlayIndex === index && playerStore.isPlaying 
                                                ? 'border-orange-500 bg-orange-500 text-white' 
                                                : 'border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500'"
                                            :title="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'Pause' : 'Play'"
                                        >
                                            <font-awesome-icon
                                                :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                                class="text-sm"
                                            />
                                        </button>

                                        <!-- Like Button -->
                                        <button
                                            @click.stop="toggleLike(index, item.Song.id)"
                                            class="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                            :class="likedSongs.includes(item.Song.id) || item.isLiked
                                                ? 'border-red-500 bg-red-500 text-white' 
                                                : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'"
                                            :title="likedSongs.includes(item.Song.id) || item.isLiked ? 'Unlike' : 'Like'"
                                        >
                                            <font-awesome-icon icon="fa-solid fa-heart" class="text-sm" />
                                        </button>

                                        <!-- Add to Playlist Button -->
                                        <button
                                            @click.stop="addToPlaylist(index, item.Song)"
                                            class="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                            title="Add to playlist"
                                        >
                                            <font-awesome-icon icon="fa-solid fa-plus" class="text-sm" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Mobile Card View -->
                <div class="md:hidden divide-y divide-gray-200">
                    <div 
                        v-for="(item, index) in songs" 
                        :key="index"
                        class="p-4 hover:bg-orange-50 transition-colors duration-150"
                    >
                        <div class="flex items-center gap-3">
                            <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                <img 
                                    :src="item.Song.artwork || defaultImage"
                                    class="w-full h-full object-cover" 
                                    :alt="item.Song.title"
                                >
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-semibold text-gray-900 truncate mb-1">
                                    {{ item.Song.title }}
                                </div>
                                <router-link 
                                    :to="`/profile/${item.Song.User.id}`"
                                    class="text-xs text-gray-500 hover:text-orange-500 transition-colors block truncate"
                                >
                                    {{ item.Song.User.username }}
                                </router-link>
                                <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span>{{ formatTime(item.Song.SongDetail?.duration || 0) }}</span>
                                    <span class="flex items-center gap-1">
                                        <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
                                        {{ item.Song.SongDetail?.likes || 0 }}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                        {{ item.Song.SongDetail?.plays || 0 }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- Action Buttons Mobile -->
                        <div class="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                            <button
                                @click="playToggle(index, item)"
                                class="flex-1 py-2.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200"
                                :class="playerStore.currentPlayIndex === index && playerStore.isPlaying 
                                    ? 'border-orange-500 bg-orange-500 text-white' 
                                    : 'border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500'"
                            >
                                <font-awesome-icon
                                    :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                />
                                <span class="text-sm font-semibold">
                                    {{ playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'Pause' : 'Play' }}
                                </span>
                            </button>

                            <button
                                @click="toggleLike(index, item.Song.id)"
                                class="flex-1 py-2.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-200"
                                :class="likedSongs.includes(item.Song.id) || item.isLiked
                                    ? 'border-red-500 bg-red-500 text-white' 
                                    : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'"
                            >
                                <font-awesome-icon icon="fa-solid fa-heart" />
                                <span class="text-sm font-semibold">Like</span>
                            </button>

                            <button
                                @click="addToPlaylist(index, item.Song)"
                                class="flex-1 py-2.5 px-4 rounded-xl border-2 border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center gap-2 transition-all duration-200"
                            >
                                <font-awesome-icon icon="fa-solid fa-plus" />
                                <span class="text-sm font-semibold">Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500 text-4xl sm:text-5xl" />
                </div>
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    No Liked Songs Yet
                </h3>
                <p class="text-gray-500 text-sm sm:text-base mb-6">
                    {{ user ? user.username + " hasn't" : "You haven't" }} liked any tracks yet. Start discovering music!
                </p>
                <router-link 
                    to="/home"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <font-awesome-icon icon="fa-solid fa-music" />
                    Discover Music
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
import { usePlayerStore } from '@/js/state';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
import { notification } from 'ant-design-vue';

export default {
    name: 'LikesPage',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        };
    },
    data() {
        return {
            songs: null,
            likedSongs: [],
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
                notification.success({
                    message: 'Added to Playlist',
                    description: `"${song.title}" has been added to your playlist.`,
                    duration: 3,
                });
            } else {
                notification.info({
                    message: 'Already in Playlist',
                    description: `"${song.title}" is already in your playlist.`,
                    duration: 2,
                });
            }
        },
        async getUserById() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId) {
                    return;
                }
                const response = await apiClient.get(`http://localhost:3000/api/users/getUserById/${userId}`);
                this.user = response.data.data;
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        },
        async toggleLike(index, songId) {
            const userId = getUserIdFromJWT();
            if (!userId) {
                notification.warning({
                    message: 'Login Required',
                    description: 'Please log in to like songs.',
                    duration: 3,
                });
                return;
            }

            const song = this.songs.find(s => s.Song.id === songId);
            const wasLiked = this.likedSongs.includes(songId) || song?.isLiked;

            try {
                const payload = {
                    song_id: songId,
                    user_id: userId
                };
                
                await apiClient.post(`http://localhost:3000/api/like/toggleLike`, payload);
                
                if (!Array.isArray(this.likedSongs)) {
                    this.likedSongs = [];
                }
                
                if (this.likedSongs.includes(songId) || song?.isLiked) {
                    this.likedSongs = this.likedSongs.filter(id => id !== songId);
                    if (song) song.isLiked = false;
                } else {
                    this.likedSongs.push(songId);
                    if (song) song.isLiked = true;
                }

                notification.success({
                    message: wasLiked ? 'Unliked' : 'Liked',
                    description: wasLiked 
                        ? `Removed "${song?.Song.title || 'song'}" from your likes.`
                        : `Added "${song?.Song.title || 'song'}" to your likes.`,
                    duration: 2,
                });
                
            } catch (error) {
                console.error('Error toggling like:', error);
                notification.error({
                    message: 'Action Failed',
                    description: 'Failed to update like status. Please try again.',
                    duration: 4,
                });
            }
        },
        formatTime(time) {
            if (!time) return '0:00';
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        },
        async fetchLikes() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId) {
                    return;
                }

                const response = await apiClient.get(`http://localhost:3000/api/like/getSongLikeById`, {
                    params: {
                        user_id: userId,
                    }
                });

                this.songs = response.data.data || [];
                
                if (this.songs.length === 0) {
                    return;
                }

                // All songs in this list are already liked
                this.songs = this.songs.map(song => ({
                    ...song,
                    isLiked: true
                }));

                // Update likedSongs array
                this.likedSongs = this.songs.map(song => song.Song.id);
                    
            } catch (error) {
                console.error('Error fetching likes:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load liked songs. Please refresh the page.',
                    duration: 4,
                });
            }
        },
        playToggle(index, song) {
            const playerStore = this.playerStore;
            const username = song.Song.User?.username || "Unknown Artist";

            try {
                if (playerStore.currentPlayIndex === index) {
                    if (playerStore.isPlaying) {
                        playerStore.pause();
                    } else {
                        playerStore.resume();
                    }
                } else {
                    playerStore.play({
                        id: song.Song.id,
                        title: song.Song.title,
                        artwork: song.Song.artwork,
                        username: username,
                        duration: song.Song.SongDetail?.duration || 0,
                        path: song.Song.path,
                    });

                    playerStore.currentPlayIndex = index;
                }
            } catch (error) {
                console.error('Error playing song:', error);
                notification.error({
                    message: 'Playback Error',
                    description: 'Failed to play the song. Please try again.',
                    duration: 3,
                });
            }
        },
    },
    components: {
        Header,
    },
}
</script>

<style scoped></style>