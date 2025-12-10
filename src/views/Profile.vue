<template>
    <div class="bg-gray-50 min-h-screen">
        <Header></Header>
        <div v-if="this.userById" class="pt-14 sm:pt-16 pb-8 sm:pb-16 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section with Background -->
            <div class="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-t-2xl overflow-hidden shadow-xl mb-4"
                :style="{
                    backgroundImage: `url('${userById.header_picture || 'http://localhost:8080/images/other/header_default.png'}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                <!-- Profile Picture -->
                <div class="absolute top-1/2 left-4 sm:left-8 md:left-12 transform -translate-y-1/2">
                    <div class="relative">
                        <div v-if="isUserCurrent" @click="ProfilePictureOpenDialog"
                            class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-xl cursor-pointer hover:shadow-2xl transition-all hover:scale-105">
                            <img :src="userById.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                class="rounded-full w-full h-full object-cover" alt="profile">
                        </div>
                        <div v-else
                            class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-xl">
                            <img :src="userById.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                class="rounded-full w-full h-full object-cover" alt="profile">
                        </div>
                        <button v-if="isUserCurrent" @click.stop="ProfilePictureOpenDialog" type="button"
                            class="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center rounded-full bg-white hover:bg-gray-100 shadow-lg border-2 border-gray-200 cursor-pointer transition-all hover:scale-110 z-10">
                            <font-awesome-icon icon="fa-solid fa-camera" class="text-gray-700 text-xs sm:text-sm" />
                        </button>
                    </div>
                </div>

                <!-- Header Upload Button -->
                <div class="absolute top-4 right-4">
                    <button v-if="isUserCurrent" @click="HeaderPictureOpenDialog" 
                        class="px-3 py-2 sm:px-4 sm:py-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                        <font-awesome-icon icon="fa-solid fa-camera" />
                        <span class="hidden sm:inline">Upload header</span>
                    </button>
                </div>
            </div>

            <!-- Profile Info Section -->
            <div class="bg-white rounded-b-2xl shadow-lg border border-gray-200 -mt-16 sm:-mt-20 md:-mt-24 pt-20 sm:pt-24 md:pt-28 pb-6 px-4 sm:px-6 md:px-8">
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                    <!-- Left: User Info -->
                    <div class="flex-grow">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
                                {{ userById.username }}
                                <div v-if="userById.is_verified"
                                    class="w-5 h-5 sm:w-6 sm:h-6 text-white bg-blue-500 rounded-full flex justify-center items-center">
                                    <font-awesome-icon icon="fa-solid fa-check" class="text-xs" />
                                </div>
                            </h1>
                        </div>
                        
                        <!-- Stats -->
                        <div class="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                            <button @click="gotoFollower" 
                                class="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors cursor-pointer">
                                <span class="font-semibold text-gray-900">{{ countFollower || 0 }}</span> followers
                            </button>
                            <button @click="gotoFollowing" 
                                class="text-sm sm:text-base text-gray-600 hover:text-orange-500 transition-colors cursor-pointer">
                                <span class="font-semibold text-gray-900">{{ countFollowing || 0 }}</span> following
                            </button>
                        </div>

                        <!-- Following Avatars -->
                        <div v-if="firstFourFollowingPictures && firstFourFollowingPictures.length > 0" class="flex items-center gap-2 mb-4">
                            <div class="flex -space-x-2">
                                <div v-for="(picture, index) in firstFourFollowingPictures" :key="index"
                                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden">
                                    <img :src="picture" class="w-full h-full object-cover"
                                        alt="Following user profile picture">
                                </div>
                            </div>
                            <router-link :to="'/following/' + profileId" 
                                class="text-xs sm:text-sm text-gray-600 hover:text-orange-500 transition-colors">
                                View all following
                            </router-link>
                        </div>

                        <!-- Bio & Address -->
                        <div class="space-y-2 text-sm sm:text-base text-left">
                            <div v-if="userById.province || userById.country">
                                <span class="font-semibold text-gray-900">Location:</span>
                                <span class="text-gray-600 ml-2">{{ userById.province }}{{ userById.province && userById.country ? ', ' : '' }}{{ userById.country }}</span>
                            </div>
                            <div v-if="userById.bio">
                                <span class="font-semibold text-gray-900">Bio:</span>
                                <span class="text-gray-600 ml-2">{{ userById.bio }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Action Buttons -->
                    <div class="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 flex-shrink-0">
                        <button v-if="isUserCurrent" @click="toggleEditProfile" 
                            class="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-pencil" />
                            <span>Edit Profile</span>
                        </button>
                        <router-link v-if="isUserCurrent" to="/achievements"
                            class="px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-trophy" />
                            <span>Achievements</span>
                        </router-link>
                        
                        <button v-if="!isUserCurrent" @click="followUser"
                            class="px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            :class="{
                                'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700': !isFollowed,
                                'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50': isFollowed
                            }">
                            <font-awesome-icon :icon="isFollowed ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                            <span>{{ isFollowed ? 'Following' : 'Follow' }}</span>
                        </button>
                        <button v-if="!isUserCurrent" @click="sendMessageClick"
                            class="px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                            <font-awesome-icon icon="fa-solid fa-message" />
                            <span>Send Message</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Profile Picture Modal -->
            <div v-if="isOpenDialogProfile"
                class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] p-4"
                @click.self="cancelImage">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                    <button @click="cancelImage" 
                        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <font-awesome-icon icon="fa-solid fa-times" />
                    </button>
                    <h2 class="text-xl font-semibold mb-4 text-gray-900 pr-8">Change Profile Picture</h2>
                    <div class="relative flex justify-center items-center mb-6">
                        <div class="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer hover:border-orange-400 transition-colors">
                            <img :src="profile_picture_preview || userById.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                alt="Preview" class="w-full h-full object-cover" />
                        </div>
                        <input @change="handleFileUpload"
                            class="absolute inset-0 opacity-0 cursor-pointer z-10" type="file"
                            accept=".jpg,.png" />
                    </div>
                    <div class="flex justify-end gap-3">
                        <button class="px-6 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium" 
                            @click="cancelImage">
                            Cancel
                        </button>
                        <button class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md"
                            @click="saveImage">
                            Save
                        </button>
                    </div>
                </div>
            </div>

            <!-- Header Picture Modal -->
            <div v-if="isOpenDialogHeaderProfile"
                class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] p-4"
                @click.self="cancelImage">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative">
                    <button @click="cancelImage" 
                        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10">
                        <font-awesome-icon icon="fa-solid fa-times" />
                    </button>
                    <h2 class="text-xl font-semibold mb-4 text-gray-900 pr-8">Change Header Picture</h2>
                    <div class="relative flex justify-center items-center mb-6 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all">
                        <img :src="header_picture_review || userById.header_picture || 'http://localhost:8080/images/other/header_default.png'"
                            alt="Preview" class="w-full h-64 sm:h-80 object-cover" />
                        <input @change="handleHeaderFileUpload" type="file" accept=".jpg,.png"
                            class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <div class="flex justify-end gap-3">
                        <button class="px-6 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium" 
                            @click="cancelImage">
                            Cancel
                        </button>
                        <button @click="saveHeaderImage"
                            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md">
                            Save
                        </button>
                    </div>
                </div>
            </div>
            <!-- Latest Upload Section -->
            <div class="mt-8 sm:mt-12">
                <h2 class="text-2xl sm:text-3xl text-left font-bold text-gray-900 mb-4 sm:mb-6">Latest Upload</h2>
                <div v-if="lastestSong && lastestSong.length > 0" class="space-y-3 sm:space-y-4">
                    <div v-for="(item, index) in lastestSong" :key="index"
                        class="group w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300">
                        <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative group-hover:scale-105 transition-transform">
                            <img class="w-full h-full rounded-lg object-cover shadow-md" 
                                :src="item.artwork || defaultImage" alt="" />
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer"
                                @click="togglePlay(index, item)">
                                <font-awesome-icon 
                                    :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                    class="text-white text-lg" />
                            </div>
                        </div>
                        <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                            <div class="flex-grow min-w-0">
                                <div @click="goToTrack(item.id)" 
                                    class="font-semibold text-base sm:text-lg text-gray-900 hover:text-orange-500 transition-colors cursor-pointer truncate mb-1">
                                    {{ item.title }}
                                </div>
                                <div class="text-sm text-gray-600 truncate mb-2">
                                    {{ item.User?.username || "Unknown Uploader" }}
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                        <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                        <span>{{ formatNumber(item.SongDetail?.plays || 0) }}</span>
                                    </div>
                                    <span class="text-xs px-2 py-0.5 rounded-full"
                                        :class="item.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
                                        {{ item.is_public ? 'Public' : 'Private' }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 flex-shrink-0">
                                <button @click.stop="togglePlay(index, item)"
                                    class="w-10 h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon
                                        :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                </button>
                                <button @click.stop="addToPlaylist(index, item)"
                                    class="w-10 h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                </button>
                                <button v-if="isUserCurrent" @click.stop="toggleEditTracks(item.id)"
                                    class="w-10 h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-pen" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-40 sm:h-48 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200">
                    <font-awesome-icon icon="fa-solid fa-music" class="text-gray-400 text-4xl mb-3" />
                    <div class="text-base sm:text-lg text-gray-500 text-center px-4">{{ userById.username }} hasn't uploaded any songs yet.</div>
                </div>
            </div>
            <!-- Most-Listened Track Section -->
            <div class="mt-8 sm:mt-12">
                <h2 class="text-2xl sm:text-3xl text-left font-bold text-gray-900 mb-4 sm:mb-6">Most-Listened Track</h2>
                <div v-if="mostListenSong && mostListenSong.length > 0" class="space-y-3 sm:space-y-4">
                    <div v-for="(item, index) in mostListenSong" :key="index"
                        class="group w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300">
                        <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative group-hover:scale-105 transition-transform">
                            <img class="w-full h-full rounded-lg object-cover shadow-md" 
                                :src="item.artwork || defaultImage" alt="" />
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity cursor-pointer"
                                @click="togglePlay(index, item)">
                                <font-awesome-icon 
                                    :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                    class="text-white text-lg" />
                            </div>
                        </div>
                        <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                            <div class="flex-grow min-w-0">
                                <div class="font-semibold text-base sm:text-lg text-gray-900 hover:text-orange-500 transition-colors cursor-pointer truncate mb-1">
                                    {{ item.title }}
                                </div>
                                <div class="text-sm text-gray-600 truncate mb-2">
                                    <span v-for="(artist, idx) in item.SongArtists" :key="idx">
                                        <span v-if="idx > 0">, </span>{{ artist.User?.username || "Unknown Uploader" }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                        <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                        <span>{{ formatNumber(item.SongDetail?.plays || 0) }}</span>
                                    </div>
                                    <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Public</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 flex-shrink-0">
                                <button @click.stop="togglePlay(index, item)"
                                    class="w-10 h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon
                                        :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                </button>
                                <button @click.stop="addToPlaylist(index, item)"
                                    class="w-10 h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                </button>
                                <button v-if="isUserCurrent" @click.stop="toggleEditTracks(item.id)"
                                    class="w-10 h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-pen" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-40 sm:h-48 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200">
                    <font-awesome-icon icon="fa-solid fa-chart-line" class="text-gray-400 text-4xl mb-3" />
                    <div class="text-base sm:text-lg text-gray-500 text-center px-4">No tracks have been played yet.</div>
                </div>
            </div>
            <!-- All Tracks Section -->
            <div class="mt-8 sm:mt-12">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">All Tracks by {{ userById.username }}</h2>
                <div v-if="songUser.length > 0" class="space-y-2 sm:space-y-3">
                    <div v-for="(item, index) in pageData" :key="item.id"
                        class="group w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-300">
                        <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
                            <img class="w-full h-full rounded-lg object-cover" :src="item.artwork || defaultImage"
                                alt="artwork" />
                        </div>
                        <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                            <div class="flex-grow min-w-0">
                                <router-link :to="`/trackinfo/${item.id}`" 
                                    class="font-semibold text-sm sm:text-base text-gray-900 hover:text-orange-500 transition-colors truncate block mb-1">
                                    {{ item.title }}
                                </router-link>
                                <div class="text-xs sm:text-sm text-gray-600 truncate mb-1">
                                    {{ item.User?.username }}
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-1 text-xs text-gray-500">
                                        <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                        <span>{{ formatNumber(item.SongDetail?.plays || 0) }}</span>
                                    </div>
                                    <div v-if="Number(item.is_public) === 0" class="flex items-center gap-1 text-xs text-blue-600">
                                        <font-awesome-icon icon="fa-solid fa-lock" />
                                        <span>Private</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 flex-shrink-0">
                                <button @click.stop="togglePlay(index, item)"
                                    class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon
                                        :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                        class="text-xs sm:text-sm" />
                                </button>
                                <button @click.stop="addToPlaylist(index, item)"
                                    class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-plus" class="text-xs sm:text-sm" />
                                </button>
                                <button v-if="idUserCurrent === userById.id" @click.stop="toggleEditTracks(item.id)"
                                    class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-pen" class="text-xs sm:text-sm" />
                                </button>
                                <button @click.stop="toggleLike(index, item.id)"
                                    class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 transition-all cursor-pointer"
                                    :class="likedSongs.includes(item.id) 
                                        ? 'border-orange-500 text-orange-500 bg-orange-50' 
                                        : 'border-gray-300 hover:border-orange-500 hover:text-orange-500'">
                                    <font-awesome-icon icon="fa-solid fa-heart" class="text-xs sm:text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-40 sm:h-48 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200">
                    <font-awesome-icon icon="fa-solid fa-music" class="text-gray-400 text-4xl mb-3" />
                    <div class="text-base sm:text-lg text-gray-500 text-center px-4">{{ userById.username }} hasn't uploaded any tracks yet.</div>
                </div>
                
                <!-- Pagination -->
                <div v-if="songUser.length > 0 && totalPage > 1" class="mt-6 flex justify-center items-center gap-2">
                    <button class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="currentPage = Math.max(1, currentPage - 1)"
                        :disabled="currentPage === 1">
                        <font-awesome-icon icon="fa-solid fa-angles-left" />
                    </button>
                    <button v-for="(page) in pageToShow" :key="page"
                        @click="currentPage = page"
                        class="px-4 py-2 rounded-lg border transition-all min-w-[40px]"
                        :class="currentPage === page 
                            ? 'bg-orange-500 text-white border-orange-500' 
                            : 'border-gray-300 hover:bg-gray-100'">
                        {{ page }}
                    </button>
                    <button class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="currentPage = Math.min(this.totalPage, currentPage + 1)"
                        :disabled="currentPage === totalPage">
                        <font-awesome-icon icon="fa-solid fa-angles-right" />
                    </button>
                </div>
            </div>
            <!-- Likes Section -->
            <div class="mt-8 sm:mt-12">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Likes by {{ userById.username }}</h2>
                <div v-if="likeByUser && likeByUser.length > 0" class="space-y-2 sm:space-y-3">
                    <div v-for="(item, index) in pageLikeData" :key="item.id"
                        class="group w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-300">
                        <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
                            <img class="w-full h-full rounded-lg object-cover" 
                                :src="item.Song.artwork || defaultImage" alt="" />
                        </div>
                        <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                            <div class="flex-grow min-w-0">
                                <router-link :to="`/trackinfo/${item.Song.id}`" 
                                    class="font-semibold text-sm sm:text-base text-gray-900 hover:text-orange-500 transition-colors truncate block mb-1">
                                    {{ item.Song.title }}
                                </router-link>
                                <div class="text-xs sm:text-sm text-gray-600 truncate mb-1">
                                    {{ item.Song.User?.username || "Unknown Uploader" }}
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-1 text-xs text-gray-500">
                                        <font-awesome-icon icon="fa-solid fa-play" class="text-orange-500" />
                                        <span>{{ formatNumber(item.Song.SongDetail?.plays || 0) }}</span>
                                    </div>
                                    <div v-if="Number(item.Song.is_public) === 0" class="flex items-center gap-1 text-xs text-blue-600">
                                        <font-awesome-icon icon="fa-solid fa-lock" />
                                        <span>Private</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 flex-shrink-0">
                                <button @click.stop="togglePlay(index, item.Song)"
                                    class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon
                                        :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
                                        class="text-xs sm:text-sm" />
                                </button>
                                <button @click.stop="addToPlaylist(index, item.Song)"
                                    class="w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-plus" class="text-xs sm:text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-40 sm:h-48 w-full flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-200">
                    <font-awesome-icon icon="fa-solid fa-heart" class="text-gray-400 text-4xl mb-3" />
                    <div class="text-base sm:text-lg text-gray-500 text-center px-4">{{ userById.username }} hasn't liked any tracks yet.</div>
                </div>
                
                <!-- Pagination -->
                <div v-if="likeByUser && likeByUser.length > 0 && totalLikePage > 1" class="mt-6 flex justify-center items-center gap-2">
                    <button class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="currentLikePage = Math.max(1, currentLikePage - 1)"
                        :disabled="currentLikePage === 1">
                        <font-awesome-icon icon="fa-solid fa-angles-left" />
                    </button>
                    <button v-for="(page) in pageLikeToShow" :key="page"
                        @click="currentLikePage = page"
                        class="px-4 py-2 rounded-lg border transition-all min-w-[40px]"
                        :class="currentLikePage === page 
                            ? 'bg-orange-500 text-white border-orange-500' 
                            : 'border-gray-300 hover:bg-gray-100'">
                        {{ page }}
                    </button>
                    <button class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="currentLikePage = Math.min(this.totalLikePage, currentLikePage + 1)"
                        :disabled="currentLikePage === totalLikePage">
                        <font-awesome-icon icon="fa-solid fa-angles-right" />
                    </button>
                </div>
            </div>
        </div>
        <!-- Edit Profile Modal -->
        <div v-if="isEditProfile && userById"
            class="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4 overflow-y-auto"
            @click.self="toggleCancel">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Edit Your Profile</h2>
                    <button @click="toggleCancel" class="text-gray-500 hover:text-gray-700 transition-colors">
                        <font-awesome-icon icon="fa-solid fa-times" class="text-xl" />
                    </button>
                </div>
                <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                        <input v-model="usernameUser" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base"
                            type="text" placeholder="Enter your display name">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <select v-model="provinceUser"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base">
                                <option value="">Select a city</option>
                                <option v-for="(item, index) in province" :key="index" :value="item.name">{{ item.name }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                            <select v-model="country" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base">
                                <option>Việt Nam</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea v-model="bio" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-base"
                            rows="4" placeholder="Tell us about yourself..."></textarea>
                    </div>
                </div>
                <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                    <button @click="toggleCancel"
                        class="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        Cancel
                    </button>
                    <button @click="SaveInfoUser"
                        class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
        <!-- Edit Track Modal -->
        <div v-if="isEditTracks"
            class="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4 overflow-y-auto"
            @click.self="isEditTracks = false">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Edit Track</h2>
                    <button @click="isEditTracks = false" class="text-gray-500 hover:text-gray-700 transition-colors">
                        <font-awesome-icon icon="fa-solid fa-times" class="text-xl" />
                    </button>
                </div>
                <div class="p-4 sm:p-6">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input v-model="editTitle" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base"
                            type="text" placeholder="Enter track title">
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Artwork</label>
                            <div class="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-orange-400 transition-colors">
                                <button type="button" class="w-full h-full relative">
                                    <img v-if="imageURL" :src="imageURL"
                                        class="w-full h-full object-cover" alt="artwork">
                                    <div v-else class="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                                        <font-awesome-icon icon="fa-solid fa-upload" class="text-4xl" />
                                        <span class="text-base sm:text-lg">Add new artwork</span>
                                    </div>
                                    <input ref="fileInput" type="file" accept=".jpg,.png" @change="handleFileUploadEdit"
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                                </button>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                                <select v-model="selectedGenre" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base">
                                    <option value="">Select a genre</option>
                                    <option v-for="item in genreList" :key="item.id" :value="item">
                                        {{ item.name }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea v-model="bioEdit" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-base"
                                    rows="4" placeholder="Enter track description..."></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">Track Privacy</label>
                                <div class="flex gap-6">
                                    <label class="flex items-center cursor-pointer">
                                        <input v-model="privacy" value="1" type="radio" class="w-4 h-4 text-orange-500 focus:ring-orange-500">
                                        <span class="ml-2 text-sm font-medium text-gray-700">Public</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input v-model="privacy" value="0" type="radio" class="w-4 h-4 text-orange-500 focus:ring-orange-500">
                                        <span class="ml-2 text-sm font-medium text-gray-700">Private</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                    <button @click="isEditTracks = false"
                        class="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        Cancel
                    </button>
                    <button @click="editTrack"
                        class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import { notification } from 'ant-design-vue';
import Header from '@/components/Header.vue';
import { usePlayerStore } from '@/js/state';
import axios from 'axios';
export default {
    name: 'ProfilePage',
    setup() {

        const playerStore = usePlayerStore();
        return {
            playerStore,
        }
    },
    data() {
        return {
            profileId: null,
            user_image_profile: {
                profile_picture: this.profile_picture_url,
                header_picture: this.header_picture_url
            },
            usernameUser: null,
            provinceUser: null,
            country: null,
            bio: null,
            streamCount: null,
            idUserCurrent: null,
            currentUser: null,
            userById: null,
            currentPage: 1,
            profile_picture_url: null,
            header_picture_url: null,
            profile_picture_preview: null,
            header_picture_review: null,
            follower: null,
            currentLikePage: 1,
            itemPerPage: 5,
            numofpageToShow: 3,
            isEditProfile: false,
            isUserCurrent: true,
            isOpenDialogProfile: false,
            isOpenDialogHeaderProfile: false,
            isFollowed: false,
            province: [],
            songUser: [],
            messageSong: 'No song found',
            lastestSong: null,
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            isEditTracks: false,
            genreList: [],
            selectedGenre: '',
            editTitle: '',
            imageURL: null,
            bioEdit: '',
            privacy: '1',
            idSelected: null,
            mostListenSong: null,
            likedSongs: [],
            countFollower: null,
            countFollowing: null,
            likeByUser: [],
            firstFourFollowingPictures: [],
        }
    },
    methods: {
        goToTrack(id) {
            this.$router.push({ name: 'TrackInfoPage', params: { id } });
        },
        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        },
        gotoFollower() {
            this.$router.push({ path: '/followers/' + this.profileId })
        },
        gotoFollowing() {
            this.$router.push({ path: '/following/' + this.profileId })
        },
        async fetchFollowing() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/follow/getAllFollowing`, {
                    params: { id: this.profileId }
                });

                // Lấy danh sách following users
                const followingUsers = response.data.data;

                // Lấy 4 ảnh đầu tiên của người dùng được follow
                this.firstFourFollowingPictures = followingUsers
                    .slice(0, 4)
                    .map(user => user.following.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg');

                // Tạo mảng các promise để check follow status cho từng user
                const followStatusPromises = followingUsers.map(user =>
                    apiClient.get('http://localhost:3000/api/follow/getFollowStatus', {
                        params: {
                            follower_id: this.profileId,
                            following_id: user.following.id
                        }
                    })
                );

                const followStatusResults = await Promise.all(followStatusPromises);

                // Kết hợp dữ liệu user với trạng thái follow
                this.users = followingUsers.map((user, index) => ({
                    ...user,
                    isFollowed: followStatusResults[index].data.data.isFollowing
                }));

                console.log('users with follow status:', this.users);
            } catch (error) {
                console.error('Error fetching following:', error);
            }
        },
        async fetchCountFollower() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/follow/getCountFollower`, {
                    params: {
                        id: this.profileId,
                    }
                });
                this.countFollower = response.data.data;
                console.log('countFollower', this.countFollower);
            } catch (error) {
                console.error('Error fetching count follower:', error);
            }
        },
        async fetchCountFollowing() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/follow/getCountFollowing`, {
                    params: {
                        id: this.profileId,
                    }
                });
                this.countFollowing = response.data.data;
                console.log('countFollower', this.countFollower);
            } catch (error) {
                console.error('Error fetching count follower:', error);
            }
        },
        async fetchSongLikeByUser() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/like/getSongLikeById`, {
                    params: {
                        user_id: this.profileId,
                    }
                });
                this.likeByUser = response.data.data;
                console.log('likeByUser', this.likeByUser);
            } catch (error) {
                console.error('Error fetching liked songs:', error);
            }
        },
        async fetchLikedSongs() {
            if (!this.idUserCurrent) return; // Không fetch nếu chưa đăng nhập

            try {
                // Tạo một mảng promises để gọi API cho từng bài hát
                const promises = this.songUser.map(song =>
                    apiClient.get(`http://localhost:3000/api/like/getLikeStatus`, {
                        params: {
                            user_id: this.idUserCurrent,
                            song_id: song.id
                        }
                    }).then(response => ({
                        songId: song.id,
                        isLiked: response.data.isLiked
                    }))
                );

                // Đợi tất cả các requests hoàn thành
                const results = await Promise.all(promises);

                // Lọc ra những bài hát được like (isLiked = true)
                this.likedSongs = results
                    .filter(result => result.isLiked)
                    .map(result => result.songId);

                console.log("Fetched liked songs:", this.likedSongs);
            } catch (error) {
                console.error('Error fetching liked songs:', error);
                this.likedSongs = []; // Reset về mảng rỗng nếu có lỗi
            }
        },
        async toggleLike(index, songId) {
            if (!this.idUserCurrent) return;

            try {
                const payload = {
                    song_id: songId,
                    user_id: this.idUserCurrent
                }
                await apiClient.post(`http://localhost:3000/api/like/toggleLike`, payload);

                // Đảm bảo likedSongs là mảng trước khi thao tác
                if (!Array.isArray(this.likedSongs)) {
                    this.likedSongs = [];
                }

                // Cập nhật trạng thái like ngay lập tức
                if (this.likedSongs.includes(songId)) {
                    // Nếu đã like thì bỏ like
                    this.likedSongs = this.likedSongs.filter(id => id !== songId);
                    notification.success({
                        message: 'Success',
                        description: 'Unike song succcessfully',
                        duration: 3,
                    });
                } else {
                    // Nếu chưa like thì thêm vào
                    this.likedSongs.push(songId);
                    notification.success({
                        message: 'Success',
                        description: 'Like song succcessfully',
                        duration: 3,
                    });
                }
            } catch (error) {
                console.error('Error toggling like:', error);
            }
        },
        async getMostListenTrack() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/song/getMostListenTrack/${this.profileId}`);
                this.mostListenSong = response.data.data;
                console.log('mostListenSong', this.mostListenSong);
            } catch (error) {
                console.log('Error get most listen song', error);
            }
        },
        async getTrackInfoById() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/song/getSongById/${this.idSelected}`);
                this.trackInfo = response.data.data;
                this.imageURL = this.trackInfo.artwork;
                this.editTitle = this.trackInfo.title;
                this.selectedGenre = this.trackInfo.genre_id || '';
                this.bioEdit = this.trackInfo.bio || '';
                this.privacy = this.trackInfo.is_public ? '1' : '0';
            } catch (error) {
                console.log('Error get track info', error);
            }
        },
        async getGenre() {
            try {
                const response = await apiClient.get('http://localhost:3000/api/songdetail/getGenre');
                this.genreList = response.data.data;
            } catch (error) {
                console.log('Error get genre', error);
            }
        },
        async editTrack() {
            if (!this.editTitle || this.editTitle.trim() === '') {
                notification.warning({
                    message: 'Validation Error',
                    description: 'Please enter a track title.',
                    duration: 3,
                });
                return;
            }

            try {
                const payload = {
                    artwork: this.imageURL,
                    title: this.editTitle,
                    genre: this.selectedGenre.name,
                    bio: this.bioEdit || null,
                    privacy: parseInt(this.privacy),
                }
                console.log('payload', payload);
                const response = await apiClient.put(`http://localhost:3000/api/song/updateSong/${this.idSelected}`, payload);
                if (response.data) {
                    this.isEditTracks = false;
                    try {
                        await this.loadProfile();
                    } catch (error) {
                        console.error('Error reloading profile:', error);
                    }
                    notification.success({
                        message: 'Track Updated',
                        description: 'Your track has been updated successfully.',
                        duration: 3,
                    });
                }
            } catch (error) {
                console.log('Error edit track', error);
                notification.error({
                    message: 'Update Failed',
                    description: 'Failed to update track. Please try again later.',
                    duration: 3,
                });
            }
        },
        toggleEditTracks(id) {
            this.isEditTracks = !this.isEditTracks;
            this.idSelected = id;
            this.getTrackInfoById();
            console.log('idSelected', this.idSelected);
        },
        async getLastestSong() {
            try {
                const id = this.$route.params.id;
                const res = await apiClient.get(`http://localhost:3000/api/song/getLastestSong/${id}`);
                this.lastestSong = res.data.data;
                console.log('last: ', this.lastestSong)
            } catch (error) {
                console.log('Error when get lastest song : ', error)
            }
        },
        getRoomId(u1, u2) {
            return [u1, u2].sort().join('_');
        },
        sendMessageClick() {
            const receiveId = this.$route.params.id;
            const room_id = this.getRoomId(this.idUserCurrent, receiveId);
            this.$router.push({
                name: 'MessagePage',
                params: { id: room_id },
            });

        },
        async fetchProvince() {
            try {
                const response = await apiClient.get('http://localhost:3000/api/users/getProvince')
                this.province = response.data; // Gán dữ liệu trực tiếp
            } catch (error) {
                console.error("Failed to fetch provinces:", error);
            }
        },
        async getFollowerById() {
            try {
                const res = await apiClient.get(`http://localhost:3000/api/follow/getFollowerById/${this.profileId}`);
                this.follower = res.data.data;
                if (this.follower) {
                    this.isFollowed = true;
                }
                else {
                    this.isFollowed = false;
                }

            } catch (error) {
                console.error("Failed to fetch followers:", error);
            }
        },
        async followUser() {
            console.log(this.profileId)
            try {
                const payload = {
                    following_id: this.profileId,
                }
                await apiClient.post('http://localhost:3000/api/follow/addNewFollower', payload);
                this.getFollowerById();
                console.log('Success', payload);
                notification.success({
                    message: 'Success',
                    description: `You are now following ${this.userById?.username || 'this user'}.`,
                    duration: 3,
                });
            } catch (error) {
                console.error("Failed to follow:", error);
                notification.error({
                    message: 'Failed to follow',
                    description: 'Unable to follow this user. Please try again later.',
                    duration: 3,
                });
            }
        },
        async SaveInfoUser() {
            try {
                const payload = {
                    username: this.usernameUser,
                    province: this.provinceUser,
                    country: this.country,
                    bio: this.bio
                }
                await apiClient.put('http://localhost:3000/api/users/updateUserInfo', payload);
                console.log('Success', payload);
                try {
                    await this.loadProfile();
                } catch (error) {
                    console.error('Error reloading profile:', error);
                }
                this.toggleCancel();
                notification.success({
                    message: 'Profile Updated',
                    description: 'Your profile information has been updated successfully.',
                    duration: 3,
                });
            } catch (error) {
                console.error("Failed to update:", error);
                notification.error({
                    message: 'Update Failed',
                    description: 'Failed to update your profile. Please try again later.',
                    duration: 3,
                });
            }
        },
        cancelImage() {
            this.isOpenDialogProfile = false;
            this.isOpenDialogHeaderProfile = false;
        },
        // triggerFileInput() {
        //     // Kích hoạt input file khi nhấn vào ảnh
        //     this.$refs.fileInput.click();
        // },
        async saveImage() {
            if (!this.profile_picture_file) {
                notification.warning({
                    message: 'No Image Selected',
                    description: 'Please select an image before saving.',
                    duration: 3,
                });
                return;
            }

            try {
                const formData = new FormData();
                formData.append("file", this.profile_picture_file);
                formData.append("upload_preset", "ml_default");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dxgqkbchh/image/upload",
                    formData
                );

                const profile_picture_res = response.data.secure_url;

                const payload = {
                    profilePicture: profile_picture_res,
                };
                await apiClient.put('/users/updateProfilePicture', payload);
                this.isOpenDialogProfile = false;
                this.profile_picture_preview = null;
                this.profile_picture_file = null;
                try {
                    await this.loadProfile();
                } catch (error) {
                    console.error('Error reloading profile:', error);
                }
                notification.success({
                    message: 'Success',
                    description: 'Your profile picture has been updated successfully.',
                    duration: 3,
                });
            } catch (error) {
                console.log("Error: ", error);
                notification.error({
                    message: 'Upload Failed',
                    description: 'Failed to update profile picture. Please try again later.',
                    duration: 3,
                });
            }
        },
        async saveHeaderImage() {
            if (!this.header_picture_file) {
                notification.warning({
                    message: 'No Image Selected',
                    description: 'Please select an image before saving.',
                    duration: 3,
                });
                return;
            }

            try {
                const formData = new FormData();
                formData.append("file", this.header_picture_file);
                formData.append("upload_preset", "ml_default");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dxgqkbchh/image/upload",
                    formData
                );

                const header_picture_res = response.data.secure_url;

                const payload = {
                    headerpicture: header_picture_res,
                };
                await apiClient.put('/users/updateHeaderPicture', payload);
                this.isOpenDialogHeaderProfile = false;
                this.header_picture_file = null;
                this.header_picture_review = null;
                try {
                    await this.loadProfile();
                } catch (error) {
                    console.error('Error reloading profile:', error);
                }
                notification.success({
                    message: 'Success',
                    description: 'Your header picture has been updated successfully.',
                    duration: 3,
                });
            } catch (error) {
                console.log("Error: ", error);
                notification.error({
                    message: 'Upload Failed',
                    description: 'Failed to update header picture. Please try again later.',
                    duration: 3,
                });
            }
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Kiểm tra định dạng file
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                notification.error({
                    message: 'Invalid File Type',
                    description: 'Please select a JPG or PNG image file.',
                    duration: 3,
                });
                event.target.value = null;
                return;
            }

            // Kiểm tra kích thước file (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                notification.error({
                    message: 'File Too Large',
                    description: 'Please select an image smaller than 5MB.',
                    duration: 3,
                });
                event.target.value = null;
                return;
            }

            // Lưu file object để upload sau này
            this.profile_picture_preview = URL.createObjectURL(file);
            this.profile_picture_file = file;
            event.target.value = null;
            notification.info({
                message: 'Image Selected',
                description: 'Click "Save" to update your profile picture.',
                duration: 2,
            });
        },

        handleHeaderFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Kiểm tra định dạng file
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                notification.error({
                    message: 'Invalid File Type',
                    description: 'Please select a JPG or PNG image file.',
                    duration: 3,
                });
                event.target.value = null;
                return;
            }

            // Kiểm tra kích thước file (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                notification.error({
                    message: 'File Too Large',
                    description: 'Please select an image smaller than 5MB.',
                    duration: 3,
                });
                event.target.value = null;
                return;
            }

            // Lưu file object để upload sau này
            this.header_picture_file = file;
            this.header_picture_review = URL.createObjectURL(file);
            event.target.value = null;
            notification.info({
                message: 'Image Selected',
                description: 'Click "Save" to update your header picture.',
                duration: 2,
            });
        },
        handleFileUploadEdit(event) {
            const file = event.target.files[0]; // Lấy file đầu tiên
            if (file) {
                // Kiểm tra định dạng file
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!validTypes.includes(file.type)) {
                    notification.error({
                        message: 'Invalid File Type',
                        description: 'Please select a JPG or PNG image file.',
                        duration: 3,
                    });
                    event.target.value = null;
                    return;
                }

                // Kiểm tra kích thước file (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    notification.error({
                        message: 'File Too Large',
                        description: 'Please select an image smaller than 5MB.',
                        duration: 3,
                    });
                    event.target.value = null;
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imageURL = e.target.result; // Gán URL ảnh vào `imageUrl`
                    notification.info({
                        message: 'Artwork Updated',
                        description: 'Artwork preview updated. Click "Save Changes" to apply.',
                        duration: 2,
                    });
                };
                reader.readAsDataURL(file); // Đọc file dưới dạng DataURL
                event.target.value = null;
            }
        },
        ProfilePictureOpenDialog() {
            this.isOpenDialogProfile = true;
        },
        HeaderPictureOpenDialog() {
            this.isOpenDialogHeaderProfile = true
        },
        addToPlaylist(index, song) {
            const isAlreadyInPlaylist = this.playerStore.playlist.some((item) => item.id === song.id);

            if (!isAlreadyInPlaylist) {
                this.playerStore.addToPlaylist(song);
                console.log("Added to playlist:", this.playerStore.playlist);
                notification.success({
                    message: 'Added to Playlist',
                    description: `${song.title} has been added to your playlist.`,
                    duration: 2,
                });
            } else {
                notification.info({
                    message: 'Already in Playlist',
                    description: `${song.title} is already in your playlist.`,
                    duration: 2,
                });
            }

        },

        togglePlay(index, song) {
            const playerStore = usePlayerStore();

            if (playerStore.currentPlayIndex === index) {
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
                    username: song.User.username,
                    duration: song.SongDetail.duration,
                    path: song.path,
                });
                playerStore.logUserListen(song.id);
                playerStore.currentPlayIndex = index;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPage) {
                this.currentPage++;
            }

        },

        prePage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        toggleEditProfile() {
            this.isEditProfile = !this.isEditProfile;
            document.body.style.overflow = this.isEditProfile ? "hidden" : "";
        },
        toggleCancel() {
            this.isEditProfile = false;
            document.body.style.overflow = this.isEditProfile ? "hidden" : "";
        },
        async loadProfile() {
            try {
                console.log(this.profileId);
                const [songResponse, userResponse, userByIdRes] = await Promise.all([
                    apiClient.get(`/song/getAllSong/${this.profileId}`),
                    apiClient.get("/users/getCurrentUser"),
                    apiClient.get(`/users/getUserById/${this.profileId}`),
                ]);

                this.songUser = songResponse.data.data;
                console.log(this.songUser)
                if (this.songUser.length == 0) {
                    this.messageSong = songResponse.data.message;
                }
                else {
                    this.messageSong = ""; // Xóa thông báo nếu có bài hát
                }
                console.log(this.messageSong);

                this.currentUser = userResponse.data.data || {};
                this.idUserCurrent = this.currentUser.id || null;
                this.userById = userByIdRes.data.data || null;
                this.usernameUser = this.userById.username;
                this.fetchSongLikeByUser();
                // Load liked songs sau khi đã có songUser và idUserCurrent
                await this.fetchLikedSongs();

                if (parseInt(this.profileId) !== this.idUserCurrent) {
                    this.isUserCurrent = false;
                }
                else {
                    this.isUserCurrent = true;
                }
                console.log('isUserCurrent', this.isUserCurrent);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Chỉ log error, không redirect vì interceptor đã xử lý redirect nếu cần
                // Nếu không phải lỗi 401 (đã được interceptor xử lý), chỉ reset data
                if (!error.response || error.response.status !== 401) {
                    this.songUser = [];
                    this.currentUser = {};
                    this.idUserCurrent = null;
                }
                // Re-throw để caller có thể xử lý
                throw error;
            }
        },
    },
    computed: {
        headerBackground() {
            return this.header_picture_url
                ? { backgroundImage: `url('${this.header_picture_url}')` }
                : {};
        },
        filteredSongs() {
            if (!this.songUser) return [];

            console.log('isUserCurrent:', this.isUserCurrent);
            console.log('songUser:', this.songUser);

            if (this.isUserCurrent) {
                return this.songUser;
            } else {
                const publicSongs = this.songUser.filter(song => Number(song.is_public) === 1);
                console.log('publicSongs:', publicSongs);
                return publicSongs;
            }
        },
        filteredSongsLike() {
            if (!this.likeByUser) return [];
            if (this.isUserCurrent) {
                return this.likeByUser;
            } else {
                const publicSongs = this.likeByUser.filter(song => Number(song.Song.is_public) === 1);
                return publicSongs;
            }
        },
        pageData() {
            const start = (this.currentPage - 1) * this.itemPerPage;
            const end = start + this.itemPerPage;
            return this.filteredSongs.slice(start, end);
        },
        totalPage() {
            return Math.ceil(this.filteredSongs.length / this.itemPerPage);
        },
        pageToShow() {
            const pages = [];
            const half = Math.floor(this.numofpageToShow / 2);
            let start = Math.max(1, this.currentPage - half);
            let end = Math.min(this.totalPage, this.currentPage + half);

            if (end - start + 1 < this.numofpageToShow) {
                if (start === 1) {
                    end = Math.min(this.totalPage, start + this.numofpageToShow - 1);
                }
                else if (end === this.totalPage) {
                    start = Math.max(1, end - this.numofpageToShow + 1)
                }
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },
        totalLikePage() {
            return Math.ceil(this.likeByUser.length / this.itemPerPage);
        },
        pageLikeData() {
            const start = (this.currentLikePage - 1) * this.itemPerPage; //stt dau tien cua moi trang
            const end = start + this.itemPerPage //stt ket thuc vi du nhu la o trang 2 la 6->10
            return this.filteredSongsLike.slice(start, end); //tra ve stt
        },
        pageLikeToShow() {
            const pages = [];
            const half = Math.floor(this.numofpageToShow / 2);
            let start = Math.max(1, this.currentLikePage - half);
            let end = Math.min(this.totalLikePage, this.currentLikePage + half);

            if (end - start + 1 < this.numofpageToShow) {
                if (start === 1) {
                    end = Math.min(this.totalLikePage, start + this.numofpageToShow - 1);
                }
                else if (end === this.totalLikePage) {
                    start = Math.max(1, end - this.numofpageToShow + 1)
                }
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },

    },
    watch: {
        profile_picture_url(newValue) {
            this.user_image_profile.profile_picture = newValue;
            console.log('New image URL:', newValue);
        },
        header_picture_url(newValue) {
            this.user_image_profile.header_picture = newValue;
            console.log('New image URL:', newValue);
        },
        '$route.params.id': async function (newId, oldId) {
            if (newId !== oldId) {
                await this.loadProfile();
            }
        }
    },
    async mounted() {
        this.profileId = this.$route.params.id;
        await this.loadProfile();
        this.fetchProvince();
        this.getFollowerById();
        this.getLastestSong();
        this.getGenre();
        this.getMostListenTrack();
        this.fetchCountFollower();
        this.fetchCountFollowing();
    },
    components: {
        Header,
    },
}
</script>

<style scoped>
/* Smooth transitions */
* {
    transition: all 0.2s ease;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
}

/* Button hover effects */
button, a {
    transition: all 0.2s ease;
}

button:focus-visible,
a:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

/* Animation for track items */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.space-y-2 > div,
.space-y-3 > div {
    animation: fadeInUp 0.3s ease-out;
    animation-fill-mode: both;
}

.space-y-2 > div:nth-child(1) { animation-delay: 0.05s; }
.space-y-2 > div:nth-child(2) { animation-delay: 0.1s; }
.space-y-2 > div:nth-child(3) { animation-delay: 0.15s; }
.space-y-2 > div:nth-child(4) { animation-delay: 0.2s; }
.space-y-2 > div:nth-child(5) { animation-delay: 0.25s; }

/* Modal backdrop */
.fixed.inset-0 {
    backdrop-filter: blur(4px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .space-y-2 > div,
    .space-y-3 > div {
        padding: 0.75rem;
    }
}

/* Image hover effects */
img {
    transition: transform 0.3s ease;
}

.group:hover img {
    transform: scale(1.05);
}
</style>