<template>
    <div v-if="isOpen" 
        class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Add to Playlist</h2>
                <button @click="closeModal" class="text-gray-500 hover:text-gray-700 transition-colors">
                    <font-awesome-icon icon="fa-solid fa-times" class="text-xl" />
                </button>
            </div>

            <!-- Playlist List -->
            <div class="flex-1 overflow-y-auto p-4">
                <div v-if="isLoadingPlaylists" class="flex justify-center items-center py-8">
                    <font-awesome-icon icon="fa-solid fa-spinner" class="text-orange-500 text-2xl animate-spin" />
                </div>
                <div v-else-if="playlists && playlists.length > 0" class="space-y-2">
                    <div v-for="playlist in playlists" :key="playlist.id"
                        @click="addSongToPlaylist(playlist.id)"
                        class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group">
                        <div class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                            <img v-if="playlist.artwork" 
                                :src="playlist.artwork" 
                                class="w-full h-full object-cover"
                                :alt="playlist.name">
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <font-awesome-icon icon="fa-solid fa-music" class="text-white text-lg" />
                            </div>
                        </div>
                        <div class="flex-grow min-w-0">
                            <h3 class="font-semibold text-gray-900 truncate">{{ playlist.name }}</h3>
                            <p class="text-sm text-gray-500">{{ playlist.Songs?.length || 0 }} songs</p>
                        </div>
                        <div class="flex-shrink-0">
                            <font-awesome-icon icon="fa-solid fa-plus" 
                                class="text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                    <font-awesome-icon icon="fa-solid fa-notes-medical" class="text-4xl mb-3 text-gray-300" />
                    <p>No playlists found. Create one first!</p>
                </div>
            </div>

            <!-- Footer with Create New Button -->
            <div class="border-t border-gray-200 p-4 flex-shrink-0">
                <button @click="openCreateModal"
                    class="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                    <span>Create New Playlist</span>
                </button>
            </div>
        </div>

        <!-- Create Playlist Modal -->
        <div v-if="isCreateModalOpen" 
            class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[60] p-4"
            @click.self="closeCreateModal">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Create New Playlist</h2>
                    <button @click="closeCreateModal" class="text-gray-500 hover:text-gray-700 transition-colors">
                        <font-awesome-icon icon="fa-solid fa-times" class="text-xl" />
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <input v-model="newPlaylistName" 
                            type="text" 
                            placeholder="Enter playlist name"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base"
                            @keyup.enter="createPlaylistAndAdd">
                    </div>
                    <div class="flex justify-end gap-3">
                        <button @click="closeCreateModal"
                            class="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Cancel
                        </button>
                        <button @click="createPlaylistAndAdd"
                            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md">
                            Create & Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
import { notification } from 'ant-design-vue';

export default {
    name: 'AddToPlaylistModal',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        song: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            playlists: [],
            isLoadingPlaylists: false,
            isCreateModalOpen: false,
            newPlaylistName: '',
        }
    },
    watch: {
        isOpen(newVal) {
            if (newVal) {
                this.fetchPlaylists();
            }
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        async fetchPlaylists() {
            this.isLoadingPlaylists = true;
            try {
                const userId = getUserIdFromJWT();
                if (!userId) return;
                
                const response = await apiClient.get(`http://localhost:3000/api/playlist/getPlaylistsByUserId/${userId}`);
                this.playlists = response.data.data || [];
            } catch (error) {
                console.error('Error fetching playlists:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load playlists.',
                    duration: 3,
                });
            } finally {
                this.isLoadingPlaylists = false;
            }
        },
        async addSongToPlaylist(playlistId) {
            if (!this.song || !this.song.id) {
                notification.error({
                    message: 'Error',
                    description: 'Invalid song data.',
                    duration: 3,
                });
                return;
            }

            try {
                await apiClient.post('http://localhost:3000/api/playlist/addSongToPlaylist', {
                    playlist_id: playlistId,
                    song_id: this.song.id,
                });

                notification.success({
                    message: 'Success',
                    description: 'Song added to playlist successfully!',
                    duration: 3,
                });

                this.closeModal();
            } catch (error) {
                console.error('Error adding song to playlist:', error);
                const errorMessage = error.response?.data?.message || 'Failed to add song to playlist.';
                notification.error({
                    message: 'Error',
                    description: errorMessage,
                    duration: 4,
                });
            }
        },
        openCreateModal() {
            this.isCreateModalOpen = true;
            this.newPlaylistName = '';
        },
        closeCreateModal() {
            this.isCreateModalOpen = false;
            this.newPlaylistName = '';
        },
        async createPlaylistAndAdd() {
            if (!this.newPlaylistName || !this.newPlaylistName.trim()) {
                notification.warning({
                    message: 'Validation Error',
                    description: 'Please enter a playlist name.',
                    duration: 3,
                });
                return;
            }

            if (!this.song || !this.song.id) {
                notification.error({
                    message: 'Error',
                    description: 'Invalid song data.',
                    duration: 3,
                });
                return;
            }

            try {
                const userId = getUserIdFromJWT();
                if (!userId) {
                    notification.error({
                        message: 'Error',
                        description: 'Please log in to create a playlist.',
                        duration: 3,
                    });
                    return;
                }

                // Create playlist
                const createResponse = await apiClient.post('http://localhost:3000/api/playlist/createNewPlaylist', {
                    name: this.newPlaylistName.trim(),
                    creator_id: userId,
                });

                const newPlaylistId = createResponse.data.data.id;

                // Add song to the newly created playlist
                await apiClient.post('http://localhost:3000/api/playlist/addSongToPlaylist', {
                    playlist_id: newPlaylistId,
                    song_id: this.song.id,
                });

                notification.success({
                    message: 'Success',
                    description: 'Playlist created and song added successfully!',
                    duration: 3,
                });

                this.closeCreateModal();
                this.closeModal();
                // Refresh playlists
                this.fetchPlaylists();
            } catch (error) {
                console.error('Error creating playlist and adding song:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to create playlist. Please try again.',
                    duration: 4,
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

