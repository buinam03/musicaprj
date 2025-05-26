    <template>
        <div class="bg-[#FF6347] h-16 w-full fixed bottom-0 z-50 xl:h-16 lg:h-12 md:h-10">
            <div
                class="w-container mx-auto h-full flex justify-center items-center xl:w-[1200px] lg:w-[960px]  md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
                <div class="w-1/6 flex justify-center items-center xl:text-[16px] lg:text-[14px] md:text-[12px]">
                    <div @click="previousSong" class=" w-1/5">
                        <font-awesome-icon icon="fa-solid fa-backward-step" size="lg" />
                    </div>
                    <div @keyup.space="PlayControlToggle" class=" w-1/5" @click="PlayControlToggle" tabindex="0">
                        <font-awesome-icon v-if="playerStore.isPlaying" icon="fa-solid fa-pause" size="lg" />
                        <font-awesome-icon v-else icon="fa-solid fa-play" size="lg" />
                    </div>
                    <div @click="nextSong" class=" w-1/5">
                        <font-awesome-icon icon="fa-solid fa-forward-step" size="lg" />
                    </div>
                    <div class="mx-2 w-1/5" :class="{ 'text-white': isShuffleToggle, '': !isShuffleToggle }"
                        @click="ShuffleMusicToggle">
                        <font-awesome-icon icon="fa-solid fa-shuffle" size="lg" />
                    </div>
                    <div class="flex w-1/5" :class="{ 'text-white': repeatState > 0, '': repeatState === 0 }"
                        @click="RepeatMusicToggle">
                        <font-awesome-icon icon="fa-solid fa-repeat" size="lg" />
                        <span class="text-xs" v-if="repeatState === 1">1</span>
                    </div>
                </div>
                <div class="pl-4 h-full w-2/3 flex justify-center items-center xl:scale-100 lg:scale-90 md:scale-90">
                    <div class="w-1/12 text-white text-xs">{{ formatDuration(playerStore.currentTime) }}</div>
                    <div class="relative w-3/6 h-full ">

                        <div class="absolute top-1/2 transform -translate-y-1/2 translate-x-0 w-full">
                            <input :style="progressPercentage" @input="updateProgressPlay($event.target.value)"
                                v-model="playerStore.currentTime" min="0" :max="playerStore.currentSong.duration"
                                step="0.1" type="range" class="playSlider h-1 block mx-auto cursor-pointer w-full">
                        </div>
                    </div>
                    <div class="w-1/12 text-white text-xs">{{ formatDuration(playerStore.currentSong.duration) }}</div>
                    <div class="w-1/3 flex justify-center items-center relative">
                        <div @click="VolumeToggle" class="cursor-pointer"
                            :class="{ 'hidden': playerStore.volume != 0 }">
                            <font-awesome-icon v-if="playerStore.volume === 0" icon="fa-solid fa-volume-xmark" />
                        </div>
                        <div @click="VolumeToggle" class="cursor-pointer" :class="{ 'hidden': volumeState != 2 }">
                            <font-awesome-icon v-if="playerStore.volume > 0" icon="fa-solid fa-volume-high" />
                        </div>

                        <div class="pl-2">
                            <input v-model="playerStore.volume" @input="updateVolume($event.target.value)" type="range"
                                min="0" max="1" step="0.01" class="h-1 block mx-auto cursor-pointer progressVolume">

                        </div>
                    </div>

                </div>
                <div class="w-3/12 h-full flex items-center justify-start xl:h-16 lg:h-12 md:h-10">
                    <div class="h-16 w-16 flex items-center justify-center flex-shrink-0  xl:h-16 lg:h-12 md:h-10">
                        <a class="flex items-center justify-center xl:h-16 lg:h-12 md:h-10" href="#"><img
                                class="h-4/5 aspect-square rounded-lg items-center justify-center object-cover xl:rounded-lg lg:rounded-md md:rounded"
                                :src="playerStore.currentSong.artwork || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                alt=""></a>
                    </div>
                    <div
                        class="pl-3 h-14 w-4/6 flex flex-col justify-center xl:text-[14px] xl:pl-3 lg:text-[14px] lg:pl-1 md:text-[12px] md:pl-1">
                        <div class="text-white text-left text-ellipsis whitespace-nowrap overflow-hidden ">
                            <a href="#">{{ playerStore.currentSong.title || 'Pick a song to set the vibe!' }}</a>
                        </div>
                        <div class="text-white text-left text-xs ">
                            <a href="#" class="">{{ playerStore.currentSong.username || 'The DJ is missing!' }}</a>
                        </div>
                    </div>
                </div>
                <div class="w-1/12 relative group">
                    <div @click="nextPlaylist" class="text-white cursor-pointer">
                        <font-awesome-icon icon="fa-solid fa-bars" alt="Next-up" />
                        <div
                            class="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:flex items-center justify-center bg-gray-800 border-gray-400 text-gray-300 text-[10px] py-1 px-2 shadow-lg select-none">
                            Playlist
                        </div>
                    </div>
                    <div class="absolute w-[450px] h-[450px] top-[-470px] right-0 bg-white"
                        :class="{ 'hidden': isPlaylistToggle === false }">
                        <div class="w-full h-96 border-gray-200 border-[1px] rounded-md">
                            <div class="flex items-center justify-between border-b-[1px]">
                                <div class="pl-4 pt-4 pb-4 text-base text-black underline">
                                    Next Up
                                </div>
                                <div @click="removeAllFromPlaylist"
                                    class="px-4 py-2 border-[1px] border-gray-400 mr-4 cursor-pointer text-[12px] text-gray-500 rounded-sm hover:border-gray-600 hover:text-orange-500 ">
                                    Clear</div>
                            </div>

                            <div class="overflow-y-auto h-[calc(100%)]">
                                <div v-for="(item, index) in playerStore.playlist" :key="item.id" draggable="true"
                                    @dragstart="onDragStart(index)" @dragover="onDragOver($event)" @drop="onDrop(index)"
                                    class="h-14 w-full mt-2 flex items-center justify-center  hover:bg-gray-200 ">
                                    <div class="w-full h-14 rounded-sm flex items-center  ">
                                        <div class="w-1/12 rotate-90 opacity-10 text-gray-700 cursor-grab">
                                            <font-awesome-icon icon="fa-solid fa-grip" />
                                        </div>
                                        <div class="ml-2 w-14 h-14 flex-shrink-0 flex justify-center items-center">
                                            <img :src="item.artwork || 'http://localhost:8080/images/other/Unknown_person.jpg'"
                                                class="aspect-square mx-auto w-full h-full object-cover" alt="">
                                        </div>
                                        <div class="text-left pl-2 w-10/12 ">
                                            <div
                                                class="w-[250px] text-ellipsis overflow-hidden whitespace-nowrap text-gray-700 text-sm">
                                                <a href="#">
                                                    {{ item.title }}
                                                </a>
                                            </div>
                                            <div class="text-gray-500 text-sm">
                                                <a href="#">
                                                    {{ item.username }}
                                                </a>
                                            </div>
                                        </div>
                                        <div class="w-1/6 flex justify-center items-center ">
                                            <div class="cursor-pointer opacity-50 text-gray-500"
                                                :class="{ 'text-orange-500': item.isLike }" @click="LikeToggle(index)">
                                                <font-awesome-icon icon="fa-solid fa-heart" />
                                            </div>
                                            <div @click="removeSongFromPlaylist(index)"
                                                class="pl-3 cursor-pointer opacity-50 text-gray-500">
                                                <font-awesome-icon icon="fa-solid fa-xmark" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

