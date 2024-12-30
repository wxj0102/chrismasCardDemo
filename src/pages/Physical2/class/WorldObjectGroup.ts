import * as THREE from 'three'
import WorldObjectGroupItem from "./WorldObjectGroupItem";
import Ammo from '../../../types/ammo';

export default class WorldObjectGroup {
  constructor(
    massList: number[], 
    geometry: THREE.BufferGeometry, 
    material: THREE.Material,
    shape: Ammo.btCollisionShape
  ) {
    this.count = massList.length
    this._massList = massList
    this._geometry = geometry
    this._material = material
    this._shape = shape
    this._threeInstanceMesh = new THREE.InstancedMesh(this._geometry, this._material, this.count)

    this._createItem()
  }

  public count
  private _objectList: WorldObjectGroupItem[] = []
  private _geometry
  private _material
  private _threeInstanceMesh
  private _massList
  private _shape

  private _createItem() {
    for (let i = 0; i < this.count; i++) {
      const object = new WorldObjectGroupItem(this._massList[i], this._threeInstanceMesh, this._shape, i)
      this._objectList.push(object)
    }
  }

  public ready () {
    return new Promise((resolve) => {
      resolve(true)
    })
  }

  public getMesh() {
    return this._threeInstanceMesh
  }
  public getObjectList () {
    return this._objectList
  }
}