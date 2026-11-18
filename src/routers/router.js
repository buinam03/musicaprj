import { createRouter, createWebHistory } from 'vue-router';

// Lazy-load từng trang để giảm dung lượng bundle ban đầu.
const routes = [
    { path: '/', redirect: '/discover' },
    { path: '/discover', name: 'DiscoverPage', component: () => import('@/views/Discover.vue'), meta: { title: 'Discover' } },
    { path: '/home', name: 'HomePage', component: () => import('@/views/Home.vue'), meta: { title: 'Musica' } },
    { path: '/upload', name: 'UploadPage', component: () => import('@/views/Upload.vue'), meta: { title: 'Upload', requiresAuth: true } },
    {
        path: '/upload/infomation',
        name: 'InfoSongUpload',
        component: () => import('@/views/InfoSongUpload.vue'),
        meta: { title: 'Upload', requiresAuth: true },
    },
    { path: '/library', name: 'LibraryPage', component: () => import('@/views/Library.vue'), meta: { title: 'Library' } },
    { path: '/chart', name: 'ChartPage', component: () => import('@/views/Chart.vue'), meta: { title: 'Chart' } },
    { path: '/search', name: 'SearchResultPage', component: () => import('@/views/SearchResult.vue'), meta: { title: 'Search' } },
    { path: '/followers/:id', name: 'FollowersPage', component: () => import('@/views/Followers.vue'), meta: { title: 'Followers' } },
    { path: '/following/:id', name: 'FollowingPage', component: () => import('@/views/Following.vue'), meta: { title: 'Following' } },
    { path: '/insights', name: 'InsightsPage', component: () => import('@/views/Insights.vue'), meta: { title: 'Insights' } },
    { path: '/likes', name: 'LikesPage', component: () => import('@/views/Likes.vue'), meta: { title: 'Likes' } },
    { path: '/tracks', name: 'TracksPage', component: () => import('@/views/Tracks.vue'), meta: { title: 'Tracks' } },
    {
        path: '/message/:id?',
        name: 'MessagePage',
        component: () => import('@/views/Message.vue'),
        meta: { title: 'Message' },
        props: true,
    },
    { path: '/profile/:id', name: 'ProfilePage', component: () => import('@/views/Profile.vue'), meta: { title: 'Profile' } },
    { path: '/trackinfo/:id', name: 'TrackInfoPage', component: () => import('@/views/TracksInfo.vue'), meta: { title: 'Track' } },
    { path: '/achievements', name: 'AchievementsPage', component: () => import('@/views/Achievements.vue'), meta: { title: 'Achievements' } },
    { path: '/playlists', name: 'PlaylistsPage', component: () => import('@/views/Playlists.vue'), meta: { title: 'Playlists' } },
    { path: '/playlist/:id', name: 'PlaylistDetailPage', component: () => import('@/views/PlaylistDetail.vue'), meta: { title: 'Playlist Detail' } },
    {
        path: '/playlists/genre',
        name: 'GenrePlaylistsPage',
        component: () => import('@/views/GenrePlaylists.vue'),
        meta: { title: 'Playlists by Genre' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    if (to.meta.requiresAuth && !localStorage.getItem('jwt')) {
        return { name: 'DiscoverPage' };
    }
    return true;
});

router.afterEach((to) => {
    if (to.meta.title) document.title = to.meta.title;
});

export default router;
