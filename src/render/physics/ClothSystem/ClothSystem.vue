<template lang="pug">
  #container
    v-dialog(v-model="setting" width="320px")
      v-card
        v-card-title Setting
        v-divider
        .pa-6
        
    //- v-btn(fixed bottom right text small color="red" @click="setting=true")
    //-   v-icon(color="white") mdi-settings
    #controler
      v-btn(fab small color="red" @click="play=!play").mx-1
        v-icon(color="white") {{play?'mdi-pause':'mdi-play'}}
</template>

<script lang="ts" src="./ClothSystem.ts">
</script>

<style lang="scss" scoped>
#container {
  position: relative;
  width: 100%;
  height: 100%;
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  #controler {
    position: absolute;
    width: 200px;
    height: 60px;
    top: calc(100% - 60px);
    // background-color: rosybrown;
  }
}
</style>