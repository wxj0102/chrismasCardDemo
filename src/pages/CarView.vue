<script setup lang="ts">
import * as THREE from 'three';
import { DRACOLoader, GLTFLoader, OrbitControls } from 'three/addons';
import { onMounted, ref } from 'vue';

const canvasDom = ref();
let controls: OrbitControls;
type MeshMapValue = {
  mesh: THREE.Mesh | null,
  material: THREE.MeshPhysicalMaterial
}
const meshMap: Record<string, MeshMapValue> = {
  wheels1: {
    mesh: null,
    material: new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      // 金属光泽度
      metalness: 1,
      // 粗糙程度
      roughness: 0.1,
    }),
  },
  wheels2: {
    mesh: null,
    material: new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      // 金属光泽度
      metalness: 1,
      // 粗糙程度
      roughness: 0.1,
    }),
  },
  wheels3: {
    mesh: null,
    material: new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      // 金属光泽度
      metalness: 1,
      // 粗糙程度
      roughness: 0.1,
    }),
  },
  wheels4: {
    mesh: null,
    material: new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      // 金属光泽度
      metalness: 1,
      // 粗糙程度
      roughness: 0.1,
    }),
  },
  carBody: {
    mesh: null,
    material: new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      // 金属光泽度
      metalness: 1,
      // 粗糙程度
      roughness: 0.5,
      // 清漆
      clearcoat: 1,
      // 清漆粗糙度 默认是0
      clearcoatRoughness: 0,
    }),
  },
  carFront: {
    mesh: null,
    material: new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      // 金属光泽度
      metalness: 1,
      // 粗糙程度
      roughness: 0.5,
      // 清漆
      clearcoat: 1,
      // 清漆粗糙度 默认是0
      clearcoatRoughness: 0,
    }),
  },
  carHood: {
    mesh: null,
    material: new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      // 金属光泽度
      metalness: 1,
      // 粗糙程度
      roughness: 0.5,
      // 清漆
      clearcoat: 1,
      // 清漆粗糙度 默认是0
      clearcoatRoughness: 0,
    }),
  },
  carGlass: {
    mesh: null,
    material: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      // 透明度 1 完全透明
      transmission: 1,
      transparent: true,
      metalness: 0,
      roughness: 0.1,
    }),
  },
};

const colors = ['red', 'blue', 'yellow', 'gray', 'orange', 'purple'];
const roughness = [{
  name: '磨砂',
  value: 1,
}, {
  name: '冰晶',
  value: 0,
}];

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(0, 2, 7);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿

});
renderer.setSize(window.innerWidth, window.innerHeight);

// 追加到dom

const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls?.update();
};


onMounted(() => {
  canvasDom.value.appendChild(renderer.domElement);
  // 设置渲染背景
  renderer.setClearColor('#000');
  scene.background = new THREE.Color('#ccc');
  // 这里提示environment是一个texture 而不是一个color
  // scene.environment = new THREE.Color('#ccc')

  render();

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(
    10,
    10
  );

  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement);

  // 添加模型
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/gltf/');
  loader.setDRACOLoader(dracoLoader);
  loader.load('./model/bmw01.glb', (gltf) => {
    const bmw = gltf.scene;
    bmw.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name.includes('轮毂')) {
          meshMap.wheels1.mesh = mesh;
          mesh.material = meshMap.wheels1.material;
          meshMap.wheels2.mesh = mesh;
          mesh.material = meshMap.wheels2.material;
          meshMap.wheels3.mesh = mesh;
          mesh.material = meshMap.wheels3.material;
          meshMap.wheels4.mesh = mesh;
          mesh.material = meshMap.wheels4.material;
        }
        if (mesh.name.includes('Mesh002')) {
          meshMap.carBody.mesh = mesh;
          mesh.material = meshMap.carBody.material;
        }
        if (mesh.name.includes('前脸')) {
          meshMap.carFront.mesh = mesh;
          mesh.material = meshMap.carFront.material;
        }
        if (mesh.name.includes('引擎盖_1')) {
          meshMap.carHood.mesh = mesh;
          mesh.material = meshMap.carHood.material;
        }
        if (mesh.name.includes('挡风玻璃')) {
          meshMap.carGlass.mesh = mesh;
          mesh.material = meshMap.carGlass.material;
        }
      }
    });
    scene.add(bmw);
  });
  const lightConfig: [x: number, y: number, z: number, power: number][] = [
    [0, 0, 10, 1],
    [0, 0, -10, 1],
    [10, 0, 0, 1],
    [-10, 0, 0, 1],
    [0, 10, 0, 1],
    [5, 10, 0, 0.3],
    [0, 10, 5, 0.3],
    [0, 10, -5, 0.3],
    [-5, 10, 0, 0.3]
  ];
  lightConfig.forEach(config => {
    const light = new THREE.DirectionalLight(0xffffff, config[3]);
    light.position.set(config[0], config[1], config[2]);
    scene.add(light);
  });
});

function selectColor(color: string) {
  Object.values(meshMap).forEach(item => {
    item.material.color.set(new THREE.Color(color));
  });
}

function selectRoughness(value: number) {
  Object.keys(meshMap).forEach(key => {
    const item = meshMap[key];
    if (['carBody', 'carFront', 'carHood'].indexOf(key) > -1) {
      item.material.clearcoatRoughness = value;
    }
  });
}

</script>

<template>
  <div class="home">
    <div class="canvas-container" ref="canvasDom" />
    <div class="home-content">
      <div class="home-content-title">
        <h1>汽车展示与选配</h1>
      </div>
      <h2>选择车身颜色</h2>
      <div class="select">
        <div class="select-item" v-for="(item, index) in colors" :key="index" @click="selectColor(item)">
          <div class="select-item-color" :style="{ background: item }"></div>
        </div>
      </div>
      <h2>选择贴膜材质</h2>
      <div class="select">
        <div class="select-item" v-for="(item, index) in roughness" :key="index" @click="selectRoughness(item.value)">
          <div class="select-item-text">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-content {
  position: fixed;
  top: 0;
  right: 20px;
}

.select {
  display: flex;
}
.select-item {
  margin: 10px;
  cursor: pointer;
  border: 1px solid #ccc;
}

.select-item-color {
  width: 30px;
  height: 30px;
  border-radius: 10px;
}
</style>
