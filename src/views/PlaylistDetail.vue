<template>
    <div class="min-h-screen bg-gray-50">
        <Header></Header>
        <div v-if="playlist" class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-8 sm:mb-12 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div class="flex flex-col md:flex-row gap-6">
                    <!-- Playlist Artwork -->
                    <div class="flex-shrink-0 w-full md:w-64 md:h-64">
                        <div class="aspect-square rounded-xl overflow-hidden shadow-xl">
                            <img v-if="playlist.artwork" 
                                :src="playlist.artwork" 
                                :alt="playlist.name"
                                class="w-full h-full object-cover">
                            <div v-else class="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                <font-awesome-icon icon="fa-solid fa-music" class="text-white text-6xl sm:text-8xl" />
                            </div>
                        </div>
                    </div>

                    <!-- Playlist Info -->
                    <div class="flex-grow flex flex-col justify-end">
                        <div class="mb-4">
                            <h1 class="text-left text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                                {{ playlist.name }}
                            </h1>
                            <div v-if="playlist.creator" class="flex items-center gap-2 mb-4">
                                <img v-if="playlist.creator.profile_picture" 
                                    :src="playlist.creator.profile_picture" 
                                    class="w-8 h-8 rounded-full object-cover"
                                    :alt="playlist.creator.username">
                                <span class="text-gray-600">Created by {{ playlist.creator.username }}</span>
                            </div>
                            <p class="text-left text-gray-500">{{ playlist.Songs?.length || 0 }} songs</p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap items-center gap-3">
                            <button @click="playPlaylist" 
                                class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                <font-awesome-icon icon="fa-solid fa-play" />
                                <span>Play</span>
                            </button>
                            <button v-if="isOwner" @click="openEditModal" 
                                class="px-6 py-3 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700 rounded-full font-medium transition-all flex items-center gap-2">
                                <font-awesome-icon icon="fa-solid fa-pencil" />
                                <span>Edit</span>
                            </button>
                            <button v-if="isOwner" @click="confirmDelete" 
                                class="px-6 py-3 border-2 border-red-300 hover:border-red-500 hover:text-red-500 text-red-600 rounded-full font-medium transition-all flex items-center gap-2">
                                <font-awesome-icon icon="fa-solid fa-trash" />
                                <span>Delete</span>
                            </button>
                            <button @click="shufflePlaylist" 
                                class="px-6 py-3 border-2 rounded-full font-medium transition-all flex items-center gap-2"
                                :class="isShuffled 
                                    ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-600' 
                                    : 'border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700'">
                                <font-awesome-icon icon="fa-solid fa-shuffle" />
                                <span>Shuffle</span>
                            </button>
                            <button @click="repeatPlaylist" 
                                class="px-6 py-3 border-2 rounded-full font-medium transition-all flex items-center gap-2"
                                :class="isRepeating 
                                    ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-600' 
                                    : 'border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700'">
                                <font-awesome-icon icon="fa-solid fa-repeat" />
                                <span>Repeat</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Songs List -->
            <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Songs</h2>
                
                <div v-if="songs && songs.length > 0" class="space-y-2">
                    <div v-for="(song) in songs" :key="song.id"
                        class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300">
                        <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
                            <img class="w-full h-full rounded-lg object-cover" 
                                :src="song.artwork || defaultImage" 
                                :alt="song.title">
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer"
                                @click="playSong(song)">
                                <font-awesome-icon 
                                    :icon="Number(playerStore.currentSong?.id) === Number(song.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                    class="text-white text-sm" />
                            </div>
                        </div>
                        <div class="flex-grow min-w-0 text-left">
                            <div @click="goToTrack(song.id)"
                                class="font-semibold text-sm sm:text-base text-gray-900 hover:text-orange-500 transition-colors cursor-pointer truncate mb-1">
                                {{ song.title }}
                            </div>
                            <div class="text-xs sm:text-sm text-gray-600 truncate">
                                {{ getSongArtist(song) }}
                            </div>
                        </div>
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <button @click.stop="playSong(song)"
                                class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                <font-awesome-icon
                                    :icon="Number(playerStore.currentSong?.id) === Number(song.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                    class="text-xs sm:text-sm" />
                            </button>
                            <button v-if="isOwner" @click.stop="removeSongFromPlaylist(song.id)"
                                class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-trash" class="text-xs sm:text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="h-48 flex flex-col justify-center items-center py-8">
                    <font-awesome-icon icon="fa-solid fa-music" class="text-gray-300 text-4xl mb-3" />
                    <div class="text-base text-gray-500 text-center px-4">This playlist is empty.</div>
                </div>
            </div>
        </div>

        <div v-if="isEditModalOpen" 
            class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
            @click.self="closeEditModal">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Edit Playlist</h2>
                    <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700 transition-colors">
                        <font-awesome-icon icon="fa-solid fa-times" class="text-xl" />
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Playlist Name</label>
                        <input v-model="editPlaylistName" 
                            type="text" 
                            placeholder="Enter playlist name"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base">
                    </div>
                    <div class="flex justify-end gap-3">
                        <button @click="closeEditModal"
                            class="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Cancel
                        </button>
                        <button @click="updatePlaylist"
                            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
