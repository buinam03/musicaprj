<template>
    <div>
        <Header></Header>
        <div
            class="w-container pt-16 mb-16 h-auto m-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div class="p-4 flex justify-between items-center">
                <div class="text-left font-semibold p-4 text-2xl">
                    My Tracks
                </div>
                <div class="h-auto w-auto p-4 flex justify-center items-center">
                    <div @click="deleteTracksById" class="w-auto h-full rounded-3xl border-[1px] bg-red-500 hover:bg-orange-500 text-white p-2 cursor-pointer  mr-4"
                        :class="{ 'invisible': selectedTracks === null }">
                        Delete Tracks
                    </div>
                    <div @click="editTracks"
                        class="w-auto h-full rounded-3xl border-[1px] hover:bg-blue-500 hover:text-white border-black hover:border-white p-2 cursor-pointer  mr-4"
                        :class="{ 'invisible': selectedTracks === null }">
                        Edit Tracks
                    </div>
                </div>
            </div>
            <div v-if="songs && songs.length > 0" class="w-full">
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="w-[5%] m-auto">Select</th>
                            <th class="w-[50%]  text-left">Track</th>
                            <th class="w-[10%]  text-left">Length</th>
                            <th class="w-[10%]  text-left">Like</th>
                            <th class="w-[10%]  text-left">Play</th>
                            <th class="w-[10%]  text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in songs" :key="index" class="hover:bg-gray-200 cursor-pointer">
                            <th class="m-auto">
                                <input 
                                    @change="toggleTrackSelection(item.id)"
                                    :checked="selectedTracks === item.id"
                                    class="cursor-pointer" 
                                    type="checkbox"
                                >
                            </th>
                            <th class="flex justify-start items-center">
                                <div class=" w-auto h-16 justify-center flex items-center">
                                    <div class="w-full h-5/6  aspect-square">
                                        <img :src="item.artwork || defaultImage"
                                            class="w-full h-full object-cover m-auto rounded-sm" alt="">
                                    </div>
                                </div>
                                <div class="p-2">
                                    <div class="text-sm font-semibold text-left">
                                        {{ item.title }}
                                    </div>
                                </div>
                            </th>
                            <th class="text-left text-sm">{{ formatTime(item.SongDetail.duration) }}</th>
                            <th class="text-left text-sm">{{ item.SongDetail.likes }}</th>
                            <th class="text-left text-sm">{{ item.SongDetail.plays }}</th>
                            <th class="text-left text-sm"
                                :class="{ 'text-red-500': item.is_public === false, 'text-blue-400': item.isPublic === true }">
                                {{ item.is_public ? 'Public' : 'Private' }}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="h-[160px] w-full flex justify-center items-center py-8">
                <div class="text-[20px] text-gray-500">You haven't uploaded any tracks yet.</div>
            </div>
        </div>
        <div v-if="isEditTracks && trackInfo"
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
                            <button type="button" class="btn-warning">
                                <img v-if="imageURL" :src="imageURL"
                                    class="w-full h-full object-cover p-5 border-[10px]" alt="artwork">
                                <div v-else class="flex flex-col items-center gap-10">
                                    <font-awesome-icon icon="fa-solid fa-upload" class="uploadIcon opacity-50" />
                                    <span class="opacity-50 text-xl">Add new artwork</span>
                                </div>
                                <input ref="fileInput" type="file" accept=".jpg,.png" @change="handleFileUpload">
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
                                <textarea v-model="bio" class="w-full p-4 h-32 text-lg resize-none" rows="4"
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
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
export default {
    name: 'TracksPage',
    data() {
        return {
            songs: null,
            selectedTracks: null,
            trackInfo: null,
            idSelected: null,
            imageURL: null,
            isEditTracks: false,
            genreList: [],
            selectedGenre: '',
            bio: '',
            privacy: '1',
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            editTitle : '',
            allSelected: false,
        }
    },
    mounted() {
        this.getTracks();
        this.getGenre();

    },

    methods: {
        async deleteTracksById() {
            try {
                await apiClient.delete(`http://localhost:3000/api/song/deleteSongById/${this.idSelected}`);
                console.log('Delete track success');
                this.getTracks();
            } catch (error) {
                console.log('Error delete track', error);
            }
        },
        async getTrackInfoById() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/song/getSongById/${this.idSelected}`);
                this.trackInfo = response.data.data;
                this.imageURL = this.trackInfo.artwork;
                this.editTitle = this.trackInfo.title;
                this.selectedGenre = this.trackInfo.genre_id || '';
                this.bio = this.trackInfo.bio || '';
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

        handleFileUpload(event) {
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
        formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        },
        async getTracks() {
            try {
                const response = await apiClient.get('http://localhost:3000/api/song/getSongByUser');
                this.songs = response.data.data;
            } catch (error) {
                console.log('Error get tracks', error);
            }
        },
        editTracks() {
            this.isEditTracks = true;
            this.getTrackInfoById();
        },
        toggleTrackSelection(id) {
            if (this.selectedTracks === id) {
                this.selectedTracks = null;
                this.idSelected = null;
            } else {
                this.selectedTracks = id;
                this.idSelected = id;
                this.isEditTracks = true;
            }
        },
        toggleAllTracks() {
            if (this.allSelected) {
                this.selectedTracks = this.songs.map(song => song.id); // Chọn tất cả
            } else {
                this.selectedTracks = null; // Bỏ chọn tất cả
            }
        },
        async editTrack() {
            try {
                const payload = {
                    artwork: this.imageURL,
                    title: this.editTitle,
                    genre: this.selectedGenre.name,
                    bio: this.bio || null,
                    privacy: parseInt(this.privacy),
                }
                console.log('payload', payload);
                const response = await apiClient.put(`http://localhost:3000/api/song/updateSong/${this.idSelected}`, payload);
                if (response.data) {
                    this.isEditTracks = false;
                    await this.getTracks();
                }
            } catch (error) {
                console.log('Error edit track', error);
            }
        },


        checkAllSelected() {
            this.allSelected = this.selectedTracks !== null; // Kiểm tra trạng thái "Chọn tất cả"
        },
    },
    components: {
        Header,
    },
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