<script>
import { usePlayerStore } from '@/js/state';
export default {
    name: 'FooterPage',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        }
    },
    data() {
        return {
            isMusicPlay: false,
            isShuffleToggle: false,
            isPlaylistToggle: false,
            repeatState: 0,
            maxTime: 0,
            currentTime: 0,
            volumeState: 2,
            volumeVal: 70,
            savedVolume: 70,
            playVal: 0,
            audio: this.playerStore.currentSong.path,

        }
    },
    watch: {
        commitVolume() {
            this.playerStore.volume = this.savedVolume.value;
            if (this.playerStore.audio) {
                this.playerStore.audio.volume = this.savedVolume.value;
            }
        },
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
            this.updateVolume(validValue);
        },
    },
    mounted() {
        this.updateProgressPlay();
        this.updateVolume();
    },
    methods: {
        nextSong() {
            this.playerStore.next();
        },
        previousSong() {
            this.playerStore.previous();
        },
        formatDuration(duration) {
            const roundedSeconds = Math.round(duration);
            const min = Math.floor(duration / 60);
            const sec = roundedSeconds % 60;
            return `${min}:${sec.toString().padStart(2, "0")}`;
        },
        removeSongFromPlaylist(index) {
            this.playerStore.removeFromPlaylist(index)
        },
        removeAllFromPlaylist(){
            this.playerStore.removeAllFromPlaylist();
        },
        onDragStart(index) {
            this.dragIndex = index;
        },
        onDragOver(event) {
            event.preventDefault();
        },
        onDrop(index) {
            const draggedItem = this.items[this.dragIndex];
            //delete item in old position 
            this.items.splice(this.dragIndex, 1);
            //add to new position
            this.items.splice(index, 0, draggedItem);
            //reset dragIndex
            this.dragIndex = null;
        },
        PlayControlToggle() {
            // Kiểm tra xem có bài hát đang phát không
            if (!this.playerStore.audio) {
                console.warn('No song selected to play');
                return;
            }

            // Nếu đang phát thì pause, nếu đang pause thì play
            if (this.playerStore.isPlaying) {
                this.playerStore.pause();
            } else {
                this.playerStore.resume();
            }
        },
        nextPlaylist() {
            this.isPlaylistToggle = !this.isPlaylistToggle;
        },
        LikeToggle(index) {
            this.items[index].isLike = !this.items[index].isLike;
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
        updateVolume(value = this.volumeVal) {
            const v = Math.max(0, Math.min(value, 1));
            console.log("Volume to set:", v);

            this.playerStore.volume = v;

            if (this.playerStore.audio) {
                this.playerStore.audio.volume = v;
                console.log("Audio volume set to:", this.playerStore.audio.volume);
            } else {
                console.error("Audio object not initialized.");
            }
        },

        updateProgressPlay(value = this.playVal) {

            if (!this.playerStore.currentSong || !this.playerStore.currentSong.duration) return;

            const validValue = Math.max(0, Math.min(value, this.playerStore.currentSong.duration));

            if (this.playerStore.audio) {
                this.playerStore.audio.currentTime = validValue;
                this.playerStore.currentTime = validValue;
            }
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
        // progressPercentageVolume(){
        //     const percentage = state.vol
        // }
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
    background: linear-gradient(to right, rgb(253, 224, 71) 0%, rgb(253, 224, 71) var(--progress, 0%), #E4D2CC var(--progress, 0%), #E4D2CC 100%);
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
    background: linear-gradient(to right, rgb(255, 255, 255) 0%, rgb(255, 255, 255) var(--progressPlay, 0%), #E4D2CC var(--progressPlay, 0%), #E4D2CC 100%);
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