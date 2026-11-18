import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import { songApi } from '@/api';
import { addToRecentlyPlayed } from '@/utils/recentlyPlayed';
import { DEFAULT_ARTWORK } from '@/config';

const PLAY_COUNT_THRESHOLD_SECONDS = 30;

const emptySong = () => ({
    id: null,
    title: '',
    artwork: null,
    username: '',
    duration: 0,
    path: '',
    isLiked: false,
});

/**
 * Chuẩn hoá bài hát từ nhiều dạng response khác nhau của API
 * thành object gọn mà player dùng.
 */
export const toPlayableSong = (song) => {
    const duration = Number(song.SongDetail?.duration ?? song.duration ?? 0);
    return {
        id: song.id,
        title: song.title || 'Unknown Title',
        artwork: song.artwork || DEFAULT_ARTWORK,
        path: song.path,
        duration: Number.isFinite(duration) && duration > 0 ? duration : 0,
        username:
            song.User?.username || song.username || song.SongArtists?.[0]?.User?.username || 'Unknown Artist',
    };
};

const uniqueById = (songs) => [...new Map(songs.map((song) => [song.id, song])).values()];

const shuffleArray = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

export const usePlayerStore = defineStore('player', () => {
    // ---------- state ----------
    const currentSong = ref(emptySong());
    const idUserLogin = ref(null);
    const isLoggedIn = ref(false);
    const user = ref(null);

    /** HTMLAudioElement hiện tại (shallowRef: không bọc proxy lên DOM object). */
    const audio = shallowRef(null);
    const volume = ref(1);
    const isPlaying = ref(false);
    const isPlayed = ref(false); // đã tính lượt nghe cho bài hiện tại chưa
    const currentTime = ref(0);

    const playlist = ref([]);
    const originalPlaylist = ref([]);
    const currentPlayIndex = ref(null);
    const isShuffle = ref(false);
    const isRepeatOne = ref(false);
    const isPlaylistPanelVisible = ref(false);

    // ---------- session ----------

    const setSession = (userId) => {
        idUserLogin.value = userId;
        isLoggedIn.value = Boolean(userId);
    };

    /** Xoá toàn bộ trạng thái khi logout. */
    const resetSession = () => {
        cleanupAudio();
        idUserLogin.value = null;
        isLoggedIn.value = false;
        user.value = null;
        currentSong.value = emptySong();
        playlist.value = [];
        originalPlaylist.value = [];
        isPlaying.value = false;
        currentTime.value = 0;
        currentPlayIndex.value = null;
    };

    // ---------- playlist ----------

    const syncCurrentIndex = () => {
        if (currentSong.value.id) {
            currentPlayIndex.value = playlist.value.findIndex((song) => song.id === currentSong.value.id);
        }
    };

    const shufflePlaylist = () => {
        if (isShuffle.value) {
            if (originalPlaylist.value.length !== playlist.value.length) {
                originalPlaylist.value = [...playlist.value];
            }
            playlist.value = shuffleArray(playlist.value);
        } else if (originalPlaylist.value.length > 0) {
            playlist.value = [...originalPlaylist.value];
        }
        syncCurrentIndex();
    };

    const toggleShuffle = () => {
        isShuffle.value = !isShuffle.value;
        shufflePlaylist();
    };

    const toggleRepeatOne = () => {
        isRepeatOne.value = !isRepeatOne.value;
    };

    const togglePlaylistPanel = () => {
        isPlaylistPanelVisible.value = !isPlaylistPanelVisible.value;
    };

    /** Nạp playlist ngẫu nhiên từ server. */
    const loadRandomPlaylist = async () => {
        try {
            const songs = await songApi.getRandomSongs();
            playlist.value = uniqueById(songs.map(toPlayableSong));
        } catch (error) {
            console.error('Error loading playlist:', error);
            playlist.value = [];
        }
        return playlist.value;
    };

    const addToPlaylist = (song) => {
        if (playlist.value.some((item) => item.id === song.id)) return;
        playlist.value.push({ ...toPlayableSong(song), isLiked: false });
    };

    const removeFromPlaylist = (index) => {
        playlist.value.splice(index, 1);
    };

    const removeAllFromPlaylist = () => {
        playlist.value = [];
    };

    // ---------- tracking ----------

    const updatePlayCount = async () => {
        try {
            await songApi.increasePlayCount(currentSong.value.id);
        } catch (error) {
            console.error('Lỗi cập nhật lượt nghe:', error);
        }
    };

    const logUserListen = async (songId) => {
        try {
            await songApi.logListen(songId, idUserLogin.value);
        } catch (error) {
            console.error('Error logging user listen:', error);
        }
    };

    // ---------- playback ----------

    const cleanupAudio = () => {
        if (!audio.value) return;
        audio.value.pause();
        audio.value.ontimeupdate = null;
        audio.value.onended = null;
        audio.value.onloadedmetadata = null;
        audio.value = null;
    };

    /** Đưa bài hát vào playlist (nếu chưa có) và cập nhật currentPlayIndex. */
    const placeInPlaylist = async (song) => {
        const existingIndex = playlist.value.findIndex((item) => item.id === song.id);
        if (existingIndex !== -1) {
            currentPlayIndex.value = existingIndex;
            return;
        }

        if (playlist.value.length === 0) {
            await loadRandomPlaylist();
            playlist.value = [song, ...playlist.value.filter((item) => item.id !== song.id)];
            currentPlayIndex.value = 0;
        } else {
            playlist.value.push(song);
            currentPlayIndex.value = playlist.value.length - 1;
        }

        if (isShuffle.value) {
            shufflePlaylist();
            currentPlayIndex.value = playlist.value.findIndex((item) => item.id === song.id);
        }
    };

    const play = async (rawSong) => {
        if (!rawSong) {
            console.warn('No song selected to play');
            return;
        }

        // Khách (chưa đăng nhập): chỉ phát trong playlist ngẫu nhiên
        if (!isLoggedIn.value) {
            await loadRandomPlaylist();
            if (isShuffle.value) shufflePlaylist();
        }

        const song = toPlayableSong(rawSong);
        if (!song.id || !song.path) {
            console.warn('Song id or path is missing', song);
            return;
        }

        await placeInPlaylist(song);

        cleanupAudio();
        const player = new Audio(song.path);
        player.volume = volume.value;
        audio.value = player;

        currentSong.value = song;
        isPlaying.value = true;
        isPlayed.value = false;
        currentTime.value = 0;

        try {
            addToRecentlyPlayed(song);
        } catch (error) {
            console.error('Error in addToRecentlyPlayed:', error);
        }

        player.onloadedmetadata = () => {
            if (player.duration && !currentSong.value.duration) {
                currentSong.value.duration = player.duration;
            }
        };

        player.ontimeupdate = () => {
            currentTime.value = player.currentTime;
            if (currentTime.value >= PLAY_COUNT_THRESHOLD_SECONDS && !isPlayed.value) {
                isPlayed.value = true;
                updatePlayCount();
            }
        };

        player.onended = () => {
            if (isRepeatOne.value) {
                player.currentTime = 0;
                player.play();
            } else {
                next();
            }
        };

        player.play().catch((error) => {
            console.error('Play failed:', error);
            isPlaying.value = false;
        });
    };

    const pause = () => {
        if (audio.value instanceof HTMLAudioElement) {
            audio.value.pause();
            isPlaying.value = false;
        }
    };

    const resume = () => {
        if (!audio.value) {
            console.warn('No song selected to play');
            return;
        }
        audio.value.play();
        isPlaying.value = true;
    };

    const playAt = (index) => {
        const song = playlist.value[index];
        if (!song) return;
        currentPlayIndex.value = index;
        play(song);
    };

    const next = () => {
        if (currentPlayIndex.value === null || playlist.value.length === 0) return;
        playAt((currentPlayIndex.value + 1) % playlist.value.length);
    };

    const previous = () => {
        if (currentPlayIndex.value === null || playlist.value.length === 0) return;
        playAt((currentPlayIndex.value - 1 + playlist.value.length) % playlist.value.length);
    };

    return {
        // state
        currentSong,
        idUserLogin,
        isLoggedIn,
        user,
        audio,
        volume,
        isPlaying,
        isPlayed,
        currentTime,
        playlist,
        originalPlaylist,
        currentPlayIndex,
        isShuffle,
        isRepeatOne,
        isPlaylistPanelVisible,
        // session
        setSession,
        resetSession,
        // playlist
        shufflePlaylist,
        toggleShuffle,
        toggleRepeatOne,
        togglePlaylistPanel,
        loadRandomPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        removeAllFromPlaylist,
        // tracking
        updatePlayCount,
        logUserListen,
        // playback
        cleanupAudio,
        play,
        pause,
        resume,
        next,
        previous,
    };
});
