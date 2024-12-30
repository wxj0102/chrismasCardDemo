<script setup lang="ts">
import { ref, onMounted } from 'vue';
import World from './class/World';
import Cube from './class/Cube';
import CubeGroup from './class/CubeGroup';

const worldRef = ref();

const world = new World(worldRef);

onMounted(() => {
  world.init();
  const count = 200
  const cubeGroup = new CubeGroup(
    new Array(count).fill(1),
    1,
    1,
    1,
  );
  const plane = new Cube(100, 0.1, 100, 0xffffff, 0);
  // 默认都是可以产生阴影和接受阴影的 但是这个是底板 是例外
  plane.getMesh().castShadow = false;
  plane.getBody().setRestitution(1);
  cubeGroup.getObjectList().forEach(item => {
    item.setPosition([
      Math.random() * 10 - 5,
      (Math.random()) * 3 + 10,
      Math.random() * 10 - 5
    ]);
  });
  world.add(plane);
  world.add(cubeGroup);
  world.addRenderCallback(() => {
    // console.log(1)
    // 从小方块里面随便找一个 如果他在地板上 那么就给他弄起来
    const rand = Math.floor(Math.random() * count)
    const object = cubeGroup.getObjectList()[rand]
    const body = object.getBody()
    const transform = object.getBtTransform()
    const state = body.getMotionState()
    state.getWorldTransform(transform)
    const y = transform.getOrigin().y()
    if (y < 0.55) {
      object.setPosition([
        Math.random() * 10 - 5,
        (Math.random()) * 3 + 10,
        Math.random() * 10 - 5
      ])
    }
  })
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
