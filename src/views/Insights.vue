<template>
    <div>
        <Header></Header>
        <div class="w-container pt-16 mb-16 h-auto m-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
            <div class="p-4 font-semibold text-2xl text-left">Insights</div>
            <div class="w-full h-auto flex justify-between items-center mb-10">
                <div class="text-semibold text-2xl p-4">
                    Overview
                </div>
                <div class="w-auto h-auto ">
                    <select v-model="currentIndexOption"
                        class="p-3 outline-none border-[1px] border-gray-500  rounded-md xl:p-3 lg:p-2 md:p-1" name="" id="">
                        <option class="xl:text-base lg:text-sm md:text-xs" :value="index" v-for="(item, index) in optionDate" :key="index">{{ item.title }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="text-sm font-extralight text-gray-500 text-left p-4">
                You have {{ insightPlays }} {{ currentTitle.toLowerCase() }} in {{ currentTitleOption.toLowerCase() }}
                !!
            </div>
            <div class="w-full h-auto flex items-center justify-around">
                <div @click="modeCick(index)" v-for="(item, index) in mode" :key="index"
                    class="h-auto w-auto px-4 py-2 rounded-3xl border-[1px] flex justify-center items-center cursor-pointer text-sm text-gray-600"
                    :class="{ 'bg-orange-500 text-white ': currentIndex === index }">
                    <font-awesome-icon :icon="item.icon" class="mr-2" />
                    {{ item.title }}
                </div>
            </div>
            <div class="mx-auto w-full h-[400px] xl:max-w-[1200px] lg:max-w-[1024px] md:max-w-[768px]">
                <Bar :data="chartData" :options="{ maintainAspectRatio: false }" />
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4 w-full h-[400px] mb-16 p-4">
                <div class="w-full h-full border-[1px] rounded-md">
                    <div class="w-full h-full p-4">
                        <div class="w-full pb-4 border-b-[1px] flex justify-between items-center">
                            <div class="font-semibold text-sm">
                                Tracks
                            </div>
                            <div class="text-sm">
                                {{ currentTitleOption }}
                            </div>
                        </div>
                        <div class="w-full h-72 mt-4 overflow-y-auto">
                            <div v-for="(item, index) in songs" :key="index"
                                class="h-20 w-full hover:bg-gray-200 cursor-pointer">
                                <div class="h-20 w-auto flex justify-start items-center">
                                    <div class="aspect-square w-auto h-4/5 xl:h-4/5 lg:h-3/5 md:h-3/5 ">
                                        <img class="object-cover w-full h-full rounded-sm" :src="item.image" alt="">
                                    </div>
                                    <div class="pl-4 text-left w-full">
                                        <div class="font-semibold text-gray-700 text-base whitespace-nowrap xl:text-base lg:text-sm md:text-xs">
                                            {{ item.name }}
                                        </div>
                                        <div class="text-xs text-gray-500 whitespace-nowrap xl:text-base lg:text-sm md:text-xs">
                                            <font-awesome-icon icon="fa-solid fa-play" />
                                            {{ item.plays }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="w-full h-full border-[1px] rounded-md">
                    <div class="w-full h-full p-4">
                        <div class="w-full pb-4 border-b-[1px] flex justify-between items-center">
                            <div class="font-semibold text-sm">
                                Overview
                            </div>
                            <div class="text-sm">
                                {{ currentTitleOption }}
                            </div>                           
                        </div>
                        <div class="w-full h-auto mt-4">
                            <div class="text-left mb-4 font-semibold xl:text-base lg:text-sm md:text-xs">
                                <font-awesome-icon icon="fa-solid fa-play" class="pr-2"/>
                                Plays in {{ currentTitleOption }} : {{ insightPlays }}
                            </div>
                            <div class="text-left mb-4 font-semibold xl:text-base lg:text-sm md:text-xs">
                                <font-awesome-icon icon="fa-solid fa-heart" class="pr-2"/>
                                Likes in {{ currentTitleOption }} : {{ insightPlays }}
                            </div>
                            <div class="text-left mb-4 font-semibold xl:text-base lg:text-sm md:text-xs">
                                <font-awesome-icon icon="fa-solid fa-comment" class="pr-2"/>
                                Comments in {{ currentTitleOption }} : {{ insightPlays }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer></Footer>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);



const getDate = getDayAndMonth(7);

function getDayAndMonth(count) {
    const today = new Date();
    return Array.from({ length: count }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day}/${month}`; // Định dạng ngày/tháng
    }).reverse(); // Đảo ngược để ngày mới nhất nằm cuối
}

export default {
    name: 'InsightsPage',
    data() {
        return {
            currentIndex: 0,
            currentIndexOption: 1,
            currentTitleOption: 'Last 7 days',
            dataInsights: [65, 59, 80, 81, 56, 55, 40],
            currentTitle: 'Plays',
            songs: [
                {
                    id: 1,
                    name: "Cái đẹp",
                    artist: [
                        { id: 1, name: "tlinh" },
                        { id: 2, name: "Pháo" },
                        { id: 3, name: "Pháp Kiều" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 2,
                    name: "Ngã tư không đèn",
                    artist: [
                        { id: 4, name: "Den Vau" },
                        { id: 5, name: "JustaTee" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 3,
                    name: "Tình yêu bận bịu",
                    artist: [
                        { id: 6, name: "Hoaprox" },
                        { id: 7, name: "Masew" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 4,
                    name: "Vùng ký ức",
                    artist: [
                        { id: 8, name: "Đức Phúc" },
                        { id: 9, name: "ERIK" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 5,
                    name: "Hành trình cuối",
                    artist: [
                        { id: 10, name: "Sơn Tùng MTP" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 6,
                    name: "Nhớ mùa thu Hà Nội",
                    artist: [
                        { id: 11, name: "Hà Anh Tuấn" },
                        { id: 12, name: "Mỹ Tâm" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 7,
                    name: "Thời thanh xuân đã qua",
                    artist: [
                        { id: 13, name: "Trịnh Thăng Bình" },
                        { id: 14, name: "Bảo Anh" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 8,
                    name: "Hoa nở không màu",
                    artist: [
                        { id: 15, name: "Hoài Lâm" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 9,
                    name: "Màu nước mắt",
                    artist: [
                        { id: 16, name: "Nguyễn Trần Trung Quân" },
                        { id: 17, name: "Den Vau" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 10,
                    name: "Ngày khác lạ",
                    artist: [
                        { id: 18, name: "Phương Ly" },
                        { id: 19, name: "JustaTee" },
                        { id: 20, name: "Den Vau" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 11,
                    name: "Đi về nhà",
                    artist: [
                        { id: 21, name: "JustaTee" },
                        { id: 22, name: "Den Vau" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
                {
                    id: 12,
                    name: "Bỏ lỡ một người",
                    artist: [
                        { id: 23, name: "Hòa Minzy" }
                    ],
                    image: require('@/image/artwork/3107 artwork.jpg'),
                    plays: 1234
                },
            ],
            optionDate: [
                {
                    title: 'Today'
                },
                {
                    title: 'Last 7 days'
                },
                {
                    title: 'Last 30 days'
                },
                {
                    title: 'Last 12 months'
                },
                {
                    title: 'All time'
                },
            ],
            mode: [
                {
                    title: 'Plays',
                    icon: 'fa-solid fa-play'
                },
                {
                    title: 'Likes',
                    icon: 'fa-solid fa-heart'
                },
                {
                    title: 'Comments',
                    icon: 'fa-solid fa-comment'
                },
            ],

        }
    },
    watch: {
        currentIndexOption(newVal) {
            this.currentTitleOption = this.optionDate[newVal].title;
        },
    },
    methods: {
        modeCick(index) {
            this.currentIndex = index;
            this.currentTitle = this.mode[index].title;
        },
        calculateInsight(data) {
            if (data.length === 0) return 0;
            return data[0] + this.calculateInsight(data.slice(1));
        },

    },
    mounted() {

    },
    computed: {
        chartData() {
            return {
                labels: getDate, // Sử dụng mảng ngày được tạo trước đó
                datasets: [
                    {
                        label: this.currentTitle, // Dùng giá trị động từ currentTitle
                        data: this.dataInsights,
                        backgroundColor: ["#F50"],
                        borderColor: [
                            "rgb(255, 255, 255)",

                        ],
                        borderWidth: 1,
                    },
                ],
            };
        },
        insightPlays() {
            return this.calculateInsight(this.dataInsights);
        },

    },
    components: {
        Bar,
        Header,
        Footer
    },
}
</script>

<style scoped></style>