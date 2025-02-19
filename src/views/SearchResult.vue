<template>
    <div>
        <Header></Header>
        <div class="pt-16 w-container mx-auto h-screen mb-16 ">
            <div
                class="font-semibold text-2xl text-left p-4 text-ellipsis whitespace-nowrap overflow-hidden border-b-[1px]">
                Search result for "{{ searchQuery }}"
            </div>
            <div class="grid grid-cols-[240px_1fr] gap-4 h-full mt-4">
                <div class="h-full w-full">

                    <div class="flex justify-start w-full">
                        <ul class="flex flex-col  pl-4 w-full">
                            <li @click="searchOptionClick(index)" v-for="(item, index) in searchOptions" :key="index"
                                class="flex items-center cursor-pointer p-1"
                                :class="{ 'bg-[url(@/image/other/searchopt.png)] bg-cover bg-center text-white scale-110 opacity-85': selectedIndex === index }">
                                <font-awesome-icon :icon="item.icon" class="pr-2" />
                                {{ item.label }}
                            </li>

                        </ul>
                    </div>
                </div>
                <div class="h-full w-full p-2">
                    <div class="text-left text-[12px] text-gray-500 underline">
                        Found 20+ User and 500+ tracks,playlist
                    </div>
                    <div class="flex justify-between items-center w-full border-b-[1px] pb-2">
                        <div class="text-left font-semibold text-2xl pt-4">
                            User
                        </div>
                        <div class="whitespace-nowrap text-gray-500 cursor-pointer">
                            All User
                            <font-awesome-icon icon="fa-solid fa-chevron-right" />
                        </div>
                    </div>
                    <div class="h-auto w-full flex mt-4">
                        <div v-for="(item, index) in artist" :key="item.id"
                            class="h-[300px] w-[180px] mr-4 overflow-x-hidden">
                            <div class="">
                                <a href="#"><img :src="item.image" class="rounded-full h-[180px] w-[180px] object-cover"
                                        alt=""></a>
                                <div class="pt-[4px] flex justify-center items-center">
                                    <a class="text-[16px]" href="#">{{ item.name }}</a>
                                    <div class="w-3 h-3 ml-1" :class="{ 'hidden': item.isVerified === false }">
                                        <div
                                            class="w-full h-full text-white bg-blue-500  rounded-full flex justify-center items-center text-xs">
                                            <font-awesome-icon icon="fa-solid fa-check" size="xs" />
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-[2px]">
                                    <span class="flex justify-center items-center opacity-60">
                                        <font-awesome-icon icon="fa-solid fa-person" size="sm" />
                                        <div class="ml-[2px] text-gray-500 text-[12px]">{{ item.followers }}
                                            followers
                                        </div>
                                    </span>
                                </div>
                                <div class="pt-[8px] flex justify-center">
                                    <button @click="followToggle(index)"
                                        class="px-4 py-[2px] max-w-20 w-20 bg-white rounded-md border-gray-400 border text-xs flex justify-center items-center text-black hover:border-gray-500 transition duration-200"
                                        :class="{ 'border-orange-500 text-orange-500 hover:border-orange-500': artist[index].isFollowing }">
                                        {{ artist[index].isFollowing ? 'Following' : 'Follow' }}
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center w-full border-b-[1px] pb-2">
                        <div class="text-left font-semibold text-2xl pt-4">
                            Tracks
                        </div>
                        <div class="whitespace-nowrap text-gray-500 cursor-pointer">
                            All Tracks
                            <font-awesome-icon icon="fa-solid fa-chevron-right" />
                        </div>
                    </div>
                    <div class="w-full h-auto mt-4 ">
                        <div class="grid grid-cols-3  ">
                            <!-- <div class=" w-1/3 p-2 max-h-[360px]"> -->
                            <!--  -->
                            <div ref="menuContainer" v-for="(item, index) in songs" :key="item.id"
                                class="flex items-center p-2 hover:bg-gray-100">
                                <div class="h-[70px] w-[70px] relative">
                                    <a href="#">
                                        <img class=" rounded-md w-full h-full object-cover" :src="item.image"
                                            alt="Artwork">
                                        <div
                                            class="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                            <font-awesome-icon icon="fa-solid fa-play" size="lg" />
                                        </div>
                                    </a>
                                </div>
                                <div class="pl-4 flex-grow text-left ">
                                    <div
                                        class="font-semibold text-black hover:text-gray-600 max-w-[165px] text-ellipsis whitespace-nowrap overflow-hidden">
                                        <a href="#">
                                            {{ item.name }}
                                        </a>
                                    </div>
                                    <div class="flex max-w-[165px] text-ellipsis whitespace-nowrap overflow-hidden">
                                        <div v-for="(artist, index) in item.artist" :key="artist.id"
                                            class="text-gray-600 text-sm hover:underline text-ellipsis whitespace-nowrap ">
                                            <a href="#">{{ index < item.artist.length - 1 ? artist.name + ' ,' :
                                                artist.name }}</a>
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
                    <div class="flex justify-between items-center w-full border-b-[1px] pb-2">
                        <div class="text-left font-semibold text-2xl pt-4">
                            Playlist
                        </div>
                        <div class="whitespace-nowrap text-gray-500 cursor-pointer">
                            All Playlist
                            <font-awesome-icon icon="fa-solid fa-chevron-right" />
                        </div>
                    </div>      
                    <div class="pt-5 mb-16  flex transition-transform duration-300">
                        <div class="h-auto w-auto flex justify-center items-center overflow-x-hidden">
                            <div class="flex">
                                <div v-for="(item, index) in playlist" :key="item.id"
                                    class="h-auto w-[180px] mr-4 group relative">
                                    <div class="h-[180px] w-[180px] relative">
                                        <a href="#">
                                            <img class=" rounded-lg object-cover z-0" :src="item.image" alt="">
                                            <div
                                                class="absolute inset-0 bg-gray-500 bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-75 rounded-lg ">
                                            </div>
                                            <div
                                                class="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity ">
                                                <div @click.stop.prevent="PlayPlaylist(index)"
                                                    class="h-[45px] w-[45px] border-[1px]  border-white flex justify-center items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity ">
                                                    <font-awesome-icon icon="fa-solid fa-play" size="lg"
                                                        class="text-white z-50" />
                                                </div>
                                            </div>
                                            <div class="absolute top-0 left-0 h-full flex items-center pl-5 z-50">
                                                <div @click.stop.prevent="addToPlaylist(index)"
                                                    class="h-[30px] w-[30px] flex justify-center items-center rounded-full  opacity-0 group-hover:opacity-100 transition-colors"
                                                    :class="{ 'text-orange-500': playlist[index].isAddToPlaylist, 'text-white': !playlist[index].isAddToPlaylist }">
                                                    <font-awesome-icon icon="fa-solid fa-plus" size="lg" />
                                                </div>
                                            </div>

                                            <div class="absolute top-0 right-0 h-full flex items-center pr-5 z-50">
                                                <div @click.stop.prevent="likePlaylist(index)"
                                                    class="h-[30px] w-[30px] flex justify-center items-center rounded-full  opacity-0 group-hover:opacity-100 transition-colors"
                                                    :class="{ 'text-orange-500': playlist[index].isLike, 'text-white': !playlist[index].isLike }">
                                                    <font-awesome-icon icon="fa-solid fa-heart" size="lg" />
                                                </div>
                                            </div>
                                        </a>

                                    </div>
                                    <div class="pt-[4px] flex justify-center items-center">
                                        <a class="text-[16px] text-gray-600" href="#">{{ item.name }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>          
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default {
    name: 'SearchResultPage',
    data() {
        return {
            selectedIndex: 0,
            openMenuIndex: null,
            songs: [
                {
                    id: 1,
                    name: "Cái đẹp",
                    artist: [
                        { id: 1, name: "tlinh" },
                        { id: 2, name: "Pháo" },
                        { id: 3, name: "Pháp Kiều" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                },
                {
                    id: 2,
                    name: "Ngã tư không đèn",
                    artist: [
                        { id: 4, name: "Den Vau" },
                        { id: 5, name: "JustaTee" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 3,
                    name: "Tình yêu bận bịu",
                    artist: [
                        { id: 6, name: "Hoaprox" },
                        { id: 7, name: "Masew" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 4,
                    name: "Vùng ký ức",
                    artist: [
                        { id: 8, name: "Đức Phúc" },
                        { id: 9, name: "ERIK" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 5,
                    name: "Hành trình cuối",
                    artist: [
                        { id: 10, name: "Sơn Tùng MTP" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 6,
                    name: "Nhớ mùa thu Hà Nội",
                    artist: [
                        { id: 11, name: "Hà Anh Tuấn" },
                        { id: 12, name: "Mỹ Tâm" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 7,
                    name: "Thời thanh xuân đã qua",
                    artist: [
                        { id: 13, name: "Trịnh Thăng Bình" },
                        { id: 14, name: "Bảo Anh" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 8,
                    name: "Hoa nở không màu",
                    artist: [
                        { id: 15, name: "Hoài Lâm" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 9,
                    name: "Màu nước mắt",
                    artist: [
                        { id: 16, name: "Nguyễn Trần Trung Quân" },
                        { id: 17, name: "Den Vau" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 10,
                    name: "Ngày khác lạ",
                    artist: [
                        { id: 18, name: "Phương Ly" },
                        { id: 19, name: "JustaTee" },
                        { id: 20, name: "Den Vau" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 11,
                    name: "Đi về nhà",
                    artist: [
                        { id: 21, name: "JustaTee" },
                        { id: 22, name: "Den Vau" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
                {
                    id: 12,
                    name: "Bỏ lỡ một người",
                    artist: [
                        { id: 23, name: "Hòa Minzy" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg')
                },
            ],
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
                {
                    label: 'Playlist',
                    icon: 'fa-solid fa-music'
                },
            ],
            artist: [
                {
                    id: 1,
                    name: 'Đen Vâu',
                    image: require('@/image/user-logo/denvau.jpg'),
                    isVerified: true,
                    followers: 102254,
                    isFollowing: false,
                },
                {
                    id: 2,
                    name: 'Hoaprox',
                    image: require('@/image/user-logo/hoaprox.jpg'),
                    isVerified: true,
                    followers: 45707,
                    isFollowing: false,
                },
                {
                    id: 3,
                    name: 'Bùi Trường Linh',
                    image: require('@/image/user-logo/buitruonglinh.jpg'),
                    isVerified: false,
                    followers: 20252,
                    isFollowing: false,
                },
                {
                    id: 4,
                    name: 'Martin Garrix',
                    image: require('@/image/user-logo/martingarrix.jpg'),
                    isVerified: true,
                    followers: 1054326,
                    isFollowing: false,
                },
            ],
            playlist: [
                {
                    id: 1,
                    name: 'EDM Now',
                    isAddToPlaylist: false,
                    isLike: false,
                    image: require('@/image/playlist-artwork/edm-now.jpg')
                },
                {
                    id: 2,
                    name: 'K-Pop Remix',
                    isAddToPlaylist: false,
                    isLike: false,
                    image: require('@/image/playlist-artwork/k-pop-rmx.jpg')
                },
                {
                    id: 3,
                    name: 'Nhạc Tết thịnh hành',
                    isAddToPlaylist: false,
                    isLike: false,
                    image: require('@/image/playlist-artwork/nhac-tet-th.jpg')
                },
                {
                    id: 4,
                    name: 'Nhạc Tết mới nhất',
                    isAddToPlaylist: false,
                    isLike: false,
                    image: require('@/image/playlist-artwork/nhac-tet.jpg')
                },
            ],
        }
    },
    mounted() {
        document.addEventListener("click", this.clickOutside);
        console.log()
    },
    methods: {
        updateMetaTitle(query) {
            document.title = `Search result for: ${query}`;
        },
        searchOptionClick(index) {
            this.selectedIndex = index;
        },
        followToggle(index) {
            this.artist[index].isFollowing = !this.artist[index].isFollowing;
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
        Footer
    },
    beforeUnmount() {
        document.removeEventListener("click", this.clickOutside);
    }
}
</script>

<style scoped></style>