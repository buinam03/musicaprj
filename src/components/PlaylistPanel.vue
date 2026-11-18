<template>
    <div v-if="playerStore.isPlaylistPanelVisible"
        class="fixed bottom-16 right-40 w-[450px] h-[450px] border-gray-200 border-[1px] rounded-md z-50 bg-white">
        <div class="flex items-center justify-between border-b-[1px]">
            <div class="pl-4 pt-4 pb-4 text-base text-black underline">
                Next Up
            </div>
            <div class="flex items-center">
                <div @click="playerStore.toggleShuffle()"
                    class="px-4 py-2 border-[1px] border-gray-400 mr-2 cursor-pointer text-[12px] text-gray-500 rounded-sm hover:border-gray-600"
                    :class="{ 'text-orange-500 border-orange-500': playerStore.isShuffle }">
                    <font-awesome-icon icon="fa-solid fa-shuffle" />
                </div>
                <div @click="playerStore.removeAllFromPlaylist()"
                    class="px-4 py-2 border-[1px] border-gray-400 mr-4 cursor-pointer text-[12px] text-gray-500 rounded-sm hover:border-gray-600 hover:text-orange-500">
                    Clear
                </div>
            </div>
        </div>

        <div class="overflow-y-auto h-[calc(100%-56px)] z-0">
            <div v-for="(item, index) in playerStore.playlist" :key="item.id" draggable="true"
                @dragstart="dragIndex = index" @dragover.prevent @drop="onDrop(index)"
                class="h-14 w-full mt-2 flex items-center justify-center hover:bg-gray-200"
                :class="{ 'bg-gray-100': playerStore.currentPlayIndex === index }">
                <div class="w-full h-14 rounded-sm flex items-center cursor-pointer">
                    <div class="w-1/12 rotate-90 opacity-10 text-gray-700 cursor-grab">
                        <font-awesome-icon icon="fa-solid fa-grip" />
                    </div>
                    <div class="ml-2 w-14 h-14 flex-shrink-0 flex justify-center items-center">
                        <img :src="item.artwork || DEFAULT_ARTWORK" class="aspect-square mx-auto w-full h-full object-cover"
                            alt="">
                    </div>
                    <div @click="playerStore.play(item)" class="text-left pl-2 w-10/12">
                        <div class="w-[250px] text-ellipsis overflow-hidden whitespace-nowrap text-gray-700 text-sm">
                            {{ item.title }}
                        </div>
                        <div class="text-gray-500 text-sm">
                            {{ item.username }}
                        </div>
                    </div>
                    <div class="w-1/6 flex justify-center items-center">
                        <div class="cursor-pointer opacity-50" :class="{ 'text-orange-500': isLiked(item.id) }"
                            @click="toggleLike(item.id, { notify: false })">
                            <font-awesome-icon icon="fa-solid fa-heart" />
                        </div>
                        <div @click="playerStore.removeFromPlaylist(index)"
                            class="pl-3 cursor-pointer opacity-50 text-gray-500">
                            <font-awesome-icon icon="fa-solid fa-xmark" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useLike } from '@/composables';
import { DEFAULT_ARTWORK } from '@/config';

const playerStore = usePlayerStore();
const { loadLikedIds, isLiked, toggleLike } = useLike();

const dragIndex = ref(null);

/** Kéo-thả để sắp xếp lại hàng đợi, giữ currentPlayIndex trỏ đúng bài đang phát. */
const onDrop = (index) => {
    const from = dragIndex.value;
    dragIndex.value = null;
    if (from === null || from === index) return;

    const [dragged] = playerStore.playlist.splice(from, 1);
    playerStore.playlist.splice(index, 0, dragged);

    const current = playerStore.currentPlayIndex;
    if (current === from) {
        playerStore.currentPlayIndex = index;
    } else if (current > from && current <= index) {
        playerStore.currentPlayIndex = current - 1;
    } else if (current < from && current >= index) {
        playerStore.currentPlayIndex = current + 1;
    }
};

onMounted(() => loadLikedIds());
</script>
