import apiClient from "@/apiService/apiClient";
import { defineStore } from "pinia";
import { addToRecentlyPlayed } from "@/utils/recentlyPlayed";

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
        // load playlist random song when play first time
        async loadPlaylist(){
            try{

                const randomSong = await apiClient.get(`http://localhost:3000/api/song/getRandomSong`);
                const randomSongData = randomSong.data.data;

                // Combine playlists
                const allSongs = [ ...randomSongData];

                // Remove duplicates based on song ID
                const uniqueSongsMap = new Map();
                allSongs.forEach(song => {
                    if (!uniqueSongsMap.has(song.id)) {
                        uniqueSongsMap.set(song.id, song);
                    }
                });
                const uniqueSongs = Array.from(uniqueSongsMap.values());

                const mappedSongs = uniqueSongs.map(song=>({
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    path: song.path,
                    duration: song.SongDetail?.duration || song.duration || 0, 
                    username: song.User?.username || song.username || 'Unknown Artist' 
                }));

                this.playlist = mappedSongs;

                return this.playlist;
            }
            catch(error){
                console.error("Error loading playlist:", error);
                this.playlist = []; 
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
            
            // Extract duration from various possible structures
            let duration = 0;
            if (song.SongDetail?.duration) {
                duration = Number(song.SongDetail.duration);
            } else if (song.duration) {
                duration = Number(song.duration);
            }
            
            // Validate duration
            if (isNaN(duration) || duration <= 0) {
                duration = 0;
            }

            // Extract username from various possible structures
            let username = 'Unknown Artist';
            if (song.User?.username) {
                username = song.User.username;
            } else if (song.username) {
                username = song.username;
            } else if (song.SongArtists?.[0]?.User?.username) {
                username = song.SongArtists[0].User.username;
            }

            const songToPlay = {
                 id: song.id,
                 title: song.title || 'Unknown Title',
                 artwork: song.artwork || 'http://localhost:8080/images/other/Unknown_person.jpg',
                 path: song.path,
                 duration: duration, 
                 username: username
            };


            if (!songToPlay.path) {
                 console.warn('Song path is missing', songToPlay);
                 return;
            }

            if (!songToPlay.id) {
                 console.warn('Song ID is missing', songToPlay);
                 return;
            }

            // Check if the song is already in the playlist, if not add it
            const existingIndex = this.playlist.findIndex(item => item.id === songToPlay.id);
            if (existingIndex === -1) {
                // If playlist is empty, load it first, then put current song at index 0
                if (this.playlist.length === 0) {
                    // Load playlist from API
                    await this.loadPlaylist();
                    // Remove current song from loaded playlist if it exists (to avoid duplicate)
                    const otherSongs = this.playlist.filter(item => item.id !== songToPlay.id);
                    // Put current song at the beginning (index 0)
                    this.playlist = [songToPlay, ...otherSongs];
                    this.currentPlayIndex = 0;
                } else {
                    // Playlist already exists, just add the song to the end
                    this.playlist.push(songToPlay);
                    this.currentPlayIndex = this.playlist.length - 1;
                }
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
            this.currentTime = 0; // Reset current time

            // Log user listen if logged in
            if (this.idUserLogin && songToPlay.id) {
                 this.logUserListen(songToPlay.id);
            }

            // Add to recently played (localStorage)
            try {
                addToRecentlyPlayed(songToPlay);
            } catch (error) {
                console.error('Error in addToRecentlyPlayed:', error);
            }

            // Get duration from audio metadata if not available from song data
            this.audio.onloadedmetadata = () => {
                const audioDuration = this.audio.duration;
                if (audioDuration && (!this.currentSong.duration || this.currentSong.duration === 0)) {
                    // Update currentSong duration reactively
                    this.currentSong = {
                        ...this.currentSong,
                        duration: audioDuration
                    };
                }
            };

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
                    if (this.playlist.length === 1) {
                        nextIndex = 0;
                    } else {
                        const availableIndices = this.playlist
                            .map((_, index) => index)
                            .filter(index => index !== this.currentPlayIndex);

                        const randomIndex = Math.floor(Math.random() * availableIndices.length);
                        nextIndex = availableIndices[randomIndex];
                    }
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
