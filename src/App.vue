<template>
  <div id="app">
    <router-view></router-view>
  </div>
  <PlaylistPanel />
  <Footer />
</template>

<script>
import Footer from './components/Footer.vue';
import PlaylistPanel from './components/PlaylistPanel.vue';
  export default {
    name: 'App',
    components: {
      Footer,
      PlaylistPanel
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
