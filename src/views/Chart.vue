<template>
    <div>
        <Header></Header>
        <div class="w-full h-screen mx-auto text-color ">
            <div class="w-container pt-16 mb-16 h-auto m-auto xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                <div class="flex justify-between items-center ">
                    <div class="p-4 text-left font-semibold text-2xl text-white  sticky">
                        #musicachart
                    </div>
                    <div class="p-4 text-left font-semibold text-2xl text-white  sticky">
                        Top 10 weeks
                    </div>
                </div>
                <div v-for="(item, index) in songs" :key="index"
                    class="h-16 w-full flex justify-start items-center  border-[1px] hover:bg-gray-300 cursor-pointer text-white xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                    <div class="w-[5%] flex items-center justify-center font-forestyland font-semibold  text-xl">
                        {{ index + 1 }}
                    </div>
                    <div class="w-[5%] h-full justify-center flex items-center">
                        <div class="w-full aspect-square h-11/12 flex justify-center items-center">
                            <img class="rounded-md w-full h-full object-cover m-auto" :src="item.artwork || defaultImage" alt="">
                        </div>
                    </div>
                    <div class="w-[90%] h-full flex justify-start items-center">
                        <div class="p-2 w-5/6">
                            <div @click="goToTrack(item.id)" class="text-md font-semibold text-left text-white ">
                                {{ item.title }}
                            </div>
                            <div class="flex justify-start items-center">
                                <div @click="gotoProfile(item.User.id)"
                                    class="hover:underline text-xs font-semibold text-white flex justify-center items-center">
                                    {{ item.User.username }}
                                </div>
                            </div>
                        </div>
                        <div class="w-1/6 ">
                            <div class="flex justify-center items-center text-sm text-white">
                                <font-awesome-icon icon="fa-solid fa-play " />
                                <div class="pl-2">{{ item.SongDetail.plays }}</div>
                            </div> 
                        </div>
                    </div>
                </div>
                <!-- <div class="mt-4 h-auto xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                    <div class="p-4 h-auto w-full text-left font-semibold text-2xl text-white xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                        Top artist of the week
                    </div>
                    <div class="grid grid-cols-2 xl:w-[1280px] lg:w-[1024px] md:w-[768px]">
                        <div class="flex justify-center items-end h-[300px] relative">
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
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
export default {
    name: 'ChartPage',
    data() {
        return {
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            songs: [],
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
        goToTrack(id) {
            this.$router.push({ name: 'TrackInfoPage', params: { id } });
        },
        async getSongTop10(){
            try {
                const res = await apiClient.get('/song/getSongByDescPlays');
                this.songs = res.data.data;
                console.log('songs top 10: ', this.songs);
            } catch (error) {
                console.error("Lỗi:", error.response?.data);
            }
        },
        gotoProfile(id) {
            this.$router.push({ name: 'ProfilePage', params: { id } });
        },
    },
    mounted() {
        this.getSongTop10();
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
    },
}
</script>

<style scoped>
.text-color {
    /* background: radial-gradient(50% 124.93% at 95.86% -10%, #3efad9 0, hsla(0, 0%, 100%, 0) 100%), linear-gradient(91.56deg, #ff9357 1.54%, #9100ff 98.71%); */
    background: #222021;
}
</style>