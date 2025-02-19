<template>
    <HeaderPage>

    </HeaderPage>
    <div>
        <div class="pt-16 pb-16 h-full w-container m-auto ">
            <div class="text-left text-3xl py-8">YOUR LASTEST UPLOAD</div>
            <div class="grid grid-cols-[192px_1fr] gap-10">
                <div class=" h-48 border-4 border-[#F6E2EC] grid place-items-center ">

                    <div class="w-5/6 h-5/6  relative">

                        <div class="rotate absolute w-5 h-2 bg-red-500 rounded-md z-50"
                            :class="{ 'rotate-active': state.isPlaying }">
                            <div class="rotate absolute h-14 w-1 bg-gray-400"></div>
                        </div>



                        <div class="relative w-full h-full">
                            <img class="spin pointer-events-none select-none z-0" src="@/image/banners/vinyl-record.png"
                                alt="">
                            <div class="absolute inset-0 flex justify-center items-center scale-150 text-white z-20 cursor-pointer"
                                @click="PlayControlToggle">
                                <font-awesome-icon v-if="state.isPlaying" icon="fa-solid fa-pause" size="2xl" />
                                <font-awesome-icon v-else icon="fa-solid fa-play" size="2xl" />


                            </div>
                        </div>

                    </div>
                </div>
                <div class=" h-48 bg-gradient-to-r from-gray-400 to-gray-600">
                    <div class="grid grid-cols-[1fr_192px] gap-10 h-full">
                        <div class="h-full">
                            <div
                                class="text-base text-left pl-5 pt-5 text-white text-ellipsis overflow-hidden whitespace-nowrap w-3/4">
                                <a href="#">Eulelia</a>
                            </div>
                            <div
                                class="w-3/4 text-xl text-left pl-5 text-white text-ellipsis overflow-hidden whitespace-nowrap">
                                <a href="#">Feel Good - Illenium,Gryffin,Daya (Eulelia Remix) </a>
                            </div>
                            <div class="pt-7">
                                <div class="pl-7 flex ">
                                    <div class="opacity-70 text-white mr-4 flex items-center">
                                        <font-awesome-icon icon="fa-solid fa-play" />
                                        <div class="pl-2">13.4k</div>
                                    </div>
                                    <div class="opacity-70 text-white mr-4 flex items-center ">
                                        <font-awesome-icon icon="fa-solid fa-heart" />
                                        <div class="pl-2">13.4k</div>
                                    </div>
                                </div>
                            </div>
                            <div class="pt-4">
                                <div class="pl-5 ">
                                    <div class="flex space-x-[15px]">
                                        <div @click="ButtonGroupToggle"
                                            class="w-auto flex justify-center items-center border-[1px] text-white cursor-pointer "
                                            :class="{ 'border-orange-500': isButtonGroupClick, 'text-orange-500': isButtonGroupClick }">
                                            <font-awesome-icon class="px-2 py-1" icon="fa-solid fa-heart" />
                                            <div class="px-2 py-1">Like </div>
                                        </div>
                                        <div @click="ButtonGroupToggle"
                                            class="w-auto flex justify-center items-center border-[1px] text-white cursor-pointer "
                                            :class="{ 'border-orange-500': isButtonGroupClick, 'text-orange-500': isButtonGroupClick }">
                                            <font-awesome-icon class="px-2 py-1" icon="fa-solid fa-heart" />
                                            <div class="px-2 py-1">Like </div>
                                        </div>
                                        <div @click="ButtonGroupToggle"
                                            class="w-auto flex justify-center items-center border-[1px] text-white cursor-pointer "
                                            :class="{ 'border-orange-500': isButtonGroupClick, 'text-orange-500': isButtonGroupClick }">
                                            <font-awesome-icon class="px-2 py-1" icon="fa-solid fa-heart" />
                                            <div class="px-2 py-1">Like </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class=" h-full place-content-center place-items-center">
                            <img class="place-items-center w-5/6 h-5/6 border-4 border-white"
                                src="@/image/artwork/feelgood.jpg" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-5">
                <a href="#">
                    <router-link to="/tracks">
                        <div
                            class=" p-2 border-gray-400 border-[1px] text-gray-400 hover:border-gray-600 hover:text-gray-600">
                            See all your tracks</div>
                    </router-link>
                </a>

            </div>
            <div class="pt-5 border-b-gray-200 border-b-[1px]"></div>
            <div class="pt-5 w-full h-auto grid grid-cols-[1fr_500px]">
                <div class=" h-full w-[700px]">
                    <div class="text-left pt-4 font-bold">
                        ARTIST YOU SHOULD FOLLOW
                    </div>
                    <div
                        class="artist-container pt-5  flex justify-center items-center transition-transform duration-300">


                        <div class="h-[300px] w-[95%] flex justify-center items-center overflow-x-hidden">
                            <div @click="preButton"
                                class=" absolute top-1/2 left-0 bg-white z-20 py-4 flex justify-center items-center px-3 h-5 w-5 border rounded-md cursor-pointer hover:border-orange-500 hover:text-orange-500 ">
                                <font-awesome-icon icon="fa-solid fa-chevron-left" />
                            </div>
                            <div ref="artistList" class="flex transition-transform duration-300 z-10">
                                <div v-for="(item, index) in artist" :key="item.id"
                                    class="h-[300px] w-[180px] mr-4 overflow-x-hidden">
                                    <div class="">
                                        <a href="#"><img :src="item.image"
                                                class="rounded-full h-[180px] w-[180px] object-cover" alt=""></a>
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
                                                class="px-4 py-[2px] max-w-20 w-20 bg-white rounded-md border-gray-400 border text-xs flex justify-center items-center text-black  transition duration-200"
                                                :class="{ 'border-orange-500 text-orange-500': artist[index].isFollowing }">
                                                {{ artist[index].isFollowing ? 'Following' : 'Follow' }}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div @click="nextButton"
                                class=" py-4 px-3 absolute top-1/2 right-0 bg-white border h-5 w-5 max-w-5 rounded-md cursor-pointer z-20 flex justify-center items-center hover:border-orange-500 hover:text-orange-500">
                                <font-awesome-icon icon="fa-solid fa-chevron-right " />
                            </div>
                        </div>

                    </div>


                </div>
                <div class=" h-full">

                    <div class="w-full h-96 border-gray-200 border-[1px] rounded-md">
                        <div class="flex items-center justify-between border-b-[1px]">
                            <div class="pl-4 pt-4 pb-4 text-base  ">
                                Next Up
                            </div>
                            <div
                                class="px-4 py-2 border-[1px] border-gray-400 mr-4 cursor-pointer text-[12px] rounded-sm hover:border-gray-600 hover:text-orange-500 ">
                                Clear</div>
                        </div>

                        <div class="overflow-y-auto h-[calc(100%-56px)]">
                            <div v-for="(item, index) in items" :key="item.id" draggable="true"
                                @dragstart="onDragStart(index)" @dragover="onDragOver($event)" @drop="onDrop(index)"
                                class="h-14 w-full mt-2 flex items-center justify-center  hover:bg-gray-200 ">
                                <div class="w-full h-14 rounded-sm flex items-center  ">
                                    <div class="1/12 rotate-90 opacity-10 cursor-grab">
                                        <font-awesome-icon icon="fa-solid fa-grip" />
                                    </div>
                                    <div class="ml-2 w-[76px] h-[56px]  flex items-center justify-center">
                                        <img :src="item.image" class="h-[56px] w-[56px] rounded-lg object-cover" alt="">
                                    </div>
                                    <div class="text-left pl-2 w-full ">
                                        <div class="w-full text-ellipsis overflow-hidden whitespace-nowrap">
                                            <a href="#">
                                                {{ item.title }}
                                            </a>
                                        </div>
                                        <div class="text-gray-500 text-sm">
                                            <a href="#">
                                                {{ item.artist }}
                                            </a>
                                        </div>
                                    </div>
                                    <div class="w-1/6 flex justify-center items-center ">
                                        <div class="pl-3 cursor-pointer opacity-50"
                                            :class="{ 'text-orange-500': item.isLike }" @click="LikeToggle(index)">
                                            <font-awesome-icon icon="fa-solid fa-heart" />
                                        </div>
                                        <div @click="removeSongFromPlaylist(index)"
                                            class="pl-3 cursor-pointer opacity-50">
                                            <font-awesome-icon icon="fa-solid fa-xmark" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="text-left pt-4 font-bold">
                PLAYLIST TODAY
            </div>
            <div class="pt-5  flex justify-center items-center transition-transform duration-300">
                <div class="h-auto w-full flex justify-center items-center overflow-x-hidden">
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
            <div class="pt-4 mb-16">
                <div class="text-left font-semibold">
                    NEW RELEASE HOT TODAY
                </div>
                <div class="w-full h-auto mt-4">
                    <div class="grid grid-cols-3  ">
                        <!-- <div class=" w-1/3 p-2 max-h-[360px]"> -->
                        <!--  -->
                        <div ref="menuContainer" v-for="(item, index) in songs" :key="item.id"
                            class="flex items-center p-2 hover:bg-gray-100">
                            <div class="h-[70px] w-[70px] relative">
                                <a href="#">
                                    <img class=" rounded-md w-full h-full object-cover" :src="item.image" alt="Artwork">
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
                                        <a href="#">{{ index < item.artist.length - 1 ? artist.name + ' ,' : artist.name
                                                }}</a>
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
    <FooterPage>

    </FooterPage>
