<template>
    <BaseModal :open="open" title="Edit Playlist" @update:open="emit('update:open', $event)">
        <form class="space-y-4" @submit.prevent="submit">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Playlist Name</label>
                <input ref="inputRef" v-model="name" type="text" placeholder="Enter playlist name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base">
            </div>
            <div class="flex justify-end gap-3">
                <button type="button" @click="emit('update:open', false)"
                    class="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Cancel
                </button>
                <button type="submit" :disabled="loading"
                    class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md disabled:opacity-60">
                    Save Changes
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import BaseModal from '@/components/common/BaseModal.vue';

/** Modal đổi tên playlist. Emit 'submit' với tên đã trim. */
const props = defineProps({
    open: { type: Boolean, default: false },
    initialName: { type: String, default: '' },
    loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:open', 'submit']);

const name = ref('');
const inputRef = ref(null);

watch(
    () => props.open,
    async (isOpen) => {
        if (!isOpen) return;
        name.value = props.initialName;
        await nextTick();
        inputRef.value?.focus();
    },
);

const submit = () => {
    const trimmed = name.value.trim();
    if (!trimmed) {
        notification.warning({ message: 'Validation Error', description: 'Please enter a playlist name.', duration: 3 });
        return;
    }
    emit('submit', trimmed);
};
</script>
