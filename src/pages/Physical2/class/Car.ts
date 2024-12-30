import * as THREE from 'three';
import WorldObject from './WorldObject';
import { Ammo, getAmmoShapeByThreeGeometry, mergeGroupGeometries, loadGltf } from '../../../utils/utils';
import { mod } from 'three/webgpu';


export default class Car extends WorldObject {
  constructor(mass: number, color: number) {
    super(mass);
    this.color = color

    this.createMesh();

    this._modelReady = new Promise(async (resolve) => {
      const model = await this.loadModel()
      console.log(111)
      console.log(model)
      const groupGeometry = mergeGroupGeometries(model);
      this._geometry = groupGeometry
      // this._geometry = new THREE.BoxGeometry(1, 1, 1)
      const shape = getAmmoShapeByThreeGeometry(this._geometry)
      this.createMesh()
      this.createBody(shape)
      resolve(true)
    })
  }
  public color: number;
  private _geometry!: THREE.BufferGeometry
  private _modelReady!: Promise<unknown>

  async loadModel () {
    const gltf = await loadGltf('./model/suz.glb')
    const model = gltf.scene;
    return model
  }

  override ready () {
    return this._modelReady
  }

  createMesh() {
    const material = new THREE.MeshStandardMaterial({ color: this.color, });
    const mesh = new THREE.Mesh(this._geometry, material)
    console.log(this)
    this.setMesh(mesh)
    mesh.receiveShadow = true;
    mesh.castShadow = true;
  }
}