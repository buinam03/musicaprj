    <template>
        <div class="bg-[#FF6347] h-16 w-full fixed bottom-0 z-50">
            <div class="w-container mx-auto h-full flex justify-center items-center">
                <div class="w-1/6 flex justify-center items-center">
                    <div class="pl-5 w-1/5">
                        <font-awesome-icon icon="fa-solid fa-backward-step" size="lg" />
                    </div>
                    <div class="pl-6 w-1/5" @click="PlayControlToggle">
                        <font-awesome-icon v-if="state.isPlaying" icon="fa-solid fa-pause" size="lg" />
                        <font-awesome-icon v-else icon="fa-solid fa-play" size="lg" />
                    </div>
                    <div class="pl-6 w-1/5" >
                        <font-awesome-icon icon="fa-solid fa-forward-step" size="lg" />
                    </div>
                    <div class="pl-6 w-1/5" :class="{ 'text-white': isShuffleToggle, '': !isShuffleToggle }"
                        @click="ShuffleMusicToggle">
                        <font-awesome-icon icon="fa-solid fa-shuffle" size="lg" />
                    </div>
                    <div class="pl-6 flex w-1/5" :class="{ 'text-white': repeatState > 0, '': repeatState === 0 }"
                        @click="RepeatMusicToggle">
                        <font-awesome-icon icon="fa-solid fa-repeat" size="lg" />
                        <span class="text-xs" v-if="repeatState === 1">1</span>
                    </div>
                </div>
                <div class="pl-9 h-full w-2/3 flex justify-center items-center">
                    <div class="w-1/12 text-white text-xs">0:00</div>
                    <div class="relative w-4/6 h-full ">
                        <!-- <div class="absolute progress-bar w-1/6 h-full rounded-full">
                                <div
                                    class="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-0  h-2 w-2  bg-white rounded-full">
                                </div>
                            </div> -->
                        <div class="absolute top-1/2 transform -translate-y-1/2 translate-x-0 w-full">
                            <input @input="updateProgressPlay($event.target.value)" v-model="playVal" min="0" max="100"
                                type="range" class="playSlider h-1 block mx-auto cursor-pointer w-full">
                        </div>
                    </div>
                    <div class="w-1/12 text-white text-xs">3:59</div>
                    <div class="w-1/4 flex justify-center items-center relative">
                        <div @click="VolumeToggle" class="cursor-pointer" :class="{ 'hidden': volumeState != 0 }">
                            <font-awesome-icon v-if="volumeState === 0" icon="fa-solid fa-volume-xmark" />
                        </div>

                        <div @click="VolumeToggle" class="cursor-pointer" :class="{ 'hidden': volumeState != 1 }">
                            <font-awesome-icon v-if="volumeState === 1" icon="fa-solid fa-volume-low" />
                        </div>
                        <div @click="VolumeToggle" class="cursor-pointer" :class="{ 'hidden': volumeState != 2 }">
                            <font-awesome-icon v-if="volumeState === 2" icon="fa-solid fa-volume-high" />
                        </div>

                        <div class="pl-2">
                            <input v-model="volumeVal" @input="updateProgress($event.target.value)" type="range" min="0"
                                max="100" class="h-1 block mx-auto cursor-pointer progressVolume">

                        </div>
                    </div>
                </div>
                <div class="w-1/6 h-full flex items-center justify-start">
                    <div class="h-16 w-16 flex items-center justify-center flex-shrink-0 ">
                        <a class="flex items-center justify-center" href="#"><img
                                class="h-4/5 w-4/5 rounded-lg items-center justify-center " src="@/image/logo/logo.png"
                                alt=""></a>
                    </div>
                    <div class="pl-3 h-14 w-full flex flex-col justify-center">
                        <div class="text-white text-left text-ellipsis whitespace-nowrap overflow-hidden ">
                            <a href="#">vinahouseeeeeeeeeeeeeeeeeeeeeeeeeee</a>
                        </div>
                        <div class="text-white text-left text-xs ">
                            <a href="#" class="">Eulelia</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

<script>
import { state } from '@/js/state';
export default {
    name: 'FooterPage',
    setup(){
        return{
            state,
        }
    },
    data() {
        return {
            isMusicPlay: false,
            isShuffleToggle: false,
            repeatState: 0,
            maxTime: 0,
            currentTime: 0,
            volumeState: 2,
            volumeVal: 70,
            savedVolume: 70,
            playVal: 0,
            audio: new Audio(require('@/audio/Tuyet Yeu Thuong Remix.wav')),
        }
    },
    watch: {
        volumeVal(value) {
            const validValue = Math.max(0, Math.min(value, 100));
            if (value < 1) {
                this.volumeState = 0;
            }
            if (value <= 33 && value > 0) {
                this.volumeState = 1;
            }
            if (value > 33) {
                this.volumeState = 2;
            }
            this.updateProgress(validValue);
        },
    },
    mounted() {
        this.updateProgressPlay();
        this.updateProgress();
    },
    methods: {

        PlayControlToggle() {
            state.isPlaying = !state.isPlaying;
            if (state.isPlaying) {
                if (this.audio.src) {
                    this.audio.play().catch((err) => {
                        console.error('Error playing audio:', err);
                    });
                } else {
                    console.error('Audio source is empty!');
                }
            } else {
                this.audio.pause();
            }
        },
        ShuffleMusicToggle() {
            this.isShuffleToggle = !this.isShuffleToggle;
        },
        RepeatMusicToggle() {
            this.repeatState = (this.repeatState + 1) % 3; // Chuyển trạng thái giữa 0, 1, và 2
        },
        VolumeToggle() {
            if (this.volumeVal === 0) {
                this.volumeVal = this.savedVolume;
            }
            else {
                this.savedVolume = this.volumeVal;
                this.volumeVal = 0;
            }
        },
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
    }
}

</script>

<style scoped>
.progress-bar {
    background: rgb(253, 224, 71);
}

/* Tùy chỉnh toàn bộ thanh */
/* Tùy chỉnh toàn bộ thanh */
.progressVolume {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, rgb(253, 224, 71) 0%, rgb(253, 224, 71) var(--progress, 70%), #E4D2CC var(--progress, 70%), #E4D2CC 100%);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
}

/* Tùy chỉnh thumb (đầu trượt) */
.progressVolume::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
    position: relative;
}

.progressVolume::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
}

.progressVolume::-ms-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    z-index: 2;
}

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