import { usePlayerStore } from '@/js/state';
import { notification } from 'ant-design-vue';

export default {
    name: 'PlaylistDetailPage',
    components: {
        Header,
    },
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        };
    },
    data() {
        return {
            playlist: null,
            playlistId: null,
            isLoading: false,
            isEditModalOpen: false,
            editPlaylistName: '',
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            isShuffled: false,
            isRepeating: false,
        }
    },
    computed: {
        songs() {
            return this.playlist?.Songs || [];
        },
        isOwner() {
            const userId = getUserIdFromJWT();
            return userId && this.playlist?.creator_id === Number(userId);
        },
    },
    mounted() {
        this.playlistId = this.$route.params.id;
        if (this.playlistId) {
            this.fetchPlaylistDetail();
        }
    },
    methods: {
        async fetchPlaylistDetail() {
            this.isLoading = true;
            try {
                const response = await apiClient.get(`http://localhost:3000/api/playlist/getPlaylistById/${this.playlistId}`);
                this.playlist = response.data.data;
                this.editPlaylistName = this.playlist.name;
            } catch (error) {
                console.error('Error fetching playlist detail:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load playlist. Please try again later.',
                    duration: 4,
                });
            } finally {
                this.isLoading = false;
            }
        },
        getSongArtist(song) {
            if (song.User?.username) return song.User.username;
            if (song.username) return song.username;
            return 'Unknown Artist';
        },
        playSong(song) {
            const currentSongId = Number(this.playerStore.currentSong?.id);
            const songId = Number(song.id);
            
            if (currentSongId === songId && !isNaN(currentSongId) && !isNaN(songId)) {
                if (this.playerStore.isPlaying) {
                    this.playerStore.pause();
                } else {
                    this.playerStore.resume();
                }
            } else {
                // Load all songs from playlist into playerStore first
                let playlistSongs = this.songs.map(s => ({
                    id: s.id,
                    title: s.title,
                    artwork: s.artwork,
                    username: this.getSongArtist(s),
                    duration: s.SongDetail?.duration || s.duration || 0,
                    path: s.path,
                }));
                
                // Shuffle if enabled
                if (this.isShuffled) {
                    playlistSongs = this.shuffleArray([...playlistSongs]);
                }
                
                // Set playlist in playerStore
                this.playerStore.playlist = playlistSongs;
                this.playerStore.isShuffle = this.isShuffled;
                this.playerStore.isRepeatOne = this.isRepeating;
                
                // Find the index of the selected song in the playlist
                const songIndex = playlistSongs.findIndex(s => s.id === song.id);
                if (songIndex !== -1) {
                    this.playerStore.currentPlayIndex = songIndex;
                }
                
                // Play the selected song
                this.playerStore.play({
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    username: this.getSongArtist(song),
                    duration: song.SongDetail?.duration || song.duration || 0,
                    path: song.path,
                });
            }
        },
        playPlaylist() {
            if (this.songs && this.songs.length > 0) {
                // Load all songs from playlist into playerStore first
                let playlistSongs = this.songs.map(song => {
                    const mappedSong = {
                        id: song.id,
                        title: song.title,
                        artwork: song.artwork,
                        username: this.getSongArtist(song),
                        duration: song.SongDetail?.duration || song.duration || 0,
                        path: song.path,
                    };
                    return mappedSong;
                });
                
                // Shuffle if enabled
                if (this.isShuffled) {
                    playlistSongs = this.shuffleArray([...playlistSongs]);
                }
                
                // Set playlist in playerStore FIRST
                this.playerStore.playlist = playlistSongs;
                this.playerStore.currentPlayIndex = 0;
                this.playerStore.isShuffle = this.isShuffled;
                this.playerStore.isRepeatOne = this.isRepeating;
                
                // Play first song directly using playerStore.play() instead of playSong()
                const firstSong = playlistSongs[0];
                
                if (firstSong && firstSong.path) {
                    this.playerStore.play(firstSong);
                } else {
                    console.error('First song is invalid:', firstSong);
                    notification.error({
                        message: 'Error',
                        description: 'Cannot play song. Song data is invalid.',
                        duration: 3,
                    });
                }
            } else {
                console.warn('No songs in playlist');
                notification.warning({
                    message: 'Empty Playlist',
                    description: 'This playlist has no songs to play.',
                    duration: 3,
                });
            }
        },
        shufflePlaylist() {
            this.isShuffled = !this.isShuffled;
            
            if (this.isShuffled) {
                notification.success({
                    message: 'Shuffle Enabled',
                    description: 'Playlist will be shuffled when played.',
                    duration: 2,
                });
            } else {
                notification.info({
                    message: 'Shuffle Disabled',
                    description: 'Playlist will play in original order.',
                    duration: 2,
                });
            }
            
            // If playlist is currently playing, update the shuffle state
            if (this.playerStore.playlist.length > 0 && this.playerStore.currentSong) {
                this.playerStore.isShuffle = this.isShuffled;
            }
        },
        repeatPlaylist() {
            this.isRepeating = !this.isRepeating;
            
            if (this.isRepeating) {
                notification.success({
                    message: 'Repeat Enabled',
                    description: 'Playlist will repeat when finished.',
                    duration: 2,
                });
            } else {
                notification.info({
                    message: 'Repeat Disabled',
                    description: 'Playlist will stop when finished.',
                    duration: 2,
                });
            }
            
            // Update repeat state in playerStore
            this.playerStore.isRepeatOne = this.isRepeating;
        },
        shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },
        goToTrack(trackId) {
            this.$router.push({ path: `/trackinfo/${trackId}` });
        },
        openEditModal() {
            this.isEditModalOpen = true;
            this.editPlaylistName = this.playlist.name;
        },
        closeEditModal() {
            this.isEditModalOpen = false;
        },
        async updatePlaylist() {
            if (!this.editPlaylistName || !this.editPlaylistName.trim()) {
                notification.warning({
                    message: 'Validation Error',
                    description: 'Please enter a playlist name.',
                    duration: 3,
                });
                return;
            }

            try {
                await apiClient.put(`http://localhost:3000/api/playlist/updatePlaylist/${this.playlistId}`, {
                    name: this.editPlaylistName.trim(),
                });

                notification.success({
                    message: 'Success',
                    description: 'Playlist updated successfully!',
                    duration: 3,
                });

                this.closeEditModal();
                this.fetchPlaylistDetail();
            } catch (error) {
                console.error('Error updating playlist:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to update playlist. Please try again.',
                    duration: 4,
                });
            }
        },
        confirmDelete() {
            if (confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
                this.deletePlaylist();
            }
        },
        async deletePlaylist() {
            try {
                await apiClient.delete(`http://localhost:3000/api/playlist/deletePlaylist/${this.playlistId}`);

                notification.success({
                    message: 'Success',
                    description: 'Playlist deleted successfully!',
                    duration: 3,
                });

                this.$router.push({ path: '/playlists' });
            } catch (error) {
                console.error('Error deleting playlist:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to delete playlist. Please try again.',
                    duration: 4,
                });
            }
        },
        async removeSongFromPlaylist(songId) {
            try {
                await apiClient.delete('http://localhost:3000/api/playlist/removeSongFromPlaylist', {
                    data: {
                        playlist_id: this.playlistId,
                        song_id: songId,
                    }
                });

                notification.success({
                    message: 'Success',
                    description: 'Song removed from playlist.',
                    duration: 2,
                });

                this.fetchPlaylistDetail();
            } catch (error) {
                console.error('Error removing song from playlist:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to remove song. Please try again.',
                    duration: 3,
                });
            }
        },
    },
}
</script>

<style scoped>
/* Smooth transitions */
* {
    transition: all 0.2s ease;
}
</style>

