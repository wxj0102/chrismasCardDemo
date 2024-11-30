<script setup lang="ts">
import * as THREE from 'three'
import gsap from 'gsap'
// 控制器
import {
  GLTFLoader,
  OrbitControls,
  DRACOLoader,
  RGBELoader,
  Water,
  Water2,
} from 'three/examples/jsm/Addons.js';
import { ref } from 'vue' 
// 初始化场景
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)
camera.position.set(-3.23, 2.98, 4.06)
// 更新投影矩阵 修改宽高比之后需要做的  因为没有修改宽高比 所以应该不需要?
camera.updateProjectionMatrix()
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 修改颜色编码空间
renderer.outputColorSpace = THREE.SRGBColorSpace;
// 设置色调映射 感觉好像更亮了一些
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 修改亮度 好像是暗了一些
renderer.toneMappingExposure = 0.5
// 缺后期 灰光 调整天空颜色
// 渲染器允许阴影
renderer.shadowMap.enabled = true
// 使用更加符合物理规律的光照模式 新版本可能默认是true了 且不能设置 文档里面也没有这个属性了
// renderer.physicallyCorrectLights = true

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 阻尼
controls.enableDamping = true
controls.target.set(-8, 2, 0)

// 加载环境纹理
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/sky.hdr', (texture) => {
  // 反射式 另一个比较像的是折射式 
  // TODO: 都试过了 看不出区别 留问大胖
  texture.mapping = THREE.EquirectangularReflectionMapping
  // 这个是比较像的那个
  // texture.mapping = THREE.EquirectangularRefractionMapping
  scene.background = texture
  scene.environment = texture
})

// 模型loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('./model/scene.glb', (gltf) => {
  const model = gltf.scene
  model.traverse((child) => {
    if (child.name === 'plane') {
      child.visible = false
    }
    if ((child as any).isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  scene.add(model)
})

// 添加水面
const waterGeometry = new THREE.CircleGeometry(300, 32)
const water = new Water2(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 100,
})
water.rotation.x = -Math.PI / 2
water.position.y = -0.4
scene.add(water)

// 添加光源
// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 50, 0)
scene.add(light)

// 添加点光源 房子里面的灯光
const houseLight = new THREE.PointLight(0xffffff, 10)
houseLight.position.set(0.5, 2.0, 0)
houseLight.castShadow = true
scene.add(houseLight)

// 创建3个球
const pointLightGroup = new THREE.Group()
const pointLightArr: THREE.Object3D[] = []
const radius = 3
const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xffffff,
  emissive: 0Xffffff,
  emissiveIntensity: 1,
})
for (let i = 0; i < 3; i++) {
  // 创建灯光
  const pointLight = new THREE.PointLight(0xffffff, 50)
  // 创建灯泡
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(
    radius * Math.cos(i * 2 * Math.PI / 3),
    Math.cos(i * 2 * Math.PI / 3),
    radius * Math.sin(i * 2 * Math.PI / 3),
  )
  pointLightArr.push(sphere)
  sphere.add(pointLight)
  pointLightGroup.add(sphere)
}
scene.add(pointLightGroup)
pointLightGroup.position.set(-8, 2.5, -1.5)

// 使用补间函数修改灯泡
const options = {
  angle: 0, // 起始值
}
gsap.to(options, {
  angle: Math.PI * 2, // 结束值
  duration: 10,
  repeat: -1,
  ease: 'linear',
  onUpdate: () => {
    pointLightGroup.rotation.y = options.angle
    pointLightArr.forEach((item, index) => {
      item.position.y = Math.cos(index * 2 * Math.PI / 3 + options.angle * 5)
    })
  }
})

// 创建满天的星星
// 需要批量创建 避免频繁drawcall
const starsInstance = new THREE.InstancedMesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive:  0xffffff,
    emissiveIntensity: 10,
  }),
  // sphereMaterial,
  100,
)
// 随机处理100个球的位置 且记录位置
const starsArr: { start: THREE.Vector3, end: THREE.Vector3 }[] = []
for(let i = 0; i < 100; i++) {
  let x = Math.random() * 100 - 50
  let y = Math.random() * 40 + 10
  let z = Math.random() * 100 - 50
  starsArr.push({
    start: new THREE.Vector3(x, y, z),
    end: new THREE.Vector3(0, 0, 0),
  })
  // 设置每个小球的矩阵
  let matrix = new THREE.Matrix4()
  matrix.setPosition(x, y, z)
  starsInstance.setMatrixAt(i, matrix)
}

scene.add(starsInstance)

