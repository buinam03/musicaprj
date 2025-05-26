<template>
    <div>
        <Header></Header>
        <div v-if="this.userById"
            class="pt-16 w-container mx-auto h-auto mb-16 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div class="h-[300px] w-full bg-gray-700 grid grid-cols-[300px_1fr]" :style="{
                backgroundImage: `url('${userById.header_picture}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }">
                <div class="w-full h-full rounded-full flex justify-center items-center">
                    <div class="h-4/5 w-4/5 rounded-full bg-white flex justify-center items-center relative">
                        <div class="h-11/12 w-11/12 rounded-full">
                            <img :src="userById.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                class="rounded-full aspect-square object-cover" alt="profile">
                        </div>
                        <button v-if="isUserCurrent" @click="ProfilePictureOpenDialog" type="button"
                            class="h-10 w-10  text-black absolute bottom-2 right-9 flex justify-center items-center rounded-full bg-white hover:bg-gray-300 cursor-pointer">
                            <!-- Icon máy ảnh -->
                            <font-awesome-icon icon="fa-solid fa-camera" />
                            <!-- Input file ẩn -->
                        </button>
                    </div>
                    <div v-if="isOpenDialogProfile"
                        class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div  class="bg-white rounded-lg shadow-xl w-1/3 h-1/2 p-4">
                            <h2 class="text-lg font-semibold mb-4">Change profile picture</h2>

                            <!-- Hiển thị ảnh đã chọn -->
                            <div class="relative flex justify-center items-center">
                                <img :src="profile_picture_url || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                    alt="Preview" class="w-72 h-72 object-cover rounded-full border" />
                                <input @change="handleFileUpload"
                                    class="absolute w-full h-full inset-0 opacity-0 cursor-pointer " type="file"
                                    accept=".jpg,.png" />
                            </div>

                            <!-- Nút điều khiển -->
                            <div class="flex justify-end gap-4 mt-6">
                                <button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" @click="cancelImage">
                                    Cancel
                                </button>
                                <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    @click="saveImage">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full h-full">
                    <div class="w-full h-full flex justify-end items-start pt-5 pr-5">
                        <button v-if="isUserCurrent" @click="HeaderPictureOpenDialog" class="btn-warning" type="button">
                            <div
                                class="text-gray-600 bg-gray-300 px-[8px] rounded-sm hover:bg-gray-200 duration-200 cursor-pointer">
                                <font-awesome-icon icon="fa-solid fa-camera" />
                                Upload header image
                            </div>
                        </button>
                    </div>
                    <div v-if="isOpenDialogHeaderProfile"
                        class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div class="bg-white rounded-lg shadow-xl w-2/3 h-1/2 p-4">
                            <h2 class="text-lg font-semibold mb-4">Change header picture</h2>

                            <!-- Hiển thị ảnh đã chọn -->
                            <div class="relative flex justify-center items-center bg-white">
                                <img :src="header_picture_url || 'http://localhost:8080/images/other/header_default.png'"
                                    alt="Preview" class="w-full h-72 object-cover border cursor-pointer" />
                                <input @change="handleHeaderFileUpload" type="file" accept=".jpg,.png"
                                    class="absolute w-full h-full inset-0 opacity-0 cursor-pointer" />
                            </div>

                            <!-- Nút điều khiển -->
                            <div class="flex justify-end gap-4 mt-6">
                                <button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" @click="cancelImage">
                                    Cancel
                                </button>
                                <button @click="saveHeaderImage"
                                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div class="w-full h-[120px] border-b-[1px] sticky top-[64px] z-10 bg-white">
                <div class="w-full h-full mb-4 flex justify-between mt-4">
                    <div class="ml-5">
                        <div class="font-semibold text-2xl flex items-center ">
                            {{ userById.username }}
                            <div v-if="userById.is_verified"
                                class="w-4 h-4 text-white bg-blue-500  rounded-full flex justify-center items-center text-xs ml-2">
                                <font-awesome-icon icon="fa-solid fa-check" size="xs" />
                            </div>
                        </div>
                        <div @click="gotoFollower" v-if="countFollower" class="text-xs text-left text-gray-400 hover:text-gray-600 hover:underline pt-1">
                            {{ countFollower || 0 }} followers
                        </div>
                        <div @click="gotoFollower" v-else class="text-xs text-left text-gray-400 hover:text-gray-600 hover:underline pt-1">
                            <router-link class="" to="/followers">0 followers</router-link>
                        </div>
                        <div @click="gotoFollowing" v-if="countFollowing" class="text-xs text-left text-gray-400 hover:text-gray-600 hover:underline pt-1">
                            <router-link class="" to="/following">{{ countFollowing || 0 }} following</router-link>
                        </div>
                        <div @click="gotoFollowing" v-else class="text-xs text-left text-gray-400 hover:text-gray-600 hover:underline pt-1">
                            <router-link class="" to="/following">0 following</router-link>
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
                    <div v-if="isUserCurrent === true" class="h-full w-48 block ">
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
                    <div v-if="isUserCurrent === false" class="h-full w-48 block ">
                        <div class="h-8 w-auto">
                            <div @click="followUser"
                                class="border-[1px] text-md font-extralight  bg-orange-500 rounded-[4px] cursor-pointer px-3 py-1 flex items-center justify-center "
                                :class="{
                                    'bg-orange-500 text-white hover:border-white': !isFollowed,
                                    'bg-white border-orange-500 text-orange-500 hover:border-orange-500 ': isFollowed
                                }">
                                <div v-if="this.isFollowed === false" class="pr-1">
                                    <font-awesome-icon icon="fa-solid fa-user-plus" />
                                </div>
                                <div v-if="this.isFollowed === true" class="pr-1 text-orange-500">
                                    <font-awesome-icon icon="fa-solid fa-user-check" />
                                </div>
                                {{ this.isFollowed ? 'Following' : 'Follow' }}
                            </div>
                        </div>
                        <div class="h-8 w-auto mt-2">
                            <div @click="sendMessageClick"
                                class="border-[1px] text-md font-extralight text-gray-600 bg-white rounded-[4px] cursor-pointer px-3 py-1 flex items-center justify-center hover:border-gray-400">
                                <div class="pr-1">
                                    <font-awesome-icon icon="fa-solid fa-message" />
                                </div>
                                Send Message
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-5 w-full h-auto">
                <div class="text-sm text-left mt-2">
                    <span class="font-semibold">Address:</span> <span class="text-gray-500">{{ userById.province + ', '
                        + userById.country ||
                        `${userById.username} hasn't added a address yet. Stay tuned for him/her to update it!`
                    }}.</span>
                </div>
                <div class="text-sm text-left mt-2">
                    <span class="font-semibold">Bio:</span> <span class="text-gray-500">{{ userById.bio ||
                        `${userById.username} hasn't added a bio yet. Stay tuned for him/her to update it!` }}.</span>
                </div>
            </div>
            <div class="w-full h-auto mt-5">
                <div
                    class="w-full h-auto text-left text-[30px] font-semibold xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    Lastest Upload
                </div>
                <div v-for="(item, index) in lastestSong" :key="index"
                    class="w-full h-40 mt-4 flex hover:bg-gray-200 rounded-sm xl:h-40 lg:h-36 md:h-32">
                    <div class="h-40 aspect-square flex-shrink-0 mr-4 xl:h-40 lg:h-36 md:h-32">
                        <img class="w-full h-full mx-auto rounded-sm object-cover " :src="item.artwork || defaultImage"
                            alt="" />
                    </div>
                    <div class="w-full h-full flex justify-start items-center">
                        <div class="w-1/2 h-1/2 flex justify-between items-center">
                            <div class="text-left">
                                <div
                                    class="font-semibold text-lg hover:text-purple-500 w-[400px] text-ellipsis overflow-hidden whitespace-nowrap">
                                    <a href="#">{{ item.title }}</a>
                                </div>
                                <div
                                    class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap">
                                    <a href="#">{{ item.User?.username || "Unknown Uploader" }}</a>
                                </div>
                                <div class="text-gray-500 text-sm mt-2">
                                    <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                    {{ item.SongDetail.plays }}
                                </div>
                            </div>
                            <div class="">
                                <div v-if="item.is_public === true"
                                    class="text-white bg-gray-400 w-auto h-auto px-1 rounded-sm">Public</div>
                                <div v-if="item.is_public === false"
                                    class="text-white bg-gray-400 w-auto h-auto px-1 rounded-sm">Private</div>
                            </div>
                        </div>
                        <div class="w-1/2 h-full flex justify-end items-center">
                            <div @click="togglePlay(index, item)"
                                class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                <font-awesome-icon
                                    :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
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
                <div
                    class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    Most-Listened Track
                </div>
                <div v-for="(item, index) in mostListenSong" :key="index" class="w-full h-40 mt-4 flex hover:bg-gray-200 rounded-sm xl:h-40 lg:h-36 md:h-32">
                    <div class="h-40 aspect-square flex-shrink-0 mr-4 xl:h-40 lg:h-36 md:h-32">
                        <img class="w-full h-full mx-auto rounded-sm object-cover "
                            :src="item.artwork || defaultImage" alt="" />
                    </div>
                    <div class="w-full h-full flex justify-start items-center">
                        <div class="w-1/2 h-1/2 flex justify-between items-center">
                            <div class="text-left w-full">
                                <div
                                    class="font-semibold text-xl hover:text-purple-500 text-ellipsis overflow-hidden whitespace-nowrap w-full ">
                                    {{ item.title }}
                                </div>
                                <div v-for="(item, index) in item.SongArtists" :key="index"
                                    class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap">
                                    <a href="#">{{ item.User?.username || "Unknown Uploader" }}</a>
                                </div>
                                <div class="text-gray-500 text-sm mt-2">
                                    <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                    {{ item.SongDetail.plays }}
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
                <div v-if="songUser.length > 0"
                    class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    All Tracks by {{songUser[0].User?.username}}
                </div>  
                <div v-if="songUser.length > 0" class="h-[500px] w-full">
                    <div v-for="(item, index) in pageData" :key="item.id"
                        class="w-full h-20 mt-4 flex hover:bg-gray-200 rounded-sm  xl:h-20 lg:h-16 md:h-14">
                        <div class="h-20 aspect-square flex-shrink-0 mr-4  xl:h-20 lg:h-16 md:h-14">
                            <img class="w-full h-full mx-auto rounded-sm object-cover " :src="item.artwork"
                                alt="artwork" />
                        </div>
                        <div class="w-full h-full flex justify-start items-center">
                            <div class="w-1/2 h-1/2 flex justify-between items-center">
                                <div class="text-left">
                                    <div
                                        class="font-semibold text-lg hover:text-purple-500 w-[320px] text-ellipsis overflow-hidden whitespace-nowrap xl:text-xl lg:text-base md:text-base">
                                        <router-link :to="`/trackinfo/${item.id}`">{{ item.title }}</router-link>
                                    </div>
                                    <div class="flex">
                                        <div 
                                            class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap flex justify-center items-center text-sm">
                                            <a href="#">{{ item.User?.username }}</a>
                                        </div>
                                    </div>
                                    <div class="text-gray-500 text-sm mt-1">
                                        <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                        {{ item.SongDetail.plays }}
                                    </div>
                                </div>
                            </div>
                            <div class="w-1/2 h-full flex justify-end items-center">
                                <div v-if="Number(item.is_public) === 0"
                                    class="mr-5 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center text-blue-500 border-blue-500 ">
                                    <font-awesome-icon icon="fa-solid fa-lock" />
                                </div>
                                <div @click="togglePlay(index, item)"
                                    class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                    <font-awesome-icon
                                        :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                </div>

                                <div @click="addToPlaylist(index, item)"
                                    class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                </div>
                                <div v-if="idUserCurrent === userById.id" @click="toggleEditTracks(item.id)"
                                    class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-pen" />
                                </div>
                                <div @click="toggleLike(index, item.id)" 
                                    class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer" 
                                    :class="{'text-orange-500 border-orange-500': likedSongs.includes(item.id)}">
                                    <font-awesome-icon icon="fa-solid fa-heart" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-auto w-full flex justify-center items-center">
                    <div class="text-[30px]">{{ messageSong }}</div> <!-- Debug -->
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
                <div v-if="userById"
                    class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    Likes by {{ userById.username }}
                </div>
                <div class="h-[400px] w-full">
                    <div v-for="(item, index) in pageLikeData" :key="item.id"
                        class="w-full h-20 mt-4 flex hover:bg-gray-200 rounded-sm xl:h-20 lg:h-16 md:h-14">
                        <div class="h-20 aspect-square flex-shrink-0 mr-4 xl:h-20 lg:h-16 md:h-14">
                            <img class="w-full h-full mx-auto rounded-sm object-cover "
                                :src="item.Song.artwork || defaultImage" alt="" />
                        </div>
                        <div class="w-full h-full flex justify-start items-center">
                            <div class="w-1/2 h-1/2 flex justify-between items-center">
                                <div class="text-left">
                                    <div
                                        class="font-semibold max-w-[320px] text-lg hover:text-purple-500 text-ellipsis overflow-hidden whitespace-nowrap xl:text-xl lg:text-base md:text-base">
                                        <a href="#">{{ item.Song.title }}</a>
                                    </div>
                                    <div class="flex">
                                        <div
                                            class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap flex justify-center items-center text-sm">
                                            <a href="#">{{ item.Song.User?.username || "Unknown Uploader" }}</a>
                                        </div>
                                    </div>
                                    <div class="text-gray-500 text-sm mt-1  ">
                                        <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                        {{ item.Song.SongDetail.plays }}
                                    </div>
                                </div>
                            </div>
                            <div class="w-1/2 h-full flex justify-end items-center">
                                <div v-if="Number(item.Song.is_public) === 0"
                                    class="mr-5 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center text-blue-500 border-blue-500 ">
                                    <font-awesome-icon icon="fa-solid fa-lock" />
                                </div>
                                <div @click="togglePlay(index, item.Song)"
                                    class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                    <font-awesome-icon
                                        :icon="playerStore.currentPlayIndex === index && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                </div>

                                <div @click="addToPlaylist(index, item.Song)"
                                    class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-plus" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pb-4">
                    <ul class="flex justify-center items-center">
                        <li>
                            <button class="button-page flex justify-center items-center"
                                @click="currentLikePage = Math.max(1, currentLikePage - 1)"
                                :class="{ 'invisible': currentPage === 1 }" type="button"><font-awesome-icon
                                    icon="fa-solid fa-angles-left" /></button>
                        </li>
                        <li class="mx-8">
                            <button class="button-page w-[40px] h-[40px]  " v-for="(page) in pageLikeToShow" :key="page"
                                @click="currentLikePage = page" :class="{ 'bg-gray-200': currentLikePage === page }"
                                type="button">{{ page }}</button>
                        </li>
                        <li>
                            <button class="button-page flex justify-center items-center max-w-10"
                                @click="currentLikePage = Math.min(this.totalLikePage, currentPage + 1)"
                                :class="{ 'invisible': currentLikePage === totalLikePage }" type="button"><font-awesome-icon
                                    icon="fa-solid fa-angles-right" /></button>
                        </li>
                    </ul>

                </div>
            </div>
        </div>
        <div v-if="isEditProfile && userById"
            class="fixed inset-0 flex justify-center items-center bg-white bg-opacity-40 w-full  h-auto m-auto z-40">
            <div
                class="w-[1000px] h-auto bg-white border-[1px] border-gray-400 p-4 xl:w-[1000px] lg:w-[900px] md:w-[700px]">
                <div class="text-left font-semibold p-4">
                    Edit Your Profile
                </div>
                <div class="w-full h-auto px-4">
                    <div class="pt-4">
                        <div class="text-left text-sm">
                            Display Name
                        </div>
                        <div class="border-[1px] rounded-md">
                            <input v-model="usernameUser" class="w-full p-4 text-lg" type="text" name="" id="">
                        </div>
                    </div>
                </div>
                <div class="w-full h-auto px-4 flex justify-between items-center ">
                    <div class="w-[45%]">
                        <div class="pt-4 ">
                            <div class="text-left text-sm ">
                                City
                            </div>
                            <select v-model="provinceUser"
                                class="flex justify-start items-center border-[1px] w-full p-4">
                                <option v-for="(item, index) in province" :key="index">{{ item.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="pt-4 w-[45%]">
                        <div class="text-left text-sm">
                            Country
                        </div>
                        <select v-model="country" class="flex justify-start items-center border-[1px] w-full p-4">
                            <option>Việt Nam</option>
                        </select>
                    </div>
                </div>
                <div class="w-full h-auto px-4">
                    <div class="pt-4">
                        <div class="text-left text-sm">
                            Bio
                        </div>
                        <div class="border-[1px] rounded-md">
                            <textarea v-model="bio" class="w-full p-4 h-32 text-lg resize-none" rows="4"
                                placeholder="Enter your bio..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="mt-24 flex justify-end items-center">

                    <button @click="toggleCancel"
                        class="border-[1px] border-black mr-4 px-4 py-2 rounded-3xl hover:bg-gray-200"
                        type="button">Cancel</button>
                    <button @click="SaveInfoUser"
                        class="border-[1px] border-white mr-4 px-4 py-2 rounded-3xl bg-orange-500 text-white"
                        type="submit">Submit</button>
                </div>
            </div>
        </div>
        <div v-if="isEditTracks"
            class="fixed inset-0 flex justify-center items-center bg-white bg-opacity-40 w-full  h-auto m-auto z-40">
            <div
                class="w-[1000px] h-auto bg-white border-[1px] border-gray-400 p-4 xl:w-[1000px] lg:w-[900px] md:w-[700px]">
                <div class="text-left font-semibold p-4">
                    Edit track
                </div>
                <div class="w-full h-auto px-4">
                    <div class="pt-4">
                        <div class="text-left text-sm">
                            Title
                        </div>
                        <div class="border-[1px] rounded-md">
                            <input v-model="editTitle" class="w-full p-4 text-lg" type="text">
                        </div>
                    </div>
                </div>
                <div class="w-full h-auto px-4 flex justify-between items-center mt-4">
                    <div class="w-[45%] aspect-square">
                        <div
                            class="aspect-square h-[full] border-[2px] border-gray-300 border-dashed rounded-md mx-auto">
                            <button type="button" class="btn-warning2">
                                <img v-if="imageURL" :src="imageURL"
                                    class="w-full h-full object-cover p-5 border-[10px]" alt="artwork">
                                <div v-else class="flex flex-col items-center gap-10">
                                    <font-awesome-icon icon="fa-solid fa-upload" class="uploadIcon opacity-50" />
                                    <span class="opacity-50 text-xl">Add new artwork</span>
                                </div>
                                <input ref="fileInput" type="file" accept=".jpg,.png" @change="handleFileUploadEdit">
                            </button>
                        </div>
                    </div>
                    <div class="pt-4 w-[45%] h-[400px]">
                        <div class="text-left text-sm">
                            Genre
                        </div>
                        <div class="border-[1px] rounded-md">
                            <select v-model="selectedGenre" class="w-full p-4 text-lg">
                                <option value="">Select a genre</option>
                                <option v-for="item in genreList" :key="item.id" :value="item">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                        <div class="pt-4">
                            <div class="text-left text-sm">
                                Bio
                            </div>
                            <div class="border-[1px] rounded-md">
                                <textarea v-model="bioEdit" class="w-full p-4 h-32 text-lg resize-none" rows="4"
                                    placeholder="Enter your bio..."></textarea>
                            </div>
                        </div>
                        <div class="w-full h-auto">
                            <div class="text-left flex font-semibold mt-5 mb-2 text-sm">
                                Track Privacy
                            </div>
                            <div class="w-full text-sm flex">
                                <div class="flex justify-start items-center">
                                    <input v-model="privacy" value="1" type="radio">
                                    <div class="pl-2 font-semibold text-sm">Public</div>
                                </div>
                                <div class="flex justify-start items-center ml-10">
                                    <input v-model="privacy" value="0" type="radio">
                                    <div class="pl-2 font-semibold text-sm">Private</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="w-full h-auto px-4">

                </div>
                <div class="mt-24 flex justify-end items-center">

                    <button @click="isEditTracks = false"
                        class="border-[1px] border-black mr-4 px-4 py-2 rounded-3xl hover:bg-gray-200"
                        type="button">Cancel</button>
                    <button @click="editTrack"
                        class="border-[1px] border-white mr-4 px-4 py-2 rounded-3xl bg-orange-500 text-white"
                        type="submit">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import Header from '@/components/Header.vue';
import { usePlayerStore } from '@/js/state';
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
        }
    },
    methods: {
        gotoFollower(){
            this.$router.push({path: '/followers/' + this.profileId})
        },
        gotoFollowing(){
            this.$router.push({path: '/following/' + this.profileId})
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
                } else {
                    // Nếu chưa like thì thêm vào
                    this.likedSongs.push(songId);
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
                    await this.loadProfile();
                }
            } catch (error) {
                console.log('Error edit track', error);
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
            } catch (error) {
                console.error("Failed to follow:", error);
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
                this.loadProfile();
                this.toggleCancel();
            } catch (error) {
                console.error("Failed to update:", error);
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
            const payload = {
                profilePicture: this.profile_picture_url, // URL Base64
            };
            try {
                await apiClient.put('http://localhost:3000/api/users/updateProfilePicture', payload);
                this.loadProfile();
                this.isOpenDialogProfile = false;
            } catch (error) {
                console.log("Error: ", error)
            }
        },
        async saveHeaderImage() {
            const payload = {
                headerpicture: this.header_picture_url, // URL Base64
            };
            try {
                await apiClient.put('http://localhost:3000/api/users/updateHeaderPicture', payload);
                console.log('success')
                this.loadProfile();
                this.isOpenDialogHeaderProfile = false;
            } catch (error) {
                console.log("Error: ", error)
            }
        },

        handleFileUpload(event) {
            const file = event.target.files[0]; // Lấy file đầu tiên
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.profile_picture_url = e.target.result; // Gán URL ảnh vào `imageUrl`
                };
                reader.readAsDataURL(file); // Đọc file dưới dạng DataURL
                event.target.value = null;
            }
        },
        handleHeaderFileUpload(event) {
            const file = event.target.files[0]; // Lấy file đầu tiên
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.header_picture_url = e.target.result; // Gán URL ảnh vào `imageUrl`
                };
                reader.readAsDataURL(file); // Đọc file dưới dạng DataURL
                event.target.value = null;
            }
        },
        handleFileUploadEdit(event) {
            const file = event.target.files[0]; // Lấy file đầu tiên
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imageURL = e.target.result; // Gán URL ảnh vào `imageUrl`
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
            } else {
                console.log("This song is already in the playlist.");
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
            console.log(this.profileId);
            Promise.all([
                apiClient.get(`/song/getAllSong/${this.profileId}`),
                apiClient.get("/users/getCurrentUser"),
                apiClient.get(`/users/getUserById/${this.profileId}`),
            ])
                .then(async ([songResponse, userResponse, userByIdRes]) => {
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
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    this.songUser = [];
                    this.currentUser = {};
                    this.idUserCurrent = null;
                });
        },
    },
    computed: {
        headerBackground() {
            return this.header_picture_url
                ? { backgroundImage: `url('${this.header_picture_url}')` }
                : {};
        },
        totalPage() {
            return Math.ceil(this.songUser.length / this.itemPerPage);
        },
        pageData() {
            const start = (this.currentPage - 1) * this.itemPerPage; //stt dau tien cua moi trang
            const end = start + this.itemPerPage //stt ket thuc vi du nhu la o trang 2 la 6->10
            return this.songUser.slice(start, end); //tra ve stt
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
            return this.likeByUser.slice(start, end); //tra ve stt
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
.button-page {
    padding: 10px;
    border: 1px solid;
    margin-right: 4px;
    border-radius: 9999px;
}

.btn-warning {
    position: relative;
    width: auto;
    height: auto;
    font-size: 15px;
    line-height: 1.5;
    color: #000000;
    background-color: #ffffff;
    border: 0;
    transition: 0.2s;
    overflow: hidden;
    cursor: pointer;
}

.btn-warning input[type="file"] {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0%;
    /* transform: scale(3); */
    opacity: 0;
}


.btn-warning2 {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 15px;
    line-height: 1.5;
    color: #000000;
    background-color: #ffffff;
    border: 0;
    transition: 0.2s;
    overflow: hidden;

}

.btn-warning2 input[type="file"] {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0%;
    /* transform: scale(3); */
    opacity: 0;
}

.uploadIcon {
    transform: scale(5);
}
</style>