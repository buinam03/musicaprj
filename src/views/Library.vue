<template>
    <div>
        <Header></Header>
        <div class="pt-16 w-container mx-auto h-auto ">
            <div class="flex justify-between items-center w-full border-b-[1px] p-4">
                <div class="text-left font-semibold text-2xl flex justify-center items-center">
                    Likes
                </div>
                <div class="whitespace-nowrap text-gray-500 cursor-pointer">
                    All Likes
                    <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </div>
            </div>
            <div class="mt-4">
                <div class="flex flex-wrap w-full h-auto">
                    <div v-for="(item, index) in songs.slice(0, 12)" :key="index" class="pr-4 h-[250px] w-1/6">

                        <div @click="togglePlay(index)" class="w-full aspect-square relative cursor-pointer group">
                            <div
                                class="absolute inset-0 bg-transparent bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-75 rounded-lg ">
                            </div>
                            <div
                                class="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity ">
                                <div
                                    class="h-[45px] w-[45px] border-[1px]  border-orange-500 bg-orange-500 flex justify-center items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity ">
                                    <font-awesome-icon icon="fa-solid fa-play" size="lg" class="text-white z-50" />
                                </div>
                            </div>
                            <img :src="item.image" class="z-0 object-cover" alt="">
                        </div>
                        <div class="text-[14px] text-left w-full text-ellipsis whitespace-nowrap overflow-hidden">
                            <font-awesome-icon icon="fa-solid fa-heart" class="text-orange-500" />
                            {{ item.name }}
                        </div>
                        <div v-for="(artist, index) in artist" :key="index"
                            class="text-[12px] font-semibold w-full text-ellipsis whitespace-nowrap overflow-hidden text-gray-400 text-left">
                            <a href="#">{{ index < item.artist.length - 1 ? artist.name + ',' : artist.name }}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between items-center w-full border-b-[1px] p-4">
                <div class="text-left font-semibold text-2xl flex justify-center items-center">
                    Playlist
                </div>
                <div class="whitespace-nowrap text-gray-500 cursor-pointer">
                    All Playlist
                    <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </div>
            </div>
            <div class="mt-4">
                <div class="flex flex-wrap w-full h-auto">
                    <div v-for="(item, index) in songs.slice(0, 12)" :key="index" class="pr-4 h-[250px] w-1/6">

                        <div @click="togglePlay(index)" class="w-full aspect-square relative cursor-pointer group">
                            <div
                                class="absolute inset-0 bg-transparent bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-75 rounded-lg ">
                            </div>
                            <div
                                class="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity ">
                                <div
                                    class="h-[45px] w-[45px] border-[1px]  border-orange-500 bg-orange-500 flex justify-center items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity ">
                                    <font-awesome-icon icon="fa-solid fa-play" size="lg" class="text-white z-50" />
                                </div>
                            </div>
                            <img :src="item.image" class="z-0 object-cover" alt="">
                        </div>
                        <div class="text-[14px] text-left w-full text-ellipsis whitespace-nowrap overflow-hidden">
                            <font-awesome-icon icon="fa-solid fa-heart" class="text-orange-500" />
                            {{ item.name }}
                        </div>
                        <div v-for="(artist, index) in artist" :key="index"
                            class="text-[12px] font-semibold w-full text-ellipsis whitespace-nowrap overflow-hidden text-gray-400 text-left">
                            <a href="#">{{ index < item.artist.length - 1 ? artist.name + ',' : artist.name }}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between items-center w-full border-b-[1px] p-4">
                <div class="text-left font-semibold text-2xl flex justify-center items-center">
                    Following
                </div>
                <div class="whitespace-nowrap text-gray-500 cursor-pointer">
                    All Following
                    <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </div>
            </div>
            <div class="grid grid-cols-5 gap-4 mb-4 h-[500px]">
                <div @mouseover="isHoverUser = index" @mouseleave="isHoverUser = null"
                    v-for="(user, index) in users.slice(0, 5)" :key="index"
                    class=" h-[300px] p-4 bg-white shadow-lg rounded-2xl">
                    <div class="w-[180px] aspect-square h-[180px] mx-auto">
                        <img :src="user.image" alt="Profile picture"
                            class="rounded-full mr-4 object-cover w-full h-full">
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold">{{ user.name }}</h2>

                        <div  v-if="isHoverUser === index" @click="followToggle(index)"
                            class="w-[120px] max-w-[120px] h-auto rounded-3xl border-[1px] mx-auto cursor-pointer my-4 p-2 text-sm "
                            :class="user.isFollow ? 'border-orange-500 text-orange-500' : 'border-gray-500 text-gray-500'">
                            <font-awesome-icon
                                :icon="user.isFollow ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                            {{ user.isFollow ? 'Following' : 'Follow' }}
                        </div>
                    </div>
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
    name: 'LibraryPage',
    setup() {
        return {
            state,
        }
    },
    data() {
        return {
            isHoverUser: null,
            songs: [
                {
                    id: 1,
                    name: 'Wait Another Day',
                    length: '5:04',
                    image: require('@/image/artwork/mikemes.jpg'),
                    isLike: true,
                    artist: [
                        {
                            id: 1,
                            name: 'Mike Williams'
                        },
                        {
                            id: 2,
                            name: 'Mesto'
                        },
                    ],
                    play: 20305969,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 2,
                    name: 'Chân Tình x Vị Ngọt Đôi Môi - DJ TuSo x Benn ft. Bobby',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
                    artist: [
                        {
                            id: 3,
                            name: 'DJ Tuso'
                        },
                    ],
                    play: 15203489,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 3,
                    name: 'No Stopping Love',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/dirtypalm.jpg'),
                    artist: [
                        {
                            id: 4,
                            name: 'Dirty Palm'
                        },
                    ],
                    play: 17450234,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 4,
                    name: 'Galantis - Runaway(U&I)',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/Galantis_-_Runaway_(U_&_I)_cover.jpg'),
                    artist: [
                        {
                            id: 5,
                            name: 'Galantis'
                        },
                    ],
                    play: 23904352,
                    like: 22,
                    isPublic: true
                },
                {
                    id: 5,
                    name: 'LeyLa - Mesto',
                    length: '5:04',
                    isLike: true,
                    image: require('@/image/artwork/leylamesto.jpg'),
                    artist: [
                        {
                            id: 6,
                            name: 'Mesto'
                        },

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
            users: [
                { name: 'Woanh', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'House Music With...', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Deep House Sessions', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Rogue Self', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'TONAL EXTRA', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'PROFANE', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'TONAL', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'TAIGA', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Pumped Deep', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Doxed', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Kudzuro', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'PuffCorn', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
            ],
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
        followToggle(index) {
            this.users[index].isFollow = !this.users[index].isFollow;
        },
    },
    components: {
        Header,
        Footer
    },
}
</script>

<style scoped></style>