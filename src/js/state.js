import { reactive } from "vue";

export const state = reactive({
    isPlaying: false,
    currentPlayIndex: null,
    isLoggedIn: false,
    isTemplate: false,
});