// 使用补间动画移动星星
// 先创建爱心的路径
// 原教程是使用贝塞尔曲线创建路径
// 这里用心形曲线的参数方程实现
const step = Math.PI / 50
const starPathRadius = 3
const SQRT2 =  Math.sqrt(2) 
for(let i = 0; i < 100; i++) {
  const currentT = step * i
  const sinT = Math.sin(currentT)
  const cosT = Math.cos(currentT)
  const x = starPathRadius * SQRT2 * sinT * sinT * sinT * 1.3
  const y = starPathRadius * (-cosT * cosT * cosT - cosT * cosT + 2 * cosT) + 12
  const z = 0
  starsArr[i].end.set(x, y, z)
}
// 创建爱心动画
function makeHeart () {
  let params = {
    time: 0,
  }
  gsap.to(params, {
    time: 1,
    duration: 1,
    onUpdate: () => {
      for(let i = 0; i < 100; i++) {
        const x = starsArr[i].start.x + (starsArr[i].end.x - starsArr[i].start.x) * params.time
        const y = starsArr[i].start.y + (starsArr[i].end.y - starsArr[i].start.y) * params.time
        const z = starsArr[i].start.z + (starsArr[i].end.z - starsArr[i].start.z) * params.time
        const matrix = new THREE.Matrix4()
        matrix.setPosition(x, y, z)
        starsInstance.setMatrixAt(i, matrix)
      }
      starsInstance.instanceMatrix.needsUpdate = true
    }
  })
}

function restoreHeart () {
  let params = {
    time: 0,
  }
  gsap.to(params, {
    time: 1,
    duration: 1,
    onUpdate: () => {
      for(let i = 0; i < 100; i++) {
        const x = starsArr[i].end.x + (starsArr[i].start.x - starsArr[i].end.x) * params.time
        const y = starsArr[i].end.y + (starsArr[i].start.y - starsArr[i].end.y) * params.time
        const z = starsArr[i].end.z + (starsArr[i].start.z - starsArr[i].end.z) * params.time
        const matrix = new THREE.Matrix4()
        matrix.setPosition(x, y, z)
        starsInstance.setMatrixAt(i, matrix)
      }
      starsInstance.instanceMatrix.needsUpdate = true
    }
  })
}

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  controls.update()
}
render()

let isHeart = false
// 场景切换
let scenes = [{
  text: '圣诞快乐',
  callback: () => {
    // 切换位置
    translateCamera(
      new THREE.Vector3(-3.23, 3, 4.06),
      new THREE.Vector3(-8, 2, 0),
    )
    if(isHeart) {
      restoreHeart()
      isHeart = false
    }
  },
}, {
  text: '感谢在这么大的世界里遇见了你',
  callback: () => {
    // 切换位置
    translateCamera(
      new THREE.Vector3(7, 0, 23),
      new THREE.Vector3(0, 0, 0),
    )
    if(isHeart) {
      restoreHeart()
      isHeart = false
    }
  },
}, {
  text: '愿陪你探寻世界的每一个角落',
  callback: () => {
    // 切换位置
    translateCamera(
      new THREE.Vector3(10, 3, 0),
      new THREE.Vector3(5, 2, 0),
    )
    if(isHeart) {
      restoreHeart()
      isHeart = false
    }
  },
}, {
  text: '愿将天上的星星送给你',
  callback: () => {
    // 切换位置
    translateCamera(
      new THREE.Vector3(7, 0, 23),
      new THREE.Vector3(0, 0, 0),
    )
    if (!isHeart) {
      makeHeart()
      isHeart = true
    }
  },
}, {
  text: '愿加班结束大家健康快乐',
  callback: () => {
    // 切换位置
    translateCamera(
      new THREE.Vector3(-20, 1.3, 6.6),
      new THREE.Vector3(5, 2, 0),
    )
    if(isHeart) {
      restoreHeart()
      isHeart = false
    }
  },
}]
const index = ref(0)
let isActive = false
window.addEventListener('wheel', (e) => {
  if (isActive) {
    return
  }
  if((e as WheelEvent).deltaY > 0) {
    index.value = (index.value + 1) % scenes.length
  } else {
    index.value = (index.value - 1) % scenes.length
  }
  isActive = true
  setTimeout(() => {
    isActive = false
  }, 1100)
  scenes[index.value].callback()
})

// 使用补间动画修改相机位置
const timeLine1 = gsap.timeline()
const timeLine2 = gsap.timeline()
function translateCamera (position: THREE.Vector3, target: THREE.Vector3) {
  timeLine1.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1,
    ease: 'power2.inOut',
  })
  timeLine2.to(controls.target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1,
    ease: 'power2.inOut',
  })
}
</script>

<template>
  <div class="scenes"  :style="{
      transform: `translate3d(0, ${-index * 100}vh, 0)`,
    }">
    <div class="scenes-item" v-for="item in scenes">
      <h1>{{ item.text }}</h1>
    </div>
  </div>
</template>

<style scoped>
.scenes {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  pointer-events: none;
  transition: all 1s;
}
.scenes-item {
  width: 100vw;
  height: 100vh;
}
.scenes-item>h1 {
  padding: 100px 50px;
  font-size: 50px;
  color: #fff;
}
</style>
