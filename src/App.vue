<template>
  <AppHeader />
  <div id="app">
    <router-view />
  </div>
  <PlaylistPanel />
  <AppFooter />
  <AddToPlaylistModal />
</template>

<script setup>
import AppHeader from '@/components/Header.vue';
import AppFooter from '@/components/Footer.vue';
import PlaylistPanel from '@/components/PlaylistPanel.vue';
import AddToPlaylistModal from '@/components/playlist/AddToPlaylistModal.vue';
import { usePlayerStore } from '@/stores/player';
import { getUserIdFromJWT } from '@/utils/jwt';

// Khôi phục trạng thái đăng nhập từ JWT khi app khởi động
const playerStore = usePlayerStore();
const userId = localStorage.getItem('jwt') ? getUserIdFromJWT() : null;
if (userId) {
  playerStore.setSession(userId);
} else {
  localStorage.removeItem('jwt');
  localStorage.removeItem('refreshToken');
  playerStore.setSession(null);
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
}
</style>
