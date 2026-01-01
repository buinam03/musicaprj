<template>
  <Header />
  <div id="app">
    <router-view></router-view>
  </div>
  <PlaylistPanel />
  <Footer />
</template>

<script>
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import PlaylistPanel from './components/PlaylistPanel.vue';
import { usePlayerStore } from '@/js/state';
import { getUserIdFromJWT } from '@/utils/getUserIdFromJWT';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    PlaylistPanel
  },
  setup() {
    const playerStore = usePlayerStore();
    
    // Khôi phục authentication state khi app khởi động
    const restoreAuthState = () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const userId = getUserIdFromJWT();
          if (userId) {
            playerStore.idUserLogin = userId;
            playerStore.isLoggedIn = true;
          } else {
            // Token không hợp lệ, xóa nó
            localStorage.removeItem('jwt');
            localStorage.removeItem('refreshToken');
            playerStore.isLoggedIn = false;
            playerStore.idUserLogin = null;
          }
        } catch (error) {
          console.error('Error restoring auth state:', error);
          localStorage.removeItem('jwt');
          localStorage.removeItem('refreshToken');
          playerStore.isLoggedIn = false;
          playerStore.idUserLogin = null;
        }
      } else {
        playerStore.isLoggedIn = false;
        playerStore.idUserLogin = null;
      }
    };
    
    // Gọi khi component được mount
    restoreAuthState();
    
    return {
      playerStore
    };
  }
};
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
