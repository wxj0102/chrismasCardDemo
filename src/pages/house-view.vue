<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons';
import { ref, onMounted } from 'vue';

const containerRef = ref();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 5
camera.position.z = 0.000001;
console.log(camera.position);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
let controls: OrbitControls|null = null;

// 添加立方体
const cubeGeomitry = new THREE.BoxGeometry(10, 10, 10);
const textLoader = new THREE.CubeTextureLoader();
// 经弹幕提示 换了专用loader
const textures = textLoader.load(['4_l', '4_r','4_d',  '4_u', '4_f', '4_b' ].map(name => `./imgs/living/${name}.jpg`));
const cube = new THREE.Mesh(cubeGeomitry, new THREE.MeshBasicMaterial({ envMap: textures }));
cube.geometry.scale(1, 1, -1);
scene.add(cube);

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  controls?.update();
}

onMounted(() => {
  containerRef.value.appendChild(renderer.domElement);
  console.log(containerRef.value);
  controls = new OrbitControls(camera, containerRef.value);
  controls.enableDamping = true;

  render();
});

</script>

<template>
  <div class="container" ref="containerRef">
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
