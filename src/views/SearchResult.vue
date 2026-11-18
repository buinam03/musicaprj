<template>
    <div class="min-h-screen bg-gray-50">
        <div class="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Search Header -->
            <div class="mb-6 sm:mb-8">
                <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Search results for "<span class="text-orange-500">{{ searchQuery }}</span>"
                </h1>
                <div v-if="loaded" class="text-sm sm:text-base text-gray-500">
                    Found {{ pluralize(users.length, 'user') }} and {{ pluralize(songs.length, 'track') }}
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-6 mb-6">
                <!-- Search Options Sidebar -->
                <div class="w-full sm:w-48 lg:w-56 flex-shrink-0">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-3">
                        <ul class="flex flex-row sm:flex-col gap-1 sm:gap-2">
                            <li v-for="option in SEARCH_OPTIONS" :key="option.key" @click="selectedTab = option.key"
                                class="flex items-center cursor-pointer px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
                                :class="selectedTab === option.key
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'">
                                <font-awesome-icon :icon="option.icon" class="mr-2 sm:mr-3 text-xs sm:text-sm" />
                                <span class="font-medium">{{ option.label }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex-1 w-full">
                    <SearchSection v-if="selectedTab !== 'track'" title="Users" :empty="users.length === 0"
                        :see-all-label="selectedTab === 'all' ? 'All Users' : ''"
                        :empty-message="selectedTab === 'user' ? 'No users found' : ''" empty-icon="fa-solid fa-user-group"
                        @see-all="selectedTab = 'user'">
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
                            <SearchUserCard v-for="user in visibleUsers" :key="user.id" :user="user" />
                        </div>
                    </SearchSection>

                    <SearchSection v-if="selectedTab !== 'user'" title="Tracks" :empty="songs.length === 0"
                        :see-all-label="selectedTab === 'all' ? 'All Tracks' : ''"
                        :empty-message="selectedTab === 'track' ? 'No tracks found' : ''" empty-icon="fa-solid fa-music"
                        @see-all="selectedTab = 'track'">
                        <div class="space-y-2 sm:space-y-3">
                            <SearchSongRow v-for="song in songs" :key="song.id" :song="song" />
                        </div>
                    </SearchSection>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { followApi, songApi } from '@/api';
import { useFollow, useLike } from '@/composables';
import { pluralize } from '@/utils/format';
import SearchSection from '@/components/search/SearchSection.vue';
import SearchUserCard from '@/components/search/SearchUserCard.vue';
import SearchSongRow from '@/components/search/SearchSongRow.vue';

const SEARCH_OPTIONS = [
    { key: 'all', label: 'All', icon: 'fa-solid fa-magnifying-glass' },
    { key: 'track', label: 'Track', icon: 'fa-solid fa-compact-disc' },
    { key: 'user', label: 'User', icon: 'fa-solid fa-user' },
];
const USERS_PREVIEW_LIMIT = 5; // số user hiển thị ở tab "All"

const route = useRoute();
const { loadLikedIds } = useLike();
const { loadFollowingIds } = useFollow();

const selectedTab = ref('all');
const songs = ref([]);
const users = ref([]);
const loaded = ref(false);

const searchQuery = computed(() => route.query.q || '');
const visibleUsers = computed(() => (selectedTab.value === 'all' ? users.value.slice(0, USERS_PREVIEW_LIMIT) : users.value));

/** Bổ sung followerCount nếu API search chưa trả về. */
const withFollowerCount = (user) => {
    if (user.followerCount != null) return Promise.resolve(user);
    return followApi
        .countFollowers(user.id)
        .catch(() => 0)
        .then((count) => ({ ...user, followerCount: Number(count) || 0 }));
};

const fetchSearchResult = async (query) => {
    loaded.value = false;
    songs.value = [];
    users.value = [];
    if (!query) return;

    try {
        const result = await songApi.searchSongs(query);
        const usersWithCount = await Promise.all((result?.users || []).map(withFollowerCount));
        if (query !== searchQuery.value) return; // query đã đổi trong lúc chờ
        songs.value = result?.songs || [];
        users.value = usersWithCount;
        loaded.value = true;
    } catch (error) {
        console.error('Error fetching search result:', error);
    }
};

watch(
    searchQuery,
    (query) => {
        if (route.name !== 'SearchResultPage') return;
        if (query) document.title = `Search result for: ${query}`;
        fetchSearchResult(query);
    },
    { immediate: true },
);

onMounted(() => {
    loadLikedIds();
    loadFollowingIds();
});
</script>
