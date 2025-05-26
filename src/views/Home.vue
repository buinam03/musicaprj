<template>
    <HeaderPage>

    </HeaderPage>
    <div>
        <div
            class="pt-16 pb-16 h-full w-container m-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div class="text-left text-3xl py-8">YOUR LASTEST UPLOAD</div>
            <div
                class="grid grid-cols-[192px_1fr] gap-10 xl:w-[1200px] lg:w-[960px] md:w-[700px] lg:grid xl:grid md:block ">
                <div class=" h-48 border-4 border-[#F6E2EC] grid place-items-center md:hidden lg:grid xl:grid">

                    <div class="w-5/6 h-5/6  relative ">

                        <div class="rotate absolute w-5 h-2 bg-red-500 rounded-md z-50"
                            :class="{ 'rotate-active': playerStore.isPlaying }">
                            <div class="rotate absolute h-14 w-1 bg-gray-400"></div>
                        </div>



                        <div class="relative w-full h-full">
                            <img class="spin pointer-events-none select-none z-0" src="@/image/banners/vinyl-record.png"
                                alt="">
                            <div class="absolute inset-0 flex justify-center items-center scale-150 text-white z-20 cursor-pointer"
                                @click="PlayControlToggle">
                                <font-awesome-icon v-if="playerStore.isPlaying" icon="fa-solid fa-pause" size="2xl" />
                                <font-awesome-icon v-else icon="fa-solid fa-play" size="2xl" />


                            </div>
                        </div>

                    </div>
                </div>
                <div v-for="(item, index) in lastestUpload" :key="index" class=" h-48 bg-gradient-to-r from-gray-400 to-gray-600">
                    <div class="grid grid-cols-[1fr_192px] gap-10 h-full">
                        <div class="h-full">
                            <div @click="gotoProfile(item.User.id)"
                                class="text-base text-left pl-5 pt-5 text-white text-ellipsis overflow-hidden whitespace-nowrap w-3/4">
                                <a href="#">{{item.User.username}}</a>
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
            <div class="pt-5">
                <a href="#">
                    <router-link to="/tracks">
                        <div @click="goToAllTracks"
                            class=" p-2 border-gray-400 border-[1px] text-gray-400 hover:border-gray-600 hover:text-gray-600">
                            See all your tracks</div>
                    </router-link>
                </a>

            </div>
            <div class="pt-5 border-b-gray-200 border-b-[1px]"></div>
            <div class="pt-5 w-full h-auto">
                <div class="h-full w-full">
                    <div class="text-left pt-4 font-bold">
                        ARTIST YOU SHOULD FOLLOW
                    </div>
                    <div class=" pt-5 flex flex-wrap justify-center mx-0 items-center w-full gap-4">
                        <div v-for="(item, index) in artist" :key="index"
                            class="h-[300px] w-[20%] max-w-[180px] flex flex-col items-center box-border">
                            <div>
                                <a href="#"><img :src="item.profile_picture || profilePicture"
                                        class="rounded-full h-[180px] w-[180px] object-cover" alt="profile_picture"></a>
                                <div @click="gotoProfile(item.id)"
                                    class="pt-[4px] flex justify-center cursor-pointer items-center">
                                    {{ item.username }}
                                    <div class="w-3 h-3 ml-1" :class="{ 'hidden': item.isVerified === false }">
                                        <div v-if="item.is_verified"
                                            class="w-full h-full text-white bg-blue-500 rounded-full flex justify-center items-center text-xs">
                                            <font-awesome-icon icon="fa-solid fa-check" size="xs" />
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-[2px]">
                                    <span class="flex justify-center items-center opacity-60">
                                        <font-awesome-icon icon="fa-solid fa-person" size="sm" />
                                        <div v-if="followers" class="ml-[2px] text-gray-500 text-[12px]">{{
                                            followers.length }}
                                            followers
                                        </div>
                                    </span>
                                </div>
                                <div class="pt-[8px] flex justify-center">
                                    <button @click="followToggle(index)"
                                        class="px-4 py-[2px] max-w-20 w-20 bg-white rounded-md border-gray-400 border text-xs flex justify-center items-center text-black transition duration-200"
                                        :class="{ 'border-orange-500 text-orange-500': artist[index].isFollowing }">
                                        {{ artist[index].isFollowing ? 'Following' : 'Follow' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-4 mb-16">
                <div class="text-left font-semibold">
                    RANDOM SONG NOW
                </div>
                <div class="w-full h-auto mt-4">
                    <div class="grid grid-cols-3  ">
                        <div ref="menuContainer" v-for="(item, index) in songs" :key="index"
                            class="flex items-center p-2 hover:bg-gray-100">
                            <div class="h-[70px] aspect-square relative xl:h-[70px] lg:h-[60px] md:h-[50px]">
                                <a href="#">
                                    <img class=" rounded-md w-full h-full object-cover aspect-square"
                                        :src="item.artwork || defaultImage" alt="Artwork">
                                    <div
                                        class="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                        <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                    </div>
                                </a>
                            </div>
                            <div class="pl-4 flex-grow text-left w-24">
                                <div @click="goToTrack(item.id)"
                                    class="font-semibold text-black hover:text-gray-600 max-w-[165px] text-ellipsis whitespace-nowrap overflow-hidden">

                                    {{ item.title }}

                                </div>
                                <div class="flex max-w-[165px]  text-ellipsis whitespace-nowrap overflow-hidden">
                                    <div @click="gotoProfile(item.User.id)"
                                        class="text-gray-600 text-sm hover:underline text-ellipsis whitespace-nowrap cursor-pointer ">
                                        {{ item.User.username }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex-shrink-0 relative ">
                                <div @click="optionSong(index)"
                                    class=" w-[32px] h-[32px] rounded-full border-[1px] flex justify-center items-center cursor-pointer hover:bg-gray-200">
                                    <font-awesome-icon icon="fa-solid fa-ellipsis" />
                                </div>
                                <div v-if="openMenuIndex === index"
                                    class="absolute w-[280px] h-[auto] bg-[#9057e0] rounded-md left-0 bottom-8 block z-10">
                                    <ul>
                                        <div class="mb-5 border-b-white border-b-[1px]">
                                            <div class="flex p-2 ">
                                                <div class="basis-1/4">
                                                    <img class=" rounded-md w-full h-full object-cover"
                                                        :src="item.image" alt="Artwork">
                                                </div>
                                                <div class="basis-3/4 relative ">
                                                    <div class="absolute text-left pl-2 pt-2 left-0 top-0">
                                                        <div class="font-semibold text-white hover:text-purple-400">
                                                            <a href="#">
                                                                {{ item.name }}
                                                            </a>
                                                        </div>
                                                        <div
                                                            class="flex text-ellipsis whitespace-nowrap overflow-hidden max-w-[190px]">
                                                            <div v-for="(artist, index) in item.artist" :key="artist.id"
                                                                class=" text-white text-sm hover:underline ">
                                                                <a href="#">
                                                                    {{ artist.name }}<span
                                                                        v-if="index < item.artist.length - 1">,</span>
                                                                </a>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <li class="text-left"><a href="#"
                                                class="flex px-4 py-2 text-white hover:opacity-40">
                                                <div class="basis-1/6">
                                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                                </div>
                                                Add to Playlist
                                            </a></li>
                                        <li class="text-left"><a href="#"
                                                class="flex px-4 py-2 text-white hover:opacity-40">
                                                <div class="basis-1/6">
                                                    <font-awesome-icon icon="fa-solid fa-forward-step" class="pr-2" />
                                                </div>
                                                Play Next
                                            </a></li>
                                        <li class="text-left"><a href="#"
                                                class="flex px-4 py-2 text-white hover:opacity-40">
                                                <div class="basis-1/6">
                                                    <font-awesome-icon icon="fa-regular fa-heart" class="pr-2" />
                                                </div>
                                                Like
                                            </a></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-4 mb-16">
                <div class="text-left font-semibold">
                    RECOMMENDED FOR YOU
                </div>
                <div class="w-full h-auto mt-4">
                    <div class="grid grid-cols-3  ">
                        <div ref="menuContainer" v-for="(item, index) in similarSong" :key="index"
                            class="flex items-center p-2 hover:bg-gray-100">
                            <div class="h-[70px] aspect-square relative xl:h-[70px] lg:h-[60px] md:h-[50px]">
                                <a href="#">
                                    <img class=" rounded-md w-full h-full object-cover aspect-square"
                                        :src="item.artwork || defaultImage" alt="Artwork">
                                    <div
                                        class="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                        <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                    </div>
                                </a>
                            </div> 
                            <div class="pl-4 flex-grow text-left w-24">
                                <div @click="goToTrack(item.id)"
                                    class="font-semibold text-black hover:text-gray-600 max-w-[165px] text-ellipsis whitespace-nowrap overflow-hidden">

                                    {{ item.title }}

                                </div>
                                <div class="flex max-w-[165px]  text-ellipsis whitespace-nowrap overflow-hidden">
                                    <div @click="gotoProfile(item.User.id)"
                                        class="text-gray-600 text-sm hover:underline text-ellipsis whitespace-nowrap cursor-pointer ">
                                        {{ item.User.username }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex-shrink-0 relative ">
                                <div @click="optionSong(index)"
                                    class=" w-[32px] h-[32px] rounded-full border-[1px] flex justify-center items-center cursor-pointer hover:bg-gray-200">
                                    <font-awesome-icon icon="fa-solid fa-ellipsis" />
                                </div>
                                <div v-if="openMenuIndex === index"
                                    class="absolute w-[280px] h-[auto] bg-[#9057e0] rounded-md left-0 bottom-8 block z-10">
                                    <ul>
                                        <div class="mb-5 border-b-white border-b-[1px]">
                                            <div class="flex p-2 ">
                                                <div class="basis-1/4">
                                                    <img class=" rounded-md w-full h-full object-cover"
                                                        :src="item.image" alt="Artwork">
                                                </div>
                                                <div class="basis-3/4 relative ">
                                                    <div class="absolute text-left pl-2 pt-2 left-0 top-0">
                                                        <div class="font-semibold text-white hover:text-purple-400">
                                                            <a href="#">
                                                                {{ item.name }}
                                                            </a>
                                                        </div>
                                                        <div
                                                            class="flex text-ellipsis whitespace-nowrap overflow-hidden max-w-[190px]">
                                                            <div v-for="(artist, index) in item.artist" :key="artist.id"
                                                                class=" text-white text-sm hover:underline ">
                                                                <a href="#">
                                                                    {{ artist.name }}<span
                                                                        v-if="index < item.artist.length - 1">,</span>
                                                                </a>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <li class="text-left"><a href="#"
                                                class="flex px-4 py-2 text-white hover:opacity-40">
                                                <div class="basis-1/6">
                                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                                </div>
                                                Add to Playlist
                                            </a></li>
                                        <li class="text-left"><a href="#"
                                                class="flex px-4 py-2 text-white hover:opacity-40">
                                                <div class="basis-1/6">
                                                    <font-awesome-icon icon="fa-solid fa-forward-step" class="pr-2" />
                                                </div>
                                                Play Next
                                            </a></li>
                                        <li class="text-left"><a href="#"
                                                class="flex px-4 py-2 text-white hover:opacity-40">
                                                <div class="basis-1/6">
                                                    <font-awesome-icon icon="fa-regular fa-heart" class="pr-2" />
                                                </div>
                                                Like
                                            </a></li>
                                    </ul>
                                </div>
                            </div>
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import HeaderPage from '@/components/Header.vue';
import { usePlayerStore } from '@/js/state';

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
            songs: null,
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
        }
    },

    methods: {
        async getSimilarSong() {
            try {
                const res = await apiClient.get(`/song/getSimilarSongs`,{params: {song_id: this.playerStore.currentSong.id || 1,user_id: this.playerStore.idUserLogin || 1}});
                this.similarSong = [...res.data.data];
                console.log('similarSong: ', this.similarSong); 
            }
            catch (error) {
                console.error("Lỗi:", error.response?.data);
            }
        },
        async getLastestUpload() {
            try {
                const res = await apiClient.get(`/song/getLastestSong/${this.playerStore.idUserLogin}`);
                this.lastestUpload = [...res.data.data];
                console.log('lastestUpload: ', this.lastestUpload);
            }
            catch (error) {
                console.error("Lỗi:", error.response?.data);
            }
        },
        goToAllTracks() {
            this.$router.push({ name: 'TracksPage',params: { id: this.playerStore.idUserLogin} });
        },
        goToTrack(id) {
            this.$router.push({ name: 'TrackInfoPage', params: { id } });
        },
        async getRandomSong() {
            try {
                const res = await apiClient.get('/song/getRandomSong');
                this.songs = [...res.data.data];
                console.log('songs: ', this.songs);
            }
            catch (error) {
                console.error("Lỗi:", error.response?.data);
            }
        },
        async getRandomUser() {
            try {
                const res = await apiClient.get('/users/getRandomUser');
                this.artist = [...res.data.data];

                this.idUser = this.artist.map(user => user.id);
                console.log(this.artist);
                console.log('Ids: ', this.idUser);
            } catch (error) {
                console.log(error);
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
            this.playerStore.isPlaying = !this.playerStore.isPlaying;
            const rotateTonearms = document.querySelector('.rotate');
            if (this.playerStore.isPlaying) {
                rotateTonearms.classList.add('rotate-active');
            }
            else {
                rotateTonearms.classList.remove('rotate-active')
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

        addToPlaylist(index) {
            this.playlist[index].isAddToPlaylist = !this.playlist[index].isAddToPlaylist;
        },
        likePlaylist(index) {
            this.playlist[index].isLike = !this.playlist[index].isLike;
        },
        PlayPlaylist(index) {
            this.playlist[index].isAddToPlaylist;
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
</style>