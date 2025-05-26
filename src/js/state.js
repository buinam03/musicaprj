import apiClient from "@/apiService/apiClient";
import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
    state: () => ({
        currentSong: {
            id: null,
            title: "",
            artwork: null,
            username: "",
            duration: 0,
            path: "",
            isLiked: false
        },
        idUserLogin: null,
        isPlayed: false,
        audio: null,
        volume: 1,
        playlist: [],
        isPlaying: false,
        currentTime: 0,
        currentPlayIndex: null,
        user: null,
        isLoggedIn: false,
        isTemplate: false,
        likePlaylist: [],
    }),

    actions: {


        async updatePlayCount() {
            try {
                await apiClient.put(`http://localhost:3000/api/songdetail/updatePlayWhenListenSong/${this.currentSong.id}`)

            } catch (error) {
                console.error('Lỗi cập nhật lượt nghe:', error);
            }
        },
        async logUserListen(songId){
            try{
                await apiClient.post(`http://localhost:3000/api/song/logUser`,{
                    user_id: this.idUserLogin,
                    song_id: songId
                })
            }
            catch(error){
                console.error("Error logging user listen:", error);
            }
        },

        play(song) {
            if (!song) {
                console.warn('No song selected to play');
                return;
            }

            if (this.audio) {
                this.audio.pause();
                this.audio.ontimeupdate = null;
                this.audio.onended = null;
                this.audio = null;
            }
            else {
                this.isPlayed = true;
            }

            if (!song.path) {
                console.warn('Song path is missing');
                return;
            }

            this.audio = new Audio(song.path);
            this.audio.volume = this.volume;

            const playlistIndex = this.playlist.findIndex(item => item.id === song.id);
            if (playlistIndex !== -1) {
                this.currentPlayIndex = playlistIndex;
            }

            this.currentSong = {
                id: song.id,
                title: song.title,
                artwork: song.artwork,
                path: song.path,
                duration: song.duration,
                username: song.username
            };
            this.isPlaying = true;
            this.isPlayed = false;

            if (this.idUserLogin && song.id) {
                apiClient.post(`http://localhost:3000/api/song/logUser`,{
                    user_id: this.idUserLogin,
                    song_id: song.id
                }).then(response => {
                    console.log("User listen logged:", response.data.message);
                }).catch(error => {
                    console.error("Error logging user listen:", error);
                });
            }
            this.audio.ontimeupdate = () => {
                this.currentTime = this.audio.currentTime;
                if (this.currentTime >= 120 && !this.isPlayed) {
                    this.updatePlayCount();
                    this.isPlayed = true;
                }
            };

            this.audio.onended = () => {
                this.next();
            };

            this.audio.play().catch(error => {
                console.error("Play failed:", error);
                this.isPlaying = false;
            });
        },

        pause() {
            if (this.audio instanceof HTMLAudioElement) { // ✅ Check đúng instance
                this.audio.pause();
                this.isPlaying = false;
            }
        },
        resume() {
            if (this.audio) {
                this.audio.play();
                this.isPlaying = true;
            }
            else {
                console.warn('No song selected to play');
            }
        },

        next() {
            if (this.currentPlayIndex !== null && this.playlist.length > 0) {
                let nextIndex = (this.currentPlayIndex + 1) % this.playlist.length;
                const nextSong = this.playlist[nextIndex];
                this.currentPlayIndex = nextIndex;
                if (nextSong) {
                    this.play({
                        id: nextSong.id,
                        title: nextSong.title,
                        artwork: nextSong.artwork,
                        path: nextSong.path,
                        duration: nextSong.duration,
                        username: nextSong.username
                    });
                }
            }
        },

        previous() {
            if (this.currentPlayIndex !== null && this.playlist.length > 0) {
                let prevIndex = (this.currentPlayIndex - 1 + this.playlist.length) % this.playlist.length;
                const prevSong = this.playlist[prevIndex];
                this.currentPlayIndex = prevIndex;
                if (prevSong) {
                    this.play({
                        id: prevSong.id,
                        title: prevSong.title,
                        artwork: prevSong.artwork,
                        path: prevSong.path,
                        duration: prevSong.duration,
                        username: prevSong.username
                    });
                }
            }
        },

        addToPlaylist(song) {
            const existingIndex = this.playlist.findIndex(item => item.id === song.id);
            if (existingIndex === -1) {
                const fullSong = {
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    path: song.path,
                    duration: song.SongDetail?.duration || song.duration,
                    username: song.User?.username || song.username,
                    isLiked: false // Add isLiked property
                };
                this.playlist.push(fullSong);
                console.log("Added to playlist:", fullSong);
            }
        },
        removeFromPlaylist(index) {
            this.playlist.splice(index, 1);
        },
        removeAllFromPlaylist() {
            this.playlist = [];
        },

        // Add method to check if a song is liked
        isSongLiked(songId) {
            return this.likePlaylist.some(song => song.id === songId);
        },

        // Add method to initialize like status when loading songs
        async initializeLikeStatus(userId) {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/like/getLikedSongs/${userId}`);
                const likedSongIds = response.data.map(song => song.id);

                // Update like status in playlist
                this.playlist.forEach(song => {
                    song.isLiked = likedSongIds.includes(song.id);
                });

                // Update current song like status
                if (this.currentSong.id) {
                    this.currentSong.isLiked = likedSongIds.includes(this.currentSong.id);
                }

                // Update likePlaylist
                this.likePlaylist = response.data.map(song => ({
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    path: song.path,
                    duration: song.duration,
                    username: song.username,
                    isLiked: true
                }));
            } catch (error) {
                console.error('Error initializing like status:', error);
            }
        },
    },
});
