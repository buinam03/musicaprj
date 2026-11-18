<template>
    <section class="mt-8 sm:mt-12">
        <h2 class="text-2xl sm:text-3xl text-left font-bold text-gray-900 mb-4 sm:mb-6">{{ title }}</h2>

        <div v-if="items.length > 0" :class="pageSize ? 'space-y-2 sm:space-y-3' : 'space-y-3 sm:space-y-4'">
            <div v-for="(item, index) in visibleItems" :key="item.id ?? index" class="track-item">
                <slot :item="item" />
            </div>
        </div>
        <EmptyState v-else boxed :icon="emptyIcon" :message="emptyMessage" />

        <!-- Phân trang -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center gap-2">
            <button type="button" :disabled="page === 1" @click="page = Math.max(1, page - 1)"
                class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <font-awesome-icon icon="fa-solid fa-angles-left" />
            </button>
            <button v-for="n in visiblePages" :key="n" type="button" @click="page = n"
                class="px-4 py-2 rounded-lg border transition-all min-w-[40px]"
                :class="page === n ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 hover:bg-gray-100'">
                {{ n }}
            </button>
            <button type="button" :disabled="page === totalPages" @click="page = Math.min(totalPages, page + 1)"
                class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <font-awesome-icon icon="fa-solid fa-angles-right" />
            </button>
        </div>
    </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import EmptyState from '@/components/common/EmptyState.vue';

/**
 * Một mục danh sách bài hát trên profile: tiêu đề, danh sách (slot #default="{ item }"),
 * trạng thái rỗng và phân trang tuỳ chọn (pageSize > 0).
 */
const props = defineProps({
    title: { type: String, required: true },
    items: { type: Array, default: () => [] },
    pageSize: { type: Number, default: 0 }, // 0 = không phân trang
    emptyIcon: { type: String, default: 'fa-solid fa-music' },
    emptyMessage: { type: String, required: true },
});

const PAGE_BUTTONS = 3;

const page = ref(1);

const totalPages = computed(() => (props.pageSize ? Math.ceil(props.items.length / props.pageSize) : 1));

const visibleItems = computed(() => {
    if (!props.pageSize) return props.items;
    const start = (page.value - 1) * props.pageSize;
    return props.items.slice(start, start + props.pageSize);
});

/** Tối đa PAGE_BUTTONS số trang quanh trang hiện tại. */
const visiblePages = computed(() => {
    const half = Math.floor(PAGE_BUTTONS / 2);
    let start = Math.max(1, page.value - half);
    let end = Math.min(totalPages.value, page.value + half);
    if (end - start + 1 < PAGE_BUTTONS) {
        if (start === 1) end = Math.min(totalPages.value, start + PAGE_BUTTONS - 1);
        else if (end === totalPages.value) start = Math.max(1, end - PAGE_BUTTONS + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// Danh sách ngắn lại (vd. vừa xoá bài) thì lùi về trang cuối còn dữ liệu
watch(totalPages, (total) => {
    if (page.value > total) page.value = Math.max(1, total);
});
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.track-item {
    animation: fadeInUp 0.3s ease-out both;
}

.track-item:nth-child(1) { animation-delay: 0.05s; }
.track-item:nth-child(2) { animation-delay: 0.1s; }
.track-item:nth-child(3) { animation-delay: 0.15s; }
.track-item:nth-child(4) { animation-delay: 0.2s; }
.track-item:nth-child(5) { animation-delay: 0.25s; }
</style>
