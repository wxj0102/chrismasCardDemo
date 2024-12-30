import * as THREE from 'three'
import ThreeScene from './ThreeScene'
import PhysicalScene from './PhysicalScene'
import { Ref } from 'vue'
import WorldObject from './WorldObject'
import WorldObjectGroup from './WorldObjectGroup'

export default class World {
  constructor(_domRef: Ref) {
    this.clock = new THREE.Clock()
    this._domRef = _domRef
  }
  public clock: THREE.Clock

  private _domRef

  public threeScene!: ThreeScene

  public physicalScene!: PhysicalScene

  public objectList: WorldObject[] = []

  init() {
    this.threeScene = new ThreeScene(this._domRef)
    this.physicalScene = new PhysicalScene()
    this.threeScene.init()
    this.physicalScene.init()

    this.render()
  }

  // 添加一个object组
  add(objectGroup: WorldObjectGroup): void;
  // 添加一个object
  add(object: WorldObject): void;
  add(item: WorldObject|WorldObjectGroup): void {
    item.ready().then(() => {
      if (item instanceof WorldObjectGroup){
        // group 只需要添加一次到three
        // 需要反复添加到physical
        this.threeScene.getScene().add(item.getMesh())
        item.getObjectList().forEach(object => {
          this.physicalScene.physicalWorld.addRigidBody(object.getBody())
          this.objectList.push(object)
        })
      } else if (item instanceof WorldObject) {
        const mesh = item.getMesh()
        const body = item.getBody()
        this.threeScene.getScene().add(mesh)
        console.log(this.threeScene.getScene())
        this.physicalScene.physicalWorld.addRigidBody(body)
        this.objectList.push(item)
      }
    })
  }

  renderCallbackList: ((dT: number) => void)[] = []

  addRenderCallback (callback: (dt: number) => void) {
    this.renderCallbackList.push(callback)
  }

  removeRenderCallback (callback: (dt: number) => void) {
    this.renderCallbackList = this.renderCallbackList.filter(v => v !== callback)
  }

  render() {
    const d = this.clock.getDelta()
    this.renderCallbackList.forEach(callback => {
      callback(d)
    })
    this.threeScene.render(this.objectList)
    this.physicalScene.update(d)
    requestAnimationFrame(() => {
      this.render()
    })
  }
}