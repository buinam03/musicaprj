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
        originalPlaylist: [],
        isPlaying: false,
        currentTime: 0,
        currentPlayIndex: null,
        user: null,
        isLoggedIn: false,
        isTemplate: false,
        likePlaylist: [],
        isRepeatOne: false,
        isPlaylistPanelVisible: false,
        isShuffle: false,
    }),

    actions: {
        shufflePlaylist() {
            if (this.isShuffle) {
                this.originalPlaylist = [...this.playlist];
                this.playlist = this.playlist.sort(() => Math.random() - 0.5);
                if (this.currentSong.id) {
                    this.currentPlayIndex = this.playlist.findIndex(song => song.id === this.currentSong.id);
                }
            } else {
                if (this.originalPlaylist.length > 0) {
                    this.playlist = [...this.originalPlaylist];
                    if (this.currentSong.id) {
                        this.currentPlayIndex = this.playlist.findIndex(song => song.id === this.currentSong.id);
                    }
                }
            }
        },
        async loadPlaylist(){
            try{
                //get user song 
                const userSong = await apiClient.get(`http://localhost:3000/api/song/getAllSong/${this.idUserLogin}`);
                const userSongData = userSong.data.data;

                const randomSong = await apiClient.get(`http://localhost:3000/api/song/getRandomSong`);
                const randomSongData = randomSong.data.data;

                // Combine and shuffle the playlists (optional, but good for variety)
                const allSongs = [...userSongData, ...randomSongData];
                // const shuffledSongs = allSongs.sort(() => Math.random() - 0.5); // Optional shuffle

                // Map data consistently, handle potential missing nested objects
                this.playlist = allSongs.map(song=>({
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    path: song.path,
                    duration: song.SongDetail?.duration || song.duration || 0, // Handle nested or direct duration
                    username: song.User?.username || song.username || 'Unknown Artist' // Handle nested or direct username
                }));

                return this.playlist;
            }
            catch(error){
                console.error("Error loading playlist:", error);
                this.playlist = []; // Clear playlist on error
                return [];
            }
        },
        async loadPlaylistRandom(){
            try{
                const randomSong = await apiClient.get(`http://localhost:3000/api/song/getRandomSong`);
                const randomSongData = randomSong.data.data;
                
                 // Map data consistently
                this.playlist = randomSongData.map(song => ({
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    path: song.path,
                    duration: song.duration || 0,
                    username: song.username || 'Unknown Artist'
                }));
                
                return this.playlist;
            }
            catch(error){
                console.error("Error loading random playlist:", error);
                this.playlist = []; // Clear playlist on error
                return [];
            }
        },
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

        toggleRepeatOne() {
            this.isRepeatOne = !this.isRepeatOne;
        },

        async play(song) {
            if (!song) {
                console.warn('No song selected to play');
                return;
            }

            // If not logged in, load only random playlist
            if (!this.isLoggedIn) {
                 await this.loadPlaylistRandom();
            }
            const songToPlay = {
                 id: song.id,
                 title: song.title || 'Unknown Title',
                 artwork: song.artwork,
                 path: song.path,
                 duration: song.SongDetail?.duration || song.duration || 0, 
                 username: song.User?.username || song.username || 'Unknown Artist' 
            };

            if (!songToPlay.path) {
                 console.warn('Song path is missing', songToPlay);
                 return;
            }

            // Check if the song is already in the playlist, if not add it
            const existingIndex = this.playlist.findIndex(item => item.id === songToPlay.id);
            if (existingIndex === -1) {
                this.playlist.push(songToPlay);
                this.loadPlaylist();
                this.currentPlayIndex = this.playlist.length - 1; // Set index to the newly added song
            } else {
                this.currentPlayIndex = existingIndex;
            }

            // Pause current audio if exists
            if (this.audio) {
                this.audio.pause();
                this.audio.ontimeupdate = null;
                this.audio.onended = null;
                this.audio = null;
            }

            // Create and play new audio
            this.audio = new Audio(songToPlay.path);
            this.audio.volume = this.volume; // Set volume from store

            // Update current song state
            this.currentSong = songToPlay;
            this.isPlaying = true;
            this.isPlayed = false; // Reset isPlayed for new song

            // // Log user listen if logged in
            // if (this.idUserLogin && songToPlay.id) {
            //      this.logUserListen(songToPlay.id);
            // }

            // Set up audio events
            this.audio.ontimeupdate = () => {
                this.currentTime = this.audio.currentTime;
                // Update play count after 30 seconds
                if (this.currentTime >= 30 && !this.isPlayed) {
                    this.updatePlayCount();
                    this.isPlayed = true;
                }
            };

            this.audio.onended = () => {
                if (this.isRepeatOne) {
                    this.audio.currentTime = 0;
                    this.audio.play();
                } else {
                    this.next(); // Play next song in playlist
                }
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
                let nextIndex;
                if (this.isShuffle) {
                    nextIndex = (this.currentPlayIndex + 1) % this.playlist.length;
                } else {
                    nextIndex = (this.currentPlayIndex + 1) % this.playlist.length;
                }
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
                let prevIndex;
                if (this.isShuffle) {
                    prevIndex = (this.currentPlayIndex - 1 + this.playlist.length) % this.playlist.length;
                } else {
                    prevIndex = (this.currentPlayIndex - 1 + this.playlist.length) % this.playlist.length;
                }
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

        togglePlaylistPanel() {
            this.isPlaylistPanelVisible = !this.isPlaylistPanelVisible;
        },
    },
});
