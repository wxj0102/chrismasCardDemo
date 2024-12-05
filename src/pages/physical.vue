<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls, GLTFLoader, DRACOLoader } from 'three/addons';
import { ref, onMounted } from 'vue';
import * as CANNON from 'cannon-es';
import { mergeGroupGeometries } from '../utils/utils';

const containerRef = ref();

const scene = new THREE.Scene();

// 创建一个物理的世界
const world = new CANNON.World({
  // 允许休眠 即在小范围运动时直接静止 需要同时给body上设置
  allowSleep: true,
});
// 设置世界的重力
world.gravity.set(0, -9.82, 0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 3;
camera.position.x = -4;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
let controls: OrbitControls | null = null;
const phyBodies: CANNON.Body[] = [];
const meshes: THREE.Mesh[] = [];


// 设置碰撞组 值必须是2的幂
enum REACT_GROUP {
  GROUND = 1,
  GROUP1 = 2,
  GROUP2 = 4,
  GROUP3 = 8,
}

// 加载模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('./model/bmw01.glb', (gltf) => {
  console.log(gltf);
  const model = gltf.scene;
  // scene.add(model);
  // 给模型添加到物理世界
  // 由于小车是由多个mesh组成的 所以需要把他们合并
  const groupGeometry = mergeGroupGeometries(model);
  console.log(groupGeometry);
  const groupMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, });
  const positionArray: number[] = [];
  const indexArray: number[] = [];
  const planeGeometry = new THREE.BoxGeometry(5, 5, 5);
  for (let i = 0; i < planeGeometry.attributes.position.array.length; i++) {
    positionArray.push(planeGeometry.attributes.position.array[i]);
  }
  // for (let i = 0; i < (planeGeometry.getIndex()?.array.length || 0); i++) {
  //   positionArray.push(planeGeometry.getIndex()!.array[i]);
  // }
  if (planeGeometry.index) {
    for (let i = 0; i < planeGeometry?.index?.array?.length; i++) {
      indexArray.push(planeGeometry.index.array[i]);
    }
  }
  console.log(positionArray);
  console.log(indexArray);
  const trimeshShape = new CANNON.Trimesh(
    positionArray,
    indexArray
    // planeGeometry.attributes.position.array,
    // planeGeometry.index?.array
  );

  const trimeshBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 15, 0),
    material: boxPhyMaterial2,
    shape: trimeshShape,
    // collisionFilterGroup: REACT_GROUP.GROUP1,
    // collisionFilterMask: REACT_GROUP.GROUND | REACT_GROUP.GROUP2 | REACT_GROUP.GROUP3,
    // collisionFilterGroup: REACT_GROUP.GROUP1,
    // collisionFilterMask: REACT_GROUP.GROUND | REACT_GROUP.GROUP2 | REACT_GROUP.GROUP3,
  });

  world.addBody(trimeshBody);
  phyBodies.push(trimeshBody);
  console.log('-----------');
  console.log(trimeshBody);
  console.log(boxBody2);

  const mesh = new THREE.Mesh(planeGeometry, groupMaterial);
  scene.add(mesh);
  meshes.push(mesh);
});

// 物理世界创建一个平面 注意box 是half的
const planeShape = new CANNON.Box(new CANNON.Vec3(8, 8, 1));
const planePhyMaterial = new CANNON.Material({
  // 只有两个物体都有摩擦系数 才会计算摩擦 只设置一个是无效的
  friction: 100000,
  // 只有两个物体都设置弹力 才会计算反弹 只设置一个是无效的
  restitution: 0.3,
});
const planeBody = new CANNON.Body({
  // 质量 没有质量貌似会不受力
  // mass: 0,
  // 形状
  shape: planeShape,
  // 位置
  position: new CANNON.Vec3(0, -1, 0),
  // 指定是不动的 感觉这样更合理一些
  type: CANNON.Body.STATIC,
  material: planePhyMaterial,
  // collisionFilterGroup: REACT_GROUP.GROUND,
  // collisionFilterMask: REACT_GROUP.GROUP1 | REACT_GROUP.GROUP2 | REACT_GROUP.GROUP3,
});
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

