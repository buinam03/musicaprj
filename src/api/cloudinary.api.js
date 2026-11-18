import axios from 'axios';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config';

const uploadUrl = (resourceType) => `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

const upload = async (file, resourceType, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(uploadUrl(resourceType), formData, {
        onUploadProgress: onProgress
            ? (event) => onProgress(Math.round((event.loaded / event.total) * 100))
            : undefined,
    });
    return response.data.secure_url;
};

/** Upload ảnh, trả về secure_url. */
export const uploadImage = (file) => upload(file, 'image');

/** Upload file nhạc (Cloudinary coi audio là 'video'), trả về secure_url. */
export const uploadAudio = (file, onProgress) => upload(file, 'video', onProgress);
