import { defineStore } from 'pinia';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { cloudinaryApi } from '@/api';

/** Trạng thái upload file nhạc lên Cloudinary (giữ qua các trang Upload -> InfoSongUpload). */
export const useUploadStore = defineStore('upload', () => {
    const isUploading = ref(false);
    const progress = ref(0);
    const fileUrl = ref(null);

    const uploadFile = async (file, duration) => {
        isUploading.value = true;
        progress.value = 0;

        try {
            fileUrl.value = await cloudinaryApi.uploadAudio(file, (percent) => {
                progress.value = percent;
            });
            return { url: fileUrl.value, name: file.name, duration };
        } catch (error) {
            message.error('Upload thất bại!');
            throw error;
        } finally {
            isUploading.value = false;
            progress.value = 0;
        }
    };

    return { isUploading, progress, fileUrl, uploadFile };
});
