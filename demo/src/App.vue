<script setup lang="ts">
import { ref } from "vue";
import demo from "../../demo.html?raw";
const html = ref(demo);
</script>

<template>
  <div v-html="html"></div>
</template>

<style>
.shiki {
  padding: 24px;
  border-radius: 8px;
}

.shiki span[style*="#000001"] {
  display: none;
}
</style>
