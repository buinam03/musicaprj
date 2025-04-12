<template>
    <div>
        <Header></Header>
        <div class="pt-16 w-container mx-auto h-auto mb-16 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div class="h-[300px] w-full bg-gray-700 grid grid-cols-[300px_1fr]">
                <div class="w-full h-full rounded-full flex justify-center items-center">
                    <div class="h-4/5 w-4/5 rounded-full bg-white flex justify-center items-center relative">
                        <div class="h-11/12 w-11/12 rounded-full">
                            <img src="@/image/user-logo/denvau.jpg" class="rounded-full object-cover" alt="">
                        </div>
                        <div
                            class="h-10 w-10 text-black absolute bottom-2 right-9 flex justify-center items-center rounded-full bg-white hover:bg-gray-300 cursor-pointer">
                            <font-awesome-icon icon="fa-solid fa-camera" />
                        </div>
                    </div>

                </div>
                <div class="w-full h-full">
                    <div class="w-full h-full flex justify-end items-start pt-5 pr-5">
                        <div
                            class="text-gray-600 bg-gray-300 px-[8px] rounded-sm hover:bg-gray-200 duration-200 cursor-pointer">
                            <font-awesome-icon icon="fa-solid fa-camera" />
                            Upload header image
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full h-[120px] border-b-[1px] sticky top-[64px] z-10 bg-white">
                <div class="w-full h-full mb-4 flex justify-between mt-4">
                    <div class="ml-5">
                        <div class="font-semibold text-2xl flex items-center ">
                            Đen Vâu
                            <div
                                class="w-4 h-4 text-white bg-blue-500  rounded-full flex justify-center items-center text-xs ml-2">
                                <font-awesome-icon icon="fa-solid fa-check" size="xs" />
                            </div>
                        </div>
                        <div class="text-xs text-left text-gray-400 hover:text-gray-600 hover:underline pt-1">
                            <router-link class="" to="/followers">1.004.256 followers</router-link>
                        </div>
                        <div class="text-xs text-left text-gray-400 hover:text-gray-600 hover:underline pt-1">
                            <router-link class="" to="/following">8 following</router-link>
                        </div>
                        <div class="pt-1 flex">
                            <div class="h-8 w-8 bg-blue-300 rounded-full mr-1">
                                <img src="@/image/user-logo/martingarrix.jpg"
                                    class="rounded-full w-full h-full object-cover" alt="">
                            </div>
                            <div class="h-8 w-8 bg-blue-300 rounded-full mr-1">
                                <img src="@/image/user-logo/masew.jpg" class="rounded-full w-full h-full object-cover"
                                    alt="">
                            </div>
                            <div class="h-8 w-8 bg-blue-300 rounded-full mr-1">
                                <img src="@/image/user-logo/meo.jpg" class="rounded-full w-full h-full object-cover"
                                    alt="">
                            </div>
                            <div class="h-8 w-8 bg-blue-300 rounded-full mr-1">
                                <img src="@/image/user-logo/moritz-mentges-5MlBMYDsGBY-unsplash.jpg"
                                    class="rounded-full w-full h-full object-cover" alt="">
                            </div>
                            <div
                                class="h-8 w-8 rounded-full mr-1 flex justify-center items-center border-[2px] hover:bg-gray-200 cursor-pointer">
                                <router-link class="" to="/following"><font-awesome-icon
                                        icon="fa-solid fa-ellipsis" /></router-link>
                            </div>

                        </div>
                    </div>
                    <div class="h-full w-48 block ">
                        <div class="h-8 w-auto">
                            <div
                                class="border-[1px] text-md font-extralight text-white bg-orange-500 rounded-[4px] cursor-pointer px-3 py-1 flex items-center justify-center hover:border-gray-400">
                                <div class="pr-1">
                                    <font-awesome-icon icon="fa-solid fa-chart-column" />
                                </div>
                                Your Insights
                            </div>
                        </div>
                        <div class="h-8 w-auto mt-2">
                            <div @click="toggleEditProfile"
                                class="border-[1px] text-md font-extralight text-gray-600 bg-white rounded-[4px] cursor-pointer px-3 py-1 flex items-center justify-center hover:border-gray-400">
                                <div class="pr-1">
                                    <font-awesome-icon icon="fa-solid fa-pencil" />
                                </div>
                                Edit Profile
                            </div>
                        </div>
                        <div class="h-8 w-auto mt-2">
                            <router-link to="/achievements">
                                <div
                                    class="border-[1px] text-md font-extralight text-gray-600 bg-white rounded-[4px] cursor-pointer px-3 py-1 flex items-center justify-center hover:border-gray-400">
                                    <div class="pr-1">
                                        <font-awesome-icon icon="fa-solid fa-trophy" />
                                    </div>
                                    Achievements
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-5 w-full h-auto">
                <div class="text-sm text-left">
                    <span class="font-semibold ">Address: </span>Ha Noi,Viet Nam
                </div>
                <div class="text-sm text-left mt-2">
                    <span class="font-semibold">Bio:</span> Nguyễn Đức Cường, thường được biết đến với nghệ danh Đen hay
                    Đen Vâu, là một nam rapper, nhạc sĩ và người dẫn chương trình người Việt Nam. Đen Vâu là "một trong
                    số ít nghệ sĩ thành công từ làn sóng underground và âm nhạc indie" của Việt Nam. Anh sở hữu những
                    bài hát đạt hàng triệu lượt xem trên YouTube và là chủ nhân của một số giải thưởng âm nhạc.
                </div>
            </div>
            <div class="w-full h-auto mt-5">
                <div class="w-full h-auto text-left text-[30px] font-semibold xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    Your Lastest Upload
                </div>
                <div class="w-full h-40 mt-4 flex hover:bg-gray-200 rounded-sm xl:h-40 lg:h-36 md:h-32">
                    <div class="h-40 aspect-square flex-shrink-0 mr-4 xl:h-40 lg:h-36 md:h-32">
                        <img class="w-full h-full mx-auto rounded-sm object-cover "
                            src="@/image/artwork/MV-den-vau-nau-an-cho-em-vietnam-nuoi-em-2.jpg" alt="" />
                    </div>
                    <div class="w-full h-full flex justify-start items-center">
                        <div class="w-1/2 h-1/2 flex justify-between items-center">
                            <div class="text-left">
                                <div
                                    class="font-semibold text-xl hover:text-purple-500 text-ellipsis overflow-hidden whitespace-nowrap">
                                    <a href="#">Nấu ăn cho em</a>
                                </div>
                                <div
                                    class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap">
                                    <a href="#">Đen, Pialinh</a>
                                </div>
                                <div class="text-gray-500 text-sm mt-2">
                                    <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                    2.1M
                                </div>
                            </div>
                            <div class="">
                                <div class="text-white bg-gray-400 w-auto h-auto px-1 rounded-sm">Public</div>
                            </div>
                        </div>
                        <div class="w-1/2 h-full flex justify-end items-center">
                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-play" />

                            </div>
                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-plus" />
                            </div>
                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-pen" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    Most-Listened Track
                </div>
                <div class="w-full h-40 mt-4 flex hover:bg-gray-200 rounded-sm xl:h-40 lg:h-36 md:h-32">
                    <div class="h-40 aspect-square flex-shrink-0 mr-4 xl:h-40 lg:h-36 md:h-32">
                        <img class="w-full h-full mx-auto rounded-sm object-cover "
                            src="@/image/artwork/lamgimaphaihot.jpg" alt="" />
                    </div>
                    <div class="w-full h-full flex justify-start items-center">
                        <div class="w-1/2 h-1/2 flex justify-between items-center">
                            <div class="text-left">
                                <div
                                    class="font-semibold text-xl hover:text-purple-500 text-ellipsis overflow-hidden whitespace-nowrap ">
                                    <a href="#">Làm gì mà phải hốt</a>
                                </div>
                                <div
                                    class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap">
                                    <a href="#">Đen, JustaTee, Hoàng Thùy Linh</a>
                                </div>
                                <div class="text-gray-500 text-sm mt-2">
                                    <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                    20.5M
                                </div>
                            </div>
                            <div class="">
                                <div class="text-white bg-gray-400 w-auto h-auto px-1 rounded-sm">Public</div>
                            </div>
                        </div>
                        <div class="w-1/2 h-full flex justify-end items-center">
                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-play" />
                            </div>
                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-plus" />
                            </div>
                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-pen" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    All Tracks by Đen Vâu
                </div>
                <div v-for="(item, index) in pageData" :key="item.id"
                    class="w-full h-20 mt-4 flex hover:bg-gray-200 rounded-sm  xl:h-20 lg:h-16 md:h-14">
                    <div class="h-20 aspect-square flex-shrink-0 mr-4  xl:h-20 lg:h-16 md:h-14">
                        <img class="w-full h-full mx-auto rounded-sm object-cover "
                            src="@/image/artwork/lamgimaphaihot.jpg" alt="" />
                    </div>
                    <div class="w-full h-full flex justify-start items-center">
                        <div class="w-1/2 h-1/2 flex justify-between items-center">
                            <div class="text-left">
                                <div
                                    class="font-semibold text-lg hover:text-purple-500 text-ellipsis overflow-hidden whitespace-nowrap xl:text-xl lg:text-base md:text-base">
                                    <router-link to="/trackinfo">{{ item.name }}</router-link>
                                </div>
                                <div class="flex">
                                    <div v-for="(artist, index) in item.artist" :key="artist.id"
                                        class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap flex justify-center items-center text-sm">
                                        <a href="#">{{ index < item.artist.length - 1 ? artist.name + ',' : artist.name
                                                }}</a>
                                    </div>
                                </div>
                                <div class="text-gray-500 text-sm mt-1">
                                    <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                    {{ parseFloat(item.stream / 1000).toFixed(1) }} k
                                </div>
                            </div>
                        </div>
                        <div class="w-1/2 h-full flex justify-end items-center">
                            <div v-if="item.isPublic === false"
                                class="mr-5 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center text-blue-500 border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-lock" />
                            </div>
                            <div @click="togglePlay(index)"
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon
                                    :icon="state.currentPlayIndex === index && state.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                            </div>

                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-plus" />
                            </div>
                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-pen" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pb-4">
                    <ul class="flex justify-center items-center">
                        <li>
                            <button class="button-page flex justify-center items-center"
                                @click="currentPage = Math.max(1, currentPage - 1)"
                                :class="{ 'invisible': currentPage === 1 }" type="button"><font-awesome-icon
                                    icon="fa-solid fa-angles-left" /></button>
                        </li>
                        <li class="mx-8">
                            <button class="button-page w-[40px] h-[40px]  " v-for="(page) in pageToShow" :key="page"
                                @click="currentPage = page" :class="{ 'bg-gray-200': currentPage === page }"
                                type="button">{{ page }}</button>
                        </li>
                        <li>
                            <button class="button-page flex justify-center items-center max-w-10"
                                @click="currentPage = Math.min(this.totalPage, currentPage + 1)"
                                :class="{ 'invisible': currentPage === totalPage }" type="button"><font-awesome-icon
                                    icon="fa-solid fa-angles-right" /></button>
                        </li>
                    </ul>

                </div>
                <div class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    Likes by Đen Vâu
                </div>
                <div v-for="(item, index) in pageData" :key="item.id"
                    class="w-full h-20 mt-4 flex hover:bg-gray-200 rounded-sm xl:h-20 lg:h-16 md:h-14">
                    <div class="h-20 aspect-square flex-shrink-0 mr-4 xl:h-20 lg:h-16 md:h-14">
                        <img class="w-full h-full mx-auto rounded-sm object-cover "
                            src="@/image/artwork/lamgimaphaihot.jpg" alt="" />
                    </div>
                    <div class="w-full h-full flex justify-start items-center">
                        <div class="w-1/2 h-1/2 flex justify-between items-center">
                            <div class="text-left">
                                <div
                                    class="font-semibold text-lg hover:text-purple-500 text-ellipsis overflow-hidden whitespace-nowrap xl:text-xl lg:text-base md:text-base">
                                    <a href="#">{{ item.name }}</a>
                                </div>
                                <div class="flex">
                                    <div v-for="(artist, index) in item.artist" :key="artist.id"
                                        class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap flex justify-center items-center text-sm">
                                        <a href="#">{{ index < item.artist.length - 1 ? artist.name + ',' : artist.name
                                                }}</a>
                                    </div>
                                </div>
                                <div class="text-gray-500 text-sm mt-1  ">
                                    <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                    {{ parseFloat(item.stream / 1000).toFixed(1) }} k
                                </div>
                            </div>
                        </div>
                        <div class="w-1/2 h-full flex justify-end items-center">
                            <div v-if="item.isPublic === false"
                                class="mr-5 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center text-blue-500 border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-lock" />
                            </div>
                            <div @click="togglePlay(index)"
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon
                                    :icon="state.currentPlayIndex === index && state.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                            </div>

                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-plus" />
                            </div>
                            <div
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-pen" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pb-4">
                    <ul class="flex justify-center items-center">
                        <li>
                            <button class="button-page flex justify-center items-center"
                                @click="currentPage = Math.max(1, currentPage - 1)"
                                :class="{ 'invisible': currentPage === 1 }" type="button"><font-awesome-icon
                                    icon="fa-solid fa-angles-left" /></button>
                        </li>
                        <li class="mx-8">
                            <button class="button-page w-[40px] h-[40px]  " v-for="(page) in pageToShow" :key="page"
                                @click="currentPage = page" :class="{ 'bg-gray-200': currentPage === page }"
                                type="button">{{ page }}</button>
                        </li>
                        <li>
                            <button class="button-page flex justify-center items-center max-w-10"
                                @click="currentPage = Math.min(this.totalPage, currentPage + 1)"
                                :class="{ 'invisible': currentPage === totalPage }" type="button"><font-awesome-icon
                                    icon="fa-solid fa-angles-right" /></button>
                        </li>
                    </ul>

                </div>
            </div>
        </div>
        <div v-if="isEditProfile" class="fixed inset-0 flex justify-center items-center bg-white bg-opacity-40 w-full  h-auto m-auto z-40">
            <div class="w-[1000px] h-auto bg-white border-[1px] border-gray-400 p-4 xl:w-[1000px] lg:w-[900px] md:w-[700px]">
                <div class="text-left font-semibold p-4">
                    Edit Your Profile
                </div>
                <div class="w-full h-auto px-4">
                    <div class="pt-4">
                        <div class="text-left text-sm">
                            Display Name
                        </div>
                        <div class="border-[1px] rounded-md">
                            <input class="w-full p-4 text-lg" type="text" name="" id="">
                        </div>
                    </div>
                </div>
                <div class="w-full h-auto px-4 flex justify-between items-center ">
                    <div class="pt-4 w-[45%]">
                        <div class="text-left text-sm ">
                            City
                        </div>
                        <select class="flex justify-start items-center border-[1px] w-full p-4">
                            <option>Ha Noi</option>
                        </select>
                    </div>
                    <div class="pt-4 w-[45%]">
                        <div class="text-left text-sm">
                            Country
                        </div>
                        <select class="flex justify-start items-center border-[1px] w-full p-4">
                            <option>Viet Nam</option>
                        </select>
                    </div>
                </div>
                <div class="w-full h-auto px-4">
                    <div class="pt-4">
                        <div class="text-left text-sm">
                            Bio
                        </div>
                        <div class="border-[1px] rounded-md">
                            <textarea class="w-full p-4 h-32 text-lg resize-none" rows="4"
                                placeholder="Enter your bio..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="mt-24 flex justify-end items-center">

                    <button @click="toggleCancel" class="border-[1px] border-black mr-4 px-4 py-2 rounded-3xl hover:bg-gray-200"
                        type="button">Cancel</button>
                    <button class="border-[1px] border-white mr-4 px-4 py-2 rounded-3xl bg-orange-500 text-white"
                        type="submit">Submit</button>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import { state } from '@/js/state';
