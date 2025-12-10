<template>
    <div>
        <Header></Header>
        <div
            class="pt-16 w-container mx-auto h-screen mb-16 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div
                class="font-semibold text-2xl text-left p-4 text-ellipsis whitespace-nowrap overflow-hidden border-b-[1px]">
                Search result for "{{ searchQuery }}"
            </div>
            <div class="grid grid-cols-[240px_1fr] gap-4 h-full mt-4">
                <div class="h-full w-full">

                    <div class="flex justify-start w-full">
                        <ul class="flex flex-col  pl-4 w-full">
                            <li @click="searchOptionClick(index) && currentSearchOption == item.label" v-for="(item, index) in searchOptions" :key="index"
                                class="flex items-center cursor-pointer p-1"
                                :class="{ 'bg-[url(@/image/other/searchopt.png)] bg-cover bg-center text-white scale-110 opacity-85': selectedIndex === index }">
                                <font-awesome-icon :icon="item.icon" class="pr-2" />
                                {{ item.label }}
                            </li>

                        </ul>
                    </div>
                </div>
                <div v-if="searchOptions[selectedIndex].label === 'All'" class="h-full w-full p-2">
                    <div v-if="artist && songs" class="text-left text-[12px] text-gray-500 underline">
                        Found {{ artist.length }} User and {{ songs.length }} tracks
                    </div>
                    <div class="flex justify-between items-center w-full border-b-[1px] pb-2">
                        <div class="text-left font-semibold text-2xl pt-4">
                            User
                        </div>
                        <div @click="searchOptionClick(2)" class="whitespace-nowrap text-gray-500 cursor-pointer">
                            All User
                            <font-awesome-icon icon="fa-solid fa-chevron-right" />
                        </div>
                    </div>
                    <div class="h-auto w-full flex mt-4 ">
                        <div v-for="(item, index) in artist" :key="item.id" class="h-[300px] w-[180px] mr-4 ">
                            <div class="">
                                <a href="#"><img :src="item.profile_picture || defaultImage"
                                        class="rounded-full h-[180px] w-[180px] object-cover" alt=""></a>
                                <div class="pt-[4px] flex justify-center items-center">
                                    <div @click="redirectToProfile(item.id)" class="text-[16px] cursor-pointer">{{
                                        item.username }}</div>
                                    <div class="w-3 h-3 ml-1" :class="{ 'hidden': item.is_verified === false }">
                                        <div
                                            class="w-full h-full text-white bg-blue-500  rounded-full flex justify-center items-center text-xs">
                                            <font-awesome-icon icon="fa-solid fa-check" size="xs" />
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-[2px]">
                                    <span class="flex justify-center items-center opacity-60">
                                        <font-awesome-icon icon="fa-solid fa-person" size="sm" />
                                        <div class="ml-[2px] text-gray-500 text-[12px]">{{ item.followerCount }}
                                            followers
                                        </div>
                                    </span>
                                </div>
                                <div class="pt-[8px] flex justify-center">
                                    <div v-if="item.id != getCurrentUserId()" @click="followToggle(item.id, index)"
                                        class="w-[120px] max-w-[120px] flex items-center justify-center h-auto rounded-3xl border-[1px] mx-auto cursor-pointer my-4 p-2 text-sm xl:text-sm lg:text-[12px] md:text-[10px] "
                                        :class="{
                                            'bg-orange-500 text-white hover:border-white': !item.isFollowed,
                                            'bg-white border-orange-500 text-orange-500 hover:border-orange-500 ': item.isFollowed
                                        }">
                                        <div v-if="!item.isFollowed && item.id != getCurrentUserId()" class="pr-1">
                                            <font-awesome-icon icon="fa-solid fa-user-plus" />
                                        </div>
                                        <div v-if="item.isFollowed && item.id != getCurrentUserId()"
                                            class="pr-1 text-orange-500">
                                            <font-awesome-icon icon="fa-solid fa-user-check" />
                                        </div>
                                        {{ item.isFollowed ? 'Following' : 'Follow' }}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center w-full border-b-[1px] pb-2">
                        <div class="text-left font-semibold text-2xl pt-4">
                            Tracks
                        </div>
                        <div @click="searchOptionClick(1)" class="whitespace-nowrap text-gray-500 cursor-pointer">
                            All Tracks
                            <font-awesome-icon icon="fa-solid fa-chevron-right" />
                        </div>
                    </div>
                    <div class="w-full h-auto mt-4 mb-16 ">
                        <div class="block  ">
                            <!-- <div class=" w-1/3 p-2 max-h-[360px]"> -->
                            <!--  -->
                            <div ref="menuContainer" v-for="(item, index) in songs" :key="item.id"
                                class="flex items-center p-2 hover:bg-gray-100">
                                <div class="h-[70px] w-[70px] relative">
                                    <a href="#">
                                        <img class=" rounded-md w-full h-full object-cover" :src="item.artwork"
                                            alt="Artwork">
                                        <div
                                            class="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                            <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                        </div>
                                    </a>
                                </div>
                                <div class="pl-4 flex-grow text-left ">
                                    <div @click="redirectTrackInfo(item.id)"
                                        class="font-semibold text-black hover:text-gray-600 max-w-[450px] text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer">

                                        {{ item.title }}

                                    </div>
                                    <div v-for="(item, index) in item.SongArtists" :key="index"
                                        class="flex max-w-[165px] text-ellipsis whitespace-nowrap overflow-hidden">
                                        <div @click="redirectToProfile(item.User.id)"
                                            class="text-gray-600 text-sm hover:underline text-ellipsis whitespace-nowrap ">
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
                                        class="absolute w-[280px] h-[auto] bg-[#9057e0] rounded-md left-[-248px] bottom-8 block z-10">
                                        <ul>
                                            <div class="mb-5 border-b-white border-b-[1px]">
                                                <div class="flex p-2 ">
                                                    <div class="basis-1/4">
                                                        <img class=" rounded-md w-full h-full object-cover aspect-square"
                                                            :src="item.artwork" alt="Artwork">
                                                    </div>
                                                    <div class="basis-3/4 relative h-auto">
                                                        <div class="absolute text-left pl-2 left-0 top-0">
                                                            <div @click="redirectTrackInfo(item.id)"
                                                                class="font-semibold text-ellipsis overflow-hidden h-16 text-white hover:text-purple-400 cursor-pointer">

                                                                {{ item.title }}

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <li @click="togglePlay(index, item)" class="text-left"><a href="#"
                                                    class="flex px-4 py-2 text-white hover:opacity-40">
                                                    <div class="basis-1/6">
                                                        <font-awesome-icon icon="fa-solid fa-play" />
                                                    </div>
                                                    Play
                                                </a></li>
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
                                                        <font-awesome-icon icon="fa-solid fa-forward-step"
                                                            class="pr-2" />
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
                <div v-if="searchOptions[selectedIndex].label === 'Track'" class="h-full w-full p-2">
                    <div class=" ">
                        <div class="flex justify-between items-center w-full border-b-[1px] pb-2">
                            <div class="text-left font-semibold text-2xl ">
                                Tracks
                            </div>
                        </div>
                        <div class="w-full h-auto mt-4 mb-16 ">
                            <div class="  ">
                                <!-- <div class=" w-1/3 p-2 max-h-[360px]"> -->
                                <!--  -->
                                <div ref="menuContainer" v-for="(item, index) in songs" :key="item.id"
                                    class="flex items-center p-2 hover:bg-gray-100">
                                    <div class="h-[70px] w-[70px] relative">
                                        <a href="#">
                                            <img class=" rounded-md w-full h-full object-cover" :src="item.artwork"
                                                alt="Artwork">
                                            <div
                                                class="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                            </div>
                                        </a>
                                    </div>
                                    <div class="pl-4 flex-grow text-left ">
                                        <div @click="redirectTrackInfo(item.id)"
                                            class="font-semibold text-black hover:text-gray-600 max-w-[500px] text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer">

                                            {{ item.title }}

                                        </div>
                                        <div v-for="(item, index) in item.SongArtists" :key="index"
                                            class="flex max-w-[165px] text-ellipsis whitespace-nowrap overflow-hidden">
                                            <div @click="redirectToProfile(item.User.id)"
                                                class="text-gray-600 text-sm hover:underline text-ellipsis whitespace-nowrap ">
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
                                            class="absolute w-[280px] h-[auto] bg-[#9057e0] rounded-md left-[-248px] bottom-8 block z-10">
                                            <ul>
                                                <div class="mb-5 border-b-white border-b-[1px]">
                                                    <div class="flex p-2 ">
                                                        <div class="basis-1/4">
                                                            <img class=" rounded-md w-full h-full object-cover aspect-square"
                                                                :src="item.artwork" alt="Artwork">
                                                        </div>
                                                        <div class="basis-3/4 relative ">
                                                            <div class="absolute text-left pl-2 left-0 top-0">
                                                                <div
                                                                    class="font-semibold text-ellipsis overflow-hidden h-16 text-white hover:text-purple-400">
                                                                    <a href="#">
                                                                        {{ item.title }}
                                                                    </a>
                                                                </div>
                                                                <div
                                                                    class="flex text-ellipsis whitespace-nowrap overflow-hidden max-w-[190px]">
                                                                    <div v-for="(artist, index) in item.artist"
                                                                        :key="artist.id"
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

                                                <li @click="togglePlay(index, item)" class="text-left"><a href="#"
                                                        class="flex px-4 py-2 text-white hover:opacity-40">
                                                        <div class="basis-1/6">
                                                            <font-awesome-icon icon="fa-solid fa-play" />
                                                        </div>
                                                        Play
                                                    </a></li>
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
                                                            <font-awesome-icon icon="fa-solid fa-forward-step"
                                                                class="pr-2" />
                                                        </div>
                                                        Play Next
                                                    </a></li>
                                                <li class="text-left"><a href="#"
                                                        class="flex px-4 py-2 text-white hover:opacity-40">
                                                        <div class="basis-1/6">
                                                            <font-awesome-icon icon="fa-regular fa-heart"
                                                                class="pr-2" />
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
                <div v-if="searchOptions[selectedIndex].label === 'User'" class="h-full w-full p-2">
                    <div class="flex justify-between items-center w-full border-b-[1px] pb-2">
                        <div class="text-left font-semibold text-2xl">
                            User
                        </div>
                    </div>
                    <div class="h-auto w-full flex mt-4 ">
                        <div v-for="(item, index) in artist" :key="item.id" class="h-[300px] w-[180px] mr-4 ">
                            <div class="">
                                <a href="#"><img :src="item.profile_picture || defaultImage"
                                        class="rounded-full h-[180px] w-[180px] object-cover" alt=""></a>
                                <div class="pt-[4px] flex justify-center items-center">
                                    <a class="text-[16px]" href="#">{{ item.username }}</a>
                                    <div class="w-3 h-3 ml-1" :class="{ 'hidden': item.is_verified === false }">
                                        <div
                                            class="w-full h-full text-white bg-blue-500  rounded-full flex justify-center items-center text-xs">
                                            <font-awesome-icon icon="fa-solid fa-check" size="xs" />
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-[2px]">
                                    <span class="flex justify-center items-center opacity-60">
                                        <font-awesome-icon icon="fa-solid fa-person" size="sm" />
                                        <div class="ml-[2px] text-gray-500 text-[12px]">{{ item.followerCount }}
                                            followers
                                        </div>
                                    </span>
                                </div>
                                <div class="pt-[8px] flex justify-center">
                                    <div v-if="item.id != getCurrentUserId()" @click="followToggle(item.id, index)"
                                        class="w-[120px] max-w-[120px] flex items-center justify-center h-auto rounded-3xl border-[1px] mx-auto cursor-pointer my-4 p-2 text-sm xl:text-sm lg:text-[12px] md:text-[10px] "
                                        :class="{
                                            'bg-orange-500 text-white hover:border-white': !item.isFollowed,
                                            'bg-white border-orange-500 text-orange-500 hover:border-orange-500 ': item.isFollowed
                                        }">
                                        <div v-if="!item.isFollowed && item.id != getCurrentUserId()" class="pr-1">
                                            <font-awesome-icon icon="fa-solid fa-user-plus" />
                                        </div>
                                        <div v-if="item.isFollowed && item.id != getCurrentUserId()"
                                            class="pr-1 text-orange-500">
                                            <font-awesome-icon icon="fa-solid fa-user-check" />
                                        </div>
                                        {{ item.isFollowed ? 'Following' : 'Follow' }}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
import { usePlayerStore } from '@/js/state';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
export default {
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
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
                    username: username,
                    duration: song.SongDetail.duration,
                    path: song.path,
                });

                playerStore.currentPlayIndex = index;
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
    components: {
        Header,
    },
    beforeUnmount() {
        document.removeEventListener("click", this.clickOutside);
    }
}
</script>

<style scoped></style>