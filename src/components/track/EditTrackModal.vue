<template>
    <Teleport to="body">
        <div v-if="open && song"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            @click.self="close">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 class="text-xl sm:text-2xl font-bold text-white">Edit Track</h2>
                    <button type="button" @click="close"
                        class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center justify-center">
                        <font-awesome-icon icon="fa-solid fa-times" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 sm:p-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        <!-- Left: Artwork -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Artwork</label>
                            <div class="relative group">
                                <div class="aspect-square w-full border-2 border-dashed rounded-xl overflow-hidden transition-all"
                                    :class="artworkPreview ? 'border-orange-300 shadow-lg' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50'">
                                    <button type="button" class="w-full h-full relative" @click="fileInput?.click()">
                                        <img v-if="artworkPreview" :src="artworkPreview" class="w-full h-full aspect-square object-cover" alt="artwork">
                                        <div v-else class="flex flex-col items-center justify-center h-full gap-4 px-4">
                                            <div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                                                <font-awesome-icon icon="fa-solid fa-image" class="text-orange-500 text-2xl" />
                                            </div>
                                            <span class="text-gray-600 font-medium text-sm sm:text-base">Add artwork</span>
                                            <span class="text-gray-400 text-xs">JPG or PNG</span>
                                        </div>
                                        <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.webp" class="hidden" @change="onArtworkChange">
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Form Fields -->
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input v-model="form.title" type="text" placeholder="Enter track title"
                                    class="w-full h-12 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Genre</label>
                                <select v-model="form.genreId"
                                    class="w-full h-12 px-4 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white">
                                    <option value="">Select a genre</option>
                                    <option v-for="item in genres" :key="item.id" :value="item.id">{{ item.name }}</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea v-model="form.bio" rows="4" placeholder="Enter track description..."
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-3">Track Privacy</label>
                                <div class="flex gap-6">
                                    <label v-for="option in privacyOptions" :key="option.value" class="flex items-center cursor-pointer group">
                                        <input v-model="form.privacy" :value="option.value" type="radio" name="track-privacy"
                                            class="w-5 h-5 text-orange-500 focus:ring-orange-500 cursor-pointer">
                                        <span class="ml-3 text-sm sm:text-base font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                                            <font-awesome-icon :icon="option.icon" class="mr-2" />
                                            {{ option.label }}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl border-t border-gray-200">
                    <button v-if="deletable" type="button" @click="onDelete"
                        class="px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                        <span>Delete Track</span>
                    </button>
                    <div class="flex gap-3">
                        <button type="button" @click="close"
                            class="px-6 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-semibold text-gray-700 transition-all">
                            Cancel
                        </button>
                        <button type="button" :disabled="saving" @click="save"
                            class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import { songApi, cloudinaryApi, getErrorMessage } from '@/api';
import { useGenres } from '@/composables';
import { confirmDeleteTrack } from './trackActions';

/**
 * Modal sửa bài hát (artwork, title, genre, description, privacy).
 * Tự tải bài hát theo songId khi mở. Dùng với v-model:open.
 */
const props = defineProps({
    open: { type: Boolean, default: false },
    songId: { type: [Number, String], default: null },
    deletable: { type: Boolean, default: false }, // hiện nút "Delete Track"
});

const emit = defineEmits(['update:open', 'saved', 'deleted']);

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const privacyOptions = [
    { value: '1', label: 'Public', icon: 'fa-solid fa-globe' },
    { value: '0', label: 'Private', icon: 'fa-solid fa-lock' },
];

const { genres, loadGenres, findGenre } = useGenres();

const fileInput = ref(null);
const song = ref(null);
const artworkPreview = ref(null);
const artworkFile = ref(null);
const saving = ref(false);
const form = reactive({ title: '', genreId: '', bio: '', privacy: '1' });

const close = () => emit('update:open', false);

const loadSong = async (id) => {
    song.value = null;
    artworkFile.value = null;
    try {
        const [data] = await Promise.all([songApi.getSongById(id), loadGenres()]);
        if (id !== props.songId) return; // đã chuyển sang bài khác
        const detail = data.SongDetail || {};
        song.value = data;
        artworkPreview.value = data.artwork;
        form.title = data.title || '';
        form.genreId = (findGenre(detail.genre_id) || findGenre(detail.genre))?.id ?? '';
        form.bio = detail.bio || '';
        form.privacy = Number(data.is_public) ? '1' : '0';
    } catch (error) {
        console.error('Error loading track:', error);
        notification.error({ message: 'Error', description: 'Failed to load track information.', duration: 4 });
        close();
    }
};

watch(
    () => [props.open, props.songId],
    ([open, id]) => {
        if (open && id) loadSong(id);
    },
    { immediate: true },
);

const onArtworkChange = (event) => {
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
        notification.error({ message: 'File Too Large', description: 'Image size must be less than 5MB.', duration: 4 });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        artworkPreview.value = e.target.result;
        artworkFile.value = file;
    };
    reader.readAsDataURL(file);
    notification.success({ message: 'Image Selected', description: 'Artwork image has been selected.', duration: 2 });
};

const save = async () => {
    const title = form.title.trim();
    if (!title) {
        notification.warning({ message: 'Validation Error', description: 'Please enter a track title.', duration: 3 });
        return;
    }
    const genre = genres.value.find((g) => g.id === form.genreId);
    if (!genre) {
        notification.warning({ message: 'Validation Error', description: 'Please select a genre.', duration: 3 });
        return;
    }

    saving.value = true;
    try {
        let artwork = song.value.artwork;
        if (artworkFile.value) {
            notification.info({ message: 'Uploading Artwork', description: 'Please wait...', duration: 2 });
            artwork = await cloudinaryApi.uploadImage(artworkFile.value);
        }

        await songApi.updateSong(props.songId, {
            artwork,
            title,
            genre: genre.name,
            bio: form.bio.trim() || null,
            privacy: Number(form.privacy),
        });

        notification.success({
            message: 'Track Updated',
            description: 'Your track has been updated successfully.',
            duration: 3,
        });
        artworkFile.value = null;
        emit('saved', props.songId);
        close();
    } catch (error) {
        console.error('Error updating track:', error);
        notification.error({
            message: 'Update Failed',
            description: getErrorMessage(error, 'Failed to update track. Please try again later.'),
            duration: 4,
        });
    } finally {
        saving.value = false;
    }
};

const onDelete = async () => {
    const id = props.songId;
    if (await confirmDeleteTrack(id)) {
        emit('deleted', id);
        close();
    }
};
</script>

<style scoped>
/* Custom radio button */
input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    outline: none;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
}

input[type="radio"]:checked {
    border-color: #f97316;
    background-color: #ffffff;
}

input[type="radio"]:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #f97316;
}

select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}

img {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover;
    width: auto;
    height: auto;
}
</style>
