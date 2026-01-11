<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Header></Header>
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                        <span v-if="userById">{{ userById.username }}'s Following</span>
                        <span v-else>Following</span>
                    </h1>
                    <p v-if="users && users.length > 0" class="text-gray-500 text-sm sm:text-base">
                        {{ users.length }} {{ users.length === 1 ? 'person' : 'people' }}
                    </p>
                </div>

                <!-- Search -->
                <div class="relative w-full sm:w-auto sm:min-w-[300px]">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <font-awesome-icon icon="fa-solid fa-search" class="text-gray-400" />
                    </div>
                    <input v-model="usernameSearch" @keyup.enter="searchUserFollowing" type="search"
                        class="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Search following...">
                </div>
            </div>

            <!-- Users Grid -->
            <div v-if="users && users.length > 0"
                class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                <div v-for="(user, index) in users" :key="index"
                    class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div class="p-4 sm:p-6">
                        <!-- Avatar -->
                        <div class="flex justify-center mb-4">
                            <router-link :to="`/profile/${user.following.id}`" class="relative group/avatar">
                                <div
                                    class="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover/avatar:border-orange-500 transition-all duration-300">
                                    <img :src="user.following.profile_picture || defaultImage" alt="Profile picture"
                                        class="w-full h-full object-cover">
                                </div>
                                <div
                                    class="absolute inset-0 rounded-full bg-orange-500/0 group-hover/avatar:bg-orange-500/20 transition-all duration-300">
                                </div>
                            </router-link>
                        </div>

                        <!-- Username -->
                        <div class="text-center mb-4">
                            <router-link :to="`/profile/${user.following.id}`">
                                <h3
                                    class="text-base sm:text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors truncate">
                                    {{ user.following.username }}
                                </h3>
                            </router-link>
                        </div>

                        <!-- Follow Button -->
                        <button @click="followToggle(user.following.id, index)"
                            class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2"
                            :class="{
                                'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg': !user.isFollowing,
                                'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50': user.isFollowing
                            }">
                            <font-awesome-icon
                                :icon="user.isFollowing ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                            <span>{{ user.isFollowing ? 'Following' : 'Follow' }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center">
                <div
                    class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <font-awesome-icon icon="fa-solid fa-users" class="text-orange-500 text-4xl sm:text-5xl" />
                </div>
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    No Following Yet
                </h3>
                <p class="text-gray-500 text-sm sm:text-base">
                    {{ userById ? userById.username : 'This user' }} isn't following anyone yet.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
import { notification } from 'ant-design-vue';

export default {
    name: 'FollowingPage',
    data() {
        return {
            users: null,
            profileId: this.$route.params.id,
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            userById: null,
            usernameSearch: '',
        };
    },
    methods: {
        async searchUserFollowing() {
            if (!this.usernameSearch.trim()) {
                this.fetchFollowing();
                return;
            }

            try {
                const response = await apiClient.get(`http://localhost:3000/api/follow/searchFollowing`, {
                    params: { username: this.usernameSearch, id: this.profileId }
                });
                this.users = response.data.data;

                if (this.users.length > 0) {
                    // Sử dụng isFollow từ response (nested trong following object)
                    this.users = this.users.map(user => ({
                        ...user,
                        isFollowing: user.following?.isFollow || false
                    }));

                    notification.success({
                        message: 'Search Complete',
                        description: `Found ${this.users.length} result(s).`,
                        duration: 2,
                    });
                } else {
                    this.fetchFollowing();
                    this.usernameSearch = '';
                    notification.info({
                        message: 'No Results',
                        description: 'No users found. Showing all following.',
                        duration: 3,
                    });
                }
            } catch (error) {
                console.error('Error fetching username:', error);
                notification.error({
                    message: 'Search Failed',
                    description: 'Failed to search users. Please try again.',
                    duration: 4,
                });
            }
        },
        async fetchUsername() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/users/getUserById/${this.profileId}`, {
                    params: { id: this.profileId }
                });
                this.userById = response.data.data;
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        },
        async fetchFollowing() {
            try {
                // Lấy danh sách user mà profileId đang follow (API đã trả về isFollowing sẵn)
                const response = await apiClient.get(
                    'http://localhost:3000/api/follow/getAllFollowing',
                    { params: { id: this.profileId } }
                );

                const followingUsers = response.data.data || [];

                if (!followingUsers.length) {
                    this.users = [];
                    return;
                }

                // Sử dụng isFollow từ response (nested trong following object)
                this.users = followingUsers.map(user => ({
                    ...user,
                    isFollowing: user.following?.isFollow || false
                }));

            } catch (error) {
                console.error('Error fetching following:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load following list. Please refresh the page.',
                    duration: 4,
                });
            }
        },

        async followToggle(id, index) {
            try {
                const payload = {
                    following_id: id,
                };

                await apiClient.post('http://localhost:3000/api/follow/addNewFollower', payload);

                this.users[index].isFollowing = !this.users[index].isFollowing;

                notification.success({
                    message: this.users[index].isFollowing ? 'Following' : 'Unfollowed',
                    description: `You are now ${this.users[index].isFollowing ? 'following' : 'unfollowing'} ${this.users[index].following.username}.`,
                    duration: 2,
                });
            } catch (error) {
                console.error("Failed to follow:", error);
                notification.error({
                    message: 'Action Failed',
                    description: 'Failed to update follow status. Please try again.',
                    duration: 4,
                });
            }
        },
    },
    components: {
        Header,
    },
    mounted() {
        this.fetchFollowing();
        this.fetchUsername();
    }
};
</script>

<style scoped>
/* Smooth transitions */
button,
a {
    transition: all 0.2s ease;
}

/* Custom hover effects */
.group:hover .group-hover\:border-orange-500 {
    border-color: #f97316;
}
</style>