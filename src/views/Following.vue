<template>
    <div>
        <Header></Header>

        <div class="pt-16 w-container mx-auto h-auto mb-16 xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">

            <div class="flex justify-between items-center h-auto w-full">
                <div class="text-left font-semibold p-4 text-2xl">
                    Đen is Following

                </div>

                <input class="no-clear border-[1px] w-80 p-4 h-10 rounded-[4px] cursor-text text-sm " type="search" name="search" id=""
                        placeholder="Search" >
            </div>
            <div class="grid grid-cols-5 gap-4 mb-4 w-full xl:w-container  xl:grid-cols-5 xl:gap-4 lg:w-[960px] lg:grid-cols-4 lg:gap-2 md:grid-cols-3 md:gap-1">
                <div v-for="(user, index) in users" :key="index" class=" h-[300px] p-4 bg-white shadow-lg rounded-2xl">
                    <div class="w-[180px] aspect-square mx-auto xl:w-[180px] lg:w-[150px] md:w-[120px]">
                        <img :src="user.image" alt="Profile picture"
                            class="rounded-full mr-4 object-cover w-full h-full">
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold xl:text-lg lg:text-[14px] md:text-[12px]">{{ user.name }}</h2>

                        <div @click="followToggle(index)"
                            class="w-[120px] max-w-[120px] h-auto rounded-3xl border-[1px] mx-auto cursor-pointer my-4 p-2 text-sm xl:text-sm lg:text-[12px] md:text-[10px] "
                            :class="user.isFollow ? 'border-orange-500 text-orange-500' : 'border-gray-500 text-gray-500'">
                            <font-awesome-icon
                                :icon="user.isFollow ? 'fa-solid fa-user-check' : 'fa-solid fa-user-plus'" />
                            {{ user.isFollow ? 'Following' : 'Follow' }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 pb-4">
                <div
                    class="w-[200px] h-auto px-4 py-2 rounded-3xl border-[1px] mx-auto hover:border-orange-500 hover:text-white hover:bg-orange-500 cursor-pointer xl:text-lg lg:text-[14px] md:text-[12px]">
                    Load More
                </div>
            </div>
        </div>

        <Footer></Footer>
    </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default {
    name: 'FollowingPage',
    data() {
        return {
            users: [
                { name: 'Woanh', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'House Music With...', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Deep House Sessions', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Rogue Self', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'TONAL EXTRA', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'PROFANE', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'TONAL', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'TAIGA', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Pumped Deep', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Doxed', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'Kudzuro', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
                { name: 'PuffCorn', image: require('@/image/user-logo/buitruonglinh.jpg'), isFollow: true },
            ],
        };
    },
    methods: {
        followToggle(index) {
            this.users[index].isFollow = !this.users[index].isFollow;
        },
    },
    components: {
        Header,
        Footer
    }
};
</script>

<style scoped>
.grid {
    padding-top: 20px;
}
</style>