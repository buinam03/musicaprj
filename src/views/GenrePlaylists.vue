<template>
    <div class="min-h-screen bg-gray-50">
        <Header></Header>
        <div class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    Playlists by Genre
                </h1>
                <p class="text-gray-600 text-sm sm:text-base mt-2">
                    Discover curated playlists for every genre
                </p>
            </div>

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
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="h-64 sm:h-80 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                <font-awesome-icon icon="fa-solid fa-music" class="text-gray-300 text-5xl sm:text-6xl mb-4" />
                <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4">
                    Playlist not found
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
import { notification } from 'ant-design-vue';

export default {
    name: 'GenrePlaylistsPage',
    components: {
        Header,
    },
    data() {
        return {
            playlists: [],
            isLoading: true,
        }
    },
    mounted() {
        this.fetchPlaylists();
    },
    methods: {
        async fetchPlaylists() {
            this.isLoading = true;
            try {
                const response = await apiClient.get('/playlist/getAllPlaylistCMS');
                this.playlists = response.data.data || [];
                console.log('CMS Playlists:', this.playlists);
            } catch (error) {
                console.error('Error fetching CMS playlists:', error);
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
    },
}
</script>

<style scoped>
/* Smooth transitions */
* {
    transition: all 0.2s ease;
}
</style>

