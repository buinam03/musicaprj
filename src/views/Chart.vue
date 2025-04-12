<template>
    <div>
        <Header></Header>
        <div class="w-full h-auto mx-auto text-color ">
            <div class="w-container pt-16 mb-16 h-auto m-auto xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                <div class="flex justify-between items-center ">
                    <div class="p-4 text-left font-semibold text-2xl text-white  sticky">
                        #musicachart
                    </div>
                    <div class="p-4 text-left font-semibold text-2xl text-white  sticky">
                        Top 10 weeks
                    </div>
                </div>
                <div v-for="(item, index) in songs.slice(0, 10)" :key="index"
                    class="h-16 w-full flex justify-start items-center  border-[1px] hover:bg-gray-300 cursor-pointer text-white xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                    <div class="w-[5%] flex items-center justify-center font-forestyland font-semibold  text-xl">
                        {{ index + 1 }}
                    </div>
                    <div class="w-[5%] h-full justify-center flex items-center">
                        <div class="w-full aspect-square h-11/12 flex justify-center items-center">
                            <img class="rounded-md w-full h-full object-cover m-auto" :src="item.image" alt="">
                        </div>
                    </div>
                    <div class="w-3/4 h-full flex justify-start items-center">
                        <div class="p-2 w-5/6">
                            <div class="text-md font-semibold text-left text-white ">
                                {{ item.name }}
                            </div>
                            <div class="flex justify-start items-center">
                                <div v-for="(artist, index) in item.artist" :key="index"
                                    class="hover:underline text-xs font-semibold text-white flex justify-center items-center">
                                    <a href="#">{{ index < item.artist.length - 1 ? artist.name + ',' : artist.name
                                            }}</a>
                                </div>
                            </div>
                        </div>
                        <div class="w-1/6 ">
                            <div class="flex justify-center items-center text-sm text-white">
                                <font-awesome-icon icon="fa-solid fa-play " />
                                <div class="pl-2">{{ item.play }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="w-[15%]">
                        <div class="text-center text-sm text-white">
                            {{ item.duration }}
                        </div>
                    </div>
                </div>
                <div class="h-10 w-full mt-4 ">
                    <div
                        class="h-10 w-[240px] mx-auto border-[1px] cursor-pointer rounded-3xl border-white text-white flex justify-center items-center hover:text-black hover:bg-white hover:border-white">
                        Top 100 Musica
                    </div>
                </div>
                <div class="mt-4 h-auto xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                    <div class="p-4 h-auto w-full text-left font-semibold text-2xl text-white xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                        Top artist of the week
                    </div>
                    <div class="grid grid-cols-2 xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                        <div class="flex justify-center items-end h-[300px] relative">
                            <!-- Silver -->
                            <div class="w-32 h-48 flex flex-col items-center">
                                <div
                                    class="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center border-4 border-gray-300">
                                    <img :src="top3artist[1].image" alt="Silver"
                                        class="w-12 h-12 object-cover rounded-full">
                                </div>
                                <div
                                    class="bg-gray-400 w-full h-32 flex justify-center items-center rounded-t-lg text-white font-bold text-lg">
                                    #2 {{ top3artist[1].name }}
                                </div>
                            </div>

                            <!-- Gold -->
                            <div class="w-32 h-64 flex flex-col items-center mx-4">
                                <div
                                    class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-300">
                                    <img :src="top3artist[0].image" alt="Gold"
                                        class="w-12 h-12 object-cover rounded-full">
                                </div>
                                <div
                                    class="bg-yellow-400 w-full h-48 flex justify-center items-center rounded-t-lg text-white font-bold text-lg">
                                    #1 {{ top3artist[0].name }}
                                </div>
                            </div>

                            <!-- Bronze -->
                            <div class="w-32 h-40 flex flex-col items-center">
                                <div
                                    class="w-16 h-16 bg-amber-700 rounded-full flex items-center justify-center border-4 border-amber-500">
                                    <img :src="top3artist[2].image" alt="Bronze"
                                        class="w-12 h-12 object-cover rounded-full">
                                </div>
                                <div
                                    class="bg-amber-700 w-full h-24 flex justify-center items-center rounded-t-lg text-white font-bold text-lg">
                                    #3 {{ top3artist[2].name }}
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-rows-7 w-full">
                            <div v-for="(item, index) in ortherartist" :key="index"
                                class="h-[60px] w-full  flex justify-start items-center p-2 hover:border-[1px] cursor-pointer rounded">
                                <div class="text-left text-white w-[10%]">{{ index + 4 }}</div>
                                <div class="h-full aspect-square w-[44px]">
                                    <img class="object-cover rounded-full h-full w-full" :src="item.image" alt="">
                                </div>
                                <div class="p-2 w-[60%] text-left  ">
                                    <div class="font-semibold text-white whitespace-nowrap">
                                        {{ item.name }}
                                    </div>
                                    <div class="text-white flex items-center text-left">
                                        <font-awesome-icon icon="fa-solid fa-user" />
                                        {{ item.followers }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-10 w-full mt-4">
                    <div
                        class="h-10 w-[240px] mx-auto border-[1px] cursor-pointer rounded-3xl border-white text-white flex justify-center items-center hover:text-black hover:bg-white hover:border-white">
                        Top 100 Artist
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

export default {
    name: 'ChartPage',
    data() {
        return {
            songs: [
                {
                    id: 1,
                    name: 'Làm gì mà phải hốt',
                    length: '5:04',
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 2,
                    name: 'Đi Về Nhà',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 3,
                    name: 'Anh Đếch Cần Gì Nhiều Ngoài Em',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 4,
                    name: 'Trốn Tìm',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 5,
                    name: 'Bài Này Chill Phết',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 6,
                    name: 'Hai Triệu Năm',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 7,
                    name: 'Mười Năm',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 8,
                    name: 'Mang Tiền Về Cho Mẹ',
                    length: '5:04',
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
                    isPublic: false,
                    duration: '4:56'
                },
                {
                    id: 9,
                    name: 'Lối Nhỏ',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 10,
                    name: 'Cho Mình Em',
                    length: '5:04',
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
                    isPublic: false,
                    duration: '4:56'
                },
                {
                    id: 11,
                    name: 'Đưa Nhau Đi Trốn',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 12,
                    name: 'Ghé Thăm',
                    length: '5:04',
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
                    isPublic: false,
                    duration: '4:56'
                },
                {
                    id: 13,
                    name: 'Ta Cứ Đi Cùng Nhau',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'

                },
                {
                    id: 14,
                    name: 'Ngày Khác Lạ',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 15,
                    name: 'Vì Yêu Cứ Đâm Đầu',
                    length: '5:04',
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
                    isPublic: true,
                    duration: '4:56'
                },
                {
                    id: 16,
                    name: 'Bước Qua Mùa Cô Đơn',
                    length: '5:04',
                    image: require('@/image/artwork/lamgimaphaihot.jpg'),
                    artist: [
                        {
                            id: 1,
                            name: 'Đen Vâu'
                        }
                    ],
                    play: 17629485,
                    like: 22,
                    isPublic: true,
                    duration: '4:56'
                }
            ],
            artists: [
                { name: 'Đen Vâu', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Mỹ Tâm', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Sơn Tùng M-TP', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'JustaTee', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Binz', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Hoàng Thùy Linh', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Min', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Vũ.', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Erik', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Phương Ly', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Bích Phương', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Trúc Nhân', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
            ],
        }
    },
    methods: {

    },
    computed: {
        sortedArtists() {
            return [...this.artists].sort((a, b) => b.followers - a.followers); //sort followers
        },
        top3artist() {
            return this.sortedArtists.slice(0, 3);
        },
        ortherartist() {
            return this.sortedArtists.slice(3, 10);
        }
    },
    components: {
        Header,
        Footer
    },
}
</script>

<style scoped>
.text-color {
    /* background: radial-gradient(50% 124.93% at 95.86% -10%, #3efad9 0, hsla(0, 0%, 100%, 0) 100%), linear-gradient(91.56deg, #ff9357 1.54%, #9100ff 98.71%); */
    background: #222021;
}
</style>