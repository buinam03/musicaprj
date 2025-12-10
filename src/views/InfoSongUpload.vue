<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-6 sm:mb-8 lg:mb-10">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    Add Track Details
                </h1>
                <p class="text-gray-600 text-sm sm:text-base">
                    Complete the information below to publish your track
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr] gap-6 lg:gap-8">
                <!-- Left: Artwork Upload -->
                <div class="flex justify-center lg:justify-start">
                    <div class="w-full max-w-md lg:max-w-none">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Album Artwork
                        </label>
                        <div class="relative group">
                            <div
                                class="aspect-square w-full border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300"
                                :class="imageURL ? 'border-orange-300 shadow-lg' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50'">
                                <button 
                                    type="button" 
                                    class="w-full h-full relative"
                                    :class="{ 'cursor-default': isImageUpload }"
                                    @click="!isImageUpload && $refs.fileInput?.click()"
                                >
                                    <img 
                                        v-if="imageURL" 
                                        :src="imageURL" 
                                        class="w-full h-full object-cover"
                                        alt="Album artwork">
                                    <div 
                                        v-else 
                                        class="flex flex-col items-center justify-center h-full gap-4 sm:gap-6 px-4">
                                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center">
                                            <font-awesome-icon 
                                                icon="fa-solid fa-image" 
                                                class="text-orange-500 text-2xl sm:text-3xl" />
                                        </div>
                                        <div class="text-center">
                                            <span class="text-gray-600 font-medium text-sm sm:text-base block mb-1">
                                                Add artwork
                                            </span>
                                            <span class="text-gray-400 text-xs sm:text-sm">
                                                JPG or PNG
                                            </span>
                                        </div>
                                    </div>

                                    <input 
                                        ref="fileInput" 
                                        type="file" 
                                        accept=".jpg,.jpeg,.png,.webp" 
                                        @change="handleFileUpload"
                                        class="hidden">
                                </button>
                            </div>

                            <!-- Action Buttons -->
                            <div v-if="isImageUpload" class="flex justify-center gap-4 mt-4">
                                <button 
                                    @click="replaceImage"
                                    class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group"
                                    title="Replace image">
                                    <font-awesome-icon 
                                        icon="fa-solid fa-pencil" 
                                        class="text-gray-600 group-hover:text-orange-600 text-sm sm:text-base" />
                                </button>
                                <button 
                                    @click="deleteImage"
                                    class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group"
                                    title="Delete image">
                                    <font-awesome-icon 
                                        icon="fa-solid fa-trash" 
                                        class="text-gray-600 group-hover:text-red-600 text-sm sm:text-base" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Form Fields -->
                <div class="space-y-5 sm:space-y-6">
                    <!-- Track Title -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Track Title <span class="text-red-500">*</span>
                        </label>
                        <input 
                            v-model="title"
                            type="text" 
                            class="w-full h-12 sm:h-14 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="Enter track title"
                            required>
                        <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
                    </div>

                    <!-- Main Artist -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Main Artist(s) <span class="text-red-500">*</span>
                        </label>
                        <input 
                            :value="username || 'No artist'"
                            type="text" 
                            class="w-full h-12 sm:h-14 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                            readonly>
                    </div>

                    <!-- Genre -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Genre <span class="text-red-500">*</span>
                        </label>
                        <select 
                            v-model="selectedGenre" 
                            class="w-full h-12 sm:h-14 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white">
                            <option value="">Select a genre</option>
                            <option v-for="item in genreList" :key="item.id" :value="item">
                                {{ item.name }}
                            </option>
                        </select>
                        <p v-if="errors.genre" class="mt-1 text-sm text-red-500">{{ errors.genre }}</p>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea 
                            v-model="bio"
                            rows="4"
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                            placeholder="Tracks with descriptions tend to get more plays and engagement. Tell your listeners about your track..."
                        ></textarea>
                    </div>

                    <!-- Privacy -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Track Privacy
                        </label>
                        <div class="flex flex-wrap gap-4 sm:gap-6">
                            <label class="flex items-center cursor-pointer group">
                                <input 
                                    v-model="privacy" 
                                    value="1" 
                                    type="radio" 
                                    name="privacy"
                                    class="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2 border-gray-300 cursor-pointer">
                                <span class="ml-3 text-sm sm:text-base font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                                    <font-awesome-icon icon="fa-solid fa-globe" class="mr-2" />
                                    Public
                                </span>
                            </label>
                            <label class="flex items-center cursor-pointer group">
                                <input 
                                    v-model="privacy" 
                                    value="0" 
                                    type="radio" 
                                    name="privacy"
                                    class="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2 border-gray-300 cursor-pointer">
                                <span class="ml-3 text-sm sm:text-base font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                                    <font-awesome-icon icon="fa-solid fa-lock" class="mr-2" />
                                    Private
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Upload Button -->
                    <div class="pt-4 flex justify-end">
                        <button 
                            @click="uploadMusic"
                            :disabled="isUploading"
                            class="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl text-sm sm:text-base shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <font-awesome-icon 
                                v-if="isUploading" 
                                icon="fa-solid fa-spinner" 
                                class="animate-spin" />
                            <font-awesome-icon 
                                v-else 
                                icon="fa-solid fa-cloud-arrow-up" />
                            <span>{{ isUploading ? 'Uploading...' : 'Upload Track' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import axios from 'axios';
import { usePlayerStore } from '@/js/state';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
import { notification } from 'ant-design-vue';

export default {
    name: 'InfoSongUpload',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        };
    },
    mounted() {
        this.title = this.fileNameWithoutExtend;
        this.getGenre();
        this.getUserById();
    },
    watch: {
        imageURL(newValue) {
            this.artworkFile = newValue;
        }
    },
    data() {
        return {
            artworkFile: null,
            title: "",
            genre: "",
            bio: "",
            duration: null,
            privacy: '1',
            fileName: '',
            imageURL: null,
            isImageUpload: false,
            isUploading: false,
            audioFile: null,
            fileUrl: null,
            genreList: [],
            userById: null,
            username: '',
            selectedGenre: '',
            errors: {
                title: '',
                genre: ''
            }
        }
    },
    computed: {

        fileNameWithoutExtend() {
            return this.fileName ? this.fileName.split(".").slice(0, -1).join(".") : "";
        },
        fileImageURL() {
            return this.imageURL;
        }
    },
    components: {
        // Header,
    },
    methods: {
        async getUserById() {
            try {
                const userId = getUserIdFromJWT();
                if (!userId) return;
                const response = await apiClient.get(`/users/getUserById/${userId}`);
                this.userById = response.data.data;
                this.username = this.userById.username;
            } catch (error) {
                console.error('Error getting user:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load user information. Please refresh the page.',
                    duration: 4,
                });
            }
        },
        async getGenre() {
            try {
                const response = await apiClient.get('http://localhost:3000/api/songdetail/getGenre');
                this.genreList = response.data.data;
            } catch (error) {
                console.error('Error getting genres:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load genres. Please refresh the page.',
                    duration: 4,
                });
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validate file type
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

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                notification.error({
                    message: 'File Too Large',
                    description: 'Image size must be less than 5MB. Please compress your image and try again.',
                    duration: 4,
                });
                event.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageURL = e.target.result;
                this.artworkFile = file; // Store the actual file for upload
            };
            reader.readAsDataURL(file);
            this.isImageUpload = true;
            event.target.value = '';

            notification.success({
                message: 'Image Selected',
                description: 'Artwork image has been selected successfully.',
                duration: 2,
            });
        },
        deleteImage() {
            this.imageURL = null;
            this.artworkFile = null;
            this.isImageUpload = false;
            notification.info({
                message: 'Image Removed',
                description: 'Artwork image has been removed.',
                duration: 2,
            });
        },
        replaceImage() {
            this.$refs.fileInput?.click();
        },
        validateForm() {
            this.errors = { title: '', genre: '' };
            let isValid = true;

            if (!this.title || this.title.trim() === '') {
                this.errors.title = 'Track title is required';
                isValid = false;
            }

            if (!this.selectedGenre || this.selectedGenre === '') {
                this.errors.genre = 'Please select a genre';
                isValid = false;
            }

            if (!this.fileUrl) {
                notification.error({
                    message: 'Missing Audio File',
                    description: 'Audio file URL is missing. Please go back and upload your audio file first.',
                    duration: 5,
                });
                isValid = false;
            }

            return isValid;
        },
        async uploadMusic() {
            // Validate form
            if (!this.validateForm()) {
                notification.warning({
                    message: 'Validation Error',
                    description: 'Please fill in all required fields.',
                    duration: 4,
                });
                return;
            }

            this.isUploading = true;

            try {
                let artworkUrl = '';

                // Upload artwork to Cloudinary if image is selected
                if (this.artworkFile) {
                    notification.info({
                        message: 'Uploading Artwork',
                        description: 'Please wait while we upload your artwork...',
                        duration: 2,
                    });

                    const formData = new FormData();
                    formData.append("file", this.artworkFile);
                    formData.append("upload_preset", "ml_default");

                    const response = await axios.post(
                        "https://api.cloudinary.com/v1_1/dxgqkbchh/image/upload",
                        formData
                    );

                    artworkUrl = response.data.secure_url;
                }

                // Prepare song data
                const songData = {
                    title: this.title.trim(),
                    genre: this.selectedGenre?.name || "",
                    bio: this.bio.trim(),
                    duration: this.duration,
                    privacy: Number(this.privacy),
                    path: this.fileUrl,
                    artwork: artworkUrl || 'http://localhost:8080/images/other/Unknown_person.jpg'
                };

                notification.info({
                    message: 'Uploading Track',
                    description: 'Please wait while we save your track information...',
                    duration: 2,
                });

                await apiClient.post("song/addNewSong", songData);

                notification.success({
                    message: 'Upload Successful!',
                    description: `"${this.title}" has been uploaded successfully. Redirecting to home...`,
                    duration: 3,
                });

                // Redirect after short delay
                setTimeout(() => {
                    this.$router.push('/home');
                }, 1500);

            } catch (error) {
                console.error('Upload error:', error);
                notification.error({
                    message: 'Upload Failed',
                    description: error.response?.data?.message || 'An error occurred while uploading your track. Please try again.',
                    duration: 5,
                });
            } finally {
                this.isUploading = false;
            }
        },
    },
    created() {
        this.fileUrl = this.$route.query.fileUrl;
        this.fileName = this.$route.query.fileName;
        this.duration = this.$route.query.duration;

        console.log("File URL:", this.fileUrl);
        console.log("File Name:", this.fileName);
    },
    beforeRouteLeave(to, from, next) {
        if (this.isUploading) {
            notification.warning({
                message: 'Upload in Progress',
                description: 'Please wait for the upload to complete before leaving this page.',
                duration: 3,
            });
            next(false);
            return;
        }
        next();
    }
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

input[type="radio"]:focus {
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
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

/* Smooth transitions */
input, textarea, select {
    transition: all 0.2s ease;
}

/* Focus visible for accessibility */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}
</style>