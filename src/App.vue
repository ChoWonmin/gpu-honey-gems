<template lang="pug">
  v-app
    //- v-app-bar(app)
    //-   v-toolbar-title.headline.text-uppercase
    //-     span Vuetify 
    //-     span.font-weight-light MATERIAL DESIGN    
    //-   v-spacer
    //-   v-btn(text href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank")
    //-     span.mr-2 Latest Release

    v-content
      router-view
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>
