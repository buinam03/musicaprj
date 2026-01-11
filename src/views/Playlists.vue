<template>
    <div class="min-h-screen bg-gray-50">
        <Header></Header>
        <div class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-6 sm:mb-8 flex justify-between items-center">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    Playlists
                </h1>
                <button @click="openCreateModal" 
                    class="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                    <span class="hidden sm:inline">Create Playlist</span>
                </button>
            </div>

            <!-- Playlists by Genre Section -->
            <section class="mb-12 sm:mb-16">
                <div class="flex justify-between items-center mb-6 sm:mb-8">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">PLAYLISTS BY GENRE</h2>
                    <router-link to="/playlists/genre"
                        class="px-4 sm:px-6 py-2 text-sm sm:text-base text-orange-500 hover:text-orange-600 font-medium transition-colors flex items-center gap-2">
                        <span>View All</span>
                        <font-awesome-icon icon="fa-solid fa-arrow-right" />
                    </router-link>
                </div>

                <!-- Loading State for Genre Playlists -->
                <div v-if="isLoadingGenrePlaylists" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-md p-4">
                        <div class="aspect-square bg-gray-200 animate-pulse rounded-lg mb-3"></div>
                        <div class="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div class="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                    </div>
                </div>

                <!-- Genre Playlists Grid -->
                <div v-else-if="genrePlaylists && genrePlaylists.length > 0" 
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    <div v-for="playlist in genrePlaylists.slice(0, 6)" :key="playlist.id"
                        class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        @click="goToPlaylistDetail(playlist.id)">
                        <div class="aspect-square relative overflow-hidden rounded-t-xl">
                            <img v-if="playlist.artwork" 
                                :src="playlist.artwork" 
                                :alt="playlist.name"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                            <div v-else class="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                <font-awesome-icon icon="fa-solid fa-music" class="text-white text-4xl sm:text-5xl" />
                            </div>
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div class="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 hover:bg-orange-600 flex justify-center items-center rounded-full shadow-lg transform transition-transform hover:scale-110">
                                    <font-awesome-icon icon="fa-solid fa-play" class="text-white text-lg sm:text-xl" />
                                </div>
                            </div>
                        </div>
                        <div class="p-3 sm:p-4">
                            <h3 class="font-semibold text-sm sm:text-base text-gray-900 truncate mb-1">
                                {{ playlist.name }}
                            </h3>
                        </div>
                    </div>
                </div>

                <!-- Empty State for Genre Playlists -->
                <div v-else class="h-40 sm:h-48 w-full flex flex-col justify-center items-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                    <font-awesome-icon icon="fa-solid fa-music" class="text-gray-400 text-4xl mb-3" />
                    <div class="text-base sm:text-lg text-gray-500 text-center px-4">Playlist not found</div>
                </div>
            </section>

            <!-- Loading State -->
            <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                <div v-for="i in 12" :key="i" class="bg-white rounded-xl shadow-md p-4">
                    <div class="aspect-square bg-gray-200 animate-pulse rounded-lg mb-3"></div>
                    <div class="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div class="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                </div>
            </div>

            <!-- Playlists Grid -->
            <div v-else-if="playlists && playlists.length > 0" 
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                <div v-for="playlist in playlists" :key="playlist.id"
                    class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    @click="goToPlaylistDetail(playlist.id)">
                    <div class="aspect-square relative overflow-hidden rounded-t-xl">
                        <img v-if="playlist.artwork" 
                            :src="playlist.artwork" 
                            :alt="playlist.name"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                        <div v-else class="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                            <font-awesome-icon icon="fa-solid fa-music" class="text-white text-4xl sm:text-5xl" />
                        </div>
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 hover:bg-orange-600 flex justify-center items-center rounded-full shadow-lg transform transition-transform hover:scale-110">
                                <font-awesome-icon icon="fa-solid fa-play" class="text-white text-lg sm:text-xl" />
                            </div>
                        </div>
                    </div>
                    <div class="p-3 sm:p-4">
                        <h3 class="font-semibold text-sm sm:text-base text-gray-900 truncate mb-1">
                            {{ playlist.name }}
                        </h3>
                        <p class="text-xs sm:text-sm text-gray-500 truncate">
                            {{ playlist.Songs?.length || 0 }} songs
                        </p>
                        <div v-if="playlist.creator" class="flex items-center gap-2 mt-2">
                            <img v-if="playlist.creator.profile_picture" 
                                :src="playlist.creator.profile_picture" 
                                class="w-5 h-5 rounded-full object-cover"
                                :alt="playlist.creator.username">
                            <span class="text-xs text-gray-600 truncate">
                                {{ playlist.creator.username }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="h-64 sm:h-80 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                <font-awesome-icon icon="fa-solid fa-notes-medical" class="text-gray-300 text-5xl sm:text-6xl mb-4" />
                <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4 mb-4">
                    No playlists found. Create your first playlist!
                </div>
                <button @click="openCreateModal" 
                    class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                    Create Playlist
                </button>
            </div>
        </div>

        <!-- Create Playlist Modal -->
        <div v-if="isCreateModalOpen" 
            class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
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
                            @keyup.enter="createPlaylist">
                    </div>
                    <div class="flex justify-end gap-3">
                        <button @click="closeCreateModal"
                            class="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Cancel
                        </button>
                        <button @click="createPlaylist"
                            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md">
                            Create
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
import { notification } from 'ant-design-vue';

export default {
    name: 'PlaylistsPage',
    components: {
        Header,
    },
    data() {
        return {
            playlists: [],
            isLoading: false,
            isCreateModalOpen: false,
            newPlaylistName: '',
            genrePlaylists: [],
            isLoadingGenrePlaylists: true,
        }
    },
    mounted() {
        this.fetchPlaylists();
        this.fetchGenrePlaylists();
    },
    methods: {
        async fetchPlaylists() {
            this.isLoading = true;
            try {
                const response = await apiClient.get(`http://localhost:3000/api/playlist/getPlaylistsByUserId/${getUserIdFromJWT()}`);
                this.playlists = response.data.data || [];
            } catch (error) {
                console.error('Error fetching playlists:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load playlists. Please try again later.',
                    duration: 4,
                });
            } finally {
                this.isLoading = false;
            }
        },
        goToPlaylistDetail(playlistId) {
            this.$router.push({ path: `/playlist/${playlistId}` });
        },
        openCreateModal() {
            this.isCreateModalOpen = true;
            this.newPlaylistName = '';
        },
        closeCreateModal() {
            this.isCreateModalOpen = false;
            this.newPlaylistName = '';
        },
        async createPlaylist() {
            if (!this.newPlaylistName || !this.newPlaylistName.trim()) {
                notification.warning({
                    message: 'Validation Error',
                    description: 'Please enter a playlist name.',
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

                await apiClient.post('http://localhost:3000/api/playlist/createNewPlaylist', {
                    name: this.newPlaylistName.trim(),
                    creator_id: userId,
                });

                notification.success({
                    message: 'Success',
                    description: 'Playlist created successfully!',
                    duration: 3,
                });

                this.closeCreateModal();
                this.fetchPlaylists();
            } catch (error) {
                console.error('Error creating playlist:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to create playlist. Please try again.',
                    duration: 4,
                });
            }
        },
        async fetchGenrePlaylists() {
            this.isLoadingGenrePlaylists = true;
            try {
                const response = await apiClient.get('/playlist/getPlaylistCMS');
                this.genrePlaylists = response.data.data.slice(0, 6) || [];
            } catch (error) {
                console.error('Error fetching genre playlists:', error);
                this.genrePlaylists = [];
            } finally {
                this.isLoadingGenrePlaylists = false;
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

