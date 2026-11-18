<template>
    <div class="min-h-screen bg-gray-50">
        <div v-if="track" class="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <TrackHero :track="track" :artist="artist" :genre-name="genreName(track.SongDetail?.genre)" :liked="isLiked(track.id)"
                @like="onLike" />

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
                <TrackComments :song-id="track.id" :current-user="currentUser" />

                <!-- Right Column: Artist Info & Overview -->
                <div class="space-y-6">
                    <TrackArtistCard :artist="artist" :follower-count="followerCount" @follow-change="onFollowChange" />

                    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">Overview</h2>
                        <div v-if="track.SongDetail?.bio" class="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">{{ track.SongDetail.bio }}</div>
                        <div v-else class="text-sm text-gray-400 italic">No description available.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { notification } from 'ant-design-vue';
import { followApi, songApi, userApi } from '@/api';
import { useAuth, useFollow, useGenres, useLike } from '@/composables';
import TrackHero from '@/components/trackinfo/TrackHero.vue';
import TrackComments from '@/components/trackinfo/TrackComments.vue';
import TrackArtistCard from '@/components/trackinfo/TrackArtistCard.vue';

const route = useRoute();
const { isLoggedIn } = useAuth();
const { loadLikedIds, isLiked, toggleLike } = useLike();
const { loadFollowingIds } = useFollow();
const { loadGenres, genreName } = useGenres();

const track = ref(null);
const artist = ref(null);
const followerCount = ref(0);
const currentUser = ref(null);

const loadArtist = async (uploaderId) => {
    try {
        artist.value = await userApi.getUserById(uploaderId);
        followerCount.value = Number(await followApi.countFollowers(artist.value.id)) || 0;
    } catch (error) {
        console.error('Error fetching artist:', error);
    }
};

const loadTrack = async (id) => {
    track.value = null;
    artist.value = null;
    followerCount.value = 0;
    try {
        const song = await songApi.getSongById(id);
        if (String(id) !== String(route.params.id)) return; // đã chuyển sang bài khác
        track.value = song;
        document.title = `${song.title} - Musica`;
        if (song.uploader_id) loadArtist(song.uploader_id);
    } catch (error) {
        console.error('Error fetching track:', error);
    }
};

const loadCurrentUser = async () => {
    if (!isLoggedIn.value) return;
    try {
        currentUser.value = await userApi.getCurrentUser();
    } catch (error) {
        console.error('Error fetching current user:', error);
    }
};

watch(
    () => route.params.id,
    (id) => {
        if (id && route.name === 'TrackInfoPage') loadTrack(id);
    },
    { immediate: true },
);

onMounted(() => {
    loadLikedIds();
    loadFollowingIds();
    loadGenres();
    loadCurrentUser();
});

const onLike = async () => {
    const song = track.value;
    const liked = await toggleLike(song, { notify: false });
    if (liked === null) return;

    if (song.SongDetail) {
        song.SongDetail.likes = Math.max(0, (song.SongDetail.likes || 0) + (liked ? 1 : -1));
    }
    notification.success({
        message: liked ? 'Liked' : 'Unliked',
        description: liked ? `Added "${song.title}" to your likes.` : `Removed "${song.title}" from your likes.`,
        duration: 2,
    });
};

const onFollowChange = (followed) => {
    followerCount.value = Math.max(0, followerCount.value + (followed ? 1 : -1));
};
</script>
