<script setup lang="ts">
import { ref, onMounted } from 'vue';
import World from './class/World';
import Cube from './class/Cube';
import Car from './class/Car';
import ModelGroup from './class/ModelGroup';

const worldRef = ref();

const world = new World(worldRef);

onMounted(() => {
  world.init();
  const plane = new Cube(100, 0.1, 100, 0xffffff, 0);
  // 默认都是可以产生阴影和接受阴影的 但是这个是底板 是例外
  plane.getMesh().castShadow = false;
  plane.getBody().setRestitution(1);
  world.add(plane);
  const car = new Car(1, 0xfffff00)
  world.add(car)
  car.ready().then(() => {
    car.getBody().setRestitution(1); 
    car.setPosition([0, 5, 0])
    console.log(111)
  })

  // const model = new ModelGroup()
  // model.loadModel('./model/RobotExpressive.glb', false)

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
