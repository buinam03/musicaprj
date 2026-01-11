<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    Achievements
                </h1>
                <p class="text-gray-600 text-sm sm:text-base">
                    Showcase your achievements on your profile
                </p>
            </div>

            <!-- Selected Achievements Display -->
            <div class="mb-8 sm:mb-10 lg:mb-12">
                <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div class="flex-1 w-full">
                            <h2 class="text-lg text-left sm:text-xl font-semibold text-gray-800 mb-4">
                                Selected Achievements <span class="text-gray-500 text-sm font-normal">(max 4)</span>
                            </h2>
                            <div class="flex flex-wrap gap-3 sm:gap-4">
                                <div 
                                    v-for="(item, index) in selectArchievement" 
                                    :key="index"
                                    @click="removeArchievements(index)"
                                    class="relative group"
                                >
                                    <div 
                                        class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer"
                                        :class="item 
                                            ? 'border-orange-500 bg-white shadow-lg hover:shadow-xl hover:scale-105' 
                                            : 'border-gray-300 bg-gray-100 border-dashed hover:border-orange-300'"
                                    >
                                        <img 
                                            v-if="item" 
                                            :src="item.img" 
                                            :alt="item.title"
                                            class="w-full h-full object-contain p-2"
                                        >
                                        <div v-else class="flex flex-col items-center justify-center text-gray-400">
                                            <font-awesome-icon icon="fa-solid fa-plus" class="text-2xl sm:text-3xl mb-1" />
                                            <span class="text-xs sm:text-sm font-medium">Empty</span>
                                        </div>
                                    </div>
                                    <!-- Remove indicator -->
                                    <div 
                                        v-if="item"
                                        class="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                        title="Click to remove"
                                    >
                                        <font-awesome-icon icon="fa-solid fa-times" class="text-xs sm:text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <button 
                                @click="cancelChanges" 
                                type="button"
                                class="px-6 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all duration-200 whitespace-nowrap"
                            >
                                Cancel
                            </button>
                            <button 
                                @click="saveChanges" 
                                type="button"
                                class="px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Achievements Grid -->
            <div class="mb-6 sm:mb-8">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                    Available Achievements
                </h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    <div 
                        @click="addArchievementToDisplay(item)" 
                        v-for="(item) in archievements" 
                        :key="item.id"
                        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                        :class="{
                            'opacity-60 cursor-not-allowed hover:shadow-lg': item.isCompleted === false,
                            'ring-2 ring-orange-500 ring-offset-2': isSelected(item.id)
                        }"
                    >
                        <div class="aspect-square w-full p-4 sm:p-6 flex justify-center items-center bg-gradient-to-br from-gray-50 to-white">
                            <img 
                                :src="item.img" 
                                :alt="item.title"
                                class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                :class="{ 'grayscale opacity-50': item.isCompleted === false }"
                            >
                        </div>
                        <div class="p-3 sm:p-4">
                            <div class="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                                {{ item.title }}
                            </div>
                            <div class="flex items-center justify-between">
                                <span 
                                    class="px-2 py-1 text-xs sm:text-sm font-semibold rounded-full"
                                    :class="item.isCompleted 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-500'"
                                >
                                    {{ item.isCompleted ? 'Completed' : 'Locked' }}
                                </span>
                                <font-awesome-icon 
                                    v-if="isSelected(item.id)"
                                    icon="fa-solid fa-check" 
                                    class="text-orange-500 text-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usePlayerStore } from '@/js/state';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';
import { notification } from 'ant-design-vue';
import { saveSelectedAchievements, getSelectedAchievements } from '@/utils/achievements';

