<template lang="pug">
  #container
    v-dialog(v-model="setting" width="320px")
      v-card
        v-card-title Setting
        v-divider
        .pa-6
          v-row
            v-col 공기저항력
            v-col
              v-slider(v-model="airDrag" thumb-label="always" :max="10" :min="1")
          v-row
            v-col 수중저항력
            v-col
              v-slider(v-model="waterDrag" thumb-label="always" :max="30" :min="1")
        
    v-btn(fixed bottom right text small color="red" @click="setting=true")
      v-icon(color="white") mdi-settings
    #controler
      v-btn(fab small color="red" @click="play=!play").mx-1
        v-icon(color="white") {{play?'mdi-pause':'mdi-play'}}
      v-btn(fab small color="red" @click="reset").mx-1
        v-icon(color="white") mdi-stop
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