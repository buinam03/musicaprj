import { ref } from 'vue';
import { songApi } from '@/api';

// Danh sách thể loại chỉ tải một lần cho cả app.
const genres = ref([]);
let loadingPromise = null;

export function useGenres() {
    const loadGenres = () => {
        if (genres.value.length > 0) return Promise.resolve(genres.value);
        if (!loadingPromise) {
            loadingPromise = songApi
                .getGenres()
                .then((list) => {
                    genres.value = list || [];
                    return genres.value;
                })
                .catch((error) => {
                    console.error('Error loading genres:', error);
                    return [];
                })
                .finally(() => {
                    loadingPromise = null;
                });
        }
        return loadingPromise;
    };

    /** Tìm genre theo id hoặc theo tên (dữ liệu cũ có thể lưu tên). */
    const findGenre = (idOrName) => {
        if (idOrName === null || idOrName === undefined || idOrName === '') return null;
        return genres.value.find((g) => g.id === Number(idOrName) || g.name === idOrName) || null;
    };

    const genreName = (idOrName) => findGenre(idOrName)?.name || '';

    return { genres, loadGenres, findGenre, genreName };
}