export default {
    name: 'ProfilePage',
    setup() {
        return {
            state,
        }
    },
    data() {
        return {
            streamCount: null,
            currentPage: 1,
            currentPage2: 1,
            itemPerPage: 5,
            numofpageToShow: 3,
            isEditProfile: false,
            songs: [
                {
                    id: 1,
                    name: 'Làm gì mà phải hốt',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 2,
                            name: 'JustaTee'
                        },
                        {
                            id: 3,
                            name: 'Hoàng Thùy Linh'
                        }
                    ],
                    stream: 20305969,
                    isPublic: true
                },
                {
                    id: 2,
                    name: 'Đi Về Nhà',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 4,
                            name: 'JustaTee'
                        }
                    ],
                    stream: 15203489,
                    isPublic: true
                },
                {
                    id: 3,
                    name: 'Anh Đếch Cần Gì Nhiều Ngoài Em',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 5,
                            name: 'Vũ.'
                        }
                    ],
                    stream: 17450234,
                    isPublic: true
                },
                {
                    id: 4,
                    name: 'Trốn Tìm',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 6,
                            name: 'MTV Band'
                        }
                    ],
                    stream: 23904352,
                    isPublic: true
                },
                {
                    id: 5,
                    name: 'Bài Này Chill Phết',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 4,
                            name: 'Min'
                        }
                    ],
                    stream: 19380456,
                    isPublic: true
                },
                {
                    id: 6,
                    name: 'Hai Triệu Năm',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 7,
                            name: 'Biên'
                        }
                    ],
                    stream: 21129487,
                    isPublic: true
                },
                {
                    id: 7,
                    name: 'Mười Năm',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 8,
                            name: 'Ngọc Linh'
                        }
                    ],
                    stream: 18023409,
                    isPublic: true
                },
                {
                    id: 8,
                    name: 'Mang Tiền Về Cho Mẹ',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 9,
                            name: 'Nguyên Thảo'
                        }
                    ],
                    stream: 25302765,
                    isPublic: false
                },
                {
                    id: 9,
                    name: 'Lối Nhỏ',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 10,
                            name: 'Phương Anh Đào'
                        }
                    ],
                    stream: 20483742,
                    isPublic: true
                },
                {
                    id: 10,
                    name: 'Cho Mình Em',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 11,
                            name: 'Binz'
                        }
                    ],
                    stream: 19384267,
                    isPublic: false
                },
                {
                    id: 11,
                    name: 'Đưa Nhau Đi Trốn',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 12,
                            name: 'Lynk Lee'
                        }
                    ],
                    stream: 16238470,
                    isPublic: true
                },
                {
                    id: 12,
                    name: 'Ghé Thăm',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 13,
                            name: 'Kimmese'
                        }
                    ],
                    stream: 17294857,
                    isPublic: false
                },
                {
                    id: 13,
                    name: 'Ta Cứ Đi Cùng Nhau',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 14,
                            name: 'Lin+'
                        }
                    ],
                    stream: 15830294,
                    isPublic: true
                },
                {
                    id: 14,
                    name: 'Ngày Khác Lạ',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 15,
                            name: 'Triple D'
                        },
                        {
                            id: 16,
                            name: 'Giang Pham'
                        }
                    ],
                    stream: 18927403,
                    isPublic: true
                },
                {
                    id: 15,
                    name: 'Vì Yêu Cứ Đâm Đầu',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        },
                        {
                            id: 17,
                            name: 'Min'
                        },
                        {
                            id: 18,
                            name: 'JustaTee'
                        }
                    ],
                    stream: 22509376,
                    isPublic: true
                },
                {
                    id: 16,
                    name: 'Bước Qua Mùa Cô Đơn',
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        }
                    ],
                    stream: 17629485,
                    isPublic: true
                }
            ]

        }
    },
    methods: {
        togglePlay(index) {
            if (state.currentPlayIndex === index && state.isPlaying) {
                state.isPlaying = false;
                state.currentPlayIndex = null;
            } else {
                state.isPlaying = true;
                state.currentPlayIndex = index;
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
        toggleEditProfile(){
            this.isEditProfile = !this.isEditProfile;
            document.body.style.overflow = this.isEditProfile ? "hidden" : "";
        },
        toggleCancel(){
            this.isEditProfile = false;
            document.body.style.overflow = this.isEditProfile ? "hidden" : "";
        }

    },
    computed: {
        totalPage() {
            return Math.ceil(this.songs.length / this.itemPerPage);
        },
        pageData() {
            const start = (this.currentPage - 1) * this.itemPerPage; //stt dau tien cua moi trang
            const end = start + this.itemPerPage //stt ket thuc vi du nhu la o trang 2 la 6->10
            return this.songs.slice(start, end); //tra ve stt
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
        }
    },
    mounted() {

    },
    components: {
        Header,
        Footer
    },
}
</script>

<style scoped>
.button-page {
    padding: 10px;
    border: 1px solid;
    margin-right: 4px;
    border-radius: 9999px;
}
</style>