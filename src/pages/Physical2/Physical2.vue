<script setup lang="ts">
import { ref, onMounted } from 'vue';
import World from './class/World';
import Cube from './class/Cube';
import Sphere from './class/Sphere';

const worldRef = ref();

const world = new World(worldRef);

onMounted(() => {
  world.init();
  const plane = new Cube(100, 0.1, 100, 0xffffff, 0);
  // 默认都是可以产生阴影和接受阴影的 但是这个是底板 是例外
  plane.getMesh().castShadow = false;
  const sphere1 = new Sphere(0.3, 0xff00ff, 1);
  plane.getBody().setRestitution(1);
  sphere1.getBody().setRestitution(1);
  world.add(plane);
  world.add(sphere1);
  plane.setPosition([0, -0.1, 0]);
  sphere1.setPosition([0, 3, 0]);
});

</script>

<template>
  <div class="container" ref="worldRef">

  </div>
</template>

<style scoped>
.container {
  position: relative;
}
</style>
