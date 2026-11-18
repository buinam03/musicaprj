<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div class="pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    Achievements
                </h1>
                <p class="text-gray-600 text-sm sm:text-base">
                    Showcase your achievements on your profile
                </p>
            </div>

            <div class="mb-8 sm:mb-10 lg:mb-12">
                <SelectedAchievements :slots="selected" @remove="removeAchievement" @cancel="cancelChanges" @save="saveChanges" />
            </div>

            <div class="mb-6 sm:mb-8">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                    Available Achievements
                </h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    <AchievementCard v-for="item in ACHIEVEMENTS" :key="item.id"
                        :achievement="item" :selected="isSelected(item.id)"
                        @click="addAchievement(item)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { useAuth, useNavigation } from '@/composables';
import { getSelectedAchievements, saveSelectedAchievements } from '@/utils/achievements';
import { ACHIEVEMENTS, MAX_SELECTED } from '@/components/achievements/achievementCatalog';
import SelectedAchievements from '@/components/achievements/SelectedAchievements.vue';
import AchievementCard from '@/components/achievements/AchievementCard.vue';

const { currentUserId } = useAuth();
const { goToProfile } = useNavigation();

const selected = ref(Array(MAX_SELECTED).fill(null));

const isSelected = (id) => selected.value.some((item) => item?.id === id);

const addAchievement = (item) => {
    if (!item.isCompleted) {
        notification.warning({
            message: 'Achievement Locked',
            description: 'This achievement has not been completed yet. Complete the requirements to unlock it.',
            duration: 4,
        });
        return;
    }

    if (isSelected(item.id)) {
        notification.info({
            message: 'Already Selected',
            description: `"${item.title}" is already selected. Click on it in the selected area to remove it.`,
            duration: 3,
        });
        return;
    }

    const emptyIndex = selected.value.indexOf(null);
    if (emptyIndex === -1) {
        notification.warning({
            message: 'Maximum Reached',
            description: `You can only select up to ${MAX_SELECTED} achievements. Please remove one first.`,
            duration: 3,
        });
        return;
    }

    selected.value[emptyIndex] = item;
    notification.success({
        message: 'Achievement Added',
        description: `"${item.title}" has been added to your display.`,
        duration: 2,
    });
};

const removeAchievement = (index) => {
    const removed = selected.value[index];
    if (!removed) return;
    selected.value[index] = null;
    notification.info({
        message: 'Achievement Removed',
        description: `"${removed.title}" has been removed from your display.`,
        duration: 2,
    });
};

const saveChanges = () => {
    const count = selected.value.filter(Boolean).length;
    if (count === 0) {
        notification.warning({
            message: 'No Achievements Selected',
            description: 'Please select at least one achievement to display.',
            duration: 3,
        });
        return;
    }

    // Lựa chọn chỉ được lưu ở localStorage (server chưa có API cho achievements).
    saveSelectedAchievements(selected.value);

    notification.success({
        message: 'Changes Saved',
        description: `Successfully saved ${count} achievement${count > 1 ? 's' : ''} to your profile.`,
        duration: 3,
    });

    if (currentUserId.value) {
        setTimeout(() => goToProfile(currentUserId.value), 1000);
    }
};

const cancelChanges = () => goToProfile(currentUserId.value);

/** Ghép lựa chọn đã lưu với danh sách thành tích (lấy ảnh/trạng thái mới nhất). */
const loadSelected = () => {
    getSelectedAchievements()
        .slice(0, MAX_SELECTED)
        .forEach((saved, index) => {
            const achievement = ACHIEVEMENTS.find((item) => item.id === saved.id);
            if (achievement) selected.value[index] = achievement;
        });
};

onMounted(loadSelected);
</script>
