<template>
    <div>
        <Header></Header>
        <div class="w-container pt-16 mb-16 h-auto m-auto">
            <div class="h-[350px] w-full bg-[#222021] flex">
                <div class="aspect-square h-full p-4 ">
                    <img src="@/image/artwork/djtuso.jpg" class="object-cover w-full h-full" alt="">
                </div>
                <div class="w-full h-full p-4 relative">
                    <div class="flex items-start">
                        <div
                            class="h-16 w-16  rounded-full flex justify-center items-center bg-orange-500 text-white hover:bg-orange-600 relative cursor-pointer">
                            <!-- Nút play được căn giữa -->
                            <font-awesome-icon icon="fa-solid fa-play" size="2xl" class="absolute" />
                        </div>
                        <div class="px-4 text-[32px] w-2/3 text-left text-white ">
                            Chân Tình x Vị Ngọt Đôi Môi - DJ TuSo x Benn ft. Bobby
                            <div class="text-white text-[16px] cursor-pointer">
                                DJ Tuso
                            </div>
                        </div>
                        <div class="w-[calc(100% - 66.666%  - 64px)] mx-auto">
                            <div class="text-gray-300 text-[20px]">1/2/2025</div>
                            <div class="text-white text-[14px] mt-4 rounded-3xl bg-gray-400">#EDM</div>
                        </div>
                    </div>
                    <div class="absolute h-28 w-full bottom-0 left-0 p-4 flex justify-center items-center">
                        <div class="w-1/12 text-white text-xs">0:00</div>
                        <div class=" flex justify-center items-center w-[80%]">
                            <input @input="updateProgressPlay($event.target.value)" v-model="playVal" min="0" max="100"
                                type="range" class="playSlider h-1 block mx-auto cursor-pointer w-full">
                        </div>
                        <div class="w-1/12 text-white text-xs">3:59</div>
                    </div>
                </div>
            </div>
            <div class="w-full h-auto mt-4 grid grid-cols-[1fr_400px]">
                <div class="w-full h-full">
                    <div class="h-16 w-full   flex justify-center items-center">
                        <div class="h-16 aspect-square">
                            <img class="rounded-full object-cover cursor-pointer" src="@/image/user-logo/denvau.jpg"
                                alt="">
                        </div>
                        <div class="w-[90%] h-full ml-4 flex justify-center items-center">
                            <div class="rounded-3xl border-[1px] w-full h-3/4 flex justify-center items-center">
                                <input type="text" name="" id="" placeholder="Write your comment"
                                    class="outline-none text-left w-full h-full rounded-3xl p-4">
                            </div>
                        </div>
                        <div class="w-[10%] h-full ml-4  flex justify-center items-center">
                            <div
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
                                1245
                            </div>
                            <div class="text-gray-500 text-[13px] mr-6">
                                <font-awesome-icon icon="fa-solid fa-heart" class="pr-2" />
                                1245
                            </div>
                        </div>
                    </div>
                    <div class="w-full h-auto grid grid-cols-[150px_1fr] mt-4">
                        <div class="w-full h-auto">
                            <div class="w-full h-auto aspect-square">
                                <img class="rounded-full w-full h-full object-cover" src="@/image/user-logo/hoaprox.jpg"
                                    alt="">
                            </div>
                            <div class="mt-4">
                                <div class=" flex justify-center items-center ">
                                    <a class="text-[16px]" href="#">DJ Tuso</a>
                                    <div class="w-3 h-3 ml-1 ">
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
                                <div class=" flex justify-center">
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
                                    3 comments
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
                                <div v-for="(item, index) in comments" :key="index"
                                    class="h-24 w-full flex flex-wrap py-2">
                                    <div class="h-14 aspect-square">
                                        <img class="object-cover h-full w-full rounded-full" :src="item.image" alt="">
                                    </div>
                                    <div class="flex-shrink-0 flex-grow basis-0 flex flex-col ml-2">
                                        <div class=" flex justify-start items-center font-semibold">
                                            {{ item.name }}
                                            <div class="pl-4 text-[12px] text-gray-300 font-medium">
                                                1 year ago
                                            </div>
                                        </div>
                                        <div class="py-2 text-left text-[13px]">
                                            {{ item.title }}
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
                        <div class="text-left text-[13px]">
                            Theo dõi DJ TuSo tại:
                            Youtube: <a class="text-blue-400" href="#">www.youtube.com/c/DJTuSo</a>
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

export default {
    name: 'TracksInfoPage',
    data() {
        return {
            playVal: 0,
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
    methods: {
        updateProgress(value = this.volumeVal) {
            const max = 100; // Giá trị tối đa của slider
            const validValue = Math.max(0, Math.min(value, max)); // Giới hạn giá trị trong khoảng [0, max]
            const percentage = (validValue / max) * 100;
            const rangeInput = document.querySelector('.progressVolume');
            if (rangeInput) {
                rangeInput.style.setProperty('--progress', `${percentage}%`);
            }
        },

        updateProgressPlay(value = this.playVal) {
            const max = 100;
            const validValue = Math.max(0, Math.min(value, max));
            const percentage = (validValue / max) * 100;
            const rangeInput = document.querySelector('.playSlider');
            if (rangeInput) {
                rangeInput.style.setProperty('--progressPlay', `${percentage}%`);
            }
        }
    },
    components: {
        Header,
        Footer
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