</template>

<script>
import FooterPage from '@/components/Footer.vue';
import HeaderPage from '@/components/Header.vue';
import { state } from '@/js/state';
export default {
    name: 'HomePage',

    setup() {
        return {
            state,

        }
    },
    mounted() {
        document.addEventListener("click", this.clickOutside);
        this.currentOffset = 0;
        this.updateTransform();

    },
    data() {
        return {
            currentOffset: 0,
            cardWidth: 200,
            openMenuIndex: null,
            isMusicPlay: false,
            isButtonGroupClick: false,
            dragIndex: null,
            followState: 'Follow',
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
                {
                    id: 5,
                    name: 'Eulelia',
                    image: require('@/image/user-logo/meo.jpg'),
                    isVerified: false,
                    followers: 14,
                    isFollowing: false,
                },
                {
                    id: 6,
                    name: 'Masew',
                    image: require('@/image/user-logo/masew.jpg'),
                    isVerified: true,
                    followers: 54323,
                    isFollowing: false,
                },

            ],
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
                {
                    id: 5,
                    name: 'Nhạc Xuân Remix',
                    isAddToPlaylist: false,
                    isLike: false,
                    image: require('@/image/playlist-artwork/nhac-xuan-rmx.jpg')
                },
                {
                    id: 6,
                    name: 'Nhạc Xuân sôi động',
                    isAddToPlaylist: false,
                    isLike: false,
                    image: require('@/image/playlist-artwork/nhac-xuan-sd.jpg')
                },
            ],
        }
    },
    methods: {
        PlayControlToggle() {
            state.isPlaying = !state.isPlaying;
            const rotateTonearms = document.querySelector('.rotate');
            if (state.isPlaying) {
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
        nextButton() {
            const containerWidth = this.$refs.artistList.offsetParent.offsetWidth - 30;
            const contentWidth = this.artist.length * this.cardWidth;
            const maxOffset = -(contentWidth - containerWidth);

            // Kiểm tra giới hạn
            if (this.currentOffset > maxOffset) {
                this.currentOffset = Math.max(maxOffset, this.currentOffset - this.cardWidth);
                this.updateTransform();
            }
        },
        preButton() {
            // Kiểm tra giới hạn
            if (this.currentOffset < 0) {
                this.currentOffset = Math.min(0, this.currentOffset + this.cardWidth);
                this.updateTransform();
            }
        },
        updateTransform() {
            this.$refs.artistList.style.transform = `translateX(${this.currentOffset + 266}px)`;
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
    components: {
        HeaderPage,
        FooterPage,
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

.artist-container {
    overflow: hidden;
    /* Ẩn các phần tràn */
    width: 100%;
    /* Hoặc kích thước cố định nếu cần */
    position: relative;
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