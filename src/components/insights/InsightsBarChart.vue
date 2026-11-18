<template>
    <div class="mx-auto w-full h-[400px] xl:max-w-[1200px] lg:max-w-[1024px] md:max-w-[768px]">
        <Bar :data="chartData" :options="CHART_OPTIONS" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHART_OPTIONS = { maintainAspectRatio: false };

const props = defineProps({
    labels: { type: Array, required: true },
    values: { type: Array, required: true },
    /** Tên dataset (Plays / Likes / Comments). */
    label: { type: String, default: '' },
});

const chartData = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            label: props.label,
            data: props.values,
            backgroundColor: ['#F50'],
            borderColor: ['rgb(255, 255, 255)'],
            borderWidth: 1,
        },
    ],
}));
</script>
