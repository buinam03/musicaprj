<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="mb-6 sm:mb-8 lg:mb-10">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    Add Track Details
                </h1>
                <p class="text-gray-600 text-sm sm:text-base">
                    Complete the information below to publish your track
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr] gap-6 lg:gap-8">
                <div class="flex justify-center lg:justify-start">
                    <ArtworkPicker v-model="artworkFile" />
                </div>

                <div class="space-y-5 sm:space-y-6">
                    <!-- Track Title -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Track Title <span class="text-red-500">*</span>
                        </label>
                        <input v-model="title" type="text"
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
                        <input :value="username || 'No artist'" type="text"
                            class="w-full h-12 sm:h-14 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                            readonly>
                    </div>

                    <!-- Genre -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Genre <span class="text-red-500">*</span>
                        </label>
                        <select v-model="selectedGenre"
                            class="w-full h-12 sm:h-14 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white">
                            <option value="">Select a genre</option>
                            <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                                {{ genre.name }}
                            </option>
                        </select>
                        <p v-if="errors.genre" class="mt-1 text-sm text-red-500">{{ errors.genre }}</p>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea v-model="bio" rows="4"
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
                            <label v-for="option in PRIVACY_OPTIONS" :key="option.value" class="flex items-center cursor-pointer group">
                                <input v-model="privacy" :value="option.value" type="radio" name="privacy"
                                    class="w-5 h-5 text-orange-500 focus:ring-orange-500 focus:ring-2 border-gray-300 cursor-pointer">
                                <span class="ml-3 text-sm sm:text-base font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                                    <font-awesome-icon :icon="option.icon" class="mr-2" />
                                    {{ option.label }}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div class="pt-4 flex justify-end">
                        <button @click="submit" :disabled="isSubmitting"
                            class="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl text-sm sm:text-base shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <font-awesome-icon v-if="isSubmitting" icon="fa-solid fa-spinner" class="animate-spin" />
                            <font-awesome-icon v-else icon="fa-solid fa-cloud-arrow-up" />
                            <span>{{ isSubmitting ? 'Uploading...' : 'Upload Track' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import { cloudinaryApi, getErrorMessage, songApi, userApi } from '@/api';
import { useAuth, useGenres } from '@/composables';
import { DEFAULT_ARTWORK } from '@/config';
import ArtworkPicker from '@/components/upload/ArtworkPicker.vue';

const PRIVACY_OPTIONS = [
    { value: 1, label: 'Public', icon: 'fa-solid fa-globe' },
    { value: 0, label: 'Private', icon: 'fa-solid fa-lock' },
];
const REDIRECT_DELAY = 2000;

const route = useRoute();
const router = useRouter();
const { currentUserId } = useAuth();
const { genres, loadGenres } = useGenres();

// Thông tin file nhạc do trang Upload truyền sang qua query params.
const fileUrl = route.query.fileUrl || null;
const fileName = route.query.fileName || '';
const duration = Number(route.query.duration) || null;

const title = ref(fileName.split('.').slice(0, -1).join('.'));
const selectedGenre = ref('');
const bio = ref('');
const privacy = ref(1);
const artworkFile = ref(null);
const username = ref('');
const isSubmitting = ref(false);
const errors = reactive({ title: '', genre: '' });

const redirectToDiscover = () => setTimeout(() => router.push('/discover'), REDIRECT_DELAY);

const loadUser = async () => {
    if (!currentUserId.value) {
        notification.error({
            message: 'Authentication Required',
            description: 'Please log in to upload tracks. Redirecting to login...',
            duration: 4,
        });
        redirectToDiscover();
        return;
    }

    try {
        const user = await userApi.getUserById(currentUserId.value);
        username.value = user?.username || '';
    } catch (error) {
        console.error('Error getting user:', error);
        const status = error.response?.status;
        if (status === 401 || status === 404) {
            notification.error({
                message: 'Authentication Error',
                description: 'Your session has expired. Please log in again.',
                duration: 4,
            });
            redirectToDiscover();
        } else {
            notification.error({
                message: 'Error',
                description: 'Failed to load user information. Please refresh the page.',
                duration: 4,
            });
        }
    }
};

const validateForm = () => {
    errors.title = title.value.trim() ? '' : 'Track title is required';
    errors.genre = selectedGenre.value ? '' : 'Please select a genre';
    let isValid = !errors.title && !errors.genre;

    if (!fileUrl) {
        notification.error({
            message: 'Missing Audio File',
            description: 'Audio file URL is missing. Please go back and upload your audio file first.',
            duration: 5,
        });
        isValid = false;
    }
    return isValid;
};

const submit = async () => {
    if (!validateForm()) {
        notification.warning({
            message: 'Validation Error',
            description: 'Please fill in all required fields.',
            duration: 4,
        });
        return;
    }

    isSubmitting.value = true;
    try {
        let artworkUrl = '';
        if (artworkFile.value) {
            notification.info({
                message: 'Uploading Artwork',
                description: 'Please wait while we upload your artwork...',
                duration: 2,
            });
            artworkUrl = await cloudinaryApi.uploadImage(artworkFile.value);
        }

        notification.info({
            message: 'Uploading Track',
            description: 'Please wait while we save your track information...',
            duration: 2,
        });

        await songApi.createSong({
            title: title.value.trim(),
            artwork: artworkUrl || DEFAULT_ARTWORK,
            genre: selectedGenre.value,
            bio: bio.value.trim(),
            duration,
            privacy: Number(privacy.value),
            path: fileUrl,
        });

        notification.success({
            message: 'Upload Successful!',
            description: `"${title.value.trim()}" has been uploaded successfully. Redirecting to home...`,
            duration: 3,
        });
        setTimeout(() => router.push('/home'), 1500);
    } catch (error) {
        console.error('Upload error:', error);
        notification.error({
            message: 'Upload Failed',
            description: getErrorMessage(error, 'An error occurred while uploading your track. Please try again.'),
            duration: 5,
        });
    } finally {
        isSubmitting.value = false;
    }
};

onBeforeRouteLeave(() => {
    if (!isSubmitting.value) return true;
    notification.warning({
        message: 'Upload in Progress',
        description: 'Please wait for the upload to complete before leaving this page.',
        duration: 3,
    });
    return false;
});

onMounted(async () => {
    loadUser();
    const list = await loadGenres();
    if (!list.length) {
        notification.error({
            message: 'Error',
            description: 'Failed to load genres. Please refresh the page.',
            duration: 4,
        });
    }
});
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
