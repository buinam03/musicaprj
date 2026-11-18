<template>
    <div class="w-container pt-16 mb-16 h-auto m-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
        <div class="p-4 font-semibold text-2xl text-left">Insights</div>
        <div class="w-full h-auto flex justify-between items-center mb-10">
            <div class="text-semibold text-2xl p-4">
                Overview
            </div>
            <div class="w-auto h-auto">
                <select v-model="periodIndex"
                    class="p-3 outline-none border-[1px] border-gray-500 rounded-md xl:p-3 lg:p-2 md:p-1">
                    <option v-for="(period, index) in PERIOD_OPTIONS" :key="period" :value="index"
                        class="xl:text-base lg:text-sm md:text-xs">{{ period }}
                    </option>
                </select>
            </div>
        </div>
        <div class="text-sm font-extralight text-gray-500 text-left p-4">
            You have {{ total }} {{ metric.title.toLowerCase() }} in {{ period.toLowerCase() }}
            !!
        </div>
        <div class="w-full h-auto flex items-center justify-around">
            <div v-for="(item, index) in METRICS" :key="item.title" @click="metricIndex = index"
                class="h-auto w-auto px-4 py-2 rounded-3xl border-[1px] flex justify-center items-center cursor-pointer text-sm text-gray-600"
                :class="{ 'bg-orange-500 text-white': metricIndex === index }">
                <font-awesome-icon :icon="item.icon" class="mr-2" />
                {{ item.title }}
            </div>
        </div>

        <InsightsBarChart :labels="dayLabels" :values="MOCK_DAILY_VALUES" :label="metric.title" />

        <div class="mt-4 grid grid-cols-2 gap-4 w-full h-[400px] mb-16 p-4">
            <InsightsTrackList :tracks="MOCK_TRACKS" :period="period" />
            <InsightsOverviewCard :period="period" :stats="overviewStats" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import InsightsBarChart from '@/components/insights/InsightsBarChart.vue';
import InsightsTrackList from '@/components/insights/InsightsTrackList.vue';
import InsightsOverviewCard from '@/components/insights/InsightsOverviewCard.vue';
import {
    METRICS,
    MOCK_DAILY_VALUES,
    MOCK_TRACKS,
    PERIOD_OPTIONS,
    getRecentDayLabels,
} from '@/components/insights/mockData';

const dayLabels = getRecentDayLabels(MOCK_DAILY_VALUES.length);

const periodIndex = ref(1); // "Last 7 days"
const metricIndex = ref(0); // "Plays"

const period = computed(() => PERIOD_OPTIONS[periodIndex.value]);
const metric = computed(() => METRICS[metricIndex.value]);
const total = MOCK_DAILY_VALUES.reduce((sum, value) => sum + value, 0);

// Dữ liệu mẫu: cả 3 chỉ số đang dùng chung một tổng.
const overviewStats = METRICS.map((item) => ({ icon: item.icon, label: item.title, value: total }));
</script>
