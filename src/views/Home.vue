<template>
    <HeaderPage>

    </HeaderPage>
    <div>
        <div
            class="pt-16 pb-16 h-full w-container m-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <!-- Hero Section with Slider -->
            <div class="relative w-full h-[500px] mb-12 overflow-hidden rounded-2xl shadow-2xl">
                <div class="relative w-full h-full">
                    <div v-for="(slide, index) in slides" :key="index"
                        class="absolute w-full h-full transition-all duration-700"
                        :class="{ 'opacity-100 scale-100': currentSlide === index, 'opacity-0 scale-105': currentSlide !== index }">
                        <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div class="absolute bottom-[160px] left-0 right-0 p-8">
                            <h2 class="text-white text-4xl font-bold mb-4 drop-shadow-lg">{{ slide.title }}</h2>
                            <p class="text-white text-xl max-w-2xl drop-shadow-lg">{{ slide.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <button @click="prevSlide"
                    class="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300">
                    <font-awesome-icon icon="fa-solid fa-chevron-left" size="lg" />
                </button>
                <button @click="nextSlide"
                    class="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300">
                    <font-awesome-icon icon="fa-solid fa-chevron-right" size="lg" />
                </button>

                <!-- Dots Indicator -->
                <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    <button v-for="(slide, index) in slides" :key="index" @click="currentSlide = index"
                        class="w-3 h-3 rounded-full transition-all duration-300"
                        :class="currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'">
                    </button>
                </div>
            </div>

            <!-- Latest Upload Section -->
            <section class="mb-16">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-800">YOUR LATEST UPLOAD</h2>
                    <div v-if="lastestUpload && lastestUpload.length > 0" class="text-sm text-gray-500">
                        {{ lastestUpload.length }} tracks
                    </div>
                </div>
                <div v-if="lastestUpload && lastestUpload.length > 0"
                    class="grid grid-cols-[192px_1fr] gap-10 xl:w-[1200px] lg:w-[960px] md:w-[700px] lg:grid xl:grid md:block">
                    <div
                        class="h-48 border-4 border-[#F6E2EC] grid place-items-center md:hidden lg:grid xl:grid rounded-xl shadow-lg">
                        <div class="w-5/6 h-5/6  relative ">
                            <div class="rotate absolute w-5 h-2 bg-red-500 rounded-md z-50"
                                :class="{ 'rotate-active': playerStore.isPlaying }">
                                <div class="rotate absolute h-14 w-1 bg-gray-400"></div>
                            </div>
                            <div class="relative w-full h-full">
                                <img class="spin pointer-events-none select-none z-0"
                                    src="@/image/banners/vinyl-record.png" alt="">
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
                        class="h-48 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                        <div class="grid grid-cols-[1fr_192px] gap-10 h-full">
                            <div class="h-full">
                                <div @click="gotoProfile(item.User.id)"
                                    class="text-base text-left pl-5 pt-5 text-white text-ellipsis overflow-hidden whitespace-nowrap w-3/4">
                                    <a href="#">{{ item.User.username }}</a>
                                </div>
                                <div @click="goToTrack(item.id)"
                                    class="w-3/4 text-xl text-left pl-5 text-white text-ellipsis overflow-hidden whitespace-nowrap">
                                    <a href="#">{{ item.title }}</a>
                                </div>
                                <div class="pt-7">
                                    <div class="pl-7 flex ">
                                        <div class="opacity-70 text-white mr-4 flex items-center">
                                            <font-awesome-icon icon="fa-solid fa-play" />
                                            <div class="pl-2">{{ item.SongDetail.plays }}</div>
                                        </div>
                                        <div class="opacity-70 text-white mr-4 flex items-center ">
                                            <font-awesome-icon icon="fa-solid fa-heart" />
                                            <div class="pl-2">{{ item.SongDetail.likes }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class=" h-full place-content-center place-items-center">
                                <img class="place-items-center w-5/6 h-5/6 border-4 border-white"
                                    :src="item.artwork || defaultImage" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-[160px] w-full flex justify-center items-center py-8 bg-gray-50 rounded-xl">
                    <div class="text-[20px] text-gray-500">You haven't uploaded any tracks yet.</div>
                </div>
                <div v-if="lastestUpload && lastestUpload.length > 0" class="mt-6">
                    <div class="w-full mb-4 overflow-hidden">
                        <div class="text-left text-gray-700 font-bold line-through">Track playing : </div>
                        <div class="marquee-text text-gray-700 font-bold">
                            {{ playerStore.currentSong.title || 'No song playing' }}
                        </div>
                    </div>
                    <router-link to="/tracks">
                        <button @click="goToAllTracks"
                            class="px-6 py-3 border-2 border-gray-400 text-gray-600 rounded-full hover:border-gray-600 hover:text-gray-800 transition-all duration-300 flex items-center">
                            See all your tracks
                            <font-awesome-icon icon="fa-solid fa-arrow-right" class="ml-2" />
                        </button>
                    </router-link>
                </div>
            </section>

            <!-- Artists Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-gray-800 mb-8">ARTISTS YOU SHOULD FOLLOW</h2>
                <div class="grid grid-cols-5 gap-6">
                    <div v-for="(item, index) in artist" :key="index"
                        class="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.02]">
                        <div class="flex flex-col items-center">
                            <img :src="item.profile_picture || profilePicture"
                                class="rounded-full h-[180px] w-[180px] object-cover shadow-md mb-4"
                                :alt="`${item.username}'s profile picture`">
                            <div @click="gotoProfile(item.id)"
                                class="text-lg font-semibold cursor-pointer hover:text-orange-500 transition-colors duration-300 flex items-center">
                                {{ item.username }}
                                <div v-if="item.is_verified" class="ml-2 text-blue-500">
                                    <font-awesome-icon icon="fa-solid fa-check-circle" />
                                </div>
                            </div>
                            <div class="text-gray-500 text-sm mt-2 flex items-center">
                                <font-awesome-icon icon="fa-solid fa-users" class="mr-2" />
                                {{ item.followerCount || 0 }} followers
                            </div>
                            <button @click="followToggle(index)" v-if="item.id != playerStore.idUserLogin"
                                class="mt-4 px-8 py-2 rounded-full transition-all duration-300 flex justify-center items-center"
                                :class="artist[index].isFollowing ?
                                    'bg-orange-500 text-white hover:bg-orange-600' :
                                    'border-2 border-orange-500 text-orange-500 hover:bg-orange-50'">
                                <div v-if="artist[index].isFollowing" class="pr-1">
                                    <font-awesome-icon icon="fa-solid fa-user-check" />
                                </div>
                                <div v-else class="pr-1">
                                    <font-awesome-icon icon="fa-solid fa-user-plus" />
                                </div>
                                {{ artist[index].isFollowing ? 'Following' : 'Follow' }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Random Songs Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-gray-800 mb-8">RANDOM SONGS NOW</h2>
                <div class="grid grid-cols-3 gap-6">
                    <div v-for="(item, index) in songs" :key="index"
                        class="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300">
                        <div class="flex items-center">
                            <div class="h-[70px] aspect-square relative">
                                <img class="rounded-lg w-full h-full object-cover" :src="item.artwork || defaultImage"
                                    :alt="`${item.title} artwork`">
                                <div
                                    class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                    <button class="text-white p-2 hover:scale-110 transition-transform duration-300">
                                        <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                    </button>
                                </div>
                            </div>
                            <div class="ml-4 flex-grow min-w-0">
                                <h3 @click="goToTrack(item.id)"
                                    class="font-semibold text-gray-800 hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate">
                                    {{ item.title }}
                                </h3>
                                <p v-if="item.User" @click="gotoProfile(item.User.id)"
                                    class="text-gray-600 text-sm hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate">
                                    {{ item.User.username }}
                                </p>
                                <p v-else class="text-gray-600 text-sm truncate">
                                    Unknown Artist
                                </p>
                            </div>
                            <div class="flex-shrink-0 relative ">
                                <button @click="optionSong(item)"
                                    class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                                    <font-awesome-icon icon="fa-solid fa-ellipsis" />
                                </button>
                                <div v-if="item.isMenuOpen"
                                    class="absolute w-[280px] h-[auto] bg-[#9057e0] rounded-md right-0 bottom-full mb-2 block z-20 shadow-lg">
                                    <ul>
                                        <div class="mb-2 p-2 border-b border-white/20">
                                            <div class="flex items-center">
                                                <div class="basis-1/4">
                                                    <img class="rounded-md w-full h-full object-cover"
                                                        :src="item.artwork || defaultImage" alt="Artwork">
                                                </div>
                                                <div class="basis-3/4 pl-3">
                                                    <div
                                                        class="font-semibold text-white text-left hover:text-purple-300 truncate">
                                                        <a href="#">
                                                            {{ item.title }}
                                                        </a>
                                                    </div>
                                                    <div class="flex text-white/80 text-sm truncate">
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
                                                class="flex px-4 py-2 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150">
                                                <div class="basis-1/6 flex items-center justify-center">
                                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                                </div>
                                                Add to Playlist
                                            </div>
                                        </li>
                                        <li @click="playerStore.play(item)" class="text-left">
                                            <div
                                                class="flex px-4 py-2 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150">
                                                <div class="basis-1/6 flex items-center justify-center">
                                                    <font-awesome-icon icon="fa-solid fa-forward-step" />
                                                </div>
                                                Play
                                            </div>
                                        </li>
                                        <li class="text-left">
                                            <div class="flex px-4 py-2 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150"
                                                @click="toggleLike(item)">
                                                <div class="basis-1/6 flex items-center justify-center">
                                                    <font-awesome-icon icon="fa-regular fa-heart"
                                                        :class="{ 'text-orange-500': item.isLiked }" />
                                                </div>
                                                Like
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
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-gray-800 mb-8">RECOMMENDED FOR YOU</h2>
                <div class="grid grid-cols-3 gap-6">
                    <div v-for="(item, index) in similarSong" :key="index"
                        class="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300">
                        <div class="flex items-center">
                            <div class="h-[70px] aspect-square relative">
                                <img class="rounded-lg w-full h-full object-cover" :src="item.artwork || defaultImage"
                                    :alt="`${item.title} artwork`">
                                <div
                                    class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                    <button class="text-white p-2 hover:scale-110 transition-transform duration-300">
                                        <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                    </button>
                                </div>
                            </div>
                            <div class="ml-4 flex-grow min-w-0">
                                <h3 @click="goToTrack(item.id)"
                                    class="font-semibold text-gray-800 hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate">
                                    {{ item.title }}
                                </h3>
                                <p v-if="item.User" @click="gotoProfile(item.User.id)"
                                    class="text-gray-600 text-sm hover:text-orange-500 cursor-pointer transition-colors duration-300 truncate">
                                    {{ item.User.username }}
                                </p>
                                <p v-else class="text-gray-600 text-sm truncate">
                                    Unknown Artist
                                </p>
                            </div>
                            <div class="flex-shrink-0 relative ">
                                <button @click="optionSong(item)"
                                    class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                                    <font-awesome-icon icon="fa-solid fa-ellipsis" />
                                </button>
                                <div v-if="item.isMenuOpen"
                                    class="absolute w-[280px] h-[auto] bg-[#9057e0] rounded-md right-0 bottom-full mb-2 block z-20 shadow-lg">
                                    <ul>
                                        <div class="mb-2 p-2 border-b border-white/20">
                                            <div class="flex items-center">
                                                <div class="basis-1/4">
                                                    <img class="rounded-md w-full h-full object-cover"
                                                        :src="item.artwork || defaultImage" alt="Artwork">
                                                </div>
                                                <div class="basis-3/4 pl-3">
                                                    <div
                                                        class="font-semibold text-white text-left hover:text-purple-300 truncate">
                                                        <a href="#">
                                                            {{ item.title }}
                                                        </a>
                                                    </div>
                                                    <div class="flex text-white/80 text-sm truncate">
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
                                                class="flex px-4 py-2 text-white hover:bg-white/20 transition-colors duration-150">
                                                <div class="basis-1/6 flex items-center justify-center">
                                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                                </div>
                                                Add to Playlist
                                            </div>
                                        </li>
                                        <li class="text-left">
                                            <a href="#"
                                                class="flex px-4 py-2 text-white hover:bg-white/20 transition-colors duration-150">
                                                <div class="basis-1/6 flex items-center justify-center">
                                                    <font-awesome-icon icon="fa-solid fa-forward-step" />
                                                </div>
                                                Play Next
                                            </a>
                                        </li>
                                        <li class="text-left">
                                            <div @click="toggleLike(item)"
                                                class="flex px-4 py-2 cursor-pointer text-white hover:bg-white/20 transition-colors duration-150">
                                                <div class="basis-1/6 flex items-center justify-center">
                                                    <font-awesome-icon icon="fa-regular fa-heart"
                                                        :class="{ 'text-orange-500': item.isLiked }" />
                                                </div>
                                                Like
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
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import HeaderPage from '@/components/Header.vue';
import { usePlayerStore } from '@/js/state';
import { notification } from 'ant-design-vue';
export default {
    name: 'HomePage',

    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,

        }
    },
    async mounted() {
        document.addEventListener("click", this.clickOutside);
        window.addEventListener("resize", this.updateOffsetBasedOnScreen);

        console.log('User:', this.playerStore.user);
        try {
            // Đợi hàm async hoàn thành trước khi chạy tiếp
            await this.getRandomUser();
            await this.getAllFollower();
            await this.getRandomSong();
            await this.getLastestUpload();
            await this.getSimilarSong();
        } catch (error) {
            console.error("Lỗi trong mounted:", error);
        }
        this.startSlideShow();
    },
    data() {
        return {
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
            items: [
                {
                    id: 1,
                    title: "Feel Good - Illenium,Gryffin,Daya (Eulelia Remix)",
                    artist: "Eulelia",
                    image: require('@/image/artwork/feelgood.jpg'),
                    isLike: false,
                },
                {
                    id: 2,
                    title: "Run Away (U & I) (Eulelia Remix)",
                    artist: "Eulelia, Galantis",
                    image: require('@/image/artwork/Galantis_-_Runaway_(U_&_I)_cover.jpg'),
                    isLike: false,
                },
                {
                    id: 3,
                    title: "W/n - 3107 (feat Nâu,Duongg) (Eulelia Bootleg)",
                    artist: "Eulelia, W/n ,Nâu ,Dương",
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    isLike: false,
                },
                {
                    id: 4,
                    title: "Run Away (U & I) (Eulelia Remix)",
                    artist: "Eulelia, Galantis",
                    image: require('@/image/artwork/Galantis_-_Runaway_(U_&_I)_cover.jpg'),
                    isLike: false,
                },
                {
                    id: 5,
                    title: "Run Away (U & I) (Eulelia Remix)",
                    artist: "Eulelia, Galantis",
                    image: require('@/image/artwork/Galantis_-_Runaway_(U_&_I)_cover.jpg'),
                    isLike: false,
                },
                {
                    id: 6,
                    title: "Run Away (U & I) (Eulelia Remix)",
                    artist: "Eulelia, Galantis",
                    image: require('@/image/artwork/Galantis_-_Runaway_(U_&_I)_cover.jpg'),
                    isLike: false,
                },
            ],

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
        }
    },

    methods: {
        async toggleLike(item) {
            if (!this.playerStore.idUserLogin) {
                notification.warning({
                    message: 'Warning',
                    description: 'You need to log in to like/unlike a song.',
                });
                return;
            }

            try {
                const payload = {
                    song_id: item.id,
                    user_id: this.playerStore.idUserLogin
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

                console.log(`Toggled like status for song ID ${item.id}`);
            } catch (error) {
                console.error('Error toggling like:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to toggle like status. Please try again later.',
                });
            }
        },

        async getSimilarSong() {
            try {
                console.log('Fetching similar songs with params:', {
                    song_id: 62,
                    user_id: this.playerStore.idUserLogin || 1
                });

                const res = await apiClient.get(`/song/getSimilarSongs`, {
                    params: {
                        song_id: 62,
                        user_id: this.playerStore.idUserLogin || 1
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
                if (this.playerStore.idUserLogin) {
                    const likeStatusPromises = similarSongsData.map(song =>
                        apiClient.get('http://localhost:3000/api/like/getLikeStatus', {
                            params: {
                                user_id: this.playerStore.idUserLogin,
                                song_id: song.id
                            }
                        }).then(response => response.data.isLiked)
                    );
                    const likeStatusResults = await Promise.all(likeStatusPromises);

                    similarSongsData = similarSongsData.map((song, index) => ({
                        ...song,
                        isMenuOpen: false,
                        isLiked: likeStatusResults[index] || false // Gán trạng thái like
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
                console.log('Similar songs received with like status:', this.similarSong);
            }
            catch (error) {
                console.error("Error fetching similar songs:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
            }
        },
        async getLastestUpload() {
            try {
                const res = await apiClient.get(`/song/getLastestSong/${this.playerStore.idUserLogin}`);
                this.lastestUpload = [...res.data.data];
                this.lastestUploadId = this.lastestUpload[0].id;
                console.log('lastestUploadId: ', this.lastestUploadId);
                console.log('lastestUpload: ', this.lastestUpload);
            }
            catch (error) {
                console.error("Lỗi:", error.response?.data);
            }
        },
        goToAllTracks() {
            this.$router.push({ name: 'TracksPage', params: { id: this.playerStore.idUserLogin } });
        },
        goToTrack(id) {
            this.$router.push({ name: 'TrackInfoPage', params: { id } });
        },
        async getRandomSong() {
            try {
                const res = await apiClient.get('/song/getRandomSong');
                let songsData = res.data.data;

                // Fetch like status if user is logged in
                if (this.playerStore.idUserLogin) {
                    const likeStatusPromises = songsData.map(song =>
                        apiClient.get('http://localhost:3000/api/like/getLikeStatus', {
                            params: {
                                user_id: this.playerStore.idUserLogin,
                                song_id: song.id
                            }
                        }).then(response => response.data.isLiked)
                    );
                    const likeStatusResults = await Promise.all(likeStatusPromises);

                    songsData = songsData.map((song, index) => ({
                        ...song,
                        isMenuOpen: false,
                        isLiked: likeStatusResults[index] || false
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
                console.log('songs with like status: ', this.songs);
            }
            catch (error) {
                console.error("Lỗi:", error.response?.data);
            }
        },
        async getRandomUser() {
            try {
                const res = await apiClient.get('/users/getRandomUser');
                const artists = res.data.data;
                this.artist = artists.slice(0, 10);
                this.idUser = this.artist.map(user => user.id);

                // Tạo mảng các promise để lấy số lượng follower
                const followerCountPromises = this.artist.map(user =>
                    apiClient.get('http://localhost:3000/api/follow/getCountFollower', {
                        params: { id: user.id }
                    })
                );

                // Tạo mảng các promise để lấy trạng thái follow
                const followStatusPromises = this.artist.map(user =>
                    apiClient.get('http://localhost:3000/api/follow/getFollowStatus', {
                        params: {
                            follower_id: this.playerStore.idUserLogin,
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
                this.artist = this.artist.map((user, index) => ({
                    ...user,
                    followerCount: followerCountResults[index]?.data?.data || 0,
                    isFollowing: followStatusResults[index]?.data?.data?.isFollowing || false
                }));

                console.log('Artists with follow data:', this.artist);
                console.log('User IDs:', this.idUser);
            } catch (error) {
                console.error('Error fetching random users:', error);
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
                console.log('followers: ', this.followers);
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
            this.playerStore.addToPlaylist(song);
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
        }
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
</style>