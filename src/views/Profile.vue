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
                        <button @click="ProfilePictureOpenDialog" type="button"
                            class="h-10 w-10  text-black absolute bottom-2 right-9 flex justify-center items-center rounded-full bg-white hover:bg-gray-300 cursor-pointer">
                            <!-- Icon máy ảnh -->
                            <font-awesome-icon icon="fa-solid fa-camera" />
                            <!-- Input file ẩn -->

                        </button>

                    </div>
                    <div v-if="isOpenDialogProfile"
                        class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div class="bg-white rounded-lg shadow-xl w-1/3 h-1/2 p-4">
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
                        <button @click="HeaderPictureOpenDialog" class="btn-warning" type="button">
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
                <div
                    class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
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
                <div
                    class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    All Tracks by Đen Vâu
                </div>
                <div v-if="songUser.length > 0" class="h-[400px] w-full">
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
                                        <div v-for="(artist, index) in item.User" :key="artist.id"
                                            class="hover:underline hover:text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap flex justify-center items-center text-sm">
                                            <a href="#">{{ index < (item.artist?.length || 0) - 1 ? artist.username
                                                + ',' : artist.username }}</a>
                                        </div>
                                    </div>
                                    <div class="text-gray-500 text-sm mt-1">
                                        <font-awesome-icon icon="fa-solid fa-play" class="pr-1" />
                                        {{ parseFloat(item.SongDetail.plays / 1000).toFixed(1) }} k
                                    </div>
                                </div>
                            </div>
                            <div class="w-1/2 h-full flex justify-end items-center">
                                <div v-if="item.is_public === 0"
                                    class="mr-5 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center text-blue-500 border-blue-500 cursor-pointer">
                                    <font-awesome-icon icon="fa-solid fa-lock" />
                                </div>
                                <div @click="togglePlay(index, item)"
                                    class="mr-2 w-10 h-10 p-2 border-[1px] rounded-full flex justify-center items-center border-black hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                                    <font-awesome-icon
                                        :icon="state.currentPlayIndex === index && state.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                </div>

                                <div @click="addToPlaylist(index, item)"
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
                </div>
                <div v-else class="h-[400px] w-full flex justify-center items-center">
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
                <div
                    class="w-full h-auto text-left text-[30px] font-semibold mt-4 xl:text-[30px] lg:text-[26px] md:text-[24px]">
                    Likes by Đen Vâu
                </div>
                <div class="h-[400px] w-full">
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
                                            <a href="#">{{ index < item.artist.length - 1 ? artist.name + ',' :
                                                artist.name }}</a>
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
                                <div
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
        <Footer></Footer>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import { playerActions, state } from '@/js/state';
export default {
    name: 'ProfilePage',
    setup() {
        return {
            state,
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
            currentPage2: 1,
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

        }
    },
    methods: {
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
        ProfilePictureOpenDialog() {
            this.isOpenDialogProfile = true;
        },
        HeaderPictureOpenDialog() {
            this.isOpenDialogHeaderProfile = true
        },
        addToPlaylist(index, song) {
            const isAlreadyInPlaylist = state.playlist.some((item) => item.id === song.id);

            if (!isAlreadyInPlaylist) {
                playerActions.addToPlaylist(song);
                console.log("Added to playlist:", state.playlist);
            } else {
                console.log("This song is already in the playlist.");
            }

        },
        togglePlay(index, song) {
            const songUrl = song.path;

            if (state.currentPlayIndex === index && state.isPlaying) {
                state.audio.pause();
                state.isPlaying = false;
            }
            else if (state.currentPlayIndex === index && !state.isPlaying) {
                state.audio.play();
                state.isPlaying = true;
            }
            else {
                if (state.audio) {
                    state.audio.pause();
                }

                state.currentSong = {
                    id: song.id,
                    title: song.title,
                    artwork: song.artwork,
                    username: song.User.username,
                    duration: song.SongDetail.duration,
                    path: songUrl
                }
                // ★ Thêm bắt sự kiện ontimeupdate để đồng bộ currentTime ★


                state.audio = new Audio(songUrl);
                state.audio.play();
                state.currentPlayIndex = index;
                state.isPlaying = true;

                state.audio.ontimeupdate = () => {
                    state.currentTime = state.audio.currentTime;
                };


                state.audio.onended = () => {
                    state.isPlaying = false;
                    state.currentPlayIndex = null;
                };
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
        loadProfile() {
            console.log(this.profileId);
            Promise.all([
                apiClient.get(`/song/getAllSong/${this.profileId}`),
                apiClient.get("/users/getCurrentUser"),
                apiClient.get(`/users/getUserById/${this.profileId}`)
            ])
                .then(([songResponse, userResponse, userByIdRes]) => {

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

                    if (parseInt(this.profileId) !== this.idUserCurrent) {
                        this.isUserCurrent = false;

                    }
                    else {
                        this.isUserCurrent = true;

                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    this.songUser = [];
                    this.currentUser = {};
                    this.idUserCurrent = null;
                });
        }

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
        '$route.params.id': function (newId, oldId) {
            if (newId !== oldId) {
                this.loadProfile();
            }
        }
    },
    mounted() {
        this.profileId = this.$route.params.id;
        this.loadProfile();
        this.fetchProvince();
        this.getFollowerById();
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
</style>