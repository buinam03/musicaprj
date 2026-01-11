// src/js/uploadState.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { message } from 'ant-design-vue';

export const useUploadStore = defineStore('upload', {
  state: () => ({
    isUploading: false,
    progress: 0,
    fileUrl: null,
  }),

  actions: {
    async uploadFile(file, duration) {
      this.isUploading = true;
      this.progress = 0;

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        formData.append("resource_type", "video");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dxgqkbchh/video/upload",
          formData,
          {
            onUploadProgress: (event) => {
              this.progress = Math.round((event.loaded / event.total) * 100);
              message.info(`Uploading... ${this.progress}%`);
            }
          }
        );

        this.fileUrl = response.data.secure_url;

        message.success('Upload thành công!');
        return {
          url: this.fileUrl,
          name: file.name,
          duration
        };
      } catch (err) {
        message.error('Upload thất bại!');
        throw err;
      } finally {
        this.isUploading = false;
        this.progress = 0;
      }
    }
  }
});
