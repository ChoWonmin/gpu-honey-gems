<template lang="pug">
  v-app
    v-content.app-container
      .nav-warp
        .nav
      router-view
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      drawer: null,
    };
  },
});
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .nav-warp {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0, 0.36);
    .nav {
      width: 240px;
      height: 100vh;
      background-color: #fefefe;
    }
  }
</style>
</style>

