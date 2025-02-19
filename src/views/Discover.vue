<template>
    <Header></Header>
    <div class="w-full h-auto min-h-screen bg-[url('@/image/other/bg-home.jpg')]
    bg-no-repeat m-auto bg-cover z-0 flex justify-center items-center relative">
        <div class="text-white font-neutra m-auto z-50 text-center text-[80px] opacity-50 select-none">
            <div class="text-white font-neutra m-auto z-50 text-center text-[80px] opacity-50 select-none line-through">
                Musica
            </div>
            Let's make music more popular

        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
    name: 'DiscoverPage',

    data() {
        return {

        }
    },
    components: {
        Header,
    },
    methods: {

    }
}
</script>

<style scoped></style>