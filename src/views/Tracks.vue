<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Header></Header>
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    My Tracks
                </h1>
                <div class="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button 
                        @click="deleteTracksById" 
                        class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        :disabled="!selectedTracks"
                    >
                        <font-awesome-icon icon="fa-solid fa-trash" />
                        <span class="hidden sm:inline">Delete</span>
                    </button>
                    <button 
                        @click="editTracks"
                        class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        :disabled="!selectedTracks"
                    >
                        <font-awesome-icon icon="fa-solid fa-pencil" />
                        <span class="hidden sm:inline">Edit</span>
                    </button>
                </div>
            </div>

            <!-- Tracks List -->
            <div v-if="songs && songs.length > 0" class="bg-white rounded-2xl shadow-xl overflow-hidden">
                <!-- Desktop Table View -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th class="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                                    <input 
                                        type="checkbox" 
                                        class="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 cursor-pointer"
                                        @change="toggleAllTracks"
                                        :checked="allSelected"
                                    >
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Track</th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Length</th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
                                </th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                </th>
                                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr 
                                v-for="(item, index) in songs" 
                                :key="index" 
                                class="hover:bg-orange-50 transition-colors duration-150 cursor-pointer"
                                @click="toggleTrackSelection(item.id)"
                            >
                                <td class="px-4 py-4 whitespace-nowrap" @click.stop>
                                    <input 
                                        @change="toggleTrackSelection(item.id)"
                                        :checked="selectedTracks === item.id"
                                        class="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 cursor-pointer" 
                                        type="checkbox"
                                    >
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-4">
                                        <div class="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                            <img 
                                                :src="item.artwork || defaultImage"
                                                class="w-full h-full object-cover" 
                                                :alt="item.title"
                                            >
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-sm sm:text-base font-semibold text-gray-900 truncate">
                                                {{ item.title }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-600">
                                    {{ formatTime(item.SongDetail?.duration || 0) }}
                                </td>
                                <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-600">
                                    {{ item.SongDetail?.likes || 0 }}
                                </td>
                                <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-600">
                                    {{ item.SongDetail?.plays || 0 }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span 
                                        class="px-3 py-1 text-xs font-semibold rounded-full"
                                        :class="item.is_public ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                    >
                                        {{ item.is_public ? 'Public' : 'Private' }}
                                    </span>
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
                        @click="toggleTrackSelection(item.id)"
                    >
                        <div class="flex items-center gap-3">
                            <input 
                                @change.stop="toggleTrackSelection(item.id)"
                                :checked="selectedTracks === item.id"
                                class="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 cursor-pointer flex-shrink-0" 
                                type="checkbox"
                            >
                            <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                <img 
                                    :src="item.artwork || defaultImage"
                                    class="w-full h-full object-cover" 
                                    :alt="item.title"
                                >
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-semibold text-gray-900 truncate mb-1">
                                    {{ item.title }}
                                </div>
                                <div class="flex items-center gap-3 text-xs text-gray-500">
                                    <span>{{ formatTime(item.SongDetail?.duration || 0) }}</span>
                                    <span class="flex items-center gap-1">
                                        <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
                                        {{ item.SongDetail?.likes || 0 }}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                        {{ item.SongDetail?.plays || 0 }}
                                    </span>
                                    <span 
                                        class="px-2 py-0.5 text-xs font-semibold rounded-full"
                                        :class="item.is_public ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                    >
                                        {{ item.is_public ? 'Public' : 'Private' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <font-awesome-icon icon="fa-solid fa-music" class="text-orange-500 text-4xl sm:text-5xl" />
                </div>
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    No Tracks Yet
                </h3>
                <p class="text-gray-500 text-sm sm:text-base mb-6">
                    You haven't uploaded any tracks yet. Start sharing your music!
                </p>
                <router-link 
                    to="/upload"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
                    Upload Your First Track
                </router-link>
            </div>
        </div>

        <!-- Edit Modal -->
        <div 
            v-if="isEditTracks && trackInfo"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            @click.self="isEditTracks = false"
        >
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 class="text-xl sm:text-2xl font-bold text-white">Edit Track</h2>
                    <button 
                        @click="isEditTracks = false"
                        class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center justify-center"
                    >
                        <font-awesome-icon icon="fa-solid fa-times" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 sm:p-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        <!-- Left: Artwork -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Artwork</label>
                            <div class="relative group">
                                <div class="aspect-square w-full border-2 border-dashed rounded-xl overflow-hidden transition-all"
                                    :class="imageURL ? 'border-orange-300 shadow-lg' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50'">
                                    <button type="button" class="w-full h-full relative" @click="$refs.fileInput?.click()">
                                        <img v-if="imageURL" :src="imageURL" class="w-full h-full object-cover" alt="artwork">
                                        <div v-else class="flex flex-col items-center justify-center h-full gap-4 px-4">
                                            <div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                                                <font-awesome-icon icon="fa-solid fa-image" class="text-orange-500 text-2xl" />
                                            </div>
                                            <span class="text-gray-600 font-medium text-sm sm:text-base">Add artwork</span>
                                            <span class="text-gray-400 text-xs">JPG or PNG</span>
                                        </div>
                                        <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.webp" @change="handleFileUpload" class="hidden">
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Form Fields -->
                        <div class="space-y-5">
                            <!-- Title -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input 
                                    v-model="editTitle" 
                                    type="text"
                                    class="w-full h-12 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                >
                            </div>

                            <!-- Genre -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Genre</label>
                                <select 
                                    v-model="selectedGenre" 
                                    class="w-full h-12 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">Select a genre</option>
                                    <option v-for="item in genreList" :key="item.id" :value="item">
                                        {{ item.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Bio -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea 
                                    v-model="bio" 
                                    rows="4"
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Enter track description..."
                                ></textarea>
                            </div>

                            <!-- Privacy -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-3">Track Privacy</label>
                                <div class="flex gap-6">
                                    <label class="flex items-center cursor-pointer group">
                                        <input v-model="privacy" value="1" type="radio" name="privacy" class="w-5 h-5 text-orange-500 focus:ring-orange-500 cursor-pointer">
                                        <span class="ml-3 text-sm sm:text-base font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                                            <font-awesome-icon icon="fa-solid fa-globe" class="mr-2" />
                                            Public
                                        </span>
                                    </label>
                                    <label class="flex items-center cursor-pointer group">
                                        <input v-model="privacy" value="0" type="radio" name="privacy" class="w-5 h-5 text-orange-500 focus:ring-orange-500 cursor-pointer">
                                        <span class="ml-3 text-sm sm:text-base font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                                            <font-awesome-icon icon="fa-solid fa-lock" class="mr-2" />
                                            Private
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl border-t border-gray-200">
                    <button 
                        @click="isEditTracks = false"
                        class="px-6 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-semibold text-gray-700 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        @click="editTrack"
                        class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
import axios from 'axios';
import { notification } from 'ant-design-vue';

export default {
    name: 'TracksPage',
    data() {
        return {
            songs: null,
            selectedTracks: null,
            trackInfo: null,
            idSelected: null,
            imageURL: null,
            artworkFile: null,
            isEditTracks: false,
            genreList: [],
            selectedGenre: '',
            bio: '',
            privacy: '1',
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            editTitle: '',
            allSelected: false,
        }
    },
    mounted() {
        this.getTracks();
        this.getGenre();
    },
    methods: {
        async deleteTracksById() {
            if (!this.selectedTracks) {
                notification.warning({
                    message: 'No Track Selected',
                    description: 'Please select a track to delete.',
                    duration: 3,
                });
                return;
            }

            try {
                await apiClient.delete(`http://localhost:3000/api/song/deleteSongById/${this.idSelected}`);
                notification.success({
                    message: 'Track Deleted',
                    description: 'Track has been deleted successfully.',
                    duration: 3,
                });
                this.selectedTracks = null;
                this.idSelected = null;
                this.getTracks();
            } catch (error) {
                console.error('Error delete track', error);
                notification.error({
                    message: 'Delete Failed',
                    description: error.response?.data?.message || 'Failed to delete track. Please try again.',
                    duration: 4,
                });
            }
        },
        async getTrackInfoById() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/song/getSongById/${this.idSelected}`);
                this.trackInfo = response.data.data;
                this.imageURL = this.trackInfo.artwork;
                this.editTitle = this.trackInfo.title;
                
                // Find and set the genre object
                const genreObj = this.genreList.find(g => g.id === this.trackInfo.genre_id || g.name === this.trackInfo.genre);
                this.selectedGenre = genreObj || '';
                
                this.bio = this.trackInfo.bio || '';
                this.privacy = this.trackInfo.is_public ? '1' : '0';
            } catch (error) {
                console.error('Error get track info', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load track information.',
                    duration: 4,
                });
            }
        },
        async getGenre() {
            try {
                const response = await apiClient.get('http://localhost:3000/api/songdetail/getGenre');
                this.genreList = response.data.data;
            } catch (error) {
                console.error('Error get genre', error);
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                notification.error({
                    message: 'Invalid File Type',
                    description: 'Please select a valid image file (JPG, PNG, or WebP).',
                    duration: 4,
                });
                event.target.value = '';
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                notification.error({
                    message: 'File Too Large',
                    description: 'Image size must be less than 5MB.',
                    duration: 4,
                });
                event.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageURL = e.target.result;
                this.artworkFile = file;
            };
            reader.readAsDataURL(file);
            event.target.value = '';

            notification.success({
                message: 'Image Selected',
                description: 'Artwork image has been selected.',
                duration: 2,
            });
        },
        formatTime(time) {
            if (!time) return '0:00';
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        },
        async getTracks() {
            try {
                const response = await apiClient.get('http://localhost:3000/api/song/getSongByUser');
                this.songs = response.data.data;
            } catch (error) {
                console.error('Error get tracks', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load tracks. Please refresh the page.',
                    duration: 4,
                });
            }
        },
        editTracks() {
            if (!this.selectedTracks) {
                notification.warning({
                    message: 'No Track Selected',
                    description: 'Please select a track to edit.',
                    duration: 3,
                });
                return;
            }
            this.isEditTracks = true;
            this.getTrackInfoById();
        },
        toggleTrackSelection(id) {
            if (this.selectedTracks === id) {
                this.selectedTracks = null;
                this.idSelected = null;
                this.isEditTracks = false;
            } else {
                this.selectedTracks = id;
                this.idSelected = id;
            }
        },
        toggleAllTracks() {
            this.allSelected = !this.allSelected;
            if (this.allSelected && this.songs && this.songs.length > 0) {
                this.selectedTracks = this.songs[0].id;
                this.idSelected = this.songs[0].id;
            } else {
                this.selectedTracks = null;
                this.idSelected = null;
            }
        },
        async editTrack() {
            if (!this.editTitle || !this.editTitle.trim()) {
                notification.warning({
                    message: 'Validation Error',
                    description: 'Please enter a track title.',
                    duration: 3,
                });
                return;
            }

            if (!this.selectedGenre || !this.selectedGenre.name) {
                notification.warning({
                    message: 'Validation Error',
                    description: 'Please select a genre.',
                    duration: 3,
                });
                return;
            }

            try {
                let artworkUrl = this.imageURL;

                // Upload new artwork if file was selected
                if (this.artworkFile) {
                    const formData = new FormData();
                    formData.append("file", this.artworkFile);
                    formData.append("upload_preset", "ml_default");

                    notification.info({
                        message: 'Uploading Artwork',
                        description: 'Please wait...',
                        duration: 2,
                    });

                    const uploadResponse = await axios.post(
                        "https://api.cloudinary.com/v1_1/dxgqkbchh/image/upload",
                        formData
                    );
                    artworkUrl = uploadResponse.data.secure_url;
                }

                const payload = {
                    artwork: artworkUrl,
                    title: this.editTitle.trim(),
                    genre: this.selectedGenre.name,
                    bio: this.bio.trim() || null,
                    privacy: parseInt(this.privacy),
                };

                await apiClient.put(`http://localhost:3000/api/song/updateSong/${this.idSelected}`, payload);
                
                notification.success({
                    message: 'Track Updated',
                    description: 'Track information has been updated successfully.',
                    duration: 3,
                });

                this.isEditTracks = false;
                this.artworkFile = null;
                await this.getTracks();
            } catch (error) {
                console.error('Error edit track', error);
                notification.error({
                    message: 'Update Failed',
                    description: error.response?.data?.message || 'Failed to update track. Please try again.',
                    duration: 4,
                });
            }
        },
    },
    components: {
        Header,
    },
}
</script>

<style scoped>
/* Custom radio button styling */
input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    outline: none;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
}

input[type="radio"]:checked {
    border-color: #f97316;
    background-color: #ffffff;
}

input[type="radio"]:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #f97316;
}

/* Select styling */
select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
}
</style>