// 物理世界创建立方体
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const boxBody1 = new CANNON.Body({
  // 质量
  mass: 1,
  // 形状
  shape: boxShape,
  // 位置
  position: new CANNON.Vec3(-1, 0.5, 0),
  // collisionFilterGroup: REACT_GROUP.GROUP1,
  // collisionFilterMask: REACT_GROUP.GROUND | REACT_GROUP.GROUP2,
  allowSleep: true,
  sleepTimeLimit: 1,
  sleepSpeedLimit: 0.3,
});
const boxPhyMaterial2 = new CANNON.Material({
  friction: 0,
  restitution: 0.3,
});
const boxBody2 = new CANNON.Body({
  // 质量
  mass: 1,
  // 形状
  shape: boxShape,
  // 位置
  position: new CANNON.Vec3(2, 0.5, 0),
  material: boxPhyMaterial2,
  // collisionFilterGroup: REACT_GROUP.GROUP1,
  // collisionFilterMask: REACT_GROUP.GROUND | REACT_GROUP.GROUP1 | REACT_GROUP.GROUP2 | REACT_GROUP.GROUP3,
  sleepTimeLimit: 1,
  sleepSpeedLimit: 0.3,
});
const boxPhyMaterial3 = new CANNON.Material();
const boxBody3 = new CANNON.Body({
  mass: 1,
  shape: boxShape,
  position: new CANNON.Vec3(0, 0.5, 0),
  material: boxPhyMaterial3,
  // collisionFilterGroup: REACT_GROUP.GROUP2,
  // collisionFilterMask: REACT_GROUP.GROUND | REACT_GROUP.GROUP1,
  sleepTimeLimit: 1,
  sleepSpeedLimit: 0.3,
});
// 创建一个圆柱体
const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1, 32);
const cylinderPhyMaterial = new CANNON.Material({
  friction: 0.5,
  restitution: 0.3,
});
const cylinderBody = new CANNON.Body({
  mass: 1,
  shape: cylinderShape,
  position: new CANNON.Vec3(5, 0.5, 0),
  material: cylinderPhyMaterial,
  // collisionFilterGroup: REACT_GROUP.GROUP3,
  // collisionFilterMask: REACT_GROUP.GROUND | REACT_GROUP.GROUP1,
  sleepTimeLimit: 1,
  sleepSpeedLimit: 0.3,
});
// cylinderBody.addEventListener('collide', (e: unknown) =>{
//   // console.log('here', e);
//   // 获取碰撞强度
//   // console.log(e.contact.getImpactVelocityAlongNormal());
//   // 接触法线 指向物体的外部
//   // console.log(e.contact.ni);
// });
// cylinderBody.addEventListener('sleepy', (e: unknown) => {
//   // 不一定真的会休眠 可能会过一会儿又行了
//   console.log('即将进入休眠', e);
// });
// cylinderBody.addEventListener('sleep', (e: unknown) => {
//   console.log('进入休眠', e);
// });
// 设置圆柱体的初始速度
cylinderBody.velocity.set(-10, 0, 0);
// 添加到物理世界
world.addBody(boxBody1);
phyBodies.push(boxBody1);
world.addBody(boxBody2);
phyBodies.push(boxBody2);
world.addBody(boxBody3);
phyBodies.push(boxBody3);
world.addBody(cylinderBody);
phyBodies.push(cylinderBody);

// 另一种计算两个材质关系的方式
const boxPhyMaterial3ToPlane = new CANNON.ContactMaterial(
  boxPhyMaterial3,
  planePhyMaterial,
  {
    friction: 1,
    restitution: 1,
  }
);
// 指定两种材质之间的关系 需要被指定材质中有一个没有配置相关参数 否则会被覆盖
world.addContactMaterial(boxPhyMaterial3ToPlane);


// three里创建一个平面 这里用box模拟才会掉下去
const planeGeometry = new THREE.BoxGeometry(16, 16, 0.2);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
scene.add(planeMesh);
// three里面创建一个立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
const box2Mesh = new THREE.Mesh(boxGeometry, boxMaterial);
const box3Mesh = new THREE.Mesh(boxGeometry, boxMaterial);
// three里面创建一个圆柱体
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(boxMesh);
meshes.push(boxMesh);
scene.add(box2Mesh);
meshes.push(box2Mesh);
scene.add(box3Mesh);
meshes.push(box3Mesh);
scene.add(cylinderMesh);
meshes.push(cylinderMesh);

const clock = new THREE.Clock();
function render() {
  const delta = clock.getDelta();
  world.step(1 / 60, delta, 10);
  // boxMesh.position.copy(boxBody.position);
  // boxMesh.quaternion.copy(boxBody.quaternion);
  phyBodies.forEach((item, index) => {
    const mesh = meshes[index];
    mesh.position.copy(item.position);
    mesh.quaternion.copy(item.quaternion);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
  controls?.update();
}

onMounted(() => {
  containerRef.value.appendChild(renderer.domElement);
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
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
