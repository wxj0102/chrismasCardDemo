<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="container">
    <div class="navigate">
      <div class="router-item">
        <RouterLink to="/chrismas-card">圣诞贺卡</RouterLink>
      </div>
      <div class="router-item">
        <RouterLink to="/car-view">汽车展示与选配</RouterLink>
      </div>
      <div class="router-item">
        <RouterLink to="/house-view">3d看房</RouterLink>
      </div>
      <div class="router-item">
        <RouterLink to="/physical">物理引擎(功能不全的物理引擎)</RouterLink>
      </div>
      <div class="router-item">
        <RouterLink to="/physical2">ammo物理引擎</RouterLink>
      </div>
      <div class="router-item">
        <RouterLink to="/physical3">ammo 大量的小方块掉落</RouterLink>
      </div>
      <div class="router-item">
        <RouterLink to="/physical4">ammo 根据gltf创建刚体</RouterLink>
      </div>
    </div>
    <div class="view">
      <RouterView></RouterView>
    </div>

  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.navigate {
  display: flex;
}
.router-item {
  background-color: blue;
  margin: 5px;
  padding: 3px;
  border-radius: 4px;
}
.router-item>a {
  color: #fff;
  text-decoration: none ;
}
.view {
  flex: 1;
}
</style>
