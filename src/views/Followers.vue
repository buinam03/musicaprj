<template>
    <div>
        <Header></Header>

        <div class="pt-16 notification-container fixed top-0 right-0 mt-2 mr-4" v-if="Message">
            <div class="notification bg-orange-500 text-white px-4 py-2 rounded-sm shadow-lg font-extralight">
                {{ Message }}
            </div>
        </div>
        <div
            class="pt-16 w-container mx-auto h-auto mb-16 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">

            <div class="flex justify-between items-center h-auto w-full">
                <div v-if="userById" class="text-left font-semibold p-4 text-2xl">
                    Follower of {{ userById.username }}
                </div>
                <div v-else class="text-left font-semibold p-4 text-2xl">
                    Followers
                </div>

                <input @keyup.enter="searchUserFollowers" v-model="usernameSearch"
                    class="no-clear border-[1px] w-80 p-4 h-10 rounded-[4px] cursor-text text-sm " type="search"
                    name="search" id="" placeholder="Search">
            </div>
            <div v-if="users && users.length > 0"
                class="grid grid-cols-5 gap-4 mb-4 w-full xl:w-container  xl:grid-cols-5 xl:gap-4 lg:w-[960px] lg:grid-cols-4 lg:gap-2 md:grid-cols-3 md:gap-1">
                <div v-for="(user, index) in users" :key="index" class=" h-[300px] p-4 bg-white shadow-lg rounded-2xl">
                    <div class="w-[180px] aspect-square mx-auto xl:w-[180px] lg:w-[150px] md:w-[120px]">
                        <img :src="user.follower.profile_picture || defaultImage" alt="Profile picture"
                            class="rounded-full mr-4 object-cover w-full h-full">
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold xl:text-lg lg:text-[14px] md:text-[12px]">{{
                            user.follower.username }}</h2>

                        <div @click="followToggle(user.follower.id, index)"
                            class="w-[120px] max-w-[120px] flex items-center justify-center h-auto rounded-3xl border-[1px] mx-auto cursor-pointer my-4 p-2 text-sm xl:text-sm lg:text-[12px] md:text-[10px] "
                            :class="{
                                'bg-orange-500 text-white hover:border-white': !user.isFollowed,
                                'bg-white border-orange-500 text-orange-500 hover:border-orange-500 ': user.isFollowed
                            }">
                            <div v-if="!user.isFollowed" class="pr-1">
                                <font-awesome-icon icon="fa-solid fa-user-plus" />
                            </div>
                            <div v-if="user.isFollowed" class="pr-1 text-orange-500">
                                <font-awesome-icon icon="fa-solid fa-user-check" />
                            </div>
                            {{ user.isFollowed ? 'Following' : 'Follow' }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="h-[160px] w-full flex justify-center items-center py-8">
                <div class="text-[20px] text-gray-500">{{ userById ? userById.username : 'User' }} doesn't have any followers yet.</div>
            </div>
        </div>
    </div>


</template>

<script>
import Header from '@/components/Header.vue';
import apiClient from '@/apiService/apiClient';
import { usePlayerStore } from '@/js/state';

export default {
    name: 'FollowersPage',
    setup() {
        const playerStore = usePlayerStore();
        return {
            playerStore,
        };
    },
    data() {
        return {
            users: null,
            profileId: this.$route.params.id,
            userById: null,
            defaultImage: 'http://localhost:8080/images/other/Unknown_person.jpg',
            usernameSearch: '',
            Message: '',
        };
    },
    methods: {
        async searchUserFollowers() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/follow/searchFollowers`, { params: { username: this.usernameSearch, id: this.profileId } });
                this.users = response.data.data;
                if (this.users.length > 0) {
                    const followers = response.data.data;

                    // Tạo mảng các promise để check follow status cho từng user
                    const followStatusPromises = followers.map(user =>
                        apiClient.get('http://localhost:3000/api/follow/getFollowStatus', {
                            params: {
                                follower_id: this.profileId,
                                following_id: user.follower.id
                            }
                        })
                    );

                    // Đợi tất cả các request hoàn thành
                    const followStatusResults = await Promise.all(followStatusPromises);

                    // Kết hợp dữ liệu user với trạng thái follow
                    this.users = followers.map((user, index) => ({
                        ...user,
                        isFollowed: followStatusResults[index].data.data.isFollowing
                    }));
                }
                else {
                    this.fetchFollowers();
                    this.usernameSearch = '';
                    this.Message = 'No user found';
                    setTimeout(() => {
                        this.Message = '';
                    }, 1500);
                }

                console.log('userById', this.users);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        },
        async fetchFollowers() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/follow/getAllFollower`, { params: { ids: this.profileId } });
                this.users = response.data.data;
                const followers = response.data.data;

                // Tạo mảng các promise để check follow status cho từng user
                const followStatusPromises = followers.map(user =>
                    apiClient.get('http://localhost:3000/api/follow/getFollowStatus', {
                        params: {
                            follower_id: this.profileId,
                            following_id: user.follower.id
                        }
                    })
                );

                // Đợi tất cả các request hoàn thành
                const followStatusResults = await Promise.all(followStatusPromises);

                // Kết hợp dữ liệu user với trạng thái follow
                this.users = followers.map((user, index) => ({
                    ...user,
                    isFollowed: followStatusResults[index].data.data.isFollowing
                }));

                console.log('users with follow status:', this.users);
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        },
        async fetchUsername() {
            try {
                const response = await apiClient.get(`http://localhost:3000/api/users/getUserById/${this.profileId}`, { params: { id: this.profileId } });
                this.userById = response.data.data;
                console.log('userById', this.userById);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        },
        async followToggle(id, index) {
            try {
                const payload = {
                    following_id: id,
                }
                await apiClient.post('http://localhost:3000/api/follow/addNewFollower', payload);
                console.log('Success', payload);
                this.users[index].isFollowed = !this.users[index].isFollowed;
            } catch (error) {
                console.error("Failed to follow:", error);
            }
        },
    },
    components: {
        Header,
    },
    mounted() {
        this.fetchFollowers();
        this.fetchUsername();
    }
};
</script>

<style scoped>
.grid {
    padding-top: 20px;
}
</style>