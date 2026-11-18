<template>
    <div class="bg-gray-50 min-h-screen">
        <div v-if="user" class="pt-14 sm:pt-16 pb-8 sm:pb-16 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ProfileHeader :user="user" :is-owner="isOwner" :follower-count="followerCount" :following-count="followingCount"
                :following-pictures="followingPictures" :achievements="achievements"
                @edit-profile="isEditProfileOpen = true" @edit-avatar="isAvatarModalOpen = true"
                @edit-header="isHeaderModalOpen = true" @follow-change="onFollowChange" />

            <ProfileTrackSection title="Latest Upload" :items="latestSongs"
                :empty-message="`${user.username} hasn't uploaded any songs yet.`">
                <template #default="{ item }">
                    <ProfileTrackRow :song="item" variant="featured" :can-edit="isOwner" @edit="openEditTrack" />
                </template>
            </ProfileTrackSection>

            <ProfileTrackSection title="Most-Listened Track" :items="mostListenedSongs" empty-icon="fa-solid fa-chart-line"
                empty-message="No tracks have been played yet.">
                <template #default="{ item }">
                    <ProfileTrackRow :song="item" variant="featured" :can-edit="isOwner" @edit="openEditTrack" />
                </template>
            </ProfileTrackSection>

            <ProfileTrackSection :title="`All Tracks by ${user.username}`" :items="visibleSongs"
                :page-size="PAGE_SIZE" :empty-message="`${user.username} hasn't uploaded any tracks yet.`">
                <template #default="{ item }">
                    <ProfileTrackRow :song="item" :can-edit="isOwner" show-like @edit="openEditTrack" />
                </template>
            </ProfileTrackSection>

            <ProfileTrackSection :title="`Likes by ${user.username}`" :items="visibleLikes"
                :page-size="PAGE_SIZE" empty-icon="fa-solid fa-heart" :empty-message="`${user.username} hasn't liked any tracks yet.`">
                <template #default="{ item }">
                    <ProfileTrackRow :song="item.Song" />
                </template>
            </ProfileTrackSection>
        </div>

        <template v-if="user && isOwner">
            <EditProfileModal v-model:open="isEditProfileOpen" :user="user" @saved="onProfileSaved" />
            <ProfileImageModal v-model:open="isAvatarModalOpen" kind="avatar" :current-url="user.profile_picture || ''"
                @updated="(url) => patchUser({ profile_picture: url })" />
            <ProfileImageModal v-model:open="isHeaderModalOpen" kind="header" :current-url="user.header_picture || ''"
                @updated="(url) => patchUser({ header_picture: url })" />
            <EditTrackModal v-model:open="isEditTrackOpen" :song-id="editingSongId" deletable
                @saved="reloadTracks" @deleted="reloadTracks" />
        </template>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { songApi, userApi, likeApi, followApi } from '@/api';
import { useAuth, useFollow, useLike } from '@/composables';
import { getSelectedAchievements } from '@/utils/achievements';
import { DEFAULT_AVATAR } from '@/config';
import ProfileHeader from '@/components/profile/ProfileHeader.vue';
import ProfileTrackSection from '@/components/profile/ProfileTrackSection.vue';
import ProfileTrackRow from '@/components/profile/ProfileTrackRow.vue';
import EditProfileModal from '@/components/profile/EditProfileModal.vue';
import ProfileImageModal from '@/components/profile/ProfileImageModal.vue';
import EditTrackModal from '@/components/track/EditTrackModal.vue';

const PAGE_SIZE = 5;
const FOLLOWING_PREVIEW = 4;

const route = useRoute();
const { isCurrentUser } = useAuth();
const { loadLikedIds } = useLike();
const { loadFollowingIds } = useFollow();

// Chỉ đọc param khi đang ở trang profile (trang khác cũng có param `id`)
const profileId = computed(() => (route.name === 'ProfilePage' ? route.params.id : null));
const isOwner = computed(() => isCurrentUser(profileId.value));

const user = ref(null);
const songs = ref([]);
const latestSongs = ref([]);
const mostListenedSongs = ref([]);
const likes = ref([]);
const followerCount = ref(0);
const followingCount = ref(0);
const followingPictures = ref([]);

