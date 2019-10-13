<template lang="pug">
  #container
    #controler
      v-btn(fab small color="red" @click="play=!play").mx-1
        v-icon(color="white") {{play?'mdi-pause':'mdi-play'}}  
      //- v-btn(fab small color="red" @click="initParticle").mx-1
      //-   v-icon(color="white") mdi-stop
</template>

<script lang="ts" src="./Basis.ts">
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