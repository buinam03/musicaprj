<template>
    <div class="w-full h-full border-[1px] rounded-md">
        <div class="w-full h-full p-4">
            <div class="w-full pb-4 border-b-[1px] flex justify-between items-center">
                <div class="font-semibold text-sm">
                    Overview
                </div>
                <div class="text-sm">
                    {{ period }}
                </div>
            </div>
            <div class="w-full h-auto mt-4">
                <div v-for="stat in stats" :key="stat.label"
                    class="text-left mb-4 font-semibold xl:text-base lg:text-sm md:text-xs">
                    <font-awesome-icon :icon="stat.icon" class="pr-2" />
                    {{ stat.label }} in {{ period }} : {{ stat.value }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    period: { type: String, default: '' },
    /** [{ icon, label, value }] */
    stats: { type: Array, default: () => [] },
});
</script>
