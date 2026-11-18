import { ref } from 'vue';
import { useAuth } from './useAuth';

// Một modal "Add to playlist" duy nhất cho cả app (được mount trong App.vue).
const isOpen = ref(false);
const song = ref(null);

export function usePlaylistPicker() {
    const { requireLogin } = useAuth();

    const openPlaylistPicker = (target) => {
        if (!requireLogin('You need to log in to add songs to a playlist.')) return;
        song.value = target;
        isOpen.value = true;
    };

    const closePlaylistPicker = () => {
        isOpen.value = false;
        song.value = null;
    };

    return { isOpen, song, openPlaylistPicker, closePlaylistPicker };
}
