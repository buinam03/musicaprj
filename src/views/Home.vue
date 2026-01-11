<template>
    <HeaderPage>

    </HeaderPage>
    <div>
        <div class="pt-16 pb-16 h-full w-full px-4 sm:px-6 lg:px-8 xl:px-4 max-w-7xl mx-auto">
            <!-- Hero Section with Slider -->
            <div
                class="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] mb-8 sm:mb-12 overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
                <!-- Hero Skeleton -->
                <div v-if="isLoading"
                    class="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse">
                    <div
                        class="absolute bottom-12 sm:bottom-20 md:bottom-[120px] lg:bottom-[160px] left-0 right-0 p-4 sm:p-6 md:p-8">
                        <div class="h-8 sm:h-10 md:h-12 w-3/4 bg-white/20 rounded-lg mb-4 animate-pulse"></div>
                        <div class="h-4 sm:h-5 md:h-6 w-1/2 bg-white/20 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                <div v-else class="relative w-full h-full">
                    <div v-for="(slide, index) in slides" :key="index"
                        class="absolute w-full h-full transition-all duration-700"
                        :class="{ 'opacity-100 scale-100': currentSlide === index, 'opacity-0 scale-105': currentSlide !== index }">
                        <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover banner-image" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div
                            class="absolute bottom-12 sm:bottom-20 md:bottom-[120px] lg:bottom-[160px] left-0 right-0 p-4 sm:p-6 md:p-8">
                            <h2
                                class="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 drop-shadow-lg">
                                {{ slide.title }}</h2>
                            <p class="text-white text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl drop-shadow-lg">{{
                                slide.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <button v-if="!isLoading" @click="prevSlide"
                    class="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 md:p-4 rounded-full hover:bg-white/30 transition-all duration-300 z-10">
                    <font-awesome-icon icon="fa-solid fa-chevron-left" size="lg" />
                </button>
                <button v-if="!isLoading" @click="nextSlide"
                    class="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 md:p-4 rounded-full hover:bg-white/30 transition-all duration-300 z-10">
                    <font-awesome-icon icon="fa-solid fa-chevron-right" size="lg" />
                </button>

                <!-- Dots Indicator -->
                <div v-if="!isLoading"
                    class="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
                    <button v-for="(slide, index) in slides" :key="index" @click="currentSlide = index"
                        class="w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300"
                        :class="currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'">
                    </button>
                </div>
            </div>

            <!-- Recently Played Section -->
            <RecentlyPlayed />

            <!-- Latest Upload Section -->
            <section class="mb-12 sm:mb-16">
                <div
                    class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">YOUR LATEST UPLOAD</h2>
                    <div v-if="!isLoadingLatest && lastestUpload && lastestUpload.length > 0"
                        class="text-sm text-gray-500">
                        {{ lastestUpload.length }} track{{ lastestUpload.length > 1 ? 's' : '' }}
                    </div>
                </div>

                <!-- Skeleton Loading for Latest Upload -->
                <div v-if="isLoadingLatest" class="space-y-4">
                    <div class="grid grid-cols-1 lg:grid-cols-[192px_1fr] gap-4 sm:gap-6 lg:gap-10">
                        <div class="hidden lg:block h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div
                            class="h-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-xl animate-pulse">
                        </div>
                    </div>
                </div>

                <div v-else-if="lastestUpload && lastestUpload.length > 0"
                    class="grid grid-cols-1 lg:grid-cols-[192px_1fr] gap-4 sm:gap-6 lg:gap-10">
                    <!-- Vinyl Player - Hidden on mobile and tablet -->
                    <div class="hidden lg:grid h-48 border-4 border-[#F6E2EC] place-items-center rounded-xl shadow-lg ">
                        <div class="w-5/6 h-5/6 relative">
                            <div class="rotate absolute w-5 h-2 bg-red-500 rounded-md z-50"
                                :class="{ 'rotate-active': playerStore.isPlaying }">
                                <div class="rotate absolute h-14 w-1 bg-gray-400"></div>
                            </div>
                            <div class="relative w-full h-full">
                                <img class="spin pointer-events-none select-none z-0"
                                    src="@/image/banners/image-removebg-preview.png" alt="" loading="lazy">
                                <div class="absolute inset-0 flex justify-center items-center text-white z-20 cursor-pointer"
                                    @click="PlayControlToggle">
                                    <font-awesome-icon v-if="playerStore.isPlaying" icon="fa-solid fa-pause"
                                        size="2xl" />
                                    <font-awesome-icon v-else icon="fa-solid fa-play" size="2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-for="(item, index) in lastestUpload" :key="index"
                        class="h-auto sm:h-48 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                        <div
                            class="grid grid-cols-1 sm:grid-cols-[1fr_160px] lg:grid-cols-[1fr_192px] gap-4 sm:gap-6 lg:gap-10 h-full p-4 sm:p-0">
                            <div class="h-full flex flex-col justify-center">
                                <div @click="gotoProfile(item.User.id)"
                                    class="text-sm sm:text-base text-left pl-0 sm:pl-5 pt-0 sm:pt-5 text-white text-ellipsis overflow-hidden whitespace-nowrap w-full sm:w-3/4 cursor-pointer hover:underline transition-all">
                                    {{ item.User.username }}
                                </div>
                                <div @click="goToTrack(item.id)"
                                    class="w-full sm:w-3/4 text-lg sm:text-xl text-left pl-0 sm:pl-5 text-white text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer hover:underline transition-all font-semibold">
                                    {{ item.title }}
                                </div>
                                <div class="pt-4 sm:pt-7">
                                    <div class="pl-0 sm:pl-7 flex gap-4 sm:gap-0">
                                        <div
                                            class="opacity-70 text-white sm:mr-4 flex items-center text-sm sm:text-base">
                                            <font-awesome-icon icon="fa-solid fa-play" />
                                            <div class="pl-2">{{ item.SongDetail.plays }}</div>
                                        </div>
                                        <div
                                            class="opacity-70 text-white sm:mr-4 flex items-center text-sm sm:text-base">
                                            <font-awesome-icon icon="fa-solid fa-heart" />
                                            <div class="pl-2">{{ item.SongDetail.likes }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="h-full place-content-center place-items-center flex justify-center sm:justify-center">
                                <img class="w-full sm:w-5/6 aspect-square sm:h-5/6 object-cover border-4 border-white rounded-lg artwork-image"
                                    :src="item.artwork || defaultImage" alt="" loading="lazy">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else
                    class="h-[120px] sm:h-[160px] w-full flex justify-center items-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                    <div class="text-base sm:text-lg md:text-xl text-gray-500 text-center px-4">You haven't uploaded any
                        tracks yet.</div>
                </div>
                <div v-if="lastestUpload && lastestUpload.length > 0" class="mt-4 sm:mt-6">
                    <div class="w-full mb-3 sm:mb-4 overflow-hidden">
                        <div class="text-left text-gray-700 font-bold text-sm sm:text-base mb-1">Track playing:</div>
                        <div class="marquee-text text-gray-700 font-bold text-sm sm:text-base">
                            {{ playerStore.currentSong.title || 'No song playing' }}
                        </div>
                    </div>
                    <router-link to="/tracks">
                        <button @click="goToAllTracks"
                            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-400 text-gray-600 rounded-full hover:border-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center">
                            <span>See all your tracks</span>
                            <font-awesome-icon icon="fa-solid fa-arrow-right" class="ml-2" />
                        </button>
                    </router-link>
                </div>
            </section>

            <!-- Artists Section -->
            <section class="mb-12 sm:mb-16">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">ARTISTS YOU SHOULD FOLLOW</h2>

                <!-- Skeleton Loading for Artists -->
                <div v-if="isLoadingArtists"
                    class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div v-for="i in 10" :key="i" class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                        <div class="flex flex-col items-center">
                            <div
                                class="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[180px] lg:h-[180px] rounded-full bg-gray-200 animate-pulse mb-3 sm:mb-4">
                            </div>
                            <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-3 w-16 bg-gray-200 rounded animate-pulse mb-3"></div>
                            <div class="h-8 w-full bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div v-for="(item, index) in artist.slice(0, 5)" :key="index"
                        class="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <div class="flex flex-col items-center">
                            <img :src="item.profile_picture || profilePicture"
                                class="rounded-full h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] lg:h-[180px] lg:w-[180px] object-cover shadow-md mb-3 sm:mb-4 transition-transform duration-300 hover:scale-105 max-w-full max-h-full"
                                :alt="`${item.username}'s profile picture`" loading="lazy" style="max-width: 100%; max-height: 100%;">
                            <div @click="gotoProfile(item.id)"
                                class="text-sm sm:text-base lg:text-lg font-semibold cursor-pointer hover:text-orange-500 transition-colors duration-300 flex items-center text-center">
                                <span class="truncate max-w-[120px] sm:max-w-[150px]">{{ item.username }}</span>
                                <div v-if="item.is_verified" class="ml-1 sm:ml-2 text-blue-500 flex-shrink-0">
                                    <font-awesome-icon icon="fa-solid fa-check-circle" />
                                </div>
                            </div>
                            <div class="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center">
                                <font-awesome-icon icon="fa-solid fa-users" class="mr-1 sm:mr-2" />
                                <span class="whitespace-nowrap">{{ item.followerCount || 0 }} follower{{
                                    (item.followerCount || 0) !== 1 ? 's' : '' }}</span>
                            </div>
                            <button @click="followToggle(index)" v-if="item.id != getCurrentUserId()"
                                class="mt-3 sm:mt-4 px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 rounded-full transition-all duration-300 flex justify-center items-center text-xs sm:text-sm w-full"
                                :class="artist[index].isFollowing ?
                                    'bg-orange-500 text-white hover:bg-orange-600 shadow-md' :
                                    'border-2 border-orange-500 text-orange-500 hover:bg-orange-50'">
                                <div v-if="artist[index].isFollowing" class="pr-1">
                                    <font-awesome-icon icon="fa-solid fa-user-check" />
                                </div>
                                <div v-else class="pr-1">
                                    <font-awesome-icon icon="fa-solid fa-user-plus" />
                                </div>
                                <span>{{ artist[index].isFollowing ? 'Following' : 'Follow' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Playlists by Genre Section -->
            <section class="mb-12 sm:mb-16">
                <div class="flex justify-between items-center mb-6 sm:mb-8">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">PLAYLISTS BY GENRE</h2>
                    <router-link to="/playlists/genre"
                        class="px-4 sm:px-6 py-2 text-sm sm:text-base text-orange-500 hover:text-orange-600 font-medium transition-colors flex items-center gap-2">
                        <span>View All</span>
                        <font-awesome-icon icon="fa-solid fa-arrow-right" />
                    </router-link>
                </div>

                <!-- Skeleton Loading for Playlists -->
                <div v-if="isLoadingPlaylists"
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div v-for="i in 10" :key="i" class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div class="aspect-square bg-gray-200 animate-pulse"></div>
                        <div class="p-3 sm:p-4">
                            <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div v-else-if="cmsPlaylists && cmsPlaylists.length > 0"
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div v-for="(playlist, index) in cmsPlaylists" :key="index" @click="goToPlaylist(playlist.id)"
                        class="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <div class="aspect-square relative group">
                            <img class="w-full h-full object-cover max-w-full max-h-full" :src="playlist.artwork || defaultImage"
                                :alt="`${playlist.name} artwork`" loading="lazy" style="max-width: 100%; max-height: 100%;">
                            <div
                                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <font-awesome-icon icon="fa-solid fa-play" class="text-white text-3xl sm:text-4xl" />
                            </div>
                        </div>
                        <div class="p-3 sm:p-4">
                            <h3
                                class="font-semibold text-sm sm:text-base text-gray-800 hover:text-orange-500 transition-colors duration-300 truncate mb-1">
                                {{ playlist.name }}
                            </h3>
                        </div>
                    </div>
                </div>
                <div v-else
                    class="h-40 sm:h-48 w-full flex flex-col justify-center items-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                    <font-awesome-icon icon="fa-solid fa-music" class="text-gray-400 text-4xl mb-3" />
                    <div class="text-base sm:text-lg text-gray-500 text-center px-4">Playlist not found</div>
                </div>
            </section>

            <!-- Random Songs Section -->
            <section class="mb-12 sm:mb-16">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">RANDOM SONGS NOW</h2>

                <!-- Skeleton Loading for Random Songs -->
                <div v-if="isLoadingRandomSongs" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div
                                class="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-lg bg-gray-200 animate-pulse flex-shrink-0">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div class="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
                        </div>
                    </div>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div v-for="(item, index) in songs.slice(0, 6)" :key="index"
                        class="bg-white rounded-xl shadow-lg p-3 sm:p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div class="flex items-center">
                            <div
                                class="h-[60px] sm:h-[70px] w-[60px] sm:w-[70px] flex-shrink-0 aspect-square relative group">
                                <img class="rounded-lg w-full h-full object-cover" :src="item.artwork || defaultImage"
                                    :alt="`${item.title} artwork`" loading="lazy">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center cursor-pointer"
                                    @click="playerStore.play(item)">
                                    <div class="text-white p-2 hover:scale-110 transition-transform duration-300">
                                        <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                    </div>
                                </div>
                            </div>
                            <div class="ml-3 sm:ml-4 flex-grow min-w-0">
                                <h3 @click="goToTrack(item.id)"
                                    class="font-semibold text-sm sm:text-base text-gray-800 hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate">
                                    {{ item.title }}
                                </h3>
                                <p v-if="item.User" @click="gotoProfile(item.User.id)"
                                    class="text-gray-600 text-xs sm:text-sm hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate mt-0.5">
                                    {{ item.User.username }}
                                </p>
                                <p v-else class="text-gray-600 text-xs sm:text-sm truncate mt-0.5">
                                    Unknown Artist
                                </p>
                            </div>
                            <div class="flex-shrink-0 relative">
                                <button @click="optionSong(item)"
                                    class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 text-gray-600">
                                    <font-awesome-icon icon="fa-solid fa-ellipsis" />
                                </button>
                                <div v-if="item.isMenuOpen"
                                    class="absolute w-[240px] sm:w-[280px] h-[auto] bg-[#9057e0] rounded-lg right-0 bottom-full mb-2 block z-30 shadow-xl overflow-hidden border border-purple-600/30">
                                    <ul>
                                        <div class="mb-2 p-2 sm:p-3 border-b border-white/20">
                                            <div class="flex items-center gap-2 sm:gap-3">
                                                <div class="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                                                    <img class="rounded-md w-full h-full object-cover max-w-full max-h-full"
                                                        :src="item.artwork || defaultImage" alt="Artwork" loading="lazy" style="max-width: 100%; max-height: 100%;">
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div
                                                        class="font-semibold text-white text-left hover:text-purple-300 truncate text-sm sm:text-base">
                                                        <a :href="`/trackinfo/${item.id}`">
                                                            {{ item.title }}
                                                        </a>
                                                    </div>
                                                    <div class="text-white/80  text-xs sm:text-sm truncate mt-0.5 ">
                                                        <span v-if="item.User" @click="gotoProfile(item.User.id)"
                                                            class="hover:underline cursor-pointer">
                                                            {{ item.User.username }}
                                                        </span>
                                                        <span v-else>Unknown Artist</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <li class="text-left">
                                            <div @click="addToPlaylist(item)"
                                                class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                                </div>
                                                <span>Add to Playlist</span>
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
                                        <li @click="playerStore.play(item)" class="text-left">
                                            <div
                                                class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                    <font-awesome-icon icon="fa-solid fa-forward-step" />
                                                </div>
                                                <span>Play</span>
                                            </div>
                                        </li>
                                        <li class="text-left">
                                            <div class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base"
                                                @click="toggleLike(item)">
                                                <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                    <font-awesome-icon icon="fa-regular fa-heart"
                                                        :class="{ 'text-orange-500': item.isLiked }" />
                                                </div>
                                                <span>{{ item.isLiked ? 'Unlike' : 'Like' }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <!-- Recommended Songs Section -->
            <section class="mb-12 sm:mb-16">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">RECOMMENDED FOR YOU</h2>

                <!-- Skeleton Loading for Recommended Songs -->
                <div v-if="isLoadingRecommended" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div
                                class="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-lg bg-gray-200 animate-pulse flex-shrink-0">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div class="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
                        </div>
                    </div>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div v-for="(item, index) in similarSong.slice(0, 6)" :key="index"
                        class="bg-white rounded-xl shadow-lg p-3 sm:p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div class="flex items-center">
                            <div
                                class="h-[60px] sm:h-[70px] w-[60px] sm:w-[70px] flex-shrink-0 aspect-square relative group">
                                <img class="rounded-lg w-full h-full object-cover" :src="item.artwork || defaultImage"
                                    :alt="`${item.title} artwork`" loading="lazy">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center cursor-pointer"
                                    @click="playerStore.play(item)">
                                    <div class="text-white p-2 hover:scale-110 transition-transform duration-300">
                                        <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                    </div>
                                </div>
                            </div>
                            <div class="ml-3 sm:ml-4 flex-grow min-w-0">
                                <h3 @click="goToTrack(item.id)"
                                    class="font-semibold text-sm sm:text-base text-gray-800 hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate">
                                    {{ item.title }}
                                </h3>
                                <p v-if="item.User" @click="gotoProfile(item.User.id)"
                                    class="text-gray-600 text-xs sm:text-sm hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate mt-0.5">
                                    {{ item.User.username }}
                                </p>
                                <p v-else class="text-gray-600 text-xs sm:text-sm truncate mt-0.5">
                                    Unknown Artist
                                </p>
                            </div>
                            <div class="flex-shrink-0 relative">
                                <button @click="optionSong(item)"
                                    class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 text-gray-600">
                                    <font-awesome-icon icon="fa-solid fa-ellipsis" />
                                </button>
                                <div v-if="item.isMenuOpen"
                                    class="absolute w-[240px] sm:w-[280px] h-[auto] bg-[#9057e0] rounded-md right-0 bottom-full mb-2 block z-20 shadow-lg overflow-hidden">
                                    <ul>
                                        <div class="mb-2 p-2 border-b border-white/20">
                                            <div class="flex items-center gap-3">
                                                <div class="w-16 h-16 flex-shrink-0">
                                                    <img class="rounded-md w-16 h-16 object-cover max-w-full max-h-full"
                                                        :src="item.artwork || defaultImage" alt="Artwork" loading="lazy" style="max-width: 100%; max-height: 100%;">
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div
                                                        class="font-semibold text-white text-left hover:text-purple-300 truncate">
                                                        <a :href="`/trackinfo/${item.id}`">
                                                            {{ item.title }}
                                                        </a>
                                                    </div>
                                                    <div class="flex text-white/80 text-sm truncate">
                                                        <span v-if="item.User" @click="gotoProfile(item.User.id)"
                                                            class="hover:underline cursor-pointer truncate">
                                                            {{ item.User.username }}
                                                        </span>
                                                        <span v-else class="truncate">Unknown Artist</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <li class="text-left">
                                            <div @click="addToPlaylist(item)"
                                                class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                                </div>
                                                <span>Add to Playlist</span>
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
                                        <li class="text-left">
                                            <div @click="playerStore.play(item)"
                                                class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                    <font-awesome-icon icon="fa-solid fa-forward-step" />
                                                </div>
                                                <span>Play Next</span>
                                            </div>
                                        </li>
                                        <li class="text-left">
                                            <div @click="toggleLike(item)"
                                                class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150 text-sm sm:text-base">
                                                <div class="w-6 flex items-center justify-center mr-2 sm:mr-3">
                                                    <font-awesome-icon icon="fa-regular fa-heart"
                                                        :class="{ 'text-orange-500': item.isLiked }" />
                                                </div>
                                                <span>{{ item.isLiked ? 'Unlike' : 'Like' }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Add to Playlist Modal -->
        <AddToPlaylistModal :isOpen="isAddToPlaylistModalOpen" :song="selectedSongForPlaylist"
            @close="isAddToPlaylistModalOpen = false; selectedSongForPlaylist = null" />
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import HeaderPage from '@/components/Header.vue';
import RecentlyPlayed from '@/components/RecentlyPlayed.vue';
import { usePlayerStore } from '@/js/state';
import { notification } from 'ant-design-vue';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
import { downloadFile } from '@/js/downloadFile';
import AddToPlaylistModal from '@/components/AddToPlaylistModal.vue';
export default {
    name: 'HomePage',

    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
            downloadFile,
        }
    },
    async mounted() {
        document.addEventListener("click", this.clickOutside);
        window.addEventListener("resize", this.updateOffsetBasedOnScreen);

        try {
            // Load all data in parallel for better performance
            await Promise.all([
                this.getRandomUser(),
                this.getRandomSong(),
                this.getLastestUpload(),
                this.getSimilarSong(),
                this.getCmsPlaylists()
            ]);
            await this.getAllFollower();
        } catch (error) {
            console.error("Lỗi trong mounted:", error);
        } finally {
            this.isLoading = false;
        }
        this.startSlideShow();
    },
    data() {
        return {
            isLoading: true,
            isLoadingLatest: true,
            isLoadingArtists: true,
            isLoadingRandomSongs: true,
            isLoadingRecommended: true,
            isLoadingPlaylists: true,
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            defaultArtwork: 'http://localhost:8080/images/artwork/pixelpig.jpg',
            cardWidth: 180,
            openMenuIndex: null,
            idUser: [],
            isMusicPlay: false,
            isButtonGroupClick: false,
            dragIndex: null,
            followers: null,
            followState: 'Follow',
            isUserPressNextOrPre: false,
            songs: [],
            artist: [],

            queryString: [],
            lastestUpload: [],
            similarSong: [],
            lastestUploadId: null,
            currentSlide: 0,
            slides: [
                {
                    image: 'http://localhost:8080/images/artwork/vo-quoc-LtJjlQZcIpk-unsplash.jpg',
                    title: 'Welcome to Musica',
                    description: 'Your ultimate destination for music sharing and discovery'
                },
                {
                    image: 'http://localhost:8080/images/artwork/3107 artwork.jpg',
                    title: 'Share Your Music',
                    description: 'Upload and share your tracks with the world'
                },
                {
                    image: 'http://localhost:8080/images/artwork/igor-omilaev-8yX2nItvibQ-unsplash.jpg',
                    title: 'Connect with Artists',
                    description: 'Follow your favorite artists and stay updated with their latest releases'
                }
            ],
            slideInterval: null,
            isAddToPlaylistModalOpen: false,
            selectedSongForPlaylist: null,
            cmsPlaylists: [],
            likeStatus: []
        }
    },

    methods: {
        async getLikeStatus(user_id) {
            if (!user_id) return [];

            const res = await apiClient.get(
                'http://localhost:3000/api/like/getLikeStatus',
                { params: { user_id } }
            );

            return res.data.likedSongIds || [];
        },

        async getFollowStatus(userId) {
            if (!userId) return;

            const res = await apiClient.get('http://localhost:3000/api/follow/getFollowStatus', {
                params: {
                    user_id: userId,
                }
            })
            return res.data.data;
        },

        getCurrentUserId() {
            return getUserIdFromJWT();
        },
        async toggleLike(item) {
            const userId = getUserIdFromJWT();
            if (!userId) {
                notification.warning({
                    message: 'Warning',
                    description: 'You need to log in to like/unlike a song.',
                });
                return;
            }

            try {
                const payload = {
                    song_id: item.id,
                    user_id: userId
                };
                await apiClient.post('http://localhost:3000/api/like/toggleLike', payload);

                // Update the local state
                const songIndex = this.songs.findIndex(s => s.id === item.id);
                if (songIndex !== -1) {
                    const newStatus = !this.songs[songIndex].isLiked;
                    this.$set(this.songs, songIndex, { ...this.songs[songIndex], isLiked: newStatus });

                    notification.success({
                        message: 'Success',
                        description: newStatus ? 'You liked the song.' : 'You unliked the song.',
                    });
                } else {
                    const similarSongIndex = this.similarSong.findIndex(s => s.id === item.id);
                    if (similarSongIndex !== -1) {
                        const newStatus = !this.similarSong[similarSongIndex].isLiked;
                        this.$set(this.similarSong, similarSongIndex, { ...this.similarSong[similarSongIndex], isLiked: newStatus });

                        notification.success({
                            message: 'Success',
                            description: newStatus ? 'You liked the song.' : 'You unliked the song.',
                        });
                    }
                }
            } catch (error) {
                console.error('Error toggling like:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to toggle like status. Please try again later.',
                });
            }
        },

        async getSimilarSong() {
            this.isLoadingRecommended = true;
            try {
                const userId = getUserIdFromJWT() || 1;
                const res = await apiClient.get(`/song/getSimilarSongs`, {
                    params: {
                        song_id: this.playerStore.currentSong.id,
                        user_id: userId
                    }
                });

                if (!res.data) {
                    console.error('No data received from API');
                    return;
                }

                if (!res.data.data) {
                    console.error('No data.data received from API');
                    return;
                }

                let similarSongsData = res.data.data;

                // Fetch like status if user is logged in
                const similarUserId = getUserIdFromJWT();

                let likedSet = new Set();
                if (userId) {
                    const likedIds = await this.getLikeStatus(userId);
                    likedSet = new Set(likedIds);
                }


                if (similarUserId) {

                    similarSongsData = similarSongsData.map((song) => ({
                        ...song,
                        isMenuOpen: false,
                        isLiked: likedSet.has(song.id) || false // Gán trạng thái like
                    }));
                }
                else {
                    similarSongsData = similarSongsData.map(song => ({
                        ...song,
                        isMenuOpen: false,
                        isLiked: false // Default to false if not logged in
                    }));
                }

                this.similarSong = similarSongsData.slice(0, 12);
            }
            catch (error) {
                console.error("Error fetching similar songs:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
            } finally {
                this.isLoadingRecommended = false;
            }
        },
        async getLastestUpload() {
            this.isLoadingLatest = true;
            try {
                const userId = getUserIdFromJWT();
                if (!userId) {
                    this.isLoadingLatest = false;
                    return;
                }
                const res = await apiClient.get(`/song/getLastestSong/${userId}`);
                this.lastestUpload = [...res.data.data];
                if (this.lastestUpload.length > 0) {
                    this.lastestUploadId = this.lastestUpload[0].id;
                }
            }
            catch (error) {
                console.error("Lỗi:", error.response?.data);
            } finally {
                this.isLoadingLatest = false;
            }
        },
        goToAllTracks() {
            const userId = getUserIdFromJWT();
            if (!userId) return;
            this.$router.push({ name: 'TracksPage', params: { id: userId } });
        },
        goToTrack(id) {
            this.$router.push({ name: 'TrackInfoPage', params: { id } });
        },
        async getRandomSong() {
            this.isLoadingRandomSongs = true;
            try {
                const res = await apiClient.get('/song/getRandomSong');
                let songsData = res.data.data;

                // Fetch like status if user is logged in
                const randomUserId = getUserIdFromJWT();

                let likedSet = new Set();
                if (randomUserId) {
                    const likedIds = await this.getLikeStatus(randomUserId);
                    likedSet = new Set(likedIds);
                }


                if (randomUserId) {

                    songsData = songsData.map((song) => ({
                        ...song,
                        isMenuOpen: false,
                        isLiked: likedSet.has(song.id) || false
                    }));
                }
                else {
                    songsData = songsData.map(song => ({
                        ...song,
                        isMenuOpen: false,
                        isLiked: false
                    }));
                }

                this.songs = songsData;
            }
            catch (error) {
                console.error("Lỗi:", error.response?.data);
            } finally {
                this.isLoadingRandomSongs = false;
            }
        },
        async getRandomUser() {
            this.isLoadingArtists = true;
            try {

                const res = await apiClient.get(`/users/getRandomUser`);
                const artists = res.data.data;
                this.artist = artists.slice(0, 10);
                this.idUser = this.artist.map(user => user.id);

                // Lấy trạng thái follow
                const userId = getUserIdFromJWT();

                const followerList  = await this.getFollowStatus(userId);

                const followerSet = new Set(followerList.map(u => u.id));

                // Kết hợp dữ liệu user với số lượng follower (đã có sẵn trong response) và trạng thái follow
                this.artist = this.artist.map((user) => ({
                    ...user,
                    followerCount: user.followerCount || 0,
                    isFollowing: followerSet.has(user.id) || false
                }));
            } catch (error) {
                console.error('Error fetching random users:', error);
            } finally {
                this.isLoadingArtists = false;
            }
        },
        async getAllFollower() {
            try {
                const rawIds = [...this.idUser];
                if (!rawIds.length) {
                    console.warn("Mảng IDs rỗng");
                    return;
                }

                // Truyền thẳng chuỗi ids, không dùng URLSearchParams
                const res = await apiClient.get('/follow/getAllFollower', {
                    params: {
                        ids: rawIds.join(',') // "22,21,20..."
                    }
                });

                this.followers = res.data.data;
            } catch (error) {
                console.error("Lỗi:", error.response?.data);
            }
        },
        gotoProfile(id) {
            this.$router.push({ name: 'ProfilePage', params: { id } });
        },
        PlayControlToggle() {
            // Kiểm tra xem có bài hát đang phát không
            if (!this.playerStore.currentSong || !this.playerStore.currentSong.id) {
                console.warn('No song selected to play');
                return;
            }

            const rotateTonearms = document.querySelector('.rotate');

            // Nếu đang phát thì pause, nếu đang pause thì play
            if (this.playerStore.isPlaying) {
                this.playerStore.pause();
                rotateTonearms.classList.remove('rotate-active');
            } else {
                this.playerStore.resume();
                rotateTonearms.classList.add('rotate-active');
            }
        },
        followToggle(index) {
            this.artist[index].isFollowing = !this.artist[index].isFollowing;

        },
        ButtonGroupToggle() {
            this.isButtonGroupClick = !this.isButtonGroupClick;
        },
        LikeToggle(index) {
            this.items[index].isLike = !this.items[index].isLike;
        },
        removeSongFromPlaylist(index) {
            this.items.splice(index, 1);
        },
        onDragStart(index) {
            this.dragIndex = index;
        },
        onDragOver(event) {
            event.preventDefault();
        },
        onDrop(index) {
            const draggedItem = this.items[this.dragIndex];
            //delete item in old position 
            this.items.splice(this.dragIndex, 1);
            //add to new position
            this.items.splice(index, 0, draggedItem);
            //reset dragIndex
            this.dragIndex = null;
        },

        addToPlaylist(song) {
            this.selectedSongForPlaylist = song;
            this.isAddToPlaylistModalOpen = true;
        },
        likePlaylist(index) {
            this.playlist[index].isLike = !this.playlist[index].isLike;
        },
        PlayPlaylist(index) {
            this.playlist[index].isAddToPlaylist;
        },
        optionSong(item) {
            // Close all other menus first
            this.songs.forEach(song => {
                if (song !== item) song.isMenuOpen = false;
            });
            this.similarSong.forEach(song => {
                if (song !== item) song.isMenuOpen = false;
            });
            // Toggle the clicked item's menu
            item.isMenuOpen = !item.isMenuOpen;
        },
        clickOutside(event) {
            // Check if the click is outside any menu
            let clickedInsideMenu = false;
            const menus = document.querySelectorAll('.song-option-menu'); // Add a class to your menu div
            menus.forEach(menu => {
                if (menu.contains(event.target)) {
                    clickedInsideMenu = true;
                }
            });

            // If click is outside all menus and not on an option button, close all menus
            if (!clickedInsideMenu && !event.target.closest('.p-2.rounded-full.hover\\:bg-gray-100')) { // Corrected escape sequence
                this.songs.forEach(song => song.isMenuOpen = false);
                this.similarSong.forEach(song => song.isMenuOpen = false);
            }
        },
        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        },
        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        },
        startSlideShow() {
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, 4000);
        },
        stopSlideShow() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
            }
        },
        async getCmsPlaylists() {
            this.isLoadingPlaylists = true;
            try {
                const res = await apiClient.get('/playlist/getPlaylistCMS');
                this.cmsPlaylists = res.data.data.slice(0, 5) || [];
            } catch (error) {
                console.error('Error fetching CMS playlists:', error);
                this.cmsPlaylists = [];
            } finally {
                this.isLoadingPlaylists = false;
            }
        },
        goToPlaylist(id) {
            this.$router.push({ name: 'PlaylistDetailPage', params: { id } });
        },
    },
    computed: {
        profilePicture() {
            const baseUrl = process.env.VUE_APP_API_BASE_URL || ''; // Fallback nếu base URL chưa được thiết lập
            const profilePicture = this.artist?.profile_picture; // Truy cập chính xác vào profile_picture

            if (profilePicture) {
                return `${baseUrl}${profilePicture}`; // Kết hợp base URL với profile_picture
            }

            return '/images/profile/Unknown_person.jpg'; // Đường dẫn ảnh mặc định
        },

    },
    components: {
        HeaderPage,
        RecentlyPlayed,
        AddToPlaylistModal,
    },
    beforeUnmount() {
        document.removeEventListener("click", this.clickOutside);
        this.stopSlideShow();
    }
}
</script>