export default {
    name: 'AchievementsPage',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        }
    },
    data() {
        return {
            selectArchievement: [null, null, null, null],
        }
    },
    mounted() {
        this.loadSelectedAchievements();
    },
    computed: {
        archievements() {
            return [
                {
                    id: 1,
                    img: require('@/image/archievements/followers_100k.png'),
                    isCompleted: true,
                    title: 'Reach 100.000 followers'
                },
                {
                    id: 2,
                    img: require('@/image/archievements/plays_10k.png'),
                    isCompleted: true,
                    title: 'Reach 10.000 streams'
                },
                {
                    id: 3,
                    img: require('@/image/archievements/plays_100k.png'),
                    isCompleted: true,
                    title: 'Reach 100.000 streams'
                },
                {
                    id: 4,
                    img: require('@/image/archievements/plays_1m.png'),
                    isCompleted: false,
                    title: 'Reach 1.000.000 streams'
                },
                {
                    id: 5,
                    img: require('@/image/archievements/plays_10m.png'),
                    isCompleted: false,
                    title: 'Reach 10.000.000 streams'
                },
                {
                    id: 6,
                    img: require('@/image/archievements/top.png'),
                    isCompleted: true,
                    title: 'Top 1 Musica'
                },
                {
                    id: 7,
                    img: require('@/image/archievements/top.png'),
                    isCompleted: true,
                    title: 'Top 2 Musica'
                },
                {
                    id: 8,
                    img: require('@/image/archievements/top.png'),
                    isCompleted: true,
                    title: 'Top 3 Musica'
                },
                {
                    id: 9,
                    img: require('@/image/archievements/first_like.png'),
                    isCompleted: true,
                    title: 'Reach top first time!!'
                },
            ];
        }
    },
    methods: {
        isSelected(achievementId) {
            return this.selectArchievement.some(selected => selected && selected.id === achievementId);
        },
        saveChanges() {
            const selectedCount = this.selectArchievement.filter(item => item !== null).length;
            
            if (selectedCount === 0) {
                notification.warning({
                    message: 'No Achievements Selected',
                    description: 'Please select at least one achievement to display.',
                    duration: 3,
                });
                return;
            }

            // Save to localStorage
            saveSelectedAchievements(this.selectArchievement);

            // TODO: Save to backend API
            // const userId = getUserIdFromJWT();
            // await apiClient.put(`/users/updateAchievements/${userId}`, {
            //     achievements: this.selectArchievement.filter(item => item !== null).map(item => item.id)
            // });

            notification.success({
                message: 'Changes Saved',
                description: `Successfully saved ${selectedCount} achievement${selectedCount > 1 ? 's' : ''} to your profile.`,
                duration: 3,
            });

            const userId = getUserIdFromJWT();
            if (userId) {
                setTimeout(() => {
                    this.$router.push({ path: `/profile/${userId}` });
                }, 1000);
            }
        },
        cancelChanges() {
            const userId = getUserIdFromJWT();
            if (userId) {
                this.$router.push({ path: `/profile/${userId}` });
            }
        },
        addArchievementToDisplay(item) {
            const isAlreadySelected = this.selectArchievement.some(selected => selected && selected.id === item.id);

            if (item.isCompleted === false) {
                notification.warning({
                    message: 'Achievement Locked',
                    description: 'This achievement has not been completed yet. Complete the requirements to unlock it.',
                    duration: 4,
                });
                return;
            }

            if (isAlreadySelected) {
                notification.info({
                    message: 'Already Selected',
                    description: `"${item.title}" is already selected. Click on it in the selected area to remove it.`,
                    duration: 3,
                });
            } else {
                const emptyIndex = this.selectArchievement.findIndex(selected => selected === null);
                if (emptyIndex !== -1) {
                    this.selectArchievement[emptyIndex] = item;
                    notification.success({
                        message: 'Achievement Added',
                        description: `"${item.title}" has been added to your display.`,
                        duration: 2,
                    });
                } else {
                    notification.warning({
                        message: 'Maximum Reached',
                        description: 'You can only select up to 4 achievements. Please remove one first.',
                        duration: 3,
                    });
                }
            }
        },
        removeArchievements(index) {
            if (this.selectArchievement[index]) {
                const removedItem = this.selectArchievement[index];
                this.selectArchievement[index] = null;
                notification.info({
                    message: 'Achievement Removed',
                    description: `"${removedItem.title}" has been removed from your display.`,
                    duration: 2,
                });
            }
        },
        loadSelectedAchievements() {
            const saved = getSelectedAchievements();
            if (saved && saved.length > 0) {
                // Map saved achievements back to the selectArchievement array
                // First, we need to get full achievement data from archievements computed property
                const achievementsMap = {};
                this.archievements.forEach(ach => {
                    achievementsMap[ach.id] = ach;
                });

                // Fill selectArchievement array up to 4 items
                saved.slice(0, 4).forEach((savedAch, index) => {
                    if (achievementsMap[savedAch.id]) {
                        this.selectArchievement[index] = achievementsMap[savedAch.id];
                    }
                });
            }
        }
    },

}
</script>

<style scoped>
/* Line clamp utility */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Smooth transitions for all interactive elements */
.group {
    transition: all 0.2s ease;
}

/* Achievement card hover effects */
.group:hover {
    transform: translateY(-2px);
}

/* Locked achievement styling */
.cursor-not-allowed {
    pointer-events: auto;
    cursor: not-allowed;
}

/* Selected achievement indicator */
.ring-orange-500 {
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.5);
}

/* Image grayscale filter for locked achievements */
.grayscale {
    filter: grayscale(100%);
}

/* Smooth image transitions */
img {
    transition: transform 0.3s ease, filter 0.3s ease;
}

/* Custom focus states for accessibility */
button:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: 2px;
}

/* Responsive image sizing */
@media (max-width: 640px) {
    .group:hover {
        transform: none;
    }
}
</style>