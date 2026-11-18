/** Cấu hình dùng chung cho toàn bộ frontend. */
export const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
export const SOCKET_URL = process.env.VUE_APP_SOCKET_URL || 'http://localhost:3000';

export const CLOUDINARY_CLOUD_NAME = 'dxgqkbchh';
export const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

export const DEFAULT_AVATAR = 'http://localhost:8080/images/other/Unknown_person.jpg';
export const DEFAULT_ARTWORK = 'http://localhost:8080/images/other/Unknown_person.jpg';