// Thành tích lưu ở localStorage của trình duyệt -> chỉ hiển thị trên profile của chính mình
const storedAchievements = getSelectedAchievements();
const achievements = computed(() => (isOwner.value ? storedAchievements : []));

const isEditProfileOpen = ref(false);
const isAvatarModalOpen = ref(false);
const isHeaderModalOpen = ref(false);
const isEditTrackOpen = ref(false);
const editingSongId = ref(null);

// Người khác chỉ thấy bài public
const visibleSongs = computed(() => (isOwner.value ? songs.value : songs.value.filter((song) => Number(song.is_public) === 1)));
const visibleLikes = computed(() =>
    likes.value.filter((like) => like.Song && (isOwner.value || Number(like.Song.is_public) === 1)),
);

/** Gọi API, lỗi thì trả về fallback (server trả 404 khi danh sách rỗng). */
const request = async (promise, fallback, label) => {
    try {
        return (await promise) ?? fallback;
    } catch (error) {
        if (error.response?.status !== 404) console.error(`Error loading ${label}:`, error);
        return fallback;
    }
};

/** Chỉ gán kết quả nếu người dùng vẫn đang xem profile `id`. */
const assignIfCurrent = (id, apply) => {
    if (String(id) === String(profileId.value)) apply();
};

const loadUser = async (id) => {
    const data = await request(userApi.getUserById(id), null, 'user');
    assignIfCurrent(id, () => (user.value = data));
};

const loadTracks = async (id) => {
    const [all, latest, most] = await Promise.all([
        request(songApi.getSongsByUploader(id), [], 'songs'),
        request(songApi.getLatestSong(id), [], 'latest song'),
        request(songApi.getMostListenedSong(id), [], 'most listened song'),
    ]);
    assignIfCurrent(id, () => {
        songs.value = all;
        latestSongs.value = latest;
        mostListenedSongs.value = most;
    });
};

const loadLikes = async (id) => {
    const data = await request(likeApi.getLikedSongs(id), [], 'liked songs');
    assignIfCurrent(id, () => (likes.value = data));
};

const loadFollowStats = async (id) => {
    const [followers, following, followingList] = await Promise.all([
        request(followApi.countFollowers(id), 0, 'follower count'),
        request(followApi.countFollowing(id), 0, 'following count'),
        request(followApi.getFollowing(id), [], 'following'),
    ]);
    assignIfCurrent(id, () => {
        followerCount.value = Number(followers) || 0;
        followingCount.value = Number(following) || 0;
        followingPictures.value = followingList
            .slice(0, FOLLOWING_PREVIEW)
            .map((item) => item.following?.profile_picture || DEFAULT_AVATAR);
    });
};

const reloadTracks = () => loadTracks(profileId.value);

const loadProfile = (id) => {
    // Sang profile khác: xoá dữ liệu cũ để không hiển thị lẫn
    if (user.value && String(user.value.id) !== String(id)) {
        user.value = null;
        songs.value = [];
        latestSongs.value = [];
        mostListenedSongs.value = [];
        likes.value = [];
        followerCount.value = 0;
        followingCount.value = 0;
        followingPictures.value = [];
    }
    loadUser(id);
    loadTracks(id);
    loadLikes(id);
    loadFollowStats(id);
};

// Tải lại khi chuyển từ profile này sang profile khác
watch(profileId, (id) => id && loadProfile(id), { immediate: true });

onMounted(() => {
    loadLikedIds();
    loadFollowingIds();
});

const patchUser = (changes) => {
    user.value = { ...user.value, ...changes };
};

const onProfileSaved = () => {
    loadUser(profileId.value);
    reloadTracks(); // tên hiển thị trên các bài hát cũng đổi
};

const onFollowChange = (followed) => {
    followerCount.value = Math.max(0, followerCount.value + (followed ? 1 : -1));
};

const openEditTrack = (songId) => {
    editingSongId.value = songId;
    isEditTrackOpen.value = true;
};
</script>
