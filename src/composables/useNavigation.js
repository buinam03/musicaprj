import { useRouter } from 'vue-router';

/** Điều hướng tới các trang chi tiết dùng lặp lại nhiều nơi. */
export function useNavigation() {
    const router = useRouter();

    return {
        goToProfile: (id) => id && router.push({ name: 'ProfilePage', params: { id } }),
        goToTrack: (id) => id && router.push({ name: 'TrackInfoPage', params: { id } }),
        goToPlaylist: (id) => id && router.push({ name: 'PlaylistDetailPage', params: { id } }),
        goToMessage: (id) => router.push({ name: 'MessagePage', params: id ? { id } : {} }),
    };
}
