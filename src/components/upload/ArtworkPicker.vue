<template>
    <div class="w-full max-w-md lg:max-w-none">
        <label class="block text-sm font-semibold text-gray-700 mb-3">
            Album Artwork
        </label>
        <div class="relative group">
            <div class="aspect-square w-full border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300"
                :class="previewUrl ? 'border-orange-300 shadow-lg' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50'">
                <button type="button" class="w-full h-full relative" :class="{ 'cursor-default': modelValue }"
                    @click="!modelValue && openPicker()">
                    <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" alt="Album artwork">
                    <div v-else class="flex flex-col items-center justify-center h-full gap-4 sm:gap-6 px-4">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center">
                            <font-awesome-icon icon="fa-solid fa-image" class="text-orange-500 text-2xl sm:text-3xl" />
                        </div>
                        <div class="text-center">
                            <span class="text-gray-600 font-medium text-sm sm:text-base block mb-1">
                                Add artwork
                            </span>
                            <span class="text-gray-400 text-xs sm:text-sm">
                                JPG or PNG
                            </span>
                        </div>
                    </div>

                    <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.webp" @change="handleFileChange" class="hidden">
                </button>
            </div>

            <div v-if="modelValue" class="flex justify-center gap-4 mt-4">
                <button @click="openPicker"
                    class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group"
                    title="Replace image">
                    <font-awesome-icon icon="fa-solid fa-pencil" class="text-gray-600 group-hover:text-orange-600 text-sm sm:text-base" />
                </button>
                <button @click="removeImage"
                    class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group"
                    title="Delete image">
                    <font-awesome-icon icon="fa-solid fa-trash" class="text-gray-600 group-hover:text-red-600 text-sm sm:text-base" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { notification } from 'ant-design-vue';

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/** v-model: File ảnh bìa được chọn (null nếu chưa chọn). */
const props = defineProps({
    modelValue: { type: File, default: null },
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);
const previewUrl = ref(null);

watch(
    () => props.modelValue,
    (file) => {
        if (!file) {
            previewUrl.value = null;
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            if (props.modelValue === file) previewUrl.value = event.target.result;
        };
        reader.readAsDataURL(file);
    },
    { immediate: true },
);

const openPicker = () => fileInput.value?.click();

const handleFileChange = (event) => {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
        notification.error({
            message: 'Invalid File Type',
            description: 'Please select a valid image file (JPG, PNG, or WebP).',
            duration: 4,
        });
        return;
    }

    if (file.size > MAX_SIZE) {
        notification.error({
            message: 'File Too Large',
            description: 'Image size must be less than 5MB. Please compress your image and try again.',
            duration: 4,
        });
        return;
    }

    emit('update:modelValue', file);
    notification.success({
        message: 'Image Selected',
        description: 'Artwork image has been selected successfully.',
        duration: 2,
    });
};

const removeImage = () => {
    emit('update:modelValue', null);
    notification.info({
        message: 'Image Removed',
        description: 'Artwork image has been removed.',
        duration: 2,
    });
};
</script>
