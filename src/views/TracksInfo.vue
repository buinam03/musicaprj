<template>
    <div>
        <Header></Header>
        <div v-if="trackInfo" class="w-container pt-16 mb-16 h-auto m-auto">
            <div class="h-[350px] w-full bg-[#222021] flex">
                <div class="aspect-square h-full p-4 ">
                    <img :src="trackInfo.artwork" class="object-cover w-full h-full" alt="artwork">
                </div>
                <div class="w-full h-full p-4 relative">
                    <div class="flex items-start">
                        <div @click="togglePlay(0, trackInfo)"
                            class="h-16 w-16  rounded-full flex justify-center items-center bg-orange-500 text-white hover:bg-orange-600 relative cursor-pointer">
                            <!-- Nút play được căn giữa -->
                            <font-awesome-icon
                                        :icon="playerStore.currentPlayIndex === 0 && playerStore.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" size="2xl" class="absolute"/>
                        </div>
                        <div class="px-4 text-[32px] w-2/3 text-left text-white ">
                            {{ trackInfo.title }}
                            <div v-if="userById" class="text-white text-[16px] cursor-pointer">
                                {{ userById.username }}
                            </div>
                        </div>
                        <div class="w-[calc(100% - 66.666%  - 64px)] mx-auto">
                            <div class="text-gray-300 text-[20px]">{{ formatDate(trackInfo.created_at) }}</div>
                            <div class="text-white text-[14px] mt-4 rounded-3xl bg-gray-400">
                                {{ formatGenre(trackInfo.SongDetail.genre) }}</div>
                        </div>
                    </div>
                    <div class="absolute h-28 w-full bottom-0 left-0 p-4 flex justify-center items-center">
                        <div class="w-1/12 text-white text-xs">{{ formatDuration(playerStore.currentTime) }}</div>
                        <div class=" flex justify-center items-center w-[80%]">
                            <input :style="progressPercentage" @input="updateProgressPlay($event.target.value)"
                                v-model="playerStore.currentTime" min="0" :max="playerStore.currentSong.duration"
                                step="0.1" type="range" class="playSlider h-1 block mx-auto cursor-pointer w-full">
                        </div>
                        <div class="w-1/12 text-white text-xs">{{ formatDuration(trackInfo.SongDetail.duration) }}</div>
                    </div>
                </div>
            </div>
            <div class="w-full h-auto mt-4 grid grid-cols-[1fr_400px]">
                <div class="w-full h-full">
                    <div class="h-16 w-full   flex justify-center items-center">
                        <div v-if="user" class="h-16 aspect-square">
                            <img class="rounded-full object-cover cursor-pointer aspect-square h-16" :src="profilePicture" alt="artwork">
                        </div>
                        <div class="w-[90%] h-full ml-4 flex justify-center items-center">
                            <div class="rounded-3xl border-[1px] w-full h-3/4 flex justify-center items-center">
                                <input v-model="commentValue" type="text" name="" id="" placeholder="Write your comment"
                                    class="outline-none text-left w-full h-full rounded-3xl p-4">
                            </div>
                        </div>
                        <div class="w-[10%] h-full ml-4  flex justify-center items-center">
                            <div @click="commentSong"
                                class="aspect-square h-3/4 border-[1px] rounded-full flex justify-center items-center text-gray-500 cursor-pointer">
                                <font-awesome-icon icon="fa-regular fa-paper-plane" />
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 w-full h-16 flex justify-between items-center border-b-[1px]">
                        <div class="flex justify-center items-center">
                            <div class="w-auto px-4 py-1 border-[1px] rounded flex justify-center items-center mr-4">
                                <font-awesome-icon icon="fa-solid fa-heart" class="pr-2" />
                                Like
                            </div>
                            <div class="w-auto px-4 py-1 border-[1px] rounded flex justify-center items-center mr-4">
                                <font-awesome-icon icon="fa-solid fa-notes-medical" class="pr-2" />
                                Add to Next up
                            </div>
                        </div>
                        <div class="flex justify-center items-center">
                            <div class="text-gray-500 text-[13px] mr-6">
                                <font-awesome-icon icon="fa-solid fa-play" class="pr-2" />
                                {{ trackInfo.SongDetail.plays }}
                            </div>
                            <div class="text-gray-500 text-[13px] mr-6">
                                <font-awesome-icon icon="fa-solid fa-heart" class="pr-2" />
                                {{ trackInfo.SongDetail.likes }}
                            </div>
                        </div>
                    </div>
                    <div class="w-full h-auto grid grid-cols-[150px_1fr] mt-4">
                        <div class="w-full h-auto">
                            <div class="w-full h-auto aspect-square">
                                <img class="rounded-full w-full h-full object-cover" :src="profilePictureArtist" alt="">
                            </div>
                            <div v-if="userById" class="mt-4">
                                <div class=" flex justify-center items-center ">
                                    <a class="text-[16px]" href="#">{{ userById.username }}</a>
                                    <div v-if="userById.is_verified" class="w-3 h-3 ml-1 ">
                                        <div
                                            class="w-full h-full text-white bg-blue-500  rounded-full flex justify-center items-center text-xs">
                                            <font-awesome-icon icon="fa-solid fa-check" size="xs" />
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <div class="text-gray-500 text-[10px]">
                                        <font-awesome-icon icon="fa-solid fa-user" class="pr-1" />
                                        13.834
                                    </div>
                                </div>
                                <div class=" flex justify-center" :class="{ hidden: userByIdCMT === user_current }">
                                    <button
                                        class="px-4 py-[2px] max-w-20 w-20 bg-white rounded-md border-gray-400 border text-xs flex justify-center items-center text-gray-500  transition duration-200">
                                        <font-awesome-icon icon="fa-solid fa-user-plus" class="pr-1" />
                                        Follow
                                    </button>

                                </div>
                            </div>
                        </div>
                        <div class="w-full h-auto p-4 ">
                            <div class="flex justify-between items-center h-16 w-full border-b-[1px]">
                                <div class="text-gray-400">
                                    <font-awesome-icon icon="fa-solid fa-comments" />
                                    {{ this.cmtSong.length }} Comments
                                </div>
                                <div class="">
                                    <div
                                        class="w-40 h-full border-[1px] p-2 border-orange-500 text-orange-500 cursor-pointer">
                                        <select class="w-full outline-none" name="" id="">
                                            <option value="">Newest</option>
                                            <option value="">Oldest</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full h-auto p-4">
                                <div v-for="(item, index) in cmtSong" :key="index"
                                    class="h-24 w-full flex flex-wrap py-2">
                                    <div class="h-14 aspect-square">
                                        <img class="object-cover h-full w-full rounded-full"
                                            :src="item.User.profile_picture" alt="">
                                    </div>
                                    <div class="flex-shrink-0 flex-grow basis-0 flex flex-col ml-2">
                                        <div class=" flex justify-start items-center font-semibold">
                                            {{ item.User.username }}
                                            <div class="pl-4 text-[12px] text-gray-300 font-medium">
                                                1 year ago
                                            </div>
                                        </div>
                                        <div class="py-2 text-left text-[13px]">
                                            {{ item.content }}
                                        </div>
                                        <div class=" text-left text-[13px] font-semibold cursor-pointer">
                                            Reply
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full h-full">
                    <div class="h-[350px] w-full">
                        <div class="text-left p-4 border-b-[1px]">
                            Overview
                        </div>
                        <div v-if="trackInfo" class="text-left text-[13px]">
                            {{ trackInfo.SongDetail.bio }}
                        </div>
                    </div>
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
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        }
    },
    name: 'TracksInfoPage',
    data() {
        return {
            cmtSong: [],
            playVal: 0,
            id: null,
            commentValue: "",
            allCommentByUser: [],
            trackInfo: null,
            isUploader: false,
            user_current: null,
            user: null,
            userById: null,
            userByIdCMT: null,
            userComment: [],
            currentTimeFormated: "0:00",
            comments: [
                {
                    title: 'nice',
                    image: require('@/image/user-logo/meo.jpg'),
                    name: 'Dinh Manh Ninh',
                },
                {
                    title: 'perfect',
                    image: require('@/image/user-logo/buitruonglinh.jpg'),
                    name: 'Hoang Xuan Duc',
                },
                {
                    title: 'Good',
                    image: require('@/image/user-logo/denvau.jpg'),
                    name: 'Bui Cong Nam',
                },
            ]
        }
    },
    mounted() {
        
        this.id = this.$route.params.id;

        if (this.id) {
            apiClient.get("/users/getCurrentUser").then(res => {
                this.user = res.data.data;
                this.user_current = this.user.id;
            });


            apiClient.get(`/song/getSongById/${this.id}`).then(res => {
                this.trackInfo = res.data.data;
                const user_id = this.trackInfo.uploader_id;

                if (this.trackInfo.uploader_id == this.user_current) {
                    this.isUploader = true;
                }
                this.getUserById(user_id);
            })

            this.fetchComments();


        }
        else {
            console.error("Song ID is missing from URL!");
        }


    },
    computed: {
        progressPercentage() {
            const percentage =
                this.playerStore.currentSong.duration && this.playerStore.currentTime
                    ? (this.playerStore.currentTime / this.playerStore.currentSong.duration) * 100
                    : 0;

            return {
                '--progressPlay': `${percentage}%`,
            };
        },
        profilePicture() {
            const profilePicture = this.user?.profile_picture;
            if (profilePicture) {
                return `${profilePicture}`;
            }

            return 'http://localhost:8080/images/other/Unknown_person.jpg';
        },
        profilePictureArtist() {
            const profilePicture = this.userById?.profile_picture;

            if (profilePicture) {
                return `${profilePicture}`;
            }

            return 'http://localhost:8080/images/other/Unknown_person.jpg';
        },
    },
    methods: { 

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
        async fetchComments() {
            try {
                const id = this.$route.params.id;
                const response = await apiClient.get(`/comment/getAllComment/${id}`);
                this.cmtSong = response.data.data;
                console.log("Fetched comments:", this.cmtSong);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        },
        async getUserById(user_id) {
            await apiClient.get(`/users/getUserById/${user_id}`).then(res => {
                this.userById = res.data.data;
                this.userByIdCMT = this.userById.id;
            });
        },
        async followById() {
            try {
                await apiClient.post('/follow/addNewFollower', this.user_current);
            } catch (error) {
                console.log(error);
            }
        },
        async commentSong() {
            try {
                const data =
                {
                    user_id: Number(this.user_current),
                    content: this.commentValue,
                    parent_id: null,
                };
                const res = await apiClient.post(`/comment/addNewCommentToSong/${this.id}`, data);
                const newComment = res.data.data;
                // Gán thông tin người dùng hiện tại vào comment mới
                newComment.user = {
                    ...this.user,  // Sao chép dữ liệu từ this.user
                    // Đảm bảo các trường cần thiết (như profile_picture) có sẵn
                };
                console.log(newComment);
                this.cmtSong.push(newComment);
                this.commentValue = "";

            } catch (error) {
                console.log(error);
            }
        },
        updateProgress(value = this.volumeVal) {
            if (!this.playerStore.currentSong || !this.playerStore.currentSong.duration) return;

            const validValue = Math.max(0, Math.min(value, this.playerStore.currentSong.duration));

            if (this.playerStore.audio) {
                this.playerStore.audio.currentTime = validValue;
                this.playerStore.currentTime = validValue;
            }
        },
        formatDate(dateString) {
            if (!dateString) return "Invalid date";
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        formatGenre(genre) {
            if (!genre) return "null";
            return `#${genre}`;
        },
        formatDuration(duration) {
            const roundedSeconds = Math.round(duration);
            const min = Math.floor(duration / 60);
            const sec = roundedSeconds % 60;
            return `${min}:${sec.toString().padStart(2, "0")}`;
        },
        updateProgressPlay(value = this.playVal) {
            const max = 100;
            const validValue = Math.max(0, Math.min(value, max));
            const percentage = (validValue / max) * 100;
            const rangeInput = document.querySelector('.playSlider');


            if (rangeInput) {
                rangeInput.style.setProperty('--progressPlay', `${percentage}%`);
            }
            const currentTime = (validValue / max) * this.trackInfo.SongDetail.duration;

            this.currentTimeFormated = this.formatDuration(Math.round(currentTime));
        }
    },
    components: {
        Header,
    },
}
</script>

<style scoped>
.playSlider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, rgb(255, 255, 255) 0%, rgb(255, 255, 255) var(--progressPlay, 70%), #E4D2CC var(--progressPlay, 70%), #E4D2CC 100%);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
}

/* Tùy chỉnh thumb (đầu trượt) */
.playSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 0;
    transform: rotate(45deg);
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
    position: relative;
}

.playSlider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
}

.playSlider::-ms-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
}
</style>