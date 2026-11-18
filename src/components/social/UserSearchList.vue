<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">{{ title }}</h1>
                    <p v-if="users && users.length > 0" class="text-gray-500 text-sm sm:text-base">{{ subtitle }}</p>
                </div>

                <!-- Search -->
                <div class="relative w-full sm:w-auto sm:min-w-[300px]">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <font-awesome-icon icon="fa-solid fa-search" class="text-gray-400" />
                    </div>
                    <input :value="query" @input="emit('update:query', $event.target.value)" @keyup.enter="emit('search')"
                        type="search" :placeholder="placeholder"
                        class="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                </div>
            </div>

            <!-- Users Grid -->
            <div v-if="users && users.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                <UserListItem v-for="user in users" :key="user.id" :user="user" />
            </div>

            <!-- Empty State -->
            <div v-else class="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <font-awesome-icon :icon="emptyIcon" class="text-orange-500 text-4xl sm:text-5xl" />
                </div>
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">{{ emptyTitle }}</h3>
                <p class="text-gray-500 text-sm sm:text-base">{{ emptyMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import UserListItem from './UserListItem.vue';

/** Trang danh sách user có ô tìm kiếm (dùng cho Followers / Following). */
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    users: { type: Array, default: null },
    query: { type: String, default: '' },
    placeholder: { type: String, default: 'Search...' },
    emptyIcon: { type: String, default: 'fa-solid fa-user-group' },
    emptyTitle: { type: String, required: true },
    emptyMessage: { type: String, required: true },
});

const emit = defineEmits(['update:query', 'search']);
</script>
