<script setup lang="ts">
import { ref, onMounted } from 'vue';
import World from './class/World';
import Cube from './class/Cube';
import CubeGroup from './class/CubeGroup';

const worldRef = ref();

const world = new World(worldRef);

onMounted(() => {
  world.init();
  const cubeGroup = new CubeGroup();
  const plane = new Cube(100, 0.1, 100, 0xffffff, 0);
  // 默认都是可以产生阴影和接受阴影的 但是这个是底板 是例外
  plane.getMesh().castShadow = false;
  plane.getBody().setRestitution(1);
  cubeGroup.getObjectList().forEach(item => {
    item.setPosition([
      Math.random() * 10 - 5,
      (Math.random()) * 10 + 5,
      Math.random() * 10 - 5
    ]);
  });
  world.add(plane);
  world.add(cubeGroup);
  plane.setPosition([0, -0.1, 0]);
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
