<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div class="w-full max-w-2xl">
            <!-- Main Upload Card -->
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100">
                <!-- Header -->
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 sm:px-8 py-6 sm:py-8">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <font-awesome-icon icon="fa-solid fa-music" class="text-white text-2xl sm:text-3xl" />
                        </div>
                    </div>
                    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
                        Upload Your Music
                    </h1>
                    <p class="text-orange-100 text-sm sm:text-base text-center mt-2">
                        Share your best tracks with the world
                    </p>
                </div>

                <!-- Upload Area -->
                <div class="p-6 sm:p-8 lg:p-10">
                    <!-- Upload Button -->
                    <div class="mb-6 sm:mb-8">
                        <button 
                            class="upload-btn relative w-full group" 
                            :disabled="uploadStore.isUploading"
                            :class="{ 'opacity-75 cursor-not-allowed': uploadStore.isUploading }"
                        >
                            <div v-if="!uploadStore.isUploading" class="flex flex-col items-center justify-center py-6 sm:py-8">
                                <div class="w-16 h-16 sm:w-20 sm:h-20 text-white rounded-full bg-orange-500 group-hover:bg-orange-600 flex items-center justify-center mb-4 transition-all duration-300 transform group-hover:scale-110">
                                    <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" class="text-white text-2xl sm:text-3xl" />
                                </div>
                                <span class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                    Choose File to Upload
                                </span>
                                <span class="text-sm text-gray-500">
                                    Click or drag and drop your audio file here
                                </span>
                            </div>

                            <div v-else class="flex flex-col items-center justify-center py-6 sm:py-8">
                                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-500 flex items-center justify-center mb-4">
                                    <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-white text-2xl sm:text-3xl" />
                                </div>
                                <span class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                    Uploading...
                                </span>
                                <div class="w-full max-w-xs">
                                    <!-- Progress Bar -->
                                    <div class="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 mb-2 overflow-hidden">
                                        <div 
                                            class="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-300 ease-out"
                                            :style="{ width: uploadStore.progress + '%' }"
                                        ></div>
                                    </div>
                                    <span class="text-sm sm:text-base font-medium text-orange-600">
                                        {{ uploadStore.progress }}% complete
                                    </span>
                                </div>
                            </div>

                            <input 
                                type="file" 
                                @change="handleFileUpload" 
                                accept=".wav,.mp3,.flac,.alac,.aiff,.m4a,.ogg"
                                :disabled="uploadStore.isUploading"
                                class="file-input"
                                ref="fileInput"
                            />
                        </button>
                    </div>

                    <!-- File Format Info -->
                    <div class="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                        <div class="flex items-start">
                            <div class="flex-shrink-0 mt-0.5">
                                <font-awesome-icon icon="fa-solid fa-circle-info" class="text-orange-500 text-lg" />
                            </div>
                            <div class="ml-3 flex-1">
                                <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                                    Supported Formats
                                </h3>
                                <p class="text-xs sm:text-sm text-gray-600 mb-3">
                                    For the highest audio quality, we recommend uploading in lossless formats:
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <span class="px-3 py-1 bg-white rounded-full text-xs sm:text-sm font-medium text-orange-600 border border-orange-200">
                                        FLAC
                                    </span>
                                    <span class="px-3 py-1 bg-white rounded-full text-xs sm:text-sm font-medium text-orange-600 border border-orange-200">
                                        WAV
                                    </span>
                                    <span class="px-3 py-1 bg-white rounded-full text-xs sm:text-sm font-medium text-orange-600 border border-orange-200">
                                        ALAC
                                    </span>
                                    <span class="px-3 py-1 bg-white rounded-full text-xs sm:text-sm font-medium text-orange-600 border border-orange-200">
                                        AIFF
                                    </span>
                                    <span class="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm font-medium text-gray-600 border border-gray-200">
                                        MP3
                                    </span>
                                    <span class="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm font-medium text-gray-600 border border-gray-200">
                                        M4A
                                    </span>
                                    <span class="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm font-medium text-gray-600 border border-gray-200">
                                        OGG
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tips -->
                    <div class="mt-4 sm:mt-6 text-center">
                        <p class="text-xs sm:text-sm text-gray-500">
                            <font-awesome-icon icon="fa-solid fa-shield-halved" class="mr-1" />
                            Your files are securely uploaded and stored
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUploadStore } from '@/js/uploadState.js';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';

