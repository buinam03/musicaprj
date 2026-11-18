<template>
    <div class="pt-16 pb-16 h-full w-full px-4 sm:px-6 lg:px-8 xl:px-4 max-w-7xl mx-auto">
        <HeroSlider :slides="slides" />

        <RecentlyPlayed />

        <LatestUploadSection :songs="latestUploads" :loading="loading.latest" />

        <!-- Artists -->
        <section class="mb-12 sm:mb-16">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">ARTISTS YOU SHOULD FOLLOW</h2>
            <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                <template v-if="loading.artists">
                    <div v-for="i in 5" :key="i" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center">
                        <div class="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[180px] lg:h-[180px] rounded-full bg-gray-200 animate-pulse mb-3 sm:mb-4"></div>
                        <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div class="h-3 w-16 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div class="h-8 w-full bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </template>
                <UserCard v-for="artist in artists" v-else :key="artist.id" :user="artist" />
            </div>
        </section>

        <!-- Playlists by genre -->
        <section class="mb-12 sm:mb-16">
            <div class="flex justify-between items-center mb-6 sm:mb-8">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">PLAYLISTS BY GENRE</h2>
                <router-link :to="{ name: 'GenrePlaylistsPage' }"
                    class="px-4 sm:px-6 py-2 text-sm sm:text-base text-orange-500 hover:text-orange-600 font-medium transition-colors flex items-center gap-2">
                    <span>View All</span>
                    <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </router-link>
            </div>

            <div v-if="loading.playlists || cmsPlaylists.length > 0"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                <template v-if="loading.playlists">
                    <div v-for="i in 5" :key="i" class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div class="aspect-square bg-gray-200 animate-pulse"></div>
                        <div class="p-3 sm:p-4">
                            <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </template>
                <PlaylistCard v-for="playlist in cmsPlaylists" v-else :key="playlist.id" :playlist="playlist" />
            </div>
            <EmptyState v-else boxed icon="fa-solid fa-music" message="Playlist not found" />
        </section>

        <!-- Random songs -->
        <section class="mb-12 sm:mb-16">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">RANDOM SONGS NOW</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <template v-if="loading.random">
                    <SongCardSkeleton v-for="i in 6" :key="i" />
                </template>
                <SongCard v-for="song in randomSongs" v-else :key="song.id" :song="song" />
            </div>
        </section>

        <!-- Recommended -->
        <section class="mb-12 sm:mb-16">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">RECOMMENDED FOR YOU</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <template v-if="loading.recommended">
                    <SongCardSkeleton v-for="i in 6" :key="i" />
                </template>
                <SongCard v-for="song in recommendedSongs" v-else :key="song.id" :song="song" play-label="Play Next" />
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { songApi, userApi, playlistApi } from '@/api';
import { usePlayerStore } from '@/stores/player';
import { useAuth, useFollow, useLike } from '@/composables';
import HeroSlider from '@/components/home/HeroSlider.vue';
import LatestUploadSection from '@/components/home/LatestUploadSection.vue';
import RecentlyPlayed from '@/components/RecentlyPlayed.vue';
import UserCard from '@/components/user/UserCard.vue';
import PlaylistCard from '@/components/playlist/PlaylistCard.vue';
import SongCard from '@/components/song/SongCard.vue';
import SongCardSkeleton from '@/components/song/SongCardSkeleton.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const ARTIST_LIMIT = 5;
const SONG_LIMIT = 6;
const PLAYLIST_LIMIT = 5;

const slides = [
    {
        image: 'http://localhost:8080/images/artwork/vo-quoc-LtJjlQZcIpk-unsplash.jpg',
        title: 'Welcome to Musica',
        description: 'Your ultimate destination for music sharing and discovery',
    },
    {
        image: 'http://localhost:8080/images/artwork/3107 artwork.jpg',
        title: 'Share Your Music',
        description: 'Upload and share your tracks with the world',
    },
    {
        image: 'http://localhost:8080/images/artwork/igor-omilaev-8yX2nItvibQ-unsplash.jpg',
        title: 'Connect with Artists',
        description: 'Follow your favorite artists and stay updated with their latest releases',
    },
];

const playerStore = usePlayerStore();
const { currentUserId } = useAuth();
const { loadLikedIds } = useLike();
const { loadFollowingIds } = useFollow();

const latestUploads = ref([]);
const artists = ref([]);
const cmsPlaylists = ref([]);
const randomSongs = ref([]);
const recommendedSongs = ref([]);

const loading = reactive({
    latest: true,
    artists: true,
    playlists: true,
    random: true,
    recommended: true,
});

/** Chạy loader, gán kết quả và tắt cờ loading tương ứng (lỗi chỉ log). */
const load = async (key, loader, target) => {
    loading[key] = true;
    try {
        target.value = await loader();
    } catch (error) {
        console.error(`Error loading ${key}:`, error);
        target.value = [];
    } finally {
        loading[key] = false;
    }
};

onMounted(() => {
    loadLikedIds();
    loadFollowingIds();

    load('artists', async () => (await userApi.getRandomUsers()).slice(0, ARTIST_LIMIT), artists);
    load('random', async () => (await songApi.getRandomSongs()).slice(0, SONG_LIMIT), randomSongs);
    load('playlists', async () => (await playlistApi.getCmsPlaylists()).slice(0, PLAYLIST_LIMIT), cmsPlaylists);
    load(
        'recommended',
        async () =>
            (await songApi.getSimilarSongs({ songId: playerStore.currentSong.id, userId: currentUserId.value })).slice(0, SONG_LIMIT),
        recommendedSongs,
    );
    load('latest', () => (currentUserId.value ? songApi.getLatestSong(currentUserId.value) : []), latestUploads);
});
</script>
