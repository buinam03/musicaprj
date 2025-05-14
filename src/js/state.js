
import { reactive } from "vue";

export const state = reactive({
    currentSong: {
        id: null,
        title: '',
        artwork: null,
        username: '',
        duration: 0,
        path: '',
    },
    audio: null,
    volume: 1,
    playlist: [],
    isPlaying: false,
    currentTime: 0,
    currentPlayIndex: null,
    isLoggedIn: false,
    isTemplate: false,
});


export const playerActions = {
    // Phát bài hát

    play(song) {
        if (state.audio) {
            state.audio.pause();
        }

        state.audio = new Audio(song);
        state.audio.currentTime = 0;
        state.currentTime = 0;
        state.audio.volume = state.volume
        state.currentSong = song;
        state.isPlaying = true;

        state.audio.play();

        state.audio.ontimeupdate = () => {
            state.currentTime = state.audio.currentTime;
        };

        state.audio.onended = () => {
            this.next();
        };
    },

    pause() {
        if (state.audio) {
            state.audio.pause();
            state.isPlaying = false;
        }
    },

    resume() {
        if (state.audio) {
            state.audio.play();
            state.isPlaying = true;
        }
    },

    next() {
        if (state.currentPlayIndex !== null && state.playlist.length > 0) {
            let nextIndex = (state.currentPlayIndex + 1) % state.playlist.length;
            state.currentPlayIndex = nextIndex;
            this.play(state.playlist[nextIndex]);
        }
    },

    previous() {
        if (state.currentPlayIndex !== null && state.playlist.length > 0) {
            let prevIndex =
                (state.currentPlayIndex - 1 + state.playlist.length) %
                state.playlist.length;
            state.currentPlayIndex = prevIndex;
            this.play(state.playlist[prevIndex]);
        }
    },

    addToPlaylist(song) {
        state.playlist.push(song);
    },
    removeFromPlaylist(song) {
        const index = state.playlist.some((item) => item.id === song.id);
        if (index != -1) {
            state.playlist.splice(index, 1); // Xóa bài hát tại vị trí index
            console.log("Removed song from playlist:", song);
        } else {
            console.log("Song not found in playlist.");
        }
    },
};
