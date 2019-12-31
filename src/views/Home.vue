<template lang="pug">
  v-content.pa-4
    .display-1 GPU-Honey-Gems
    .content-list-container.pa-2
      .group.py-2
        .title Geometry
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'terrain'})") Terrain
      .group.py-2
        .title Lighting
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'wolf'})") Wolf
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'reflection'})") Reflection  
      .group.py-2
        .title Physics
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'physicsBasis'})") Basis    
        //- .item-list.pl-2
        //-   .subtitle-2.link(@click="$router.push({name: 'physicsSpring'})") Spring
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'physicsClothSystem'})") Cloth System  
      .group.py-2
        .title Geometry Buffer
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'cubeGeoBuffer'})") Cube
          //- .subtitle-2.link(@click="$router.push({name: 'fractal'})") Fractal Tree
          .subtitle-2.link(@click="$router.push({name: 'instancing'})") Instancing   
      .group.py-2
        .title Texture
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'liquid'})") Liquid
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'fire'})") Fire  
      .group.py-2
        .title Animation
        .item-list.pl-2
          .subtitle-2.link(@click="$router.push({name: 'space'})") Stars
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.link {
  &:hover {
    color: #1867c0 !important;
  }
}
</style>