<style scoped>
.spin {
    width: 100%;
    animation: spin 3s linear infinite;
    transform-origin: center;
    z-index: 0;
}

.rotate {
    transition: transform 0.3s ease-in-out;
    transform-origin: bottom center;
    transform: rotate(0deg);
    z-index: 10;
}

.rotate-active {
    transform: rotate(-30deg);
}

.linear {
    background: linear-gradient(to right, white 50%, transparent 50%);
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Add new styles for slider */
.slider-enter-active,
.slider-leave-active {
    transition: opacity 0.5s ease;
}

.slider-enter-from,
.slider-leave-to {
    opacity: 0;
}

/* New styles */
.section-title {
    position: relative;
    display: inline-block;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: #f97316;
    border-radius: 2px;
}

/* Hover effects */
.hover-lift {
    transition: transform 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-4px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.marquee-text {
    white-space: nowrap;
    animation: marquee 15s linear infinite;
    display: inline-block;
}

@keyframes marquee {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

/* Responsive improvements */
@media (max-width: 640px) {
    .marquee-text {
        font-size: 0.875rem;
    }
}

/* Smooth transitions for all interactive elements */
button,
a,
img {
    transition: all 0.3s ease;
}

/* Limit image sizes to prevent UI drop and resource consumption */
/* Exclude banner and artwork images to preserve their sizing */
img:not(.banner-image):not(.artwork-image) {
    max-width: 100%;
    max-height: 100%;
}

/* Ensure object-fit works properly */
img {
    object-fit: cover;
}

/* Improve touch targets on mobile */
@media (max-width: 768px) {
    button {
        min-height: 44px;
        min-width: 44px;
    }
}

/* Better focus states for accessibility */
button:focus-visible,
a:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

/* Loading state improvements */

/* Card hover improvements */
.bg-white {
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* Gradient text improvements */
.text-white {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Skeleton Loading Animations */
@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }

    100% {
        background-position: 1000px 0;
    }
}

.skeleton {
    background: linear-gradient(90deg,
            #f0f0f0 0%,
            #f8f8f8 50%,
            #f0f0f0 100%);
    background-size: 2000px 100%;
    animation: shimmer 1.5s infinite;
}

/* Enhanced skeleton pulse */
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* Skeleton gradient effect */
.skeleton-gradient {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}
</style>