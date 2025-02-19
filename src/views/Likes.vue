<template>
    <div>
        <Header></Header>
        <div class="w-container pt-16 mb-16 h-auto m-auto">
            <div class="p-4 flex justify-between items-center">
                <div class="text-left font-semibold p-4 text-2xl">
                    Likes by Đen
                </div>
                <div class="h-auto w-auto p-4 flex justify-center items-center">
                    <div class="w-auto h-full rounded-3xl border-[1px] bg-red-500 hover:bg-orange-500 text-white p-2 cursor-pointer  mr-4"
                        :class="{ 'invisible': selectedTracks.length === 0 }">
                        Unlike Track
                    </div>
                    <div class="w-auto h-full rounded-3xl border-[1px] hover:bg-blue-500 hover:text-white border-black hover:border-white p-2 cursor-pointer  mr-4"
                        :class="{ 'invisible': selectedTracks.length === 0 }">
                        Play Selected Track
                    </div>
                </div>
            </div>
            <div class="w-full">
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="w-[5%] m-auto"> <input type="checkbox" name="" id="allCheckbox"
                                    v-model="allSelected" @change="toggleAllTracks"> </th>
                            <th class="w-[50%]  text-left">Track</th>
                            <th class="w-[10%]  text-left">Length</th>
                            <th class="w-[10%]  text-left">Like</th>
                            <th class="w-[10%]  text-left">Play</th>
                            <th class="w-[10%]  text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in songs" :key="index" class="hover:bg-gray-200 cursor-pointer">
                            <th class="m-auto"><input @change="toggleTrackSelection(item.id)"
                                    :checked="selectedTracks.includes(item.id)" class="cursor-pointer" type="checkbox"
                                    name="" id=""></th>
                            <th class="flex justify-start items-center">
                                <div class=" w-auto h-16 justify-center flex items-center">
                                    <div class="w-full h-5/6  aspect-square">
                                        <img :src="item.image" class="w-full h-full object-cover m-auto" alt="">
                                    </div>
                                </div>
                                <div class="p-2">
                                    <div class="text-sm font-semibold text-left">
                                        {{ item.name }}
                                    </div>
                                    <div class="flex justify-start items-center">
                                        <div v-for="(artist, index) in item.artist" :key="index"
                                            class="hover:underline text-xs font-semibold text-gray-400 flex justify-center items-center">
                                            <a href="#">{{ index < item.artist.length - 1 ? artist.name + ',' :
                                                artist.name }}</a>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th class="text-left text-sm">{{ item.length }}</th>
                            <th class="text-left text-sm">{{ item.like }}</th>
                            <th class="text-left text-sm">{{ item.play }}</th>
                            <th class="text-left text-sm">
                                <div class="flex justify-center items-center">
                                    
                                    <div class="w-1/3 h-full aspect-square p-1">
                                        <div @click="playToggle(index)" class="h-full w-full border-[1px] border-gray-500 rounded-full text-gray-500 flex justify-center items-center hover:border-orange-500 hover:text-orange-500">
                                            <font-awesome-icon :icon="songs[index].isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                                        </div>
                                    </div>
                                    <div class="w-1/3 h-full aspect-square p-1">
                                        <div @click="likeToggle(index)" class="h-full w-full border-[1px] border-gray-500 rounded-full text-gray-500 flex justify-center items-center hover:border-orange-500 hover:text-orange-500" :class="{'border-orange-500 text-orange-500': item.isLike === true}">
                                            <font-awesome-icon icon="fa-solid fa-heart" />
                                        </div>
                                    </div>
                                    <div class="w-1/3 h-full aspect-square p-1">
                                        <div class="h-full w-full border-[1px] border-gray-500 rounded-full text-gray-500 flex justify-center items-center hover:border-orange-500 hover:text-orange-500">
                                            <font-awesome-icon icon="fa-solid fa-plus" />
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default {
    name: 'LikesPage',
    data() {
        return {
            isPlaying: false,
            songs: [
                {
                    id: 1,
                    name: 'Làm gì mà phải hốt',
                    length: '5:04',
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
                    isLike: true,
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
                    play: 20305969,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 2,
                    name: 'Đi Về Nhà',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 15203489,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 3,
                    name: 'Anh Đếch Cần Gì Nhiều Ngoài Em',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 17450234,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 4,
                    name: 'Trốn Tìm',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 23904352,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 5,
                    name: 'Bài Này Chill Phết',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 19380456,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 6,
                    name: 'Hai Triệu Năm',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 21129487,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 7,
                    name: 'Mười Năm',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 18023409,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 8,
                    name: 'Mang Tiền Về Cho Mẹ',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 25302765,
                    like: 22,
                    isPublic: false
                },
                {
                    id: 9,
                    name: 'Lối Nhỏ',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 20483742,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 10,
                    name: 'Cho Mình Em',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 19384267,
                    like: 22,
                    isPublic: false
                },
                {
                    id: 11,
                    name: 'Đưa Nhau Đi Trốn',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 16238470,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 12,
                    name: 'Ghé Thăm',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 17294857,
                    like: 22,
                    isPublic: false
                },
                {
                    id: 13,
                    name: 'Ta Cứ Đi Cùng Nhau',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 15830294,
                    like: 22,
                    isPublic: true

                },
                {
                    id: 14,
                    name: 'Ngày Khác Lạ',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 18927403,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 15,
                    name: 'Vì Yêu Cứ Đâm Đầu',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    play: 22509376,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 16,
                    name: 'Bước Qua Mùa Cô Đơn',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        }
                    ],
                    play: 17629485,
                    like: 22,
                    isPublic: true
                }
            ],
            selectedTracks: [],
            currentTrackPlay: null,
        }
    },
    methods: {
        toggleTrackSelection(id) {
            const index = this.selectedTracks.indexOf(id);
            if (index > -1) {
                this.selectedTracks.splice(index, 1); // Bỏ chọn
            } else {
                this.selectedTracks.push(id); // Chọn thêm
            }
        },
        clearSelection() {
            this.selectedTracks = []; // Xóa tất cả lựa chọn
        },
        toggleAllTracks() {
            if (this.allSelected) {
                this.selectedTracks = this.songs.map(song => song.id); // Chọn tất cả
            } else {
                this.selectedTracks = []; // Bỏ chọn tất cả
            }
        },
        checkAllSelected() {
            this.allSelected = this.selectedTracks.length === this.songs.length; // Kiểm tra trạng thái "Chọn tất cả"
        },
        likeToggle(index){
            this.songs[index].isLike = !this.songs[index].isLike;
        },
        playToggle(index) {
            if (this.currentTrackPlay === this.songs[index].id) {
                this.songs[index].isPlaying = false;
                this.currentTrackPlay = null;
            } else {
                this.songs.forEach(song => song.isPlaying = false);
                this.songs[index].isPlaying = true;
                this.currentTrackPlay = this.songs[index].id;
            }
        },
    },
    components: {
        Header,
        Footer
    },
}
</script>

<style scoped></style>