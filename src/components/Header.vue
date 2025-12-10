<template>
    <div class="h-14 sm:h-16 mx-auto w-full bg-[#222021] fixed z-50 shadow-lg">
        <div class="mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl"
            :class="{ 'justify-between': playerStore.isLoggedIn === false }">
            <!-- Logo -->
            <div class="flex-shrink-0 font-neutra text-2xl sm:text-3xl lg:text-4xl text-white">
                <router-link to="/home" class="hover:opacity-80 transition-opacity">MUSICA</router-link>
            </div>
            
            <!-- Mobile Menu Button -->
            <button v-if="playerStore.isLoggedIn === true" @click="toggleMobileMenu"
                class="lg:hidden text-white p-2 hover:bg-white/10 rounded-md transition-colors">
                <font-awesome-icon :icon="isMobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" size="lg" />
            </button>

            <!-- Desktop Navigation -->
            <div v-if="playerStore.isLoggedIn === true"
                class="hidden lg:flex flex-grow items-center justify-start gap-2 xl:gap-4 ml-6 xl:text-[16px] lg:text-[14px]">
                <div class="flex justify-center items-center w-full max-w-5xl">
                    <div class="nav-left border-l border-white/30 px-3 xl:px-4 text-white hover:text-orange-400 transition-colors">
                        <router-link to="/home" class="text-sm xl:text-base">Home</router-link>
                    </div>
                    <div class="nav-left border-l border-white/30 px-3 xl:px-4 text-white hover:text-orange-400 transition-colors">
                        <router-link to="/library" class="text-sm xl:text-base">Library</router-link>
                    </div>
                    <div class="px-2 xl:px-4 relative flex-1 max-w-md">
                        <input v-model="querryToSearch" @keydown.enter="search"
                            class="no-clear w-full px-4 pr-10 h-8 xl:h-10 rounded-md cursor-text text-sm bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-all"
                            type="search" name="search" id="search-input" placeholder="Search...">
                        <button @click="search" type="button"
                            class="absolute right-2 xl:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors cursor-pointer focus:outline-none p-1">
                            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-sm" />
                        </button>
                    </div>
                    <div class="px-3 xl:px-4 text-white hover:text-orange-400 transition-colors">
                        <router-link to="/upload" class="text-sm xl:text-base">Upload</router-link>
                    </div>
                    <div class="nav-left border-l border-white/30 px-3 xl:px-4 text-white hover:text-orange-400 transition-colors">
                        <router-link to="/chart" class="text-sm xl:text-base">Chart</router-link>
                    </div>
                    <div class="nav-left nav-right border-l border-white/30 px-3 xl:px-2 text-white relative hover:text-orange-400 transition-colors">
                        <button @click="ToggleDropdown('bell')" class="focus:outline-none">
                            <font-awesome-icon icon="fa-solid fa-bell" class="text-lg" />
                        </button>
                    </div>

                    <!-- Message Button -->
                    <div @click="getDESCRoom"
                        class="nav-left nav-right border-l border-white/30 px-3 xl:px-2 text-white relative cursor-pointer hover:text-orange-400 transition-colors">
                        <router-link to="/message" class="block">
                            <font-awesome-icon icon="fa-solid fa-message" class="text-lg" />
                        </router-link>
                    </div>
                    <!-- Shared Dropdown -->
                    <div v-if="isDropdownOpen" ref="dropdown"
                        class="fixed lg:absolute mt-2 lg:mt-4 h-80 lg:h-96 w-[calc(100vw-2rem)] sm:w-96 lg:w-[450px] bg-white lg:bg-gray-50 shadow-xl lg:shadow-lg z-50 overflow-y-auto rounded-lg border border-gray-200 right-4 lg:right-auto overflow-x-hidden">
                        <template v-if="dropdownContent === 'bell'">
                            <div class="h-12 sticky top-0 border-b border-gray-300 bg-gray-50 z-50 rounded-t-lg">
                                <p class="px-4 py-3 text-gray-800 font-semibold">Notifications</p>
                            </div>
                            <div>
                                <ul v-if="notifications && notifications.length > 0">
                                    <li v-for="(item, index) in notifications" :key="index"
                                        class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <a href="#" class="block py-3 px-4">
                                            <div class="flex items-start gap-3">
                                                <img class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 object-cover"
                                                    :src="item.User.profile_picture || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                                    alt="Profile">
                                                <div class="flex-1 min-w-0">
                                                    <div class="text-sm sm:text-base text-gray-800 line-clamp-2">
                                                        {{ item.title + ' ' + item.message }}
                                                    </div>
                                                    <div class="text-xs sm:text-sm text-gray-500 mt-1">
                                                        {{ formatTime(item.created_at) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                                <div v-else class="px-4 py-8 text-center text-gray-500">
                                    No notifications
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Profile Dropdown -->
                    <div class="border-l border-white/30 px-3 xl:px-2 text-white relative">
                        <template v-if="playerStore.isLoggedIn === true">
                            <button @click="ToggleLogoDropdown()" class="logo flex items-center hover:text-orange-400 transition-colors focus:outline-none">
                                <div>
                                    <img class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                                        :src="profilePicture" alt="User Profile Picture" />
                                </div>
                                <span class="ml-2 hidden xl:inline-block">
                                    <font-awesome-icon icon="fa-solid fa-chevron-down" class="text-xs" />
                                </span>
                            </button>
                            <div v-if="isLogoDropdownOpen"
                                class="fixed lg:absolute left-4 lg:left-0 mt-2 lg:mt-4 w-48 lg:w-40 xl:w-48 bg-[#222021] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                <ul class="mb-0">
                                    <li class="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                        <router-link
                                            class="px-4 py-2.5 text-white hover:text-orange-400 transition-colors flex items-center text-sm"
                                            :to="`/profile/${idUserCurrent}`" @click="isLogoDropdownOpen = false">
                                            <font-awesome-icon icon="fa-regular fa-address-card" class="mr-2 w-4" />
                                            Profile
                                        </router-link>
                                    </li>
                                    <li class="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                        <router-link
                                            class="px-4 py-2.5 text-white hover:text-orange-400 transition-colors flex items-center text-sm"
                                            to="/tracks" @click="isLogoDropdownOpen = false">
                                            <font-awesome-icon icon="fa-solid fa-compact-disc" class="mr-2 w-4" />
                                            Tracks
                                        </router-link>
                                    </li>
                                    <li class="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                        <router-link
                                            class="px-4 py-2.5 text-white hover:text-orange-400 transition-colors flex items-center text-sm"
                                            :to="`/likes`" @click="isLogoDropdownOpen = false">
                                            <font-awesome-icon icon="fa-solid fa-heart" class="mr-2 w-4" />
                                            Likes
                                        </router-link>
                                    </li>
                                    <li class="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                        <router-link
                                            class="px-4 py-2.5 text-white hover:text-orange-400 transition-colors flex items-center text-sm"
                                            :to="`/following/${getCurrentUserId()}`" @click="isLogoDropdownOpen = false">
                                            <font-awesome-icon icon="fa-solid fa-user-check" class="mr-2 w-4" />
                                            Following
                                        </router-link>
                                    </li>
                                    <li class="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                        <router-link
                                            class="px-4 py-2.5 text-white hover:text-orange-400 transition-colors flex items-center text-sm"
                                            :to="`/followers/${getCurrentUserId()}`" @click="isLogoDropdownOpen = false">
                                            <font-awesome-icon icon="fa-solid fa-user-plus" class="mr-2 w-4" />
                                            Followers
                                        </router-link>
                                    </li>
                                    <li class="hover:bg-gray-800 transition-colors">
                                        <router-link
                                            class="px-4 py-2.5 text-white hover:text-orange-400 transition-colors flex items-center text-sm"
                                            to="/discover" @click="signOutClick">
                                            <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" class="mr-2 w-4" />
                                            Sign Out
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu Backdrop -->
            <div v-if="playerStore.isLoggedIn === true && isMobileMenuOpen"
                class="lg:hidden fixed inset-0 bg-black/50 z-[55] cursor-pointer"
                @click="toggleMobileMenu"></div>
            
            <!-- Mobile Menu -->
            <transition name="slide">
                <div v-if="playerStore.isLoggedIn === true && isMobileMenuOpen"
                    class="lg:hidden fixed inset-x-0 top-14 sm:top-16 bg-[#222021] border-b border-gray-700 shadow-xl z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto">
                <div class="px-4 py-4 space-y-4">
                    <!-- Mobile Search -->
                    <div class="relative">
                        <input v-model="querryToSearch" @keydown.enter="handleMobileSearch"
                            class="no-clear w-full px-4 pr-10 h-10 rounded-md text-sm bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-all"
                            type="search" placeholder="Search...">
                        <button @click="handleMobileSearch" type="button"
                            class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors cursor-pointer focus:outline-none p-1">
                            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-sm" />
                        </button>
                    </div>
                    
                    <!-- Mobile Navigation Links -->
                    <div class="space-y-1">
                        <router-link to="/home" @click="isMobileMenuOpen = false"
                            class="block px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Home
                        </router-link>
                        <router-link to="/library" @click="isMobileMenuOpen = false"
                            class="block px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Library
                        </router-link>
                        <router-link to="/upload" @click="isMobileMenuOpen = false"
                            class="block px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Upload
                        </router-link>
                        <router-link to="/chart" @click="isMobileMenuOpen = false"
                            class="block px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Chart
                        </router-link>
                        <button @click="ToggleDropdown('bell'); isMobileMenuOpen = false"
                            class="w-full text-left px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Notifications
                        </button>
                        <router-link to="/message" @click="getDESCRoom; isMobileMenuOpen = false"
                            class="block px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Messages
                        </router-link>
                        <router-link :to="`/profile/${idUserCurrent}`" @click="isMobileMenuOpen = false"
                            class="block px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Profile
                        </router-link>
                        <router-link to="/tracks" @click="isMobileMenuOpen = false"
                            class="block px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Tracks
                        </router-link>
                        <router-link to="/likes" @click="isMobileMenuOpen = false"
                            class="block px-4 py-3 text-white hover:bg-white/10 hover:text-orange-400 rounded-md transition-colors">
                            Likes
                        </router-link>
                    </div>
                </div>
                </div>
            </transition>
            <template v-if="playerStore.isLoggedIn === false">
                <div class="flex gap-2 sm:gap-4 h-full justify-center items-center">
                    <button @click="isSignInTemplate" 
                        class="text-white px-3 sm:px-4 py-1.5 sm:py-2 border border-white rounded-md text-xs sm:text-sm flex justify-center items-center whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">
                        Sign In
                    </button>
                    <button @click="isCreateTemplate"
                        class="text-white px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 hover:bg-orange-600 rounded-md text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors">
                        Create Account
                    </button>
                </div>
            </template>
        </div>
    </div>
    <!-- Sign In Modal -->
    <div v-if="this.currentAction === 0"
        class="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm w-full h-full m-auto z-40 p-4"
        @click.self="closeModal">
        <div class="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button @click="closeModal" 
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
                <font-awesome-icon icon="fa-solid fa-times" class="text-xl" />
            </button>
            <div class="p-6 sm:p-8">
                <div class="text-center text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">
                    Sign In
                </div>
                <div class="space-y-4 sm:space-y-6">
                    <div>
                        <input v-model="form.email"
                            class="w-full h-12 sm:h-14 border-gray-400 border px-4 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Your Email" type="email" name="email" id="signin-email">
                    </div>
                    <div class="relative">
                        <input v-model="form.password"
                            class="w-full h-12 sm:h-14 border-gray-400 border px-4 pr-12 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Password" type="password" name="password" id="password">
                        <button @click="showPassword" type="button"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                            <img v-if="isShowPass === false" class="h-5 w-5 opacity-70"
                                src="@/image/other/eye-close.png" alt="Show password">
                            <img v-else class="h-5 w-5 opacity-70"
                                src="@/image/other/eye-open.png" alt="Hide password">
                        </button>
                    </div>
                    <div class="text-right">
                        <a href="#" class="text-sm text-gray-600 hover:text-orange-500 hover:underline transition-colors">
                            Forgot Password?
                        </a>
                    </div>
                    <div>
                        <button @click="signInClick"
                            class="w-full h-12 sm:h-14 border-2 border-orange-500 cursor-pointer bg-orange-500 hover:bg-orange-600 rounded-lg text-white flex justify-center items-center font-semibold text-lg sm:text-xl transition-colors">
                            <span>Log In</span>
                            <font-awesome-icon icon="fa-solid fa-arrow-right" class="ml-2" />
                        </button>
                    </div>
                    <div v-if="message" class="text-center text-red-500 text-sm">
                        {{ message }}
                    </div>
                    <div class="text-center text-gray-600 text-sm sm:text-base pt-2">
                        Don't have an account? <button @click="isCreateAccount"
                            class="text-orange-500 hover:text-orange-600 underline font-semibold transition-colors">Create Account</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Create Account Modal -->
    <div v-if="this.currentAction === 1"
        class="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm w-full h-full m-auto z-40 p-4"
        @click.self="closeModal">
        <div class="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button @click="closeModal" 
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
                <font-awesome-icon icon="fa-solid fa-times" class="text-xl" />
            </button>
            <div class="p-6 sm:p-8">
                <div class="text-center text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">
                    Create Account
                </div>
                <div class="space-y-4 sm:space-y-5">
                    <div>
                        <input v-model="form.username"
                            class="w-full h-12 sm:h-14 border-gray-500 border px-4 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Username" type="text" name="username" id="create-username">
                    </div>
                    <div>
                        <input v-model="form.email"
                            class="w-full h-12 sm:h-14 border-gray-500 border px-4 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Your Email" type="email" name="email" id="create-email">
                    </div>
                    <div class="relative">
                        <input v-model="form.password"
                            class="w-full h-12 sm:h-14 border-gray-500 border px-4 pr-12 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Password" type="password" name="password" id="create-password">
                        <button @click="showPassword" type="button"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                            <img v-if="isShowPass === false" class="h-5 w-5 opacity-70"
                                src="@/image/other/eye-close.png" alt="Show password">
                            <img v-else class="h-5 w-5 opacity-70"
                                src="@/image/other/eye-open.png" alt="Hide password">
                        </button>
                    </div>
                    <div class="relative">
                        <input v-model="reEnterPassword"
                            class="w-full h-12 sm:h-14 border-gray-500 border px-4 pr-12 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Re-enter Password" type="password" name="re-password" id="re-en-password">
                        <button @click="showPassword" type="button"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                            <img v-if="isShowPass === false" class="h-5 w-5 opacity-70"
                                src="@/image/other/eye-close.png" alt="Show password">
                            <img v-else class="h-5 w-5 opacity-70"
                                src="@/image/other/eye-open.png" alt="Hide password">
                        </button>
                    </div>
                    <div>
                        <button @click="createAccountClick"
                            class="w-full h-12 sm:h-14 border-2 border-orange-500 cursor-pointer bg-orange-500 hover:bg-orange-600 rounded-lg text-white flex justify-center items-center font-semibold text-lg sm:text-xl transition-colors">
                            <span>Create Account</span>
                            <font-awesome-icon icon="fa-solid fa-arrow-right" class="ml-2" />
                        </button>
                    </div>
                    <div class="text-center text-gray-600 text-sm sm:text-base pt-2">
                        Already have an account? <button @click="isAlreadyAccount"
                            class="text-orange-500 hover:text-orange-600 underline font-semibold transition-colors">Sign In</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import { usePlayerStore } from '@/js/state';
import { formatDistanceToNow } from 'date-fns';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
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
            reEnterPassword: "",
            isRegisted: false,
            isDropdownOpen: false,
            isLogoDropdownOpen: false,
            isMobileMenuOpen: false,
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
        document.addEventListener('click', this.handleClickOutside);
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
        window.removeEventListener('resize', this.handleResize);
        document.body.style.overflow = '';
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
        getCurrentUserId() {
            return getUserIdFromJWT();
        },
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
                this.isMobileMenuOpen = false;
                this.dropdownContent = type;

                this.$nextTick(() => this.positionDropdown());
            }
        },

        positionDropdown() {
            const dropdown = this.$refs.dropdown;
            if (!dropdown) return;

            const bellTarget = document.querySelector('.nav-right .fa-bell');
            const messageTarget = document.querySelector('.nav-right .fa-message');

            let target = this.dropdownContent === 'message' ? messageTarget : bellTarget;

            if (target) {
                const rect = target.getBoundingClientRect();
                // On mobile, center the dropdown
                if (window.innerWidth < 1024) {
                    dropdown.style.top = `${rect.bottom + window.scrollY + 12}px`;
                    dropdown.style.left = '50%';
                    dropdown.style.transform = 'translateX(-50%)';
                    dropdown.style.right = 'auto';
                } else {
                    dropdown.style.top = `${rect.bottom + window.scrollY + 9}px`;
                    dropdown.style.left = `${rect.left + rect.width / 2 - dropdown.offsetWidth / 2}px`;
                    dropdown.style.transform = 'none';
                }
            }
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            this.isDropdownOpen = false;
            this.isLogoDropdownOpen = false;
            if (this.isMobileMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        },
        ToggleLogoDropdown() {
            this.isLogoDropdownOpen = !this.isLogoDropdownOpen;
            this.isDropdownOpen = false;
            this.isMobileMenuOpen = false;
        },
        search() {
            if (this.querryToSearch.trim()) {
                this.$router.push({ path: '/search', query: { q: this.querryToSearch } });
            }
        },
        handleMobileSearch() {
            if (this.querryToSearch.trim()) {
                this.$router.push({ path: '/search', query: { q: this.querryToSearch } });
                this.isMobileMenuOpen = false;
                document.body.style.overflow = '';
            }
        },
        isSignInTemplate() {
            this.currentAction = 0;
            this.isMobileMenuOpen = false;
            document.body.style.overflow = "hidden";
        },
        isCreateTemplate() {
            this.currentAction = 1;
            this.isMobileMenuOpen = false;
            document.body.style.overflow = "hidden";
        },
        isCreateAccount() {
            this.currentAction = 1;
            document.body.style.overflow = "hidden";
        },
        isAlreadyAccount() {
            this.currentAction = 0;
            document.body.style.overflow = "hidden";
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
                const res = await apiClient.post('/users/login', this.form);
                const accessToken = res.data.accessToken;
                const refreshToken = res.data.refreshToken;

                // Lưu access & refresh token trước
                localStorage.setItem('jwt', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                // Decode JWT token để lấy userId
                const userId = getUserIdFromJWT();

                this.playerStore.idUserLogin = userId;

                console.log('Decoded userId from JWT:', userId);
                console.log('playerStore', this.playerStore.idUserLogin);

                this.$router.push({ path: '/home' });
                this.playerStore.isLoggedIn = true;
            } catch (error) {
                if (error.response?.status === 404) {
                    this.message = "User not found";
                }
                if (error.response?.status === 400) {
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
        closeModal() {
            this.currentAction = null;
            document.body.style.overflow = "";
        },
        handleClickOutside(event) {
            // Close mobile menu if clicked outside
            if (this.isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('button[aria-label]')) {
                const menuButton = event.target.closest('button');
                if (!menuButton || !menuButton.querySelector('.fa-bars') && !menuButton.querySelector('.fa-times')) {
                    this.isMobileMenuOpen = false;
                    document.body.style.overflow = '';
                }
            }
            
            // Close dropdowns if clicked outside
            if (this.isDropdownOpen && this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
                const bellButton = event.target.closest('button');
                if (!bellButton || !bellButton.querySelector('.fa-bell')) {
                    this.isDropdownOpen = false;
                    this.dropdownContent = null;
                }
            }
            
            // Close logo dropdown if clicked outside
            if (this.isLogoDropdownOpen && !event.target.closest('.logo') && !event.target.closest('button.logo')) {
                this.isLogoDropdownOpen = false;
            }
        },
        handleResize() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
                this.isMobileMenuOpen = false;
                document.body.style.overflow = '';
            }
            // Reposition dropdown on resize
            if (this.isDropdownOpen) {
                this.$nextTick(() => this.positionDropdown());
            }
        },
    }
}
</script>

<style scoped>
.nav-left {
    border-left: 1px solid rgba(255, 255, 255, 0.3);
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

/* Smooth transitions */
button, a, input {
    transition: all 0.2s ease;
}

/* Improve focus states */
button:focus-visible,
a:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

/* Mobile menu backdrop */
@media (max-width: 1023px) {
    .mobile-menu-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 35;
    }
}

/* Smooth scroll for dropdowns */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
}

/* Mobile menu transitions */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease-out;
}

.slide-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>