<template>
    <div class="w-full h-full border-[1px] rounded-md">
        <div class="w-full h-full p-4">
            <div class="w-full pb-4 border-b-[1px] flex justify-between items-center">
                <div class="font-semibold text-sm">
                    Tracks
                </div>
                <div class="text-sm">
                    {{ period }}
                </div>
            </div>
            <div class="w-full h-72 mt-4 overflow-y-auto">
                <div v-for="track in tracks" :key="track.id" class="h-20 w-full hover:bg-gray-200 cursor-pointer">
                    <div class="h-20 w-auto flex justify-start items-center">
                        <div class="aspect-square w-auto h-4/5 xl:h-4/5 lg:h-3/5 md:h-3/5">
                            <img class="object-cover w-full h-full rounded-sm" :src="track.image" alt="">
                        </div>
                        <div class="pl-4 text-left w-full">
                            <div class="font-semibold text-gray-700 text-base whitespace-nowrap xl:text-base lg:text-sm md:text-xs">
                                {{ track.name }}
                            </div>
                            <div class="text-xs text-gray-500 whitespace-nowrap xl:text-base lg:text-sm md:text-xs">
                                <font-awesome-icon icon="fa-solid fa-play" />
                                {{ track.plays }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    tracks: { type: Array, default: () => [] },
    period: { type: String, default: '' },
});
</script>
