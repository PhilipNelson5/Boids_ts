<template>
  <div id="app">
    <Github class="right" url="https://github.com/PhilipNelson5/Boids_ts" />
    <Boids />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Boids from "@/components/Boids.vue";
import Github from "@/components/Github.vue";

@Component({
  components: {
    Github,
    Boids
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.right {
  float: right;
}
</style>
