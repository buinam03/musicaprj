<template>
    <div class="h-16 mx-auto w-full bg-[#222021] fixed z-50 ">
        <div class=" mx-auto h-full flex items-center justify-center xl:w-[1200px] lg:w-[768px]  md:w-[768px] xl:mx-auto lg:mx-auto md:mx-auto"
            :class="{ 'justify-between': playerStore.isLoggedIn === false }">
            <div class=" flex-shrink-0 font-neutra text-4xl text-white"><router-link to="/home">MUSICA</router-link>
            </div>
            <div v-if="playerStore.isLoggedIn === true"
                class="flex-grow flex items-center justify-start p-3 xl:w-[1200px] xl:text-[16px] lg:w-[1024px] lg:text-[14px] md:w-[768px] md:text-[12px] ">
                <div class="flex justify-center items-center" :class="{ 'hidden': playerStore.isLoggedIn === false }">
                    <div class="nav-left  border-white px-5 text-white xl:px-4 lg:px-3 md:px-2"><router-link
                            to="/home">Home</router-link></div>
                    <div class="nav-left  border-white px-5 text-white xl:px-4 lg:px-3 md:px-2"><router-link
                            to="/library">Library</router-link>
                    </div>
                    <div class="px-5 relative xl:px-4 lg:px-3 md:px-2">
                        <input v-model="querryToSearch" @keydown.enter="search"
                            class="no-clear w-80 p-4 h-10 rounded-[4px] cursor-text text-sm xl:w-[400px] lg:w-72 md:w-52 xl:h-10 lg:h-8 md:h-6  "
                            type="search" name="search" id="" placeholder="Search">
                        <div class="absolute inset-y-0 right-0 pr-8 flex items-center ">
                            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="cursor-pointer text-gray-500"
                                @click="search" />
                        </div>
                    </div>
                    <div class="px-5 text-white xl:px-4 lg:px-3 md:px-2"><router-link to="/upload">Upload</router-link>
                    </div>
                    <div class="nav-left  border-white px-5 text-white xl:px-4 lg:px-3 md:px-2"><router-link
                            to="/insights">Insights</router-link>
                    </div>
                    <div class="nav-left  border-white px-5 text-white xl:px-4 lg:px-3 md:px-2"><router-link
                            to="/chart">Chart</router-link>
                    </div>
                    <!-- Notification Button -->
                    <div class="nav-left nav-right  border-white px-5 text-white relative xl:px-4 lg:px-2 md:px-1">
                        <div @click="ToggleDropdown('bell')">
                            <a href="#"><font-awesome-icon icon="fa-solid fa-bell" /></a>
                        </div>
                    </div>

                    <!-- Message Button -->
                    <div @click="getDESCRoom"
                        class=" nav-left nav-right border-white px-5 text-white relative xl:px-4 lg:px-2 md:px-1">
                        <div>
                            <font-awesome-icon icon="fa-solid fa-message" />
                        </div>
                    </div>
                    <!-- Shared Dropdown -->
                    <div v-if="isDropdownOpen" ref="dropdown"
                        class="absolute mt-4 h-96 w-noti bg-gray-200 shadow-lg z-50 overflow-y-auto xl:w-[450px] lg:w-[350px]  md:w-[250px] overflow-x-hidden">
                        <template v-if="dropdownContent === 'bell'">
                            <div class="h-12 sticky top-0 border-gray-300 border-b-2 bg-gray-200 z-50">
                                <p class="px-4 py-2 text-black  float-left z-50">Notifications</p>
                            </div>
                            <div>
                                <ul v-for="(item, index) in notifications" :key="index"
                                    class="xl:text-[16px] lg:text-[14px]  md:text-[12px]">
                                    <li
                                        class="border-gray-300 border-b-2 xl:text-[16px] lg:text-[14px]  md:text-[12px]">
                                        <a href="#" class="block py-2 text-black m-auto">
                                            <div class="m-auto h-16 w-full flex flex-row justify-center items-center ">
                                                <img class="ml-3 border-2 border-black border-solid h-12 w-12 rounded-full aspect-square "
                                                    :src="item.User.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                                    alt="" srcset="">
                                                <div class="">
                                                    <div
                                                        class="line-clamp-3 w-full ml-5 pr-3 text-sm text-left flex-grow">
                                                        <span>{{ item.title + ' ' + item.message }}</span>
                                                    </div>
                                                    <div
                                                        class="line-clamp-3 w-full ml-5 text-[12px] text-gray-400 text-left flex-grow">
                                                        <span>{{ formatTime(item.created_at) }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>

                                </ul>
                            </div>
                        </template>
                        <!-- <template v-if="dropdownContent === 'message'">
                            <div class="h-12 sticky w-noti top-0 border-gray-300 border-b-2 bg-gray-200 z-50">
                                <p class="px-4 py-2 text-black  float-left z-50">Messages</p>
                            </div>
                            <div>
                                <ul>
                                    <li class="border-gray-300 border-b-2"><a href="#"
                                            class="block py-2 text-black m-auto">
                                            <div class="m-auto h-16 w-full flex flex-row justify-center items-center ">
                                                <img class="ml-3 border-2 border-black border-solid h-12 w-12 rounded-full  "
                                                    src="@/image/logo/logo.png" alt="" srcset="">
                                                <div class="line-clamp-3 w-full ml-5 text-sm text-left flex-grow">Lorem
                                                    ipsum dolor, sit amet consectetur adipisicing
                                                    elit. Eius, nulla nobis? Reprehenderit quibusdam quos corporis aut
                                                    numquam architecto esse, quidem ad maxime assumenda tempore, odit
                                                    deserunt similique alias atque odio.</div>

                                            </div>
                                        </a></li>
                                </ul>
                            </div>
                        </template> -->
                    </div>

                    <div class=" border-white px-5 text-white relative cursor-pointer xl:px-4 lg:px-2 md:px-1">
                        <template v-if="playerStore.isLoggedIn === true">
                            <div @click="ToggleLogoDropdown()" class="logo flex items-center">
                                <div>
                                    <img class="w-8 h-8 max-w-8 opacity-100 rounded-full border-[2px] border-white"
                                        :src="profilePicture" alt="User Profile Picture" />
                                </div>

                                <span class="ml-3">
                                    <font-awesome-icon icon="fa-solid fa-chevron-down" />
                                </span>
                            </div>
                            <div v-if="isLogoDropdownOpen"
                                class="absolute left-0 mt-4 w-40 bg-gray-200 xl:w-40 lg:w-28 md:w-24">
                                <ul>
                                    <li class="border-gray-300 border-b-2"><router-link
                                            class="block px-4 py-2 text-black"
                                            :to="`/profile/${idUserCurrent}`">Profile</router-link></li>
                                    <li class="border-gray-300 border-b-2"><router-link
                                            class="block px-4 py-2 text-black" to="/tracks">Tracks</router-link></li>
                                    <li class="border-gray-300 border-b-2"><router-link
                                            class="block px-4 py-2 text-black" to="/likes">Likes</router-link></li>
                                    <li class="border-gray-300 border-b-2"><router-link
                                            class="block px-4 py-2 text-black" :to="`/following/${playerStore.idUserLogin}`">Following</router-link>
                                    </li>
                                    <li class="border-gray-300 border-b-2"><router-link
                                            class="block px-4 py-2 text-black" :to="`/followers/${playerStore.idUserLogin}`">Followers</router-link>
                                    </li>
                                    <li @click="signOutClick" class="border-gray-300 border-b-2"><router-link
                                            class="block px-4 py-2 text-black" to="/discover">Sign Out</router-link>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <template v-if="playerStore.isLoggedIn === false">
                <div class="flex gap-4 h-full justify-center items-center">
                    <div @click="isSignInTemplate" class="h-1/2 text-white px-3 py-1 border border-white rounded text-[12px] flex
                                justify-center items-center whitespace-nowrap cursor-pointer">Sign
                        In</div>
                    <div @click="isCreateTemplate"
                        class="text-white px-3 py-1 bg-orange-500 rounded text-[12px] whitespace-nowrap cursor-pointer">
                        Create Account</div>
                </div>
            </template>
        </div>
    </div>
    <div v-if="this.currentAction === 0"
        class="fixed inset-0 flex justify-center items-center bg-white bg-opacity-60 w-full  h-auto m-auto z-40">
        <div class="w-[1000px] h-[550px] bg-white border-[1px] border-gray-400 ">
            <div class="w-full h-full grid grid-cols-2 bg-gradient">
                <div class=" p-4">
                    <div class="text-center  text-[40px] font-semibold">
                        Sign In
                    </div>
                    <div class="w-full h-16 mt-10">
                        <input v-model="form.email"
                            class="w-full h-full border-gray-400 border-[1px] p-4 outline-none rounded focus:outline-none focus:ring focus:ring-gray-300"
                            placeholder="Your Email" type="text" name="" id="">
                    </div>
                    <div class="w-full h-16 mt-10 relative">
                        <input v-model="form.password"
                            class="w-full h-full border-gray-400 border-[1px] p-4 outline-none rounded focus:outline-none focus:ring focus:ring-gray-300"
                            placeholder="Password" type="password" name="" id="password">
                        <img v-if="isShowPass === false" @click="showPassword"
                            class="opacity-50 h-4 w-6 object-fill absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            src="@/image/other/eye-close.png" alt="">
                        <img v-else @click="showPassword"
                            class="h-4 w-6 opacity-50 object-fill absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            src="@/image/other/eye-open.png" alt="">
                    </div>
                    <div class="w-full h-auto mt-5">
                        <div class="text-right  cursor-pointer hover:underline">
                            Forgot Password?
                        </div>
                    </div>
                    <div class="w-full h-16 mt-5">
                        <div @click="signInClick"
                            class="w-full h-full border-gray-400 border-[1px] cursor-pointer bg-white rounded text-orange-500 flex justify-center items-center font-semibold text-[20px]">
                            Log In
                            <font-awesome-icon icon="fa-solid fa-arrow-right" class="pl-2" />
                        </div>
                    </div>
                    <span>{{ message }}</span>
                    <div class="w-full mt-12 h-auto">
                        <div class="text-center text-gray-600 cursor-pointer">
                            Don't have an account ? <span @click="isCreateAccount"
                                class="text-gray-600  underline">Create
                                Account</span>
                        </div>
                    </div>
                </div>
                <div class="w-full h-full flex flex-col justify-center items-center p-4 relative">
                    <div @click="cancelTemplate"
                        class="h-auto aspect-square absolute top-0 right-0 p-4 cursor-pointer  ">
                        <font-awesome-icon icon="fa-solid fa-xmark" size="xl" />
                    </div>
                    <div class="text-center text-[40px] font-semibold">
                        Sign in with
                    </div>
                    <div
                        class="h-16 hover:bg-gray-100 rounded border-[1px] px-8 flex justify-center items-center cursor-pointer m-auto">

                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4" />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853" />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05" />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335" />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span class="pl-2">Google</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="this.currentAction === 1"
        class="fixed inset-0 flex justify-center items-center bg-white bg-opacity-60 w-full  h-auto m-auto z-40">
        <div class="w-[1000px] h-[550px] bg-white border-[1px] border-gray-400 ">
            <div class="w-full h-full grid grid-cols-2 bg-gradient">
                <div class=" p-4">
                    <div class="text-center text-gray-600  text-[40px] font-semibold">
                        Create Account
                    </div>
                    <div class="w-full h-10 mt-5">
                        <input v-model="form.username"
                            class="w-full h-full border-[1px] border-gray-500 p-4 outline-none rounded focus:outline-none focus:ring focus:ring-gray-300"
                            placeholder="Username" type="text" name="" id="">
                    </div>
                    <div class="w-full h-10 mt-5">
                        <input v-model="form.email"
                            class="w-full h-full p-4 border-[1px] border-gray-500 outline-none rounded focus:outline-none focus:ring focus:ring-gray-300"
                            placeholder="Your Email" type="text" name="" id="">
                    </div>
                    <div class="w-full h-10 mt-5 relative">
                        <input v-model="form.password"
                            class="w-full h-full border-[1px] border-gray-500 p-4 outline-none rounded focus:outline-none focus:ring focus:ring-gray-300"
                            placeholder="Password" type="password" name="" id="password">
                        <img v-if="isShowPass === false" @click="showPassword"
                            class="opacity-50 h-4 w-6 object-fill absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            src="@/image/other/eye-close.png" alt="">
                        <img v-else @click="showPassword"
                            class="h-4 w-6 opacity-50 object-fill absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            src="@/image/other/eye-open.png" alt="">
                    </div>
                    <div class="w-full h-10 mt-5 relative">
                        <input
                            class="w-full h-full border-[1px] border-gray-500 p-4 outline-none rounded focus:outline-none focus:ring focus:ring-gray-300"
                            placeholder="Re-enter Password" type="password" name="" id="re-en-password">
                    </div>
                    <div class="w-full h-16 mt-10">
                        <div @click="createAccountClick"
                            class="w-full h-full border-[1px] border-gray-500 cursor-pointer bg-white rounded text-orange-500 flex justify-center items-center font-semibold text-[20px]">
                            Create Account
                            <font-awesome-icon icon="fa-solid fa-arrow-right" class="pl-2" />
                        </div>
                    </div>
                    <div class="w-full mt-12 h-auto">
                        <div class="text-center text-gray-600 cursor-pointer">
                            Already an account ? <span @click="isAlreadyAccount" class="text-gray-600 underline">Sign
                                In</span>
                        </div>
                    </div>
                </div>
                <div class="w-full h-full flex flex-col justify-center items-center p-4 relative">
                    <div @click="cancelTemplate"
                        class="h-auto aspect-square absolute top-0 right-0 p-4 cursor-pointer  ">
                        <font-awesome-icon icon="fa-solid fa-xmark" size="xl" />
                    </div>
                    <div class="text-center text-[40px] font-semibold">
                        Sign in with
                    </div>
                    <div
                        class="h-16 hover:bg-gray-100 rounded border-[1px] px-8 flex justify-center items-center cursor-pointer m-auto">

                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4" />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853" />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05" />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335" />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span class="pl-2">Google</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import { usePlayerStore } from '@/js/state';
import { formatDistanceToNow } from 'date-fns'
export default {
    name: 'HeaderPage',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        }
    },
    data() {
        return {
            message: "",
            apiUrl: process.env.VUE_APP_API_BASE_URL,
            imgPath: "",
            idUserCurrent: null,
            user: null,
            notifications: null,
            form: {
                username: "",
                email: "",
                password: "",
            },
            isRegisted: false,
            isDropdownOpen: false,
            isLogoDropdownOpen: false,
            dropdownContent: null,
            isLoggedIn: false,
            isSignInTem: false,
            isShowPass: false,
            currentAction: null,
            querryToSearch: '',
            descMessage: null,
        }
    },
    mounted() {
        this.getAllInfoUser();
        this.getNotifications();

    },
    computed: {
        profilePicture() {
            // const baseUrl = process.env.VUE_APP_API_BASE_URL || ''; // Fallback nếu base URL chưa được thiết lập
            const profilePicture = this.user?.data?.profile_picture; // Truy cập chính xác vào profile_picture

            if (profilePicture) {
                return `${profilePicture}`; // Kết hợp base URL với profile_picture
            }

            return '/images/profile/Unknown_person.jpg'; // Đường dẫn ảnh mặc định
        },

    },
    methods: {
        async getDESCRoom() {
            try {
                const res = await apiClient.get("/message/getASCRoom");
                this.descMessage = res.data.data;
                const newId = this.descMessage.room_id;
                // Chỉ navigate nếu khác route hiện tại
                if (this.$route.params.id !== newId) {
                    this.$router.push({ name: 'MessagePage', params: { id: newId } });
                }
            } catch (err) {
                console.error(err);
            }
        },
        async getAllInfoUser() {
            try {
                const res = await apiClient.get("/users/getCurrentUser");
                this.user = res.data;

                this.idUserCurrent = this.user.data.id || null;

            } catch (error) {
                console.log("Error :", error);
            }
        },
        async getNotifications() {  
            try {
                const res = await apiClient.get("http://localhost:3000/api/notification/getAllNotification");
                this.notifications = res.data.data;
                console.log(this.notifications);
            } catch (error) {
                console.log("Error :", error);
            }
        },
        formatTime(timestamp) {
            return formatDistanceToNow(new Date(timestamp), {
                addSuffix: true,
            })
        },
        ToggleDropdown(type) {
            if (this.dropdownContent === type) {
                this.dropdownContent = null;
                this.isDropdownOpen = false;
            }
            else {
                this.isDropdownOpen = true;
                this.isLogoDropdownOpen = false;
                this.dropdownContent = type;

                this.$nextTick(() => this.positionDropdown());
            }
        },

        positionDropdown() {
            const dropdown = this.$refs.dropdown;

            const bellTarget = document.querySelector('.nav-right .fa-bell'); // Bell Icon
            const messageTarget = document.querySelector('.nav-right .fa-message'); // Message Icon

            let target = messageTarget; // Default to bell icon if dropdown is for bell
            if (this.dropdownContent === 'message') {
                target = messageTarget; // Switch to message icon if dropdown is for messages
            }
            else {
                target = bellTarget;
            }

            if (dropdown && target) {
                const rect = target.getBoundingClientRect();
                dropdown.style.top = `${rect.bottom + window.scrollY + 9}px`;
                dropdown.style.left = `${rect.left + rect.width / 2 - dropdown.offsetWidth / 2}px`;
            }
        },
        ToggleLogoDropdown() {
            this.isLogoDropdownOpen = !this.isLogoDropdownOpen;
            this.isDropdownOpen = false;
        },
        search() {
            if (this.querryToSearch.trim()) {
                this.$router.push({ path: '/search', query: { q: this.querryToSearch } });
            }

        },
        isSignInTemplate() {
            this.currentAction = 0;
            document.body.style.overflow = this.isEditProfile ? "hidden" : "";
        },
        isCreateTemplate() {
            this.currentAction = 1;
            document.body.style.overflow = this.isEditProfile ? "hidden" : "";
        },
        isCreateAccount() {
            this.currentAction = 1;
            document.body.style.overflow = this.isEditProfile ? "hidden" : "";
        },
        isAlreadyAccount() {
            this.currentAction = 0;
            document.body.style.overflow = this.isEditProfile ? "hidden" : "";
        },
        showPassword() {
            const password = document.getElementById('password');
            const reenterpassword = document.getElementById('re-en-password');
            if (password.type === 'password' && this.currentAction == 0) {
                password.type = 'text';
                this.isShowPass = true;
            }
            else if (password.type === 'password' && this.currentAction == 1 && reenterpassword.type === 'password') {
                password.type = 'text';
                reenterpassword.type = 'text'
                this.isShowPass = true;
            }
            else if (password.type === 'text' && this.currentAction == 1 && reenterpassword.type === 'text') {
                password.type = 'password';
                reenterpassword.type = 'password'
                this.isShowPass = false;
            }
            else if (password.type === 'text' && this.currentAction == 0) {
                password.type = 'password'
                this.isShowPass = false;
            }
        },
        async signInClick() {
            try {
                // const res = await axios.post("http://localhost:3000/api/users/login", this.form);
                const res = await apiClient.post('/users/login', this.form);
                const accessToken = res.data.accessToken;
                const refreshToken = res.data.refreshToken;

                

                const userData = res.data.userId; // Assuming the API returns user data

                this.playerStore.idUserLogin = userData;

                console.log('playerStore',this.playerStore.idUserLogin);

                //luu access & refreshtoken
                localStorage.setItem('jwt', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                

                this.$router.push({ path: '/home' });
                this.playerStore.isLoggedIn = true;
            } catch (error) {
                if (error.response.status === 404) {
                    this.message = "User not found";
                }
                if (error.response.status === 400) {
                    this.message = "Wrong password";
                }
                console.error("Error :", error);
            }

        },
        signOutClick() {
            this.playerStore.isLoggedIn = false
        },
        async createAccountClick() {
            console.log(this.form);
            try {
                const res = await apiClient.post('/users/register', this.form);

                console.log("Đăng ký thành công:", res.data);
                window.alert("Register Success!");
                this.isRegisted = true;
                window.location.reload();
            } catch (error) {
                console.error("Error :", error);
            }
        },
        cancelTemplate() {
            this.currentAction = null;
            document.body.style.overflow = "";
        },
    }
}
</script>

<style>
.nav-left {
    border-left: 1px solid #ffffff;
}



.nav-right {
    border-right: 0px solid #ffffff;
}

nav .nav-right .absolute {
    width: auto;
}

nav .nav-left .absolute {
    width: auto;
}

input.no-clear::-webkit-search-cancel-button {
    display: none;
}
</style>