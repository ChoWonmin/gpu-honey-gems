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
              v-slider(v-model="airDrag" thumb-label="always" :max="200" :min="100" @change="reset")
            v-col g/m³
                
          v-row
            v-col 수중저항력
            v-col
              v-slider(v-model="waterDrag" thumb-label="always" :max="4000" :min="3000" @change="reset")
            v-col kg/m³  
          v-row
            v-col 질량
            v-col
              v-slider(v-model="mass" thumb-label="always" :max="600" :min="400" @change="reset")
            v-col g
          v-divider  
          v-row
            v-col 물체 반지름
            v-col
              v-slider(v-model="radius" thumb-label="always" :max="50" :min="30" @change="reset")
            v-col cm
        
    
    #controler
      v-btn(fab small color="red" @click="play=!play").mx-1
        v-icon(color="white") {{play?'mdi-pause':'mdi-play'}}
      v-btn(fab small color="red" @click="reset").mx-1
        v-icon(color="white") mdi-stop
      div(:style="{width: '40px'}")
      v-btn(fab small color="#42A5F5" @click="setting=true")
        v-icon(color="white") mdi-cog
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
    display: flex;
    right: 80px;
    bottom: 80px;
  }
}
</style>