export default {
    name: 'UploadPage',
    setup() {
        const router = useRouter();
        const uploadStore = useUploadStore();

        const getAudioDuration = (file) => {
            return new Promise((resolve, reject) => {
                const audio = new Audio();
                const objectUrl = URL.createObjectURL(file);
                audio.src = objectUrl;

                const cleanup = () => {
                    URL.revokeObjectURL(objectUrl);
                };

                audio.addEventListener('loadedmetadata', () => {
                    const duration = audio.duration;
                    cleanup();
                    if (isNaN(duration) || duration <= 0) {
                        reject(new Error('Invalid audio file duration.'));
                    } else {
                        resolve(duration);
                    }
                });

                audio.addEventListener('error', () => {
                    cleanup();
                    reject(new Error('Cannot load audio file. Please make sure it is a valid audio file.'));
                });

                // Timeout after 10 seconds
                setTimeout(() => {
                    if (!audio.duration) {
                        cleanup();
                        reject(new Error('Failed to load audio metadata. The file may be corrupted.'));
                    }
                }, 10000);
            });
        };

        const handleFileUpload = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Validate file type
            const validExtensions = ['.wav', '.mp3', '.flac', '.alac', '.aiff', '.m4a', '.ogg'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!validExtensions.includes(fileExtension)) {
                notification.error({
                    message: 'Invalid File Format',
                    description: 'Please select a valid audio file (WAV, MP3, FLAC, ALAC, AIFF, M4A, or OGG).',
                    duration: 4,
                });
                event.target.value = '';
                return;
            }

            // Validate file size (max 100MB)
            const maxSize = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSize) {
                notification.error({
                    message: 'File Too Large',
                    description: 'The file size exceeds 100MB. Please select a smaller file.',
                    duration: 4,
                });
                event.target.value = '';
                return;
            }

            try {
                // Show loading notification
                notification.info({
                    message: 'Reading Audio File',
                    description: 'Please wait while we process your audio file...',
                    duration: 2,
                });

                const duration = await getAudioDuration(file);
                
                // Show upload notification
                notification.info({
                    message: 'Upload Started',
                    description: `Uploading "${file.name}"... This may take a few moments.`,
                    duration: 3,
                });

                const result = await uploadStore.uploadFile(file, duration);

                // Success notification
                notification.success({
                    message: 'Upload Successful!',
                    description: `"${file.name}" has been uploaded successfully. Redirecting to add details...`,
                    duration: 3,
                });

                // Reset input
                event.target.value = '';

                // Navigate to info page after a short delay
                setTimeout(() => {
                    router.push({
                        name: 'InfoSongUpload',
                        query: {
                            fileUrl: result.url,
                            fileName: result.name,
                            duration: result.duration
                        }
                    });
                }, 500);

            } catch (err) {
                console.error('Upload error:', err);
                
                notification.error({
                    message: 'Upload Failed',
                    description: err.message || 'An error occurred while uploading your file. Please try again.',
                    duration: 5,
                });

                // Reset input
                event.target.value = '';
            }
        };

        return { uploadStore, handleFileUpload };
    }
};
</script>

<style scoped>
.upload-btn {
    position: relative;
    border: 2px dashed #fb923c;
    border-radius: 1rem;
    background: linear-gradient(to bottom, #fff7ed, #ffffff);
    transition: all 0.3s ease;
    overflow: hidden;
}

.upload-btn:hover:not(:disabled) {
    border-color: #f97316;
    background: linear-gradient(to bottom, #ffedd5, #ffffff);
    box-shadow: 0 10px 25px rgba(249, 115, 22, 0.15);
    transform: translateY(-2px);
}

.upload-btn:active:not(:disabled) {
    transform: translateY(0);
}

.upload-btn:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.file-input {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: 10;
}

.file-input:disabled {
    cursor: not-allowed;
}

/* Progress bar animation */
@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
}

.upload-btn[disabled] .bg-gradient-to-r {
    background: linear-gradient(
        90deg,
        #fb923c 0%,
        #f97316 50%,
        #fb923c 100%
    );
    background-size: 2000px 100%;
    animation: shimmer 2s infinite;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .upload-btn {
        border-radius: 0.75rem;
    }
}
</style>
