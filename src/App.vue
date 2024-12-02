<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div class="navigate">
      <RouterLink to="/chrismas-card">圣诞贺卡</RouterLink>
      <RouterLink to="/car-view">汽车展示与选配</RouterLink>
    </div>
    <div class="view">
      <RouterView></RouterView>
    </div>
    
  </div>
</template>

<style scoped>
.navigate {
  display: flex;
  flex-direction: column;
}
</style>
