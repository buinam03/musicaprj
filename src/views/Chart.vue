<template>
    <div>
        <Header></Header>
        <div class="w-full min-h-screen mx-auto text-color">
            <div class="w-full pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <!-- Header Section -->
                <div class="mb-8 sm:mb-12">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                        <div class="text-left">
                            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                                #musicachart
                            </h1>
                            <p class="text-gray-400 text-sm sm:text-base">Top trending songs</p>
                        </div>
                        <div class="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-full border border-orange-500/30">
                            <span class="text-white font-semibold text-sm sm:text-base">Top 10 This Week</span>
                        </div>
                    </div>
                </div>

                <!-- Chart List -->
                <div class="space-y-2 sm:space-y-3">
                    <div v-for="(item, index) in songs" :key="index"
                        class="group relative w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-orange-500/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.01]">
                        <!-- Rank Number -->
                        <div class="flex-shrink-0 w-8 sm:w-12 flex items-center justify-center">
                            <div class="text-lg sm:text-2xl lg:text-3xl font-bold"
                                :class="{
                                    'text-yellow-400': index === 0,
                                    'text-gray-300': index === 1,
                                    'text-orange-400': index === 2,
                                    'text-gray-400': index > 2
                                }">
                                {{ index + 1 }}
                            </div>
                        </div>

                        <!-- Artwork -->
                        <div class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative group-hover:scale-105 transition-transform duration-300">
                            <img class="rounded-lg w-full h-full object-cover shadow-md" 
                                :src="item.artwork || defaultImage" 
                                :alt="item.title">
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity duration-300">
                                <font-awesome-icon icon="fa-solid fa-play" class="text-white text-lg" />
                            </div>
                        </div>

                        <!-- Song Info -->
                        <div class="flex-grow min-w-0 flex items-center justify-between gap-3 sm:gap-4">
                            <div class="flex-grow min-w-0">
                                <div @click.stop="goToTrack(item.id)" 
                                    class="text-base sm:text-lg font-semibold text-white mb-1 truncate hover:text-orange-400 transition-colors cursor-pointer">
                                    {{ item.title }}
                                </div>
                                <div class="flex items-center gap-2">
                                    <div @click.stop="gotoProfile(item.User?.id)"
                                        class="text-xs sm:text-sm text-gray-400 hover:text-orange-400 hover:underline transition-colors cursor-pointer truncate">
                                        {{ item.User?.username || 'Unknown Artist' }}
                                    </div>
                                </div>
                            </div>

                            <!-- Play Count -->
                            <div class="flex-shrink-0 flex items-center gap-2 text-gray-400 text-xs sm:text-sm px-3 py-1.5 bg-white/5 rounded-full">
                                <font-awesome-icon icon="fa-solid fa-play" class="text-orange-400" />
                                <span class="font-medium">{{ formatNumber(item.SongDetail?.plays || 0) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="!songs || songs.length === 0" 
                    class="flex flex-col items-center justify-center py-16 sm:py-20">
                    <font-awesome-icon icon="fa-solid fa-music" class="text-gray-600 text-6xl mb-4" />
                    <p class="text-gray-400 text-lg sm:text-xl">No charts available yet</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
export default {
    name: 'ChartPage',
    data() {
        return {
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            songs: [],
            artists: [
                { name: 'Đen Vâu', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Mỹ Tâm', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Sơn Tùng M-TP', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'JustaTee', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Binz', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Hoàng Thùy Linh', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Min', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Vũ.', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Erik', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Phương Ly', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Bích Phương', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
                { name: 'Trúc Nhân', followers: Math.floor(Math.random() * 1000000), image: require('@/image/user-logo/denvau.jpg') },
            ],
        }
    },
    methods: {
        goToTrack(id) {
            this.$router.push({ name: 'TrackInfoPage', params: { id } });
        },
        async getSongTop10(){
            try {
                const res = await apiClient.get('/song/getSongByDescPlays');
                this.songs = res.data.data || [];
            } catch (error) {
                console.error("Lỗi:", error.response?.data);
            }
        },
        gotoProfile(id) {
            if (id) {
                this.$router.push({ name: 'ProfilePage', params: { id } });
            }
        },
        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        },
    },
    mounted() {
        this.getSongTop10();
    },
    components: {
        Header,
    },
}
</script>

<style scoped>
.text-color {
    background: #222021;
    min-height: 100vh;
}

/* Smooth transitions */
* {
    transition: all 0.2s ease;
}

/* Custom scrollbar */
.space-y-2::-webkit-scrollbar,
.space-y-3::-webkit-scrollbar {
    width: 6px;
}

.space-y-2::-webkit-scrollbar-track,
.space-y-3::-webkit-scrollbar-track {
    background: transparent;
}

.space-y-2::-webkit-scrollbar-thumb,
.space-y-3::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.space-y-2::-webkit-scrollbar-thumb:hover,
.space-y-3::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

/* Animation for chart items */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.space-y-2 > div,
.space-y-3 > div {
    animation: fadeInUp 0.4s ease-out;
    animation-fill-mode: both;
}

.space-y-2 > div:nth-child(1) { animation-delay: 0.05s; }
.space-y-2 > div:nth-child(2) { animation-delay: 0.1s; }
.space-y-2 > div:nth-child(3) { animation-delay: 0.15s; }
.space-y-2 > div:nth-child(4) { animation-delay: 0.2s; }
.space-y-2 > div:nth-child(5) { animation-delay: 0.25s; }
.space-y-2 > div:nth-child(6) { animation-delay: 0.3s; }
.space-y-2 > div:nth-child(7) { animation-delay: 0.35s; }
.space-y-2 > div:nth-child(8) { animation-delay: 0.4s; }
.space-y-2 > div:nth-child(9) { animation-delay: 0.45s; }
.space-y-2 > div:nth-child(10) { animation-delay: 0.5s; }

/* Hover glow effect */
.group:hover {
    box-shadow: 0 10px 25px rgba(249, 115, 22, 0.2);
}

/* Top 3 special styling */
.space-y-2 > div:nth-child(1),
.space-y-3 > div:nth-child(1) {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
    border-color: rgba(251, 191, 36, 0.3);
}

.space-y-2 > div:nth-child(2),
.space-y-3 > div:nth-child(2) {
    background: linear-gradient(135deg, rgba(209, 213, 219, 0.1) 0%, rgba(156, 163, 175, 0.1) 100%);
    border-color: rgba(209, 213, 219, 0.3);
}

.space-y-2 > div:nth-child(3),
.space-y-3 > div:nth-child(3) {
    background: linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
    border-color: rgba(251, 146, 60, 0.3);
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .space-y-2 > div,
    .space-y-3 > div {
        padding: 0.75rem;
    }
}
</style>