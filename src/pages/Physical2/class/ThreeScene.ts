import * as THREE from 'three';
import { OrbitControls } from 'three/addons';
import Stats from 'three/addons/libs/stats.module.js';
import { Ref } from 'vue'
import WorldObject from './WorldObject';

export default class ThreeScene {
  constructor(_domRef: Ref) {
    this._domRef = _domRef
  }

  private _camera!: THREE.PerspectiveCamera
  private _scene!: THREE.Scene
  private _domRef: Ref
  private _controls!: OrbitControls
  private _renderer!: THREE.WebGLRenderer
  private _textureLoader!: THREE.TextureLoader
  private _stats!: Stats
  init() {
    this._init()
    this.addDirectionalLight(0xffffff, [-100, 100, 100], 1)
    this._initHelper()
  }

  getScene() {
    return this._scene
  }

  private _init() {
    const width = this._domRef.value.offsetWidth
    const height = this._domRef.value.offsetHeight
    this._camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    this._camera.position.set(-7, 5, 8)
    this._controls = new OrbitControls(this._camera, this._domRef.value)
    this._controls.enableDamping = true
    this._renderer = new THREE.WebGLRenderer()
    this._renderer.shadowMap.enabled = true
    // 修改色彩空间
    this._renderer.outputColorSpace = THREE.SRGBColorSpace;
    // this._renderer.setClearColor(0xbfd1e5)
    // 针对高清屏缩放进行处理
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._scene = new THREE.Scene()
    this._scene.background = new THREE.Color(0xbfd1e5)
    this._renderer.setSize(width, height)
    // 添加到dom
    this._domRef.value.appendChild(this._renderer.domElement)
    // 添加一个环境光
    const ambientLight = new THREE.AmbientLight(0x404040)
    this._scene.add(ambientLight)
  }

  private addDirectionalLight(color: number, pos: number[], intensity = 1, callback?: (light: THREE.DirectionalLight) => void) {
    const light = new THREE.DirectionalLight(color, intensity)
    light.castShadow = true
    light.position.set(pos[0], pos[1], pos[2])
    this._scene.add(light)
    callback?.(light)
    return light
  }

  private _initHelper() {
    const axesHelper = new THREE.AxesHelper(15)
    this._scene.add(axesHelper)
    this._stats = new Stats()
    this._stats.dom.setAttribute('style', 'position: absolute;top: 0; left: 0;')
    this._domRef.value.appendChild(this._stats.dom)
  }

  public render(objectList: WorldObject[]) {
    this._render(objectList)
    this._controls.update()
    this._stats.update()
  }

  private _render(objectList: WorldObject[]) {
    objectList.forEach(object => {
      object.updateMeshByBody()
    })
    this._renderer?.render(this._scene, this._camera)
  }
}