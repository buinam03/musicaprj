<template>
    <BaseModal :open="open" :size="isAvatar ? 'md' : 'xl'" :layer="60" body-class="p-6 relative" @update:open="close">
        <button type="button" @click="close"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-20">
            <font-awesome-icon icon="fa-solid fa-times" />
        </button>
        <h2 class="text-xl font-semibold mb-4 text-gray-900 pr-8 text-left">
            {{ isAvatar ? 'Change Profile Picture' : 'Change Header Picture' }}
        </h2>

        <div v-if="isAvatar" class="relative flex justify-center items-center mb-6">
            <div class="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer hover:border-orange-400 transition-colors">
                <img :src="preview || currentUrl || DEFAULT_AVATAR" alt="Preview" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <input type="file" accept=".jpg,.png" class="absolute inset-0 opacity-0 cursor-pointer z-10" @change="onFileChange" />
        </div>
        <div v-else
            class="relative flex justify-center items-center mb-6 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all">
            <img :src="preview || currentUrl || DEFAULT_HEADER" alt="Preview" class="w-full h-64 sm:h-80 object-cover" loading="lazy" />
            <input type="file" accept=".jpg,.png" class="absolute inset-0 opacity-0 cursor-pointer z-10" @change="onFileChange" />
        </div>

        <div class="flex justify-end gap-3">
            <button type="button" class="px-6 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium" @click="close">
                Cancel
            </button>
            <button type="button" :disabled="saving" @click="save"
                class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md disabled:opacity-60">
                Save
            </button>
        </div>
    </BaseModal>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { cloudinaryApi, userApi } from '@/api';
import { DEFAULT_AVATAR } from '@/config';
import BaseModal from '@/components/common/BaseModal.vue';
import { DEFAULT_HEADER } from './constants';

/**
 * Modal đổi avatar (kind="avatar") hoặc ảnh bìa (kind="header").
 * Upload lên Cloudinary rồi lưu URL; emit `updated(url)` khi xong. Dùng với v-model:open.
 */
const props = defineProps({
    open: { type: Boolean, default: false },
    kind: { type: String, default: 'avatar' }, // avatar | header
    currentUrl: { type: String, default: '' },
});

const emit = defineEmits(['update:open', 'updated']);

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const isAvatar = computed(() => props.kind === 'avatar');
const label = computed(() => (isAvatar.value ? 'profile picture' : 'header picture'));

const file = ref(null);
const preview = ref(null);
const saving = ref(false);

const resetSelection = () => {
    if (preview.value) URL.revokeObjectURL(preview.value);
    preview.value = null;
    file.value = null;
};

const close = () => {
    resetSelection();
    emit('update:open', false);
};

const onFileChange = (event) => {
    const selected = event.target.files[0];
    event.target.value = null;
    if (!selected) return;

    if (!VALID_TYPES.includes(selected.type)) {
        notification.error({ message: 'Invalid File Type', description: 'Please select a JPG or PNG image file.', duration: 3 });
        return;
    }
    if (selected.size > MAX_SIZE) {
        notification.error({ message: 'File Too Large', description: 'Please select an image smaller than 5MB.', duration: 3 });
        return;
    }

    resetSelection();
    file.value = selected;
    preview.value = URL.createObjectURL(selected);
    notification.info({
        message: 'Image Selected',
        description: `Click "Save" to update your ${label.value}.`,
        duration: 2,
    });
};

const save = async () => {
    if (!file.value) {
        notification.warning({ message: 'No Image Selected', description: 'Please select an image before saving.', duration: 3 });
        return;
    }

    saving.value = true;
    try {
        const url = await cloudinaryApi.uploadImage(file.value);
        if (isAvatar.value) await userApi.updateProfilePicture(url);
        else await userApi.updateHeaderPicture(url);

        emit('updated', url);
        close();
        notification.success({
            message: 'Success',
            description: `Your ${label.value} has been updated successfully.`,
            duration: 3,
        });
    } catch (error) {
        console.error(`Error updating ${label.value}:`, error);
        notification.error({
            message: 'Upload Failed',
            description: `Failed to update ${label.value}. Please try again later.`,
            duration: 3,
        });
    } finally {
        saving.value = false;
    }
};

onBeforeUnmount(resetSelection);
</script>
