<template lang="pug">
  v-app
    v-content.app-container
      .nav-btn
        v-row
          v-btn(fab small color="white").mx-1
            v-icon(color="#003569") mdi-menu
      .nav-warp(v-if="nav" @click="nav=false")
        .nav
          .content-list-container.pa-2
            .group.py-2
              .title Geometry
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('terrain')") Terrain
            .group.py-2
              .title Lighting
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('wolf')") Wolf
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('reflection')") Reflection  
            .group.py-2
              .title Physics
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('physicsBasis')") Gravity    
              //- .item-list.pl-2
              //-   .subtitle-2.link(@click="$router.push({name: 'physicsSpring'})") Spring
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('physicsClothSystem')") Cloth System  
            .group.py-2
              .title Geometry Buffer
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('cubeGeoBuffer')") Cube
                //- .subtitle-2.link(@click="$router.push({name: 'fractal'})") Fractal Tree
                .subtitle-2.link(@click="linkPage('instancing')") Instancing   
            .group.py-2
              .title Texture
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('liquid')") Liquid
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('fire')") Fire
            .group.py-2
              .title Universe
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('space')") Stars
              .item-list.pl-2 
                .subtitle-2.link(@click="linkPage('moon')") Moon
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('rotaion')") Rotaion
              .item-list.pl-2
                .subtitle-2.link(@click="linkPage('revolution')") Revolution
      router-view
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      nav: true,
    };
  },
  methods: {
    linkPage(page: string) {
      this.nav = false;
      this.$router.push({name: page});
    },
  },
});
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .nav-btn {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 5;
  }
  .nav-warp {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0, 0.36);
    z-index: 10;
    .nav {
      width: 240px;
      height: 100vh;
      background-color: #fefefe;
    }
  }

  .link {
    &:hover {
      color: #1867c0 !important;
    }
  }

  .content-list-container {
    max-width: 480px;
  }
</style>
</style>

