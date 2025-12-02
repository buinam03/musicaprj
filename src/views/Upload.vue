<template>

    <div class="flex items-center justify-center min-h-screen">
        <div class="w-[800px] h-[400px] rounded-md shadow-2xl flex justify-center items-center">
            <div class="h-[200px] w-full text-center">
                <div class="font-semibold pb-4">Upload your best music here</div>

                <button class="btn-warning relative" :disabled="uploadStore.isUploading">
                    <div v-if="!uploadStore.isUploading">
                        <font-awesome-icon icon="fa-solid fa-upload" />
                        Choose file to upload
                    </div>

                    <div v-else class="flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin mr-2" />
                        Uploading... {{ uploadStore.progress }}%
                    </div>

                    <input type="file" @change="handleFileUpload" accept=".wav,.mp3,.flac,.alac,.aiff"
                        :disabled="uploadStore.isUploading" />
                </button>

                <div class="pt-4 text-xs">
                    Provide FLAC, WAV, ALAC, or AIFF for highest audio quality
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUploadStore } from '@/js/uploadState.js';
import { useRouter } from 'vue-router';

export default {
    name: 'UploadPage',
    setup() {
        const router = useRouter();
        const uploadStore = useUploadStore();

        const getAudioDuration = (file) => {
            return new Promise((resolve, reject) => {
                const audio = new Audio();
                audio.src = URL.createObjectURL(file);

                audio.addEventListener('loadedmetadata', () => resolve(audio.duration));
                audio.addEventListener('error', () => reject('Cannot load audio file.'));
            });
        };

        const handleFileUpload = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            try {
                const duration = await getAudioDuration(file);
                const result = await uploadStore.uploadFile(file, duration);

                // Chuyển trang khi upload xong
                event.target.value = ''; // reset input
                event.target.value = ''; // reset input
                router.push({
                    name: 'InfoSongUpload',
                    query: {
                        fileUrl: result.url,
                        fileName: result.name,
                        duration: result.duration
                    }
                });
            } catch (err) {
                console.error(err);
            }
        };

        return { uploadStore, handleFileUpload };
    }
};
</script>

<style scoped>
.btn-warning {
    position: relative;
    padding: 20px 30px;
    font-size: 15px;
    line-height: 1.5;
    border-radius: 4px;
    color: #fff;
    background-color: orange;
    border: 0;
    transition: 0.2s;
    overflow: hidden;
}

.btn-warning input[type="file"] {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
}
</style>
