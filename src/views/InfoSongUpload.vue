<template>
    <div>
        <div class="pt-16 notification-container fixed top-0 right-0 mt-2 mr-4" v-if="successMessage">
            <div class="notification bg-orange-500 text-white px-4 py-2 rounded-sm shadow-lg font-extralight">
                {{ successMessage }}
            </div>
        </div>
        <div
            class="pt-16 mb-20 w-container mx-auto h-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div
                class="grid grid-cols-[550px_1fr] gap-4 h-full mt-10 xl:grid-cols-[550px_1fr] lg:grid-cols-[450px_1fr] md:grid-cols-[300px_1fr]">
                <div class="flex justify-center items-start relative">
                    <div
                        class="aspect-square h-[450px] border-[2px] border-gray-300 border-dashed rounded-md mx-auto xl:h-[450px] lg:h-[350px] md:h-[300px]">
                        <button type="button" class="btn-warning" :class="{ 'cursor-default': isImageUpload }">
                            <img v-if="imageURL" :src="imageURL" class="w-full h-full object-cover p-5 border-[10px]"
                                alt="artwork">
                            <div v-else class="flex flex-col items-center gap-10">
                                <font-awesome-icon icon="fa-solid fa-upload" class="uploadIcon opacity-50" />
                                <span class="opacity-50 text-xl">Add new artwork</span>
                            </div>

                            <input ref="fileInput" type="file" accept=".jpg,.png" @change="handleFileUpload"
                                :class="{ 'hidden': isImageUpload }">
                        </button>
                        <div class="mt-10 h-20">
                            <div class="flex justify-between">
                                <div v-if="isImageUpload" @click="replaceImage"
                                    class="h-20 w-20 border-[1px] border-gray-600 rounded-full flex justify-center items-center opacity-70 hover:scale-110 hover:opacity-90 duration-200 cursor-pointer">
                                    <div class="scale-150 text-gray-600">
                                        <font-awesome-icon icon="fa-solid fa-pencil" />
                                    </div>
                                </div>
                                <div v-if="isImageUpload" @click="deleteImage" class="h-20 w-20 border-[1px] border-gray-600 rounded-full flex justify-center items-center opacity-70 
                                hover:scale-110 duration-200 hover:opacity-90 cursor-pointer">
                                    <div class="scale-150 text-gray-600">
                                        <font-awesome-icon icon="fa-solid fa-trash" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="">
                    <div class="w-full h-auto">
                        <div class="text-left flex font-semibold text-sm">
                            Track title
                            <div class="text-red-500">*</div>
                        </div>
                        <div class="w-full h-12 border-[1px] border-gray-400 rounded-sm text-sm">
                            <input id="titleInput" type="text" class="w-full h-full rounded-sm p-4"
                                :value="fileNameWithoutExtend">
                        </div>
                    </div>
                    <div class="w-full h-auto">
                        <div class="text-left flex font-semibold mt-5 mb-2 text-sm">
                            Main Artist(s)
                            <div class="text-red-500">*</div>
                        </div>
                        <div v-if="userById" class="w-full h-12 border-[1px] border-gray-400 rounded-sm text-sm">
                            <input id="titleInput" type="text" class="w-full h-full rounded-sm p-4" :value="username"
                                readonly>
                        </div>
                        <div v-else class="w-full h-12 border-[1px] border-gray-400 rounded-sm text-sm">
                            <input id="titleInput" type="text" class="w-full h-full rounded-sm p-4" value="No artist"
                                readonly>
                        </div>
                    </div>
                    <div class="w-full h-auto">
                        <div class="text-left flex font-semibold mt-5 mb-2 text-sm">
                            Genre (Pop,Jazz,EDM...)
                            <div class="text-red-500">*</div>
                        </div>
                        <div class="w-full h-12 border-[1px] border-gray-400 rounded-sm text-sm">
                            <select v-model="selectedGenre" class="w-full p-4 text-lg">
                                <option value="">Select a genre</option>
                                <option v-for="item in genreList" :key="item.id" :value="item">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="w-full h-auto">
                        <div class="text-left flex font-semibold mt-5 mb-2 text-sm">
                            Decription
                        </div>
                        <div class="w-full h-24 border-[1px] border-gray-400 rounded-sm text-sm">
                            <input v-model="bio" id="titleInput" type="text"
                                class="w-full h-full rounded-sm pb-10 pl-4 pr-4"
                                placeholder="Tracks with descriptions tend to get more plays and engagement.">
                        </div>
                    </div>
                    <div class="w-full h-auto">
                        <div class="text-left flex font-semibold mt-5 mb-2 text-sm">
                            Track Privacy
                        </div>
                        <div class="w-full text-sm flex">
                            <div class="flex justify-start items-center">
                                <input v-model="privacy" value="1" type="radio" name="" id="">
                                <div class="pl-2 font-semibold text-sm">
                                    Public
                                </div>
                            </div>
                            <div class="flex justify-start items-center ml-10">
                                <input v-model="privacy" value="0" type="radio" name="" id="">
                                <div class="pl-2 font-semibold text-sm">
                                    Private
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full h-8 0 mt-5">
                        <div @click="uploadMusic" class="flex justify-end items-center h-full">
                            <div
                                class="w-28 h-full bg-orange-500 rounded-2xl text-sm text-white flex items-center justify-center font-semibold cursor-pointer hover:bg-orange-400">
                                Upload
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiClient from '@/apiService/apiClient';
import axios from 'axios';
import { usePlayerStore } from '@/js/state';
export default {
    name: 'InfoSongUpload',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        };
    },
    mounted() {
        this.title = this.fileNameWithoutExtend;
        console.log(this.title);
        this.getGenre();
        this.getUserById();

    },
    watch: {
        imageURL(newValue) {
            this.artwork = newValue;
        }
    },
    data() {
        return {
            artwork: this.imageURL,
            title: "",
            genre: "",
            bio: "",
            duration: null,
            privacy: 1,
            fileName: '',
            imageURL: null,
            isImageUpload: false,
            successMessage: '',
            audioFile: null,
            fileUrl: null,
            genreList: [],
            userById: null,
            username: '',
            selectedGenre: '',
        }
    },
    computed: {

        fileNameWithoutExtend() {
            return this.fileName ? this.fileName.split(".").slice(0, -1).join(".") : "";
        },
        fileImageURL() {
            return this.imageURL;
        }
    },
    components: {
        // Header,
    },
    methods: {
        async getUserById() {
            try {
                const response = await apiClient.get(`/users/getUserById/${this.playerStore.idUserLogin}`);
                this.userById = response.data.data;
                this.username = this.userById.username;
                console.log('userById', this.userById);
            } catch (error) {
                console.log('Error get genre', error);
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
        handleFileUpload(event) {
            const file = event.target.files[0]; // Lấy file đầu tiên
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imageURL = e.target.result; // Gán URL ảnh vào `imageUrl`
                };
                reader.readAsDataURL(file); // Đọc file dưới dạng DataURL
                this.isImageUpload = true;
                event.target.value = null;
            }
        },
        deleteImage() {
            this.imageURL = null;
            this.isImageUpload = false;
        },
        replaceImage() {
            this.$refs.fileInput.click();
        },
        async uploadMusic() {
            try {

                const formData = new FormData();
                // formData.append("title", this.title);
                // formData.append("genre", this.selectedGenre.name);
                // formData.append("bio", this.bio);
                // formData.append("duration", this.duration);
                // formData.append("privacy", this.privacy);
                // formData.append("path", this.fileUrl);

                formData.append("artwork", this.artwork);
                formData.append("file", this.artwork);
                formData.append("upload_preset", "ml_default");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dxgqkbchh/image/upload",
                    formData
                );

                const artworkUrl = response.data.secure_url;
                console.log("Uploaded Artwork URL:", artworkUrl);

                // Lưu URL artwork lại để gửi lên backend
                const songData = {
                    title: this.title,
                    genre: this.selectedGenre?.name || "",
                    bio: this.bio,
                    duration: this.duration,
                    privacy: this.privacy,
                    path: this.fileUrl,      // file nhạc (URL từ trang trước)
                    artwork: artworkUrl      // ảnh bìa vừa upload
                };

                await apiClient.post("song/addNewSong", songData);


                this.successMessage = 'Track upload successful!';

                setTimeout(() => {
                    this.successMessage = '';
                    this.$router.push('/home');
                }, 1500);
            } catch (error) {
                console.log({ message: 'error when add new song', error: error });
            }
        },
    },
    created() {
        this.fileUrl = this.$route.query.fileUrl;
        this.fileName = this.$route.query.fileName;
        this.duration = this.$route.query.duration;

        console.log("File URL:", this.fileUrl);
        console.log("File Name:", this.fileName);
    },
    beforeRouteLeave(to, from, next) {
        if (!this.isFormValid || confirm("Bạn chưa hoàn tất upload. Tiếp tục rời trang?")) {
            next();
        } else {
            next(false);
        }
    }
}
</script>

<style scoped>
.btn-warning {
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

.uploadIcon {
    transform: scale(5);
}

.notification {
    animation: fade-in-out 3s ease;
}

@keyframes fade-in-out {
    0% {
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>