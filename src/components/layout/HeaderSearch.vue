<template>
    <div :class="mobile ? 'relative' : 'px-2 xl:px-4 relative flex-1 max-w-md'">
        <input v-model="query" @keydown.enter="submit"
            class="no-clear w-full px-4 pr-10 rounded-md text-sm bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-all"
            :class="mobile ? 'h-10' : 'h-8 xl:h-10 cursor-text'"
            type="search" :name="mobile ? undefined : 'search'" :id="mobile ? undefined : 'search-input'"
            placeholder="Search...">
        <button @click="submit" type="button"
            class="absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors cursor-pointer focus:outline-none p-1"
            :class="mobile ? 'right-2' : 'right-2 xl:right-6'">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-sm" />
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
    mobile: { type: Boolean, default: false },
});

const emit = defineEmits(['search']);

const router = useRouter();
const query = ref('');

const submit = () => {
    const q = query.value.trim();
    if (!q) return;
    router.push({ path: '/search', query: { q: query.value } });
    emit('search', q);
};
</script>

<style scoped>
input.no-clear::-webkit-search-cancel-button {
    display: none;
}
</style>
