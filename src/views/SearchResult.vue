<template>
    <div class="min-h-screen bg-gray-50">
        <div class="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Search Header -->
            <div class="mb-6 sm:mb-8">
                <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Search results for "<span class="text-orange-500">{{ searchQuery }}</span>"
                </h1>
                <div v-if="artist && songs" class="text-sm sm:text-base text-gray-500">
                    Found {{ artist.length }} {{ artist.length === 1 ? 'user' : 'users' }} and {{ songs?.length || 0 }} {{ (songs?.length || 0) === 1 ? 'track' : 'tracks' }}
                </div>
            </div>

            <!-- Search Options Sidebar -->
            <div class="flex flex-col sm:flex-row gap-6 mb-6">
                <div class="w-full sm:w-48 lg:w-56 flex-shrink-0">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-3">
                        <ul class="flex flex-row sm:flex-col gap-1 sm:gap-2">
                            <li 
                                v-for="(item, index) in searchOptions" 
                                :key="index"
                                @click="searchOptionClick(index)"
                                class="flex items-center cursor-pointer px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
                                :class="selectedIndex === index 
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                                    : 'text-gray-700 hover:bg-gray-100'">
                                <font-awesome-icon :icon="item.icon" class="mr-2 sm:mr-3 text-xs sm:text-sm" />
                                <span class="font-medium">{{ item.label }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- All Section -->
                <div v-if="searchOptions[selectedIndex].label === 'All'" class="flex-1 w-full">
                    <!-- Users Section -->
                    <div v-if="artist && artist.length > 0" class="mb-8 sm:mb-12">
                        <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
                            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Users</h2>
                            <div @click="searchOptionClick(2)" 
                                class="flex items-center gap-2 text-sm sm:text-base text-gray-500 hover:text-orange-500 cursor-pointer transition-colors duration-200">
                                <span>All Users</span>
                                <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-xs" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
                            <div v-for="(item, index) in artist" :key="item.id" 
                                class="bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div class="flex flex-col items-center">
                                    <div @click="redirectToProfile(item.id)" class="cursor-pointer mb-3">
                                        <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-square relative overflow-hidden rounded-full ring-2 ring-gray-200 hover:ring-orange-400 transition-all duration-300">
                                            <img :src="item.profile_picture || defaultImage"
                                                class="w-full h-full object-cover rounded-full transform hover:scale-110 transition-transform duration-300"
                                                :alt="item.username">
                                        </div>
                                    </div>
                                    <div @click="redirectToProfile(item.id)" 
                                        class="flex items-center justify-center gap-1 mb-2 cursor-pointer group">
                                        <h3 class="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                                            {{ item.username }}
                                        </h3>
                                        <div v-if="item.is_verified" class="w-4 h-4 flex-shrink-0">
                                            <div class="w-full h-full bg-blue-500 rounded-full flex justify-center items-center">
                                                <font-awesome-icon icon="fa-solid fa-check" class="text-white text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-4">
                                        <font-awesome-icon icon="fa-solid fa-person" />
                                        <span>{{ item.followerCount }} {{ item.followerCount === 1 ? 'follower' : 'followers' }}</span>
                                    </div>
                                    <button 
                                        v-if="item.id != getCurrentUserId()" 
                                        @click="followToggle(item.id, index)"
                                        class="w-full rounded-full border-2 px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                        :class="item.isFollowed 
                                            ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600' 
                                            : 'border-orange-500 text-orange-500 hover:bg-orange-50'">
                                        <font-awesome-icon :icon="item.isFollowed ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                                        <span>{{ item.isFollowed ? 'Following' : 'Follow' }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tracks Section -->
                    <div v-if="songs && songs.length > 0" class="mb-8 sm:mb-12">
                        <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
                            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Tracks</h2>
                            <div @click="searchOptionClick(1)" 
                                class="flex items-center gap-2 text-sm sm:text-base text-gray-500 hover:text-orange-500 cursor-pointer transition-colors duration-200">
                                <span>All Tracks</span>
                                <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-xs" />
                            </div>
                        </div>
                        <div class="space-y-2 sm:space-y-3">
                            <div ref="menuContainer" 
                                v-for="(item, index) in songs" 
                                :key="item.id"
                                class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300">
                                <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative cursor-pointer"
                                    @click="togglePlay(index, item)">
                                    <img class="w-full h-full rounded-lg object-cover shadow-md" 
                                        :src="item.artwork" 
                                        :alt="item.title" />
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer">
                                        <font-awesome-icon 
                                            :icon="Number(playerStore.currentSong?.id) === Number(item.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                            class="text-white text-lg" />
                                    </div>
                                </div>
                                <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                                    <div class="flex-grow min-w-0">
                                        <div @click="redirectTrackInfo(item.id)"
                                            class="font-semibold text-sm sm:text-base md:text-lg text-gray-900 hover:text-orange-500 cursor-pointer truncate mb-1 transition-colors">
                                            {{ item.title }}
                                        </div>
                                        <div class="flex flex-wrap gap-x-2 gap-y-1">
                                            <div v-for="(artist, artistIndex) in item.SongArtists" 
                                                :key="artistIndex"
                                                @click="redirectToProfile(artist.User.id)"
                                                class="text-xs sm:text-sm text-gray-500 hover:text-orange-500 hover:underline cursor-pointer">
                                                {{ artist.User.username }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0 relative">
                                        <button @click.stop="optionSong(index)"
                                            class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
                                            <font-awesome-icon icon="fa-solid fa-ellipsis" />
                                        </button>
                                        <div v-if="openMenuIndex === index"
                                            class="absolute right-0 bottom-full mb-2 w-56 sm:w-64 bg-[#9057e0] rounded-lg shadow-xl z-30 overflow-hidden border border-purple-600/30">
                                            <ul>
                                                <div class="p-3 sm:p-4 border-b border-white/20">
                                                    <div class="flex gap-3">
                                                        <img class="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover"
                                                            :src="item.artwork" 
                                                            :alt="item.title" />
                                                        <div class="flex-1 min-w-0">
                                                            <div @click="redirectTrackInfo(item.id)"
                                                                class="font-semibold text-sm sm:text-base text-white hover:text-purple-200 cursor-pointer truncate mb-1">
                                                                {{ item.title }}
                                                            </div>
                                                            <div class="text-xs text-white/80 truncate">
                                                                <span v-for="(artist, artistIndex) in item.SongArtists" 
                                                                    :key="artistIndex">
                                                                    {{ artist.User.username }}<span v-if="artistIndex < item.SongArtists.length - 1">, </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <li @click="togglePlay(index, item)" class="text-left">
                                                    <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon :icon="Number(playerStore.currentSong?.id) === Number(item.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                                        </div>
                                                        <span>Play</span>
                                                    </div>
                                                </li>
                                                <li class="text-left">
                                                    <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon icon="fa-solid fa-plus" />
                                                        </div>
                                                        <span>Add to Playlist</span>
                                                    </div>
                                                </li>
                                                <li class="text-left">
                                                    <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon icon="fa-solid fa-forward-step" />
                                                        </div>
                                                        <span>Play Next</span>
                                                    </div>
                                                </li>
                                                <li class="text-left">
                                                    <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon icon="fa-regular fa-heart" />
                                                        </div>
                                                        <span>Like</span>
                                                    </div>
                                                </li>
                                                <li class="text-left">
                                                    <div @click="downloadFile(item.path, item.title)"
                                                        class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon icon="fa-solid fa-download" />
                                                        </div>
                                                        <span>Download</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Track Section -->
                <div v-if="searchOptions[selectedIndex].label === 'Track'" class="flex-1 w-full">
                    <div v-if="songs && songs.length > 0" class="mb-8 sm:mb-12">
                        <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
                            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Tracks</h2>
                        </div>
                        <div class="space-y-2 sm:space-y-3">
                            <div ref="menuContainer" 
                                v-for="(item, index) in songs" 
                                :key="item.id"
                                class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300">
                                <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative cursor-pointer"
                                    @click="togglePlay(index, item)">
                                    <img class="w-full h-full rounded-lg object-cover shadow-md" 
                                        :src="item.artwork" 
                                        :alt="item.title" />
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer">
                                        <font-awesome-icon 
                                            :icon="Number(playerStore.currentSong?.id) === Number(item.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                            class="text-white text-lg" />
                                    </div>
                                </div>
                                <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                                    <div class="flex-grow min-w-0">
                                        <div @click="redirectTrackInfo(item.id)"
                                            class="font-semibold text-sm sm:text-base md:text-lg text-gray-900 hover:text-orange-500 cursor-pointer truncate mb-1 transition-colors">
                                            {{ item.title }}
                                        </div>
                                        <div class="flex flex-wrap gap-x-2 gap-y-1">
                                            <div v-for="(artist, artistIndex) in item.SongArtists" 
                                                :key="artistIndex"
                                                @click="redirectToProfile(artist.User.id)"
                                                class="text-xs sm:text-sm text-gray-500 hover:text-orange-500 hover:underline cursor-pointer">
                                                {{ artist.User.username }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0 relative">
                                        <button @click.stop="optionSong(index)"
                                            class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
                                            <font-awesome-icon icon="fa-solid fa-ellipsis" />
                                        </button>
                                        <div v-if="openMenuIndex === index"
                                            class="absolute right-0 bottom-full mb-2 w-56 sm:w-64 bg-[#9057e0] rounded-lg shadow-xl z-30 overflow-hidden border border-purple-600/30">
                                            <ul>
                                                <div class="p-3 sm:p-4 border-b border-white/20">
                                                    <div class="flex gap-3">
                                                        <img class="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover"
                                                            :src="item.artwork" 
                                                            :alt="item.title" />
                                                        <div class="flex-1 min-w-0">
                                                            <div @click="redirectTrackInfo(item.id)"
                                                                class="font-semibold text-sm sm:text-base text-white hover:text-purple-200 cursor-pointer truncate mb-1">
                                                                {{ item.title }}
                                                            </div>
                                                            <div class="text-xs text-white/80 truncate">
                                                                <span v-for="(artist, artistIndex) in item.SongArtists" 
                                                                    :key="artistIndex">
                                                                    {{ artist.User.username }}<span v-if="artistIndex < item.SongArtists.length - 1">, </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <li @click="togglePlay(index, item)" class="text-left">
                                                    <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon :icon="Number(playerStore.currentSong?.id) === Number(item.id) && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                                        </div>
                                                        <span>Play</span>
                                                    </div>
                                                </li>
                                                <li class="text-left">
                                                    <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon icon="fa-solid fa-plus" />
                                                        </div>
                                                        <span>Add to Playlist</span>
                                                    </div>
                                                </li>
                                                <li class="text-left">
                                                    <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon icon="fa-solid fa-forward-step" />
                                                        </div>
                                                        <span>Play Next</span>
                                                    </div>
                                                </li>
                                                <li class="text-left">
                                                    <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon icon="fa-regular fa-heart" />
                                                        </div>
                                                        <span>Like</span>
                                                    </div>
                                                </li>
                                                <li class="text-left">
                                                    <div @click="downloadFile(item.path, item.title)"
                                                        class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                        <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                            <font-awesome-icon icon="fa-solid fa-download" />
                                                        </div>
                                                        <span>Download</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="h-64 flex flex-col justify-center items-center bg-white rounded-xl border border-gray-200">
                        <font-awesome-icon icon="fa-solid fa-music" class="text-gray-300 text-5xl mb-4" />
                        <div class="text-lg text-gray-500">No tracks found</div>
                    </div>
                </div>
                <!-- User Section -->
                <div v-if="searchOptions[selectedIndex].label === 'User'" class="flex-1 w-full">
                    <div v-if="artist && artist.length > 0" class="mb-8 sm:mb-12">
                        <div class="flex justify-between items-center w-full border-b-2 border-gray-200 pb-3 sm:pb-4 mb-6">
                            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Users</h2>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
                            <div v-for="(item, index) in artist" :key="item.id" 
                                class="bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div class="flex flex-col items-center">
                                    <div @click="redirectToProfile(item.id)" class="cursor-pointer mb-3">
                                        <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-square relative overflow-hidden rounded-full ring-2 ring-gray-200 hover:ring-orange-400 transition-all duration-300">
                                            <img :src="item.profile_picture || defaultImage"
                                                class="w-full h-full object-cover rounded-full transform hover:scale-110 transition-transform duration-300"
                                                :alt="item.username">
                                        </div>
                                    </div>
                                    <div @click="redirectToProfile(item.id)" 
                                        class="flex items-center justify-center gap-1 mb-2 cursor-pointer group">
                                        <h3 class="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                                            {{ item.username }}
                                        </h3>
                                        <div v-if="item.is_verified" class="w-4 h-4 flex-shrink-0">
                                            <div class="w-full h-full bg-blue-500 rounded-full flex justify-center items-center">
                                                <font-awesome-icon icon="fa-solid fa-check" class="text-white text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-4">
                                        <font-awesome-icon icon="fa-solid fa-person" />
                                        <span>{{ item.followerCount }} {{ item.followerCount === 1 ? 'follower' : 'followers' }}</span>
                                    </div>
                                    <button 
                                        v-if="item.id != getCurrentUserId()" 
                                        @click="followToggle(item.id, index)"
                                        class="w-full rounded-full border-2 px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                        :class="item.isFollowed 
                                            ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600' 
                                            : 'border-orange-500 text-orange-500 hover:bg-orange-50'">
                                        <font-awesome-icon :icon="item.isFollowed ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                                        <span>{{ item.isFollowed ? 'Following' : 'Follow' }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="h-64 flex flex-col justify-center items-center bg-white rounded-xl border border-gray-200">
                        <font-awesome-icon icon="fa-solid fa-user-group" class="text-gray-300 text-5xl mb-4" />
                        <div class="text-lg text-gray-500">No users found</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import { usePlayerStore } from '@/js/state';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
import { downloadFile } from '@/js/downloadFile';
export default {
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
            downloadFile,
        };
    },
    name: 'SearchResultPage',
    data() {
        return {
            selectedIndex: 0,
            openMenuIndex: null,
            songs: null,
            searchOptions: [
                {
                    label: 'All',
                    icon: 'fa-solid fa-magnifying-glass'
                },
                {
                    label: 'Track',
                    icon: 'fa-solid fa-compact-disc'
                },
                {
                    label: 'User',
                    icon: 'fa-solid fa-user'
                },
            ],
            artist: null,
            countFollower: [],
            currentSearchOption: 'All',
            message: '',
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
        }
    },
    mounted() {
        document.addEventListener("click", this.clickOutside);
        this.fetchSearchResult();
        
    },
    methods: {
        getCurrentUserId() {
            return getUserIdFromJWT();
        },
        togglePlay(index, song) {
            const playerStore = usePlayerStore();
            const username = song.SongArtists?.[0]?.User?.username || "Unknown Artist";

            // Check by song ID instead of index to avoid conflicts
            const currentSongId = Number(playerStore.currentSong?.id);
            const songId = Number(song.id);
            
            if (currentSongId === songId && !isNaN(currentSongId) && !isNaN(songId)) {
                if (playerStore.isPlaying) {
                    playerStore.pause();
                } else {
                    playerStore.resume();
                }
            }
            else {
                playerStore.play({
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    username: username,
                    duration: song.SongDetail?.duration || song.duration || 0,
                    path: song.path,
                });
            }
        },
        redirectToProfile(id) {
            this.$router.push({ path: `/profile/${id}` });
        },
        redirectTrackInfo(id) {
            this.$router.push({ path: `/trackinfo/${id}` });
        },

        async followToggle(id, index) {
            try {
                const payload = {
                    following_id: id,
                }
                await apiClient.post('http://localhost:3000/api/follow/addNewFollower', payload);
                console.log('Success', payload);
                this.artist[index].isFollowed = !this.artist[index].isFollowed;
            } catch (error) {
                console.error("Failed to follow:", error);
            }
        },
        async fetchSearchResult() {
            try {
                const response = await apiClient.get('http://localhost:3000/api/song/getSongSearch', {
                    params: {
                        key: this.searchQuery,
                    }
                });

                this.songs = response.data.data.songs;
                const artists = response.data.data.users;

                // Tạo mảng các promise để lấy số lượng follower
                const followerCountPromises = artists.map(user =>
                    apiClient.get('http://localhost:3000/api/follow/getCountFollower', {
                        params: { id: user.id }
                    })
                );

                // Tạo mảng các promise để lấy trạng thái follow
                const userId = getUserIdFromJWT();
                const followStatusPromises = artists.map(user =>
                    apiClient.get('http://localhost:3000/api/follow/getFollowStatus', {
                        params: {
                            follower_id: userId,
                            following_id: user.id
                        }
                    })
                );

                // Đợi tất cả các request hoàn thành
                const [followerCountResults, followStatusResults] = await Promise.all([
                    Promise.all(followerCountPromises),
                    Promise.all(followStatusPromises)
                ]);

                // Kết hợp dữ liệu user với số lượng follower và trạng thái follow
                this.artist = artists.map((user, index) => ({
                    ...user,
                    followerCount: followerCountResults[index]?.data?.data || 0, // Giá trị mặc định là 0 nếu không có dữ liệu
                    isFollowed: followStatusResults[index]?.data?.data?.isFollowing || false, // Giá trị mặc định là false
                }));
                if (this.currentSearchOption === 'All') {
                    this.artist = this.artist.slice(0, 5);
                }
                console.log('songs', this.songs);
                console.log('artists', this.artist);
            } catch (error) {
                console.error('Error fetching search result:', error);
            }
        },
        updateMetaTitle(query) {
            document.title = `Search result for: ${query}`;
        },
        searchOptionClick(index) {
            this.selectedIndex = index;
            this.currentSearchOption = this.searchOptions[index].label;
            console.log('currentSearchOption', this.currentSearchOption);
        },
        optionSong(index) {
            // this.songs[index].isMenuClick = !this.songs[index].isMenuClick;
            // console.log(this.songs[index].isMenuClick);
            if (this.openMenuIndex === index) {
                this.openMenuIndex = null;
            } else {
                this.openMenuIndex = index;
            }
        },
        clickOutside(event) {
            const openMenu = this.$refs.menuContainer?.[this.openMenuIndex]; // Lấy menu đang mở
            if (openMenu && !openMenu.contains(event.target)) {
                this.openMenuIndex = null; // Đóng menu nếu click ngoài
            }
        },
        addToPlaylist(index) {
            this.playlist[index].isAddToPlaylist = !this.playlist[index].isAddToPlaylist;
        },
        likePlaylist(index) {
            this.playlist[index].isLike = !this.playlist[index].isLike;
        },
        PlayPlaylist(index) {
            this.playlist[index].isAddToPlaylist;
        },
    },
    computed: {
        searchQuery() {
            return this.$route.query.q || "";
        }
    },
    watch: {
        searchQuery: {
            immediate: true,
            handler(newQuery) {
                if (newQuery) {
                    this.updateMetaTitle(newQuery);
                }
            }
        }
    },

    beforeUnmount() {
        document.removeEventListener("click", this.clickOutside);
    }
}
</script>

<style scoped></style>
<style scoped></style>