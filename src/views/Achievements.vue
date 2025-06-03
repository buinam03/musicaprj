<template>
    <div>
        <Header></Header>
        <div class="w-container pt-16 mb-16 h-auto m-auto">
            <div class="text-left font-semibold text-2xl p-4">
                Archievements
            </div>
            <div class="mt-10 w-full h-auto pb-5 flex justify-between items-center">
                <div class="flex relative">
                    <div @click="removeArchievements(index)" v-for="(item, index) in selectArchievement" :key="index"
                        class="aspect-square mr-4 h-20 rounded-full border-[1px] bg-gray-400 flex justify-center items-center text-white cursor-pointer"
                        :class="{ 'bg-white': item }">
                        <img v-if="item" :src="item.img" alt="">
                        <span class="text-white" v-else>Empty</span>
                    </div>
                    <div v-if="alertArchievement" class="absolute inset-0 top-full left-0 text-left text-red-500">
                        {{ alertArchievementTitle }}
                    </div>
                </div>
                <div class="flex h-2/3">
                    <button @click="cancelChanges" type="button"
                        class="px-6 py-2 border-[1px] rounded-3xl mr-4">Cancel</button>
                    <button @click="saveChanges" type="button"
                        class="px-6 py-2 border-[1px] rounded-3xl mr-4 bg-orange-500 text-white">Save Changes</button>
                </div>
            </div>
            <div class="w-full h-auto flex gap-x-4 flex-wrap items-center justify-center pb-4">
                <div @click="addArchievementToDisplay(item)" v-for="(item) in archievements" :key="item.id"
                    class="basis-1/6 h-[320px] border-[1px] shadow-xl rounded-lg cursor-pointer"
                    :class="{ 'bg-slate-200 cursor-not-allowed': item.isCompleted === false }">
                    <div class="w-5/6 aspect-square  flex justify-center items-center  mx-auto mt-4 ">
                        <img :src="item.img" alt="">
                    </div>
                    <div class="p-4 font-semibold ">
                        {{ item.title }}
                    </div>
                    <div class="p-4 font-semibold text-center text-blue-500">
                        {{ item.isCompleted == true ? 'Completed' : '' }}
                    </div>
                </div>

            </div>

            <!-- <font-awesome-icon icon="fa-solid fa-plus" size="2xl"/> -->

        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import { usePlayerStore } from '@/js/state';
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
            alertArchievementTitle: '',
            alertArchievement: false,
            archievements: [
                {
                    id: 1,
                    img: require('@/image/archievements/check.png'),
                    isCompleted: true,
                    title: 'Reach 100.000 followers'
                },
                {
                    id: 2,
                    img: require('@/image/archievements/headphone.png'),
                    isCompleted: true,
                    title: 'Reach 10.000 streams'
                },
                {
                    id: 3,
                    img: require('@/image/archievements/headphone 100k.png'),
                    isCompleted: true,
                    title: 'Reach 100.000 streams'
                },
                {
                    id: 4,
                    img: require('@/image/archievements/headphone 1m.png'),
                    isCompleted: false,
                    title: 'Reach 1.000.000 streams'
                },
                {
                    id: 5,
                    img: require('@/image/archievements/headphone 10m.png'),
                    isCompleted: false,
                    title: 'Reach 10.000.000 streams'
                },
                {
                    id: 6,
                    img: require('@/image/archievements/top 1 musica.png'),
                    isCompleted: true,
                    title: 'Top 1 Musica'
                },
                {
                    id: 7,
                    img: require('@/image/archievements/top 1 musica.png'),
                    isCompleted: true,
                    title: 'Top 2 Musica'
                },
                {
                    id: 8,
                    img: require('@/image/archievements/top 1 musica.png'),
                    isCompleted: true,
                    title: 'Top 3 Musica'
                },
                {
                    id: 9,
                    img: require('@/image/archievements/fisrttimereachtop.png'),
                    isCompleted: true,
                    title: 'Reach top first time!!'
                },
            ],
        }
    },
    methods: {
        saveChanges() {
            this.$router.push({ path: `/profile/${this.playerStore.idUserLogin}` });
        },
        cancelChanges() {
            this.$router.push({ path: `/profile/${this.playerStore.idUserLogin}` });
        },
        addArchievementToDisplay(item) {

            const isAlreadySelected = this.selectArchievement.some(selected => selected && selected.id === item.id); // kiem tra xem phan tu duoc chon co trong mang chua

            if (item.isCompleted === false) {
                this.alertArchievement = true;
                this.alertArchievementTitle = 'This achievement has not been completed yet.';
                setTimeout(() => {
                    this.alertArchievement = false;
                }, 2000);
                return;
            }

            if (isAlreadySelected) {
                this.alertArchievement = true;
                this.alertArchievementTitle = 'This achievement has been selected.';
                setTimeout(() => {
                    this.alertArchievement = false;
                }, 2000);
            }
            else {
                const emptyIndex = this.selectArchievement.findIndex(selected => selected === null); //add phan tu vao mang moi
                if (emptyIndex !== -1) {
                    this.selectArchievement[emptyIndex] = item;
                } else {
                    this.alertArchievement = true
                    this.alertArchievementTitle = 'You can only select up to 4 achievements.';
                    setTimeout(() => {
                        this.alertArchievement = false
                    }, 2000);
                }
            }
        },
        removeArchievements(index) {
            this.selectArchievement[index] = null;
        }
    },
    components: {
        Header,
    },

}
</script>

<style scoped></style>