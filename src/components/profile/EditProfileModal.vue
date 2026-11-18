<template>
    <BaseModal :open="open" title="Edit Your Profile" size="lg" body-class="p-4 sm:p-6 space-y-4 sm:space-y-6 text-left"
        @update:open="close">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input v-model="form.username" type="text" placeholder="Enter your display name" :class="fieldClass">
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select v-model="form.province" :class="fieldClass">
                    <option value="">Select a city</option>
                    <option v-for="item in provinces" :key="item.id ?? item.name" :value="item.name">{{ item.name }}</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select v-model="form.country" :class="fieldClass">
                    <option :value="DEFAULT_COUNTRY">{{ DEFAULT_COUNTRY }}</option>
                </select>
            </div>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea v-model="form.bio" rows="4" placeholder="Tell us about yourself..." :class="[fieldClass, 'resize-none']"></textarea>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3 px-2">
                <button type="button" @click="close"
                    class="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Cancel
                </button>
                <button type="button" :disabled="saving" @click="save"
                    class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md disabled:opacity-60">
                    Save Changes
                </button>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import { userApi, getErrorMessage } from '@/api';
import BaseModal from '@/components/common/BaseModal.vue';

/** Modal sửa tên hiển thị, tỉnh/thành, quốc gia, bio. Dùng với v-model:open; emit `saved` khi lưu xong. */
const props = defineProps({
    open: { type: Boolean, default: false },
    user: { type: Object, required: true },
});

const emit = defineEmits(['update:open', 'saved']);

const DEFAULT_COUNTRY = 'Việt Nam';
const fieldClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base';

const provinces = ref([]);
const saving = ref(false);
const form = reactive({ username: '', province: '', country: DEFAULT_COUNTRY, bio: '' });

const loadProvinces = async () => {
    if (provinces.value.length > 0) return;
    try {
        provinces.value = (await userApi.getProvinces()) || [];
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
    }
};

// Mỗi lần mở: điền form từ thông tin hiện tại
watch(
    () => props.open,
    (open) => {
        if (!open) return;
        form.username = props.user.username || '';
        form.province = props.user.province || '';
        form.country = props.user.country || DEFAULT_COUNTRY;
        form.bio = props.user.bio || '';
        loadProvinces();
    },
    { immediate: true },
);

const close = () => emit('update:open', false);

const save = async () => {
    saving.value = true;
    try {
        await userApi.updateUserInfo({ ...form });
        notification.success({
            message: 'Profile Updated',
            description: 'Your profile information has been updated successfully.',
            duration: 3,
        });
        emit('saved');
        close();
    } catch (error) {
        console.error('Failed to update profile:', error);
        notification.error({
            message: 'Update Failed',
            description: getErrorMessage(error, 'Failed to update your profile. Please try again later.'),
            duration: 3,
        });
    } finally {
        saving.value = false;
    }
};
</script>
