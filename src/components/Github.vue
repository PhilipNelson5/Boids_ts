<template>
  <a class="button" :href="url">
    <img src="@/assets/github.svg" />
  </a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Github extends Vue {
  @Prop() private url!: string;
}
</script>

<style scoped>
.button {
  background-color: white;
  color: black;
  border: 2px solid #00a4db;
  border-radius: 10px;
  padding: 8px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 5px;
  transition-duration: 0.2s;
  cursor: pointer;
  box-shadow: -4px 4px #999;
}
.button:hover {
  background-color: #d6f5ff;
  box-shadow: -3px 3px #777;
  color: white;
  border: 2px solid #0080aa;
}
.button:active {
  box-shadow: -2px 2px #555;
  transform: translateY(4px);
}
img {
  width: 25px;
  height: 25px;
  margin-top: 1px;
}
.inline {
  display: inline;
}
</style>