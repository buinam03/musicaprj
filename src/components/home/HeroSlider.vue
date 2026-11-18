<template>
    <div class="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] mb-8 sm:mb-12 overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
        <div v-for="(slide, index) in slides" :key="slide.title"
            class="absolute w-full h-full transition-all duration-700"
            :class="currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'">
            <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div class="absolute bottom-12 sm:bottom-20 md:bottom-[120px] lg:bottom-[160px] left-0 right-0 p-4 sm:p-6 md:p-8">
                <h2 class="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 drop-shadow-lg">{{ slide.title }}</h2>
                <p class="text-white text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto drop-shadow-lg">{{ slide.description }}</p>
            </div>
        </div>

        <button @click="prev" aria-label="Previous slide"
            class="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 md:p-4 rounded-full hover:bg-white/30 transition-all duration-300 z-10">
            <font-awesome-icon icon="fa-solid fa-chevron-left" size="lg" />
        </button>
        <button @click="next" aria-label="Next slide"
            class="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 md:p-4 rounded-full hover:bg-white/30 transition-all duration-300 z-10">
            <font-awesome-icon icon="fa-solid fa-chevron-right" size="lg" />
        </button>

        <div class="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
            <button v-for="(slide, index) in slides" :key="slide.title" @click="currentSlide = index"
                :aria-label="`Go to slide ${index + 1}`"
                class="w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300"
                :class="currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'">
            </button>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

/** Banner tự chuyển slide. */
const props = defineProps({
    slides: { type: Array, required: true }, // [{ image, title, description }]
    interval: { type: Number, default: 4000 },
});

const currentSlide = ref(0);
let timer = null;

const next = () => {
    currentSlide.value = (currentSlide.value + 1) % props.slides.length;
};
const prev = () => {
    currentSlide.value = (currentSlide.value - 1 + props.slides.length) % props.slides.length;
};

onMounted(() => {
    timer = setInterval(next, props.interval);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
