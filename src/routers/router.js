import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Upload from "@/views/Upload.vue";
import InfoSongUpload from "@/views/InfoSongUpload.vue";
import Library from "@/views/Library.vue";
import Chart from "@/views/Chart.vue";
import Followers from "@/views/Followers.vue";
import Following from "@/views/Following.vue";
import Likes from "@/views/Likes.vue";
import Tracks from "@/views/Tracks.vue";
import Profile from "@/views/Profile.vue";
import Insights from "@/views/Insights.vue";
import Achievements from "@/views/Achievements.vue";
import SearchResult from "@/views/SearchResult.vue";
import TracksInfo from "@/views/TracksInfo.vue";
import Discover from "@/views/Discover.vue";
import Message from "@/views/Message.vue";

const routes = [
    {
        path: '/home',
        name: 'HomePage',
        component: Home,
        meta: {title: 'Musica'}
    },
    {
        path: '/upload',
        name: 'UploadPage',
        component: Upload,
        meta: {title: 'Upload'},        

    },
    {
        path: '/library',
        name: 'LibraryPage',
        component: Library,
        meta: {title: 'Library'},        

    },
    {
        path: '/chart',
        name: 'ChartPage',
        component: Chart,
        meta: {title: 'Chart'},        

    },
    {
        path: '/search',
        name: 'SearchResultPage',
        component: SearchResult,
        meta: {title: 'Search'},        

    },
    {
        path: '/followers',
        name: 'FollowersPage',
        component: Followers,
        meta: {title: 'Followers'},        

    },
    {
        path: '/following',
        name: 'FollowingPage',
        component: Following,
        meta: {title: 'Following'},        

    },
    {
        path: '/insights',
        name: 'InsightsPage',
        component: Insights,
        meta: {title: 'Insights'},        

    },
    {
        path: '/likes',
        name: 'LikesPage',
        component: Likes,
        meta: {title: 'Likes'},        

    },
    {
        path: '/tracks',
        name: 'TracksPage',
        component: Tracks,
        meta: {title: 'Tracks'},        

    },
    {
        path: '/message/:id?',
        name: 'MessagePage',
        component: Message,
        meta: {title: 'Message'},     
        props: true      

    },
    {
        path: '/profile/:id',
        name: 'ProfilePage',
        component: Profile,
        meta: {title: 'Profile'},        

    },
    {
        path: '/trackinfo/:id',
        name: 'TrackInfoPage',
        component: TracksInfo,
        meta: {title: 'TrackInfoPage'},        

    },
    {
        path: '/achievements',
        name: 'AchievementsPage',
        component: Achievements,
        meta: {title: 'Achievements'},        

    },
    {
        path: '/discover',
        name: 'DiscoverPage',
        component: Discover,
        meta: {title: 'Discover'},        

    },
    {
        path: '/upload/infomation',
        name: 'InfoSongUpload',
        component: InfoSongUpload,
        meta: {title: 'Upload'},
    },
    {
        path: '/',
        redirect: '/